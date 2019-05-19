const {app, BrowserWindow, ipcMain, Menu} = require('electron')
const path = require('path')

let mainWindow
let imgWindow

const poolPath = path.resolve(__dirname, "./resources/pool/")
let imagePool = []

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      devTools: false
    },
    resizable: false,
    title: "Precognition Test"
  })

  const template = [
    {
      role: "help",
      submenu: [
        {
          label:"About",
          click() {require('electron').shell.openExternal('https://github.com/nykotar/precognition-test')}
        }
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', function () {
  const fs = require('fs');

  //Load image pool
  fs.readdir(poolPath, function(err, items) {
    for (var i=0; i<items.length; i++) {
        if(items[i].endsWith(".jpg"))
          imagePool.push(items[i])
    }
    createWindow()
    console.log("Retrieved " + imagePool.length + " images.")
  });
})

app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  //if (process.platform !== 'darwin') app.quit()
  app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

ipcMain.on("get-image-pool", function (event, args) {
  event.returnValue = imagePool
})

ipcMain.on("open-img", function (event, args) {
  imgWindow = new BrowserWindow()
  imgWindow.loadFile(path.join(poolPath, args))
})