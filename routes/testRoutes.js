const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
  res.send('Welcome to this Test project')
})

router.get("/about", (req, res) => {
  res.send('Hello, My Name is Ian. I am a fullstack developer')
})

module.exports = router
