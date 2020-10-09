const { app, BrowserWindow } = require("electron");
let win;

function createWindow() {

    win = new BrowserWindow({
        width: 1000,
        height: 820,
        icon: __dirname + "/resources/icons/logo.png",
        webPreferences: {
            nodeIntegration: true

        }
    })

    win.loadFile("index.html");

}


app.whenReady().then(createWindow);

const DiscordRPC = require('discord-rpc');
const clientId = '764187560418344980';
const rpc = new DiscordRPC.Client({ transport: 'ipc' });
const startTimestamp = new Date();


async function setActivity() {
  if (!rpc || !win) {
    return;
  }

	const title = await win.webContents.executeJavaScript('window.playing');

  rpc.setActivity({
    details: 'Listening to music',
    state: title,
    startTimestamp,
    instance: false,
		largeImageKey: 'logo'
  });
}

rpc.on('ready', () => {
  setActivity();

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login({ clientId }).catch(console.error);
