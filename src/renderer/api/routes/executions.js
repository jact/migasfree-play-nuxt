const confFile = 'executions.json'
const fs = require('fs')
const path = require('path')
const filePath = path.join(confFile)
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8')

    if (data) res.json(JSON.parse(data))
    else res.json({})
  } else {
    res.json({})
  }
})

router.post('/', (req, res) => {
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2))
  res.send()
})

module.exports = router
