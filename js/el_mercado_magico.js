let score = 0;
let correctMoves = 0;
let errorMoves = 0;
let level = 1;

const instructions = [
    "Nivel 1: Clasifica las frutas en las cestas según su color. Todas las frutas verdes van en la cesta verde, las frutas rojas en la cesta roja, y las amarillas en la cesta amarilla.",
    "Nivel 2: Clasifica las frutas en las cestas según su tamaño. Las frutas pequeñas van en la cesta pequeña, las medianas en la cesta mediana y las grandes en la cesta grande.",
    "Nivel 3: Clasifica las frutas en las cestas según su color y tamaño. La cesta verde es pequeña y guarda frutas pequeñas verdes, la roja es mediana y guarda frutas medianas rojas, y la amarilla es grande y guarda frutas grandes amarillas."
];

const fruits = [
    { name: 'Manzana Roja', color: 'red', size: 'grande', image: 'manzana_roja.png' },
    { name: 'Plátano Amarillo', color: 'yellow', size: 'mediana', image: 'platano_amarillo.png' },
    { name: 'Uva Verde', color: 'green', size: 'pequeña', image: 'uva_verde.png' },
    { name: 'Fresa Roja', color: 'red', size: 'pequeña', image: 'fresa_roja.png' },
    { name: 'Limón Amarillo', color: 'yellow', size: 'pequeña', image: 'limon_amarillo.png' },
    { name: 'Manzana Verde', color: 'green', size: 'grande', image: 'manzana_verde.png' },
    { name: 'Sandía', color: 'green', size: 'grande', image: 'sandia.png' },
    { name: 'Cereza Roja', color: 'red', size: 'mediana', image: 'cereza_roja.png' },
    { name: 'Melón Amarillo', color: 'yellow', size: 'grande', image: 'melon_amarillo.png' }
];

function createFruit(fruit) {
    const div = document.createElement('div');
    div.className = `fruit ${fruit.size}`;
    div.draggable = true;
    div.dataset.color = fruit.color;
    div.dataset.size = fruit.size;
    div.dataset.name = fruit.name;

    const img = document.createElement('img');
    img.src = fruit.image;
    img.alt = fruit.name;

    div.appendChild(img);

    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);

    return div;
}

function setupBaskets() {
    const basketArea = document.getElementById('basketArea');
    basketArea.innerHTML = '';

    if (level === 1) {
        addBasket('red', 'medium');
        addBasket('yellow', 'medium');
        addBasket('green', 'medium');
    } else if (level === 2) {
        addBasket(null, 'small');
        addBasket(null, 'medium');
        addBasket(null, 'large');
    } else if (level === 3) {
        addBasket('green', 'small');
        addBasket('red', 'medium');
        addBasket('yellow', 'large');
    }
}

function addBasket(color, size) {
    const basket = document.createElement('div');
    basket.className = `basket ${size}`;
    if (color) basket.classList.add(color);
    basket.dataset.color = color || '';
    basket.dataset.size = size;

    const label = document.createElement('div');
    label.className = 'basket-label';
    label.textContent = `${size.charAt(0).toUpperCase() + size.slice(1)} ${color ? color.charAt(0).toUpperCase() + color.slice(1) : ''}`;
    basket.appendChild(label);

    basket.addEventListener('dragover', (e) => e.preventDefault());
    basket.addEventListener('drop', handleDrop);
    basketArea.appendChild(basket);
}

function handleDragStart(e) {
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDrop(e) {
    e.preventDefault();

    const fruit = document.querySelector('.dragging');
    const basket = e.currentTarget;

    const matchesColor = fruit.dataset.color === basket.dataset.color || !basket.dataset.color;
    const matchesSize = fruit.dataset.size === basket.dataset.size;

    if ((level === 1 && matchesColor) || (level === 2 && matchesSize) || (level === 3 && matchesColor && matchesSize)) {
        basket.appendChild(fruit);
        score += 10;
        correctMoves++;
        checkLevelCompletion();
    } else {
        errorMoves++;
    }

    updateStats();
}

function checkLevelCompletion() {
    const fruitsInShelf = document.querySelectorAll('#fruitShelf .fruit');
    if (fruitsInShelf.length === 0) {
        nextLevel();
    }
}

function updateStats() {
    document.getElementById('score').textContent = score;
    document.getElementById('correct').textContent = correctMoves;
    document.getElementById('errors').textContent = errorMoves;
}

function nextLevel() {
    if (level < 3) {
        level++;
        document.getElementById('instructionsText').textContent = instructions[level - 1];
        startNewGame();
    } else {
        alert('¡Felicidades! Completaste todos los niveles.');
    }
}

function startNewGame() {
    correctMoves = 0;
    errorMoves = 0;
    updateStats();

    const fruitShelf = document.getElementById('fruitShelf');
    fruitShelf.innerHTML = '';

    fruits.forEach(fruit => {
        fruitShelf.appendChild(createFruit(fruit));
    });

    setupBaskets();
}

startNewGame();
