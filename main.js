const { app, BrowserWindow } = require("electron");


function createWindow() {

    const win = new BrowserWindow({
        width: 1000,
        height: 820,
        icon: __dirname + "/resources/icons/icon_hires.png",
        webPreferences: {
            nodeIntegration: true

        }
    })

    win.loadFile("index.html");

}

app.whenReady().then(createWindow);