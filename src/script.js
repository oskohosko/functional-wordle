/**
 * Main file containing code for my game for now.
 */

// As this is planning to be functional, I need a game state to be passed around
const gameState = {
    word: 'oskar',
    guesses: [],
    maxGuesses: 5,
    gameOver: false
}

// Setting up the grid
document.addEventListener('DOMContentLoaded', () => {
    // Grabbing our grid
    const wordGrid = document.getElementById('word-grid')

    // Function that creates one of our cubes
    const createCube = () => {
        const cube = document.createElement('div')
        cube.classList.add('cube')
        return cube
    }

    // Creates an array of cubes
    const createGrid = (rows, cols) => {
        return Array.from({ length: rows * cols }, createCube);
    }

    // Adds all cubes to our grid
    const cubes = createGrid(6, 5)
    cubes.forEach(cube => wordGrid.appendChild(cube))
})

// Testing out key events
document.addEventListener('keypress', (event) => {
    const keyName = event.key
    const keyCode = keyName.toUpperCase().charCodeAt(0)
    // Ensuring a valid key is pressed.
    if (keyCode >= 65 && keyCode <= 90) {
        console.log(keyName)
    }
})