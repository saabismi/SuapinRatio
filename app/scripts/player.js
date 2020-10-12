const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const fs = require("fs");
window.playing = "Currently not playing anything";

let url = ""
let lists


function loadVideo(url, title) {
	fs.unlink("temp.mp4", ()=>{});
	let audio = new Audio();
	audio.src = "";

	document.getElementById("loading").style.display = "block";

	let stream = fs.createWriteStream("temp.mp4");
	ytdl(url,{ filter: format => format.container === 'mp4' }).pipe(stream);
	stream.on("close", ()=>{

	    audio.src = "temp.mp4";
			audio.time = 0
	    audio.play();

			document.getElementById("playing").innerHTML = title;
			document.getElementById("loading").style.display = "none";
			window.playing = title;

	    audio.onended = () => {
	        fs.unlink("temp.mp4", ()=>{});

					document.getElementById("playing").innerHTML="";
					window.playing = "Currently not playing anything";
	    }
	})
}

function search(string) {
	let main = document.getElementById("results");
	main.innerHTML = "<img src='resources/loading.gif' id='loading'>";
	ytsr(string, {limit: 3}).then(result => {
		result.items.forEach((item, i) => {
			let button = document.createElement("BUTTON");
			button.setAttribute("onClick",`loadVideo( '${item.link}' , '${item.title}' ) `);
			button.setAttribute("class", "searchResult");
			main.appendChild(button);
			button.innerHTML=`<img class="thumbnail" src='${item.thumbnail}'>${item.title}`;
		});
	document.getElementById("loading").style.display = "none";
	});

}
