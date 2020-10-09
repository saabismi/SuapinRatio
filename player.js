const ytdl = require("ytdl-core");
const ytsr = require("ytsr");

const fs = require("fs");

let url = ""
let audio = new Audio();

function loadVideo(url, title) {
	fs.unlink("temp.mp4", ()=>{});
	let stream = fs.createWriteStream("temp.mp4");
	document.getElementById("loading").style.display = "block";
	ytdl(url,{ filter: format => format.container === 'mp4' }).pipe(stream);
	stream.on("close", ()=>{
	    audio.src = "temp.mp4";
			audio.time = 0
	    audio.play();
			document.getElementById("playing").innerHTML = title;
			document.getElementById("loading").style.display = "none";
	    audio.onended = () => {
	        fs.unlink("temp.mp4", ()=>{});
					document.getElementById("playing").innerHTML="";
	    }
	})
}

function search(string) {
	var main = document.getElementById("results");
	main.innerHTML = "<img src='loading.gif' id='loading'>";
	ytsr(string, {limit: 3}).then(result => {
		result.items.forEach((item, i) => {
			var button = document.createElement("BUTTON");
			button.setAttribute("onClick",`loadVideo( '${item.link}' , '${item.title}' ) `);
			button.setAttribute("class", "searchResult");
			main.appendChild(button);
			button.innerHTML=`<img class="thumbnail" src='${item.thumbnail}'>`;
		});
	document.getElementById("loading").style.display = "none";
	});

}
