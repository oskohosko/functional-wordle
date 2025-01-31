/**
 * Main file containing code for my game for now.
 */

const setupGrid = () => {
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
}
// Setting up the grid
setupGrid()

const resetLetters = () => {
    const cubes = document.querySelectorAll('.grid .cube')
    cubes.forEach(cube => {
        cube.innerHTML = ''
        cube.style.background = 'transparent'
    })
}

const getRandomWord = async () => {
    try {
        // Getting the random word
        const response = await fetch('random-word')
        const data = await response.json()
        return data.word
    } catch (err) {
        console.error(err)
        return null
    }

}

// Function to setup the game
const setupGame = async () => {
    const randomWord = await getRandomWord()
    // As this is planning to be functional, I need a game state to be passed around
    const gameState = {
        word: 'oskar',
        guesses: [],
        currentGuess: '',
        gameOver: false
    }

    resetLetters()

    return gameState
}

let currentState = await setupGame()

// Function to add a letter to the current cube
const addLetter = (state, letter) => {
    // Current row is representative by the number of guesses user has made
    const currRow = state.guesses.length
    console.log(currRow)
    // And current column is representative by the current guess
    const currCol = state.currentGuess.length
    console.log(currCol)
    // This is the cube we need to place the letter in
    const cubeId = (currRow * 5) + currCol
    const cube = document.getElementById(`cube-${cubeId}`)
    console.log(cubeId)
    // Updating HTML.
    //! Check later for functional
    cube.innerHTML = letter.toUpperCase()

    return {
        ...state,
        // Adding the letter to the end of the word
        currentGuess: state.currentGuess + letter
    }
}

// Function that counts the occurences of each letter in target word
const countOccs = () => {
    // Checks if letter exists if not equal 0 else add 1
    return currentState.word.split('').reduce((occs, char) => {
        occs[char] = (occs[char] || 0) + 1
        return occs
    }, {})
}

// Function that checks if the letter is correct or in the word
const checkLetters = (guess) => {
    // Getting frequencies of each letter
    let freqs = countOccs()
    // Firstly need to check if any letters are in correct positions
    // These take priority
    const initialCheck = guess.split('').map((char, i) => {
        // If it's correct, we decrease frequency
        if (char === currentState.word[i]) {
            // Making a copy of freqs (not mutating)
            freqs = {
                ...freqs,
                [char]: freqs[char] - 1
            }
            return 'green';
        }
        return 'grey';
    });

    // Now need to check if the letters are present in the word
    return guess.split('').map((char, i) => {
        // Making sure we keep greens same
        if (initialCheck[i] === 'green') {
            return 'green';
        }
        // Now checking if there can be any yellows
        // Ensuring the letter isn't already taken
        if (freqs[char] > 0) {
            // If character is present in frequencies, decrease and yellow
            freqs = {
                ...freqs,
                [char]: freqs[char] - 1
            }
            return 'yellow';
        }
        // Else grey
        return 'grey';
    });
}

// Function to update the state and check the guesses.
const checkGuess = (state) => {
    // Creating a list from the guess
    const guess = state.currentGuess
    const guessArr = guess.split('')
    const updatedGuesses = [...state.guesses, guess]
    // Mapping each letter in the guess to the wordle colour
    const results = checkLetters(guess)
    //! Update HTML
    results.forEach((colour, index) => {
        const row = updatedGuesses.length - 1
        const col = index

        const cubeId = (row * 5) + col
        const cube = document.getElementById(`cube-${cubeId}`)
        cube.style.background = colour
    })

    // const cubeId = (state.guesses.length * 5) + state.currentGuess.length - 1
    // Checking if we have won
    // Reducing to a boolean - if all green true else false
    const win = results.reduce((prev, curr) => {
        return prev && (curr === 'green')
    }, true)

    // Updating guesses and checking if the game is over
    return {
        ...state,
        currentGuess: '',
        guesses: updatedGuesses,
        gameOver: (updatedGuesses.length === 6) || win ? true : false
    }
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
    const cubeId = (state.guesses.length * 5) + state.currentGuess.length - 1
    const cube = document.getElementById(`cube-${cubeId}`)
    // Removing letter
    if (cubeId >= state.guesses.length * 5) {
        cube.innerHTML = ''
    }
    // Returning state, with the last letter of currentGuess removed
    return {
        ...state,
        currentGuess: state.currentGuess.slice(0, -1)
    }
}

// Testing out key events
document.addEventListener('keydown', async (event) => {
    const keyName = event.key
    if (!currentState.gameOver) {
        // Handling ctrl, alt and meta
        if (event.ctrlKey || event.altKey || event.metaKey) {
            return
        }
        // Checking if delete key was pressed
        if (keyName === 'Backspace' || keyName === 'Delete') {
            // Updating current game state
            currentState = decreaseGuess(currentState)
        // Ensuring a valid alphabetic key was pressed
        } else if (isValidKey(currentState, keyName)) {
            // Need to place the letters in their div elements
            currentState = addLetter(currentState, keyName)
        // And now checking if enter was pressed
        } else if (keyName === 'Enter') {
            // Check if currentGuess is 5 long
            if (currentState.currentGuess.length > 4) {
                // Add it to guesses and check the guess
                currentState = checkGuess(currentState)
            }
        }
    } else {
        //! Reset game
        currentState = await setupGame()

    }
})




