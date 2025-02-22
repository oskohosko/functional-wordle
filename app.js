import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import ejs from 'ejs'
import expressEjsLayouts from 'express-ejs-layouts';
import fs from 'fs'

// Port number
const PORT_NUM = 8000

// Getting __dirname equivalent in ES6 modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Setting up the app
let app = express()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(expressEjsLayouts)

// Middleware to parse url-encoded
app.use(express.urlencoded({ extended: true }))
// JSON
app.use(express.json())
// This is for our bootstrap, css and js
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'src')))
app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))

app.listen(PORT_NUM, () => {
    console.log(`App listening on port number ${PORT_NUM}`)
})

// Home page
app.get('/', (req, res) => {
    res.render('index', { title: 'Oskle' })
})

// For getting our random word
const getRandomWord = () => {
    const filePath = path.join(__dirname, 'words.txt')
    // Splitting txt file to list of words then finding random one.
    const data = fs.readFileSync(filePath, 'utf8')
    const wordsArr = data.split('\n')
    const index = Math.floor(Math.random() * wordsArr.length)

    return wordsArr[index]
}

// API Endpoint to send to our script.js
app.get('/random-word', (req, res) => {
    const randomWord = getRandomWord()
    res.json({ word: randomWord })
})