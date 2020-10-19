const { app, BrowserWindow } = require("electron");
const path = require('path');
let win;

function createWindow() {

    win = new BrowserWindow({
        width: 1000,
        height: 820,
        icon: __dirname + "/app/resources/icons/logo.png",
        webPreferences: {
            nodeIntegration: true

        }
    });

	console.log(win.setThumbarButtons([
		{
			tooltip: 'prev',
			icon: path.join(__dirname, 'prev.png'),
			click () { console.log('prev') },
		},
		{
			tooltip: 'play',
			icon: path.join(__dirname, 'play.png'),
			click () { console.log('play') },
		},
		{
			tooltip: 'next',
			icon: path.join(__dirname, 'next.png'),
			click () { console.log('next') },
		}
	]));

    win.loadFile("app/index.html");

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
	const time = await win.webContents.executeJavaScript('window.time');

  rpc.setActivity({
    details: `Listening to music (${time})`,
    state: title,
    startTimestamp,
    instance: false,
	largeImageKey: 'logo',
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
