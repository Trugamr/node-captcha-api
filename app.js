require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { generateDataUrl, validateCaptcha } = require('./captcha')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/test/:width?/:height?', (req, res) => {
  const { width = 200, height = 100 } = req.params
  const { image } = generateDataUrl(parseInt(width), parseInt(height))
  res.send(`<img  src="${image}" />`)
})

// Return captcha data url image and encryped validation key
app.get('/captcha/:width?/:height?', (req, res) => {
  const { width = 200, height = 100 } = req.params
  const { image, text, validationKey } = generateDataUrl(
    parseInt(width),
    parseInt(height)
  )
  res.json({
    image,
    validationKey
  })
})

// Validate provided text against validation key
app.post('/captcha/validate', (req, res) => {
  const { text, validationKey } = req.body
  res.json({
    validationStaus: validateCaptcha(text, validationKey),
    text,
    validationKey
  })
})

const listener = app.listen(3000, () =>
  console.log(`Listening on port ${listener.address().port}`)
)
