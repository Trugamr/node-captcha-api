const { createCanvas } = require('canvas')
const { encrypt, decrypt } = require('./encryption')

const FONTBASE = 200
const FONTSIZE = 35

// Get an integer between min and max
const randomInteger = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

// Get a float between min and max
const randomFloat = (min, max) => Math.random() * (max - min) + min

// Randomly captilize characters of string
const randomCapitals = str =>
  [...str]
    .map(char => char[`to${randomInteger(0, 1) ? 'Upper' : 'Lower'}Case`]())
    .join('')

// Get random string of alpanumeric characters
const randomText = (length = 6) => {
  if (length > 11 || length <= 0)
    throw new Error('length must be a number from 1 to 11')
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

// Get a font size relative to base size and canvas width
const relativeFont = width => {
  const ratio = FONTSIZE / FONTBASE
  const size = width * ratio
  return `${size}px serif`
}

// Get a rotation between -degrees and degrees converted to radians
const randomRotation = (degrees = 15) =>
  (randomFloat(-degrees, degrees) * Math.PI) / 180

// Configure captcha text
const configureText = (ctx, width, height) => {
  ctx.font = relativeFont(width)
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  const text = randomCapitals(randomText(6))
  ctx.fillText(text, width / 2, height / 2)
  return text
}

// Get a PNG dataURL of a captcha image
const generateDataUrl = (width, height) => {
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  ctx.rotate(randomRotation())
  const text = configureText(ctx, width, height)
  return {
    image: canvas.toDataURL(),
    text: text,
    validationKey: encrypt(text)
  }
}

// Validate typed captcha against encryped captcha text
const validateCaptcha = (text, encrypedText) => {
  if (text && encrypedText) {
    return text === decrypt(encrypedText)
  }
  return false
}

module.exports = {
  generateDataUrl,
  validateCaptcha
}
