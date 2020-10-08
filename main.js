const { app, BrowserWindow } = require('electron');


let mainWindow;


function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true

        }
    })

    win.loadFile("index.html");

}

app.whenReady().then(createWindow);