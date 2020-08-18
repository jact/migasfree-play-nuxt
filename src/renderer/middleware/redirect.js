//const { ipcRenderer } = require('electron')

export default async function({ store, redirect }) {
  // ipcRenderer.send('start')
  await store.dispatch('init')
  // automatic redirect
  return redirect('/apps')
}
