let { PythonShell } = require('python-shell')

const confFile = 'settings.json'
const fs = require('fs')
const path = require('path')
const filePath = path.join(process.cwd(), confFile)
const express = require('express')
const router = express.Router()

const settings = {
  language: 'es',
  show_sync_details: false,
  show_apps: true,
  show_devices: true,
  show_details: true,
  show_preferences: true,
  show_info: true,
  show_help: true
}

PythonShell.defaultOptions = {
  pythonPath: '/usr/bin/python3'
}

router.get('/', (req, res) => {
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8')

    if (data) res.json(JSON.parse(data))
    else res.json(settings)
  } else {
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2))
    res.json(settings)
  }
})

router.post('/', (req, res) => {
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2))
  res.send()
})

router.get('/server', (req, res) => {
  const code = `
import json
from migasfree_client import settings
from migasfree_client.utils import get_config, get_hardware_uuid, \
get_mfc_project, get_mfc_computer_name, get_graphic_pid, get_graphic_user

graphic_pid, graphic_process = get_graphic_pid()
ret = {
    'server': get_config(settings.CONF_FILE, 'client').get('server', 'localhost'),
    'uuid': get_hardware_uuid(),
    'project': get_mfc_project(),
    'computer_name': get_mfc_computer_name(),
    'user': get_graphic_user(graphic_pid)
}
print(json.dumps(ret))`

  PythonShell.runString(code, null, (err, results) => {
    if (err) throw err
    res.setHeader('Content-Type', 'application/json')
    res.send(results[0])
  })
})

router.get('/protocol', (req, res) => {
  const code = `
from migasfree_client.command import MigasFreeCommand

print(MigasFreeCommand().api_protocol())`

  PythonShell.runString(code, null, (err, results) => {
    if (err) throw err
    res.setHeader('Content-Type', 'text/plain')
    res.send(results[0])
  })
})

module.exports = router
