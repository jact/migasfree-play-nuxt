let { PythonShell } = require('python-shell')

const express = require('express')
const router = express.Router()

PythonShell.defaultOptions = {
  pythonPath: '/usr/bin/python'
}

router.get('/available', (req, res) => {
  const code = `
import json
from migasfree_client.sync import MigasFreeSync
print(json.dumps(MigasFreeSync().pms.available_packages()))` // FIXME Client

  PythonShell.runString(code, null, (err, results) => {
    if (err) throw err
    res.setHeader('Content-Type', 'application/json')
    res.send(results[0])
  })
})

router.post('/installed', (req, res) => {
  const packages = JSON.stringify(req.body)
  const code = `
import json
from migasfree_client.command import MigasFreeCommand

mfc = MigasFreeCommand()
installed = []

packages = ${packages}
for pkg in packages:
    if mfc.pms.is_installed(pkg):
        if pkg not in installed:
            installed.append(pkg)

print(json.dumps(installed))`

  PythonShell.runString(code, null, (err, results) => {
    if (err) throw err
    res.setHeader('Content-Type', 'application/json')
    res.send(results[0])
  })
})

router.post('/install', (req, res) => {
  const packages = JSON.stringify(req.body)
  let cmd

  if (getOS() === 'Linux') {
    cmd = 'LANG_ALL=C echo "y" | migasfree -ip "' + packages + '"'
  } else if (getOS() === 'Windows') {
    cmd = 'migasfree -ip "' + packages + '"'
  }
  console.log(cmd)
})

router.post('/remove', (req, res) => {
  const packages = JSON.stringify(req.body)
  let cmd

  if (getOS() === 'Linux') {
    cmd = 'LANG_ALL=C echo "y" | migasfree -rp "' + packages + '"'
  } else if (getOS() === 'Windows') {
    cmd = 'migasfree -rp "' + packages + '"'
  }
  console.log(cmd)
})

module.exports = router
