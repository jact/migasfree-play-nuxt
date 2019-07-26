const fs = require('fs')
const path = require('path')
const tokenFile = path.join(process.cwd(), 'token')

const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  let token = ''

  if (fs.existsSync(tokenFile)) {
    token = fs.readFileSync(tokenFile, 'utf8')
  }
  res.json({ token })
})

router.post('/', (req, res) => {
  fs.writeFileSync(tokenFile, req.body.token)
  res.send()
})

module.exports = router
