import {app, BrowserWindow} from 'electron'
import * as path from 'path'
import { preload_path, view_path } from './constant'

const env = process.env.NODE_ENV || 'development'


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(preload_path, 'preload.js'),
      contextIsolation : true,
    }
  })

  win.loadFile(path.join(view_path, 'index.html'))

}

app.on('ready', () => createWindow())

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
