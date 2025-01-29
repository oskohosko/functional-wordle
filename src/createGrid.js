// Setting up the grid
document.addEventListener("DOMContentLoaded", () => {
    // Grabbing our grid
    const wordGrid = document.getElementById("word-grid")

    // Function that creates one of our cubes
    const createCube = () => {
        const cube = document.createElement("div")
        cube.classList.add("cube")
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