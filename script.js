const grilleElem = document.getElementById('grille');
const largeur = 8;
const hauteur = 8;
const nbMines = 10;
let grille = [];
let jeuTermine = false;
let cellulesRestantes = largeur * hauteur - nbMines;

function initialiser() {
    for (let y = 0; y < hauteur; y++) {
        grille[y] = [];
        for (let x = 0; x < largeur; x++) {
            const cellule = document.createElement('button');
            cellule.classList.add('cellule');
            cellule.dataset.x = x;
            cellule.dataset.y = y;
            cellule.addEventListener('click', revelerCellule);
            cellule.addEventListener('contextmenu', marquerCellule);
            grilleElem.appendChild(cellule);
            grille[y][x] = {
                mine: false,
                revelee: false,
                marquee: false,
                element: cellule,
                compte: 0
            };
        }
    }
    placerMines();
    calculerChiffres();
}

function placerMines() {
    let minesPlacees = 0;
    while (minesPlacees < nbMines) {
        let x = Math.floor(Math.random() * largeur);
        let y = Math.floor(Math.random() * hauteur);
        if (!grille[y][x].mine) {
            grille[y][x].mine = true;
            minesPlacees++;
        }
    }
}

function calculerChiffres() {
    for (let y = 0; y < hauteur; y++) {
        for (let x = 0; x < largeur; x++) {
            if (grille[y][x].mine) continue;
            let compte = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let nx = x + j;
                    let ny = y + i;
                    if (nx >= 0 && nx < largeur && ny >= 0 && ny < hauteur) {
                        if (grille[ny][nx].mine) compte++;
                    }
                }
            }
            grille[y][x].compte = compte;
        }
    }
}

function revelerCellule(e) {
    if (jeuTermine) return;
    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);
    const cellule = grille[y][x];
    if (cellule.revelee || cellule.marquee) return;
    cellule.revelee = true;
    cellule.element.classList.add('revelee');

    if (cellule.mine) {
        cellule.element.textContent = '💣';
        cellule.element.classList.add('mine');
        terminerJeu(false);
    } else {
        cellulesRestantes--;
        if (cellule.compte > 0) {
            cellule.element.textContent = cellule.compte;
            cellule.element.style.color = obtenirCouleurChiffre(cellule.compte);
        } else {
            // Révéler les cellules adjacentes
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let nx = x + j;
                    let ny = y + i;
                    if (nx >= 0 && nx < largeur && ny >= 0 && ny < hauteur) {
                        revelerCellule({ target: grille[ny][nx].element });
                    }
                }
            }
        }
        if (cellulesRestantes === 0) {
            terminerJeu(true);
        }
    }
}

function marquerCellule(e) {
    e.preventDefault();
    if (jeuTermine) return;
    const x = parseInt(e.target.dataset.x);
    const y = parseInt(e.target.dataset.y);
    const cellule = grille[y][x];
    if (cellule.revelee) return;
    cellule.marquee = !cellule.marquee;
    if (cellule.marquee) {
        cellule.element.classList.add('flag');
        cellule.element.textContent = '🚩';
    } else {
        cellule.element.classList.remove('flag');
        cellule.element.textContent = '';
    }
}

function obtenirCouleurChiffre(nombre) {
    const couleurs = {
        1: '#1e88e5',
        2: '#43a047',
        3: '#e53935',
        4: '#3949ab',
        5: '#f4511e',
        6: '#00acc1',
        7: '#8e24aa',
        8: '#757575'
    };
    return couleurs[nombre] || '#000';
}

function terminerJeu(victoire) {
    jeuTermine = true;
    const message = document.createElement('div');
    message.id = 'message';
    if (victoire) {
        message.textContent = 'Félicitations, vous avez gagné ! 🎉';
    } else {
        message.textContent = 'Désolé, vous avez perdu. 💥';
        revelerToutesLesMines();
    }
    document.body.appendChild(message);
}

function revelerToutesLesMines() {
    for (let y = 0; y < hauteur; y++) {
        for (let x = 0; x < largeur; x++) {
            const cellule = grille[y][x];
            if (cellule.mine && !cellule.revelee) {
                cellule.element.textContent = '💣';
                cellule.element.classList.add('mine', 'revelee');
            }
        }
    }
}

initialiser();
