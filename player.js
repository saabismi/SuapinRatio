const ytdl = require("ytdl-core");
const ytsr = require('ytsr');

const fs = require("fs");
const audio = new Audio();
let stream = fs.createWriteStream("temp.mp4");

let url = ""

function loadVideo(url) {
	ytdl(url,{ filter: format => format.container === 'mp4' }).pipe(stream);
	stream.on("close", ()=>{
	    audio.src = "temp.mp4";
	    audio.play();
	    audio.onended = () => {
	        fs.unlink("temp.mp4", ()=>{});
	    }
	})
}

function search(string) {
	document.getElementById("main-container").append("Results:");
	ytsr(string).then(result => {
		document.getElementById("main-container").append(result.items[0].title);
	});
}
