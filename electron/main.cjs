const { app, BrowserWindow, shell } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 480,
    height: 900,
    minWidth: 380,
    minHeight: 560,
    title: 'Transformación',
    backgroundColor: '#f5f5f7',
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    autoHideMenuBar: true, // sin barra de menú, se ve más limpio
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      // Permite que el saludo de voz suene al abrir sin requerir un clic.
      autoplayPolicy: 'no-user-gesture-required',
    },
  })

  // Carga la app ya compilada (carpeta dist).
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))

  // Los enlaces con target="_blank" (botón "Ver el plan", etc.) se abren en el
  // visor del sistema en vez de en una ventana de Electron.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url)
    } else if (url.startsWith('file://')) {
      try {
        let p = decodeURIComponent(new URL(url).pathname)
        // En Windows el pathname llega como "/C:/...", se quita la barra inicial.
        if (process.platform === 'win32') p = p.replace(/^\//, '')
        shell.openPath(p)
      } catch {
        shell.openExternal(url)
      }
    }
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
