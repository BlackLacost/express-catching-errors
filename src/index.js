import express from 'express'
import { readFile, readFileSync } from 'fs'
import { promisify } from 'util'

const app = express()
const port = 4000

app.get('/sync', (req, res, next) => {
  const data = readFileSync('/wrong_path')
  res.send(data)
})

app.get('/callback', (req, res, next) => {
  readFile('/wrong_path', (err, data) => {
    if (err) {
      return next(err)
    }
    res.send(data)
  })
})

const readFilePromise = promisify(readFile)

app.get('/promise', (req, res, next) => {
  readFilePromise('/wrong_path')
    .then((data) => res.send(data))
    .catch(next)
})

app.get('/async-await', async (req, res, next) => {
  try {
    const data = await readFilePromise('/wrong_path')
    res.send(data)
  } catch (err) {
    next(err)
  }
})

app.get('/set-timeout', (req, res, next) => {
  setTimeout(() => {
    try {
      const data = readFileSync('/wrong_path')
      res.send(data)
    } catch (err) {
      next(err)
    }
  }, 500)
})

app.listen(port, () => console.log('Server on port', port))
