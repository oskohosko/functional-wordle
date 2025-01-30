/**
 * Main file containing code for my game for now.
 */

// As this is planning to be functional, I need a game state to be passed around
const gameState = {
    word: 'oskar',
    guesses: [],
    currentGuess: '',
    maxGuesses: 6,
    gameOver: false
}

// The state we are replacing
let currentState = gameState

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
        return Array.from({ length: rows * cols }, createCube)
    }

    // Adds all cubes to our grid
    const cubes = createGrid(6, 5)
    cubes.forEach((cube, index) => {
        // Adding an id to each cube so we can track each one
        //? Not sure if this is legal for functional
        cube.id = `cube-${index}`
        wordGrid.appendChild(cube)
    })
})

// Function to add a letter to the current cube
const addLetter = (state, letter) => {
    // Current row is representative by the number of guesses user has made
    const currRow = state.guesses.length
    // And current column is representative by the current guess
    const currCol = state.currentGuess.length
    // This is the cube we need to place the letter in
    const cubeId = currRow + currCol
    const cube = document.getElementById(`cube-${cubeId}`)
    // Updating HTML.
    //! Check later for functional
    cube.innerHTML = letter.toUpperCase()

    return {
        ...state,
        // Adding the letter to the end of the word
        currentGuess: state.currentGuess + letter
    }
}

// Function that checks if the letter is correct or in the word
const checkLetter = (letter, index) => {
    console.log(letter, index)
    // Firstly check if letter is correct
    if (currentState.word[index] === letter) {
        return "green"
    // Then if it is in the word but not correct position
    } else if (currentState.word.includes(letter)) {
        return "yellow"
    // Otherwise, not in word
    } else {
        return "grey"
    }
}

// Function to update the state and check the guesses.
const checkGuess = (state) => {
    // Logic of checking each letter
    const guessArr = state.currentGuess.split('')
    console.log(guessArr)

    const results = guessArr.map(checkLetter)
    console.log(results)

}

// Function that checks if the key pressed is valid and allowed.
const isValidKey = (state, keyName) => {
    const keyCode = keyName.toUpperCase().charCodeAt(0)
    // Boolean value checking if key pressed is alphabetic
    const isAlpha = (keyCode >= 65 && keyCode <= 90 && keyName.length == 1)
    // Now need to check if there's room in current guess
    const isRoom = state.currentGuess.length < 5

    return isRoom && isAlpha
}

// Removing last character from current guess
const decreaseGuess = (state) => {
    // Getting the cube Id to remove letter from
    const cubeId = state.guesses.length + state.currentGuess.length - 1
    const cube = document.getElementById(`cube-${cubeId}`)
    // Removing letter
    if (cubeId >= 0) {
        cube.innerHTML = ''
    }
    // Returning state, with the last letter of currentGuess removed
    return {
        ...state,
        currentGuess: state.currentGuess.slice(0, -1)
    }
}

// Testing out key events
document.addEventListener('keydown', (event) => {
    const keyName = event.key
    const keyCode = keyName.toUpperCase().charCodeAt(0)
    // Checking if delete key was pressed
    if (keyName === 'Backspace' || keyName === 'Delete') {
        // Updating current game state
        currentState = decreaseGuess(currentState)
    // Ensuring a valid alphabetic key was pressed
    } else if (isValidKey(currentState, keyName)) {
        console.log(keyName)
        console.log(keyCode)
        // Need to place the letters in their div elements
        currentState = addLetter(currentState, keyName)
    // And now checking if enter was pressed
    } else if (keyName === 'Enter') {
        // Check if currentGuess is 5 long
        if (currentState.currentGuess.length > 4) {
            // Add it to guesses and check the guess
            checkGuess(currentState)
        }
    }
})