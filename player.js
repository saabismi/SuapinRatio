const ytdl = require("ytdl-core");
const ytsr = require("ytsr");

const fs = require("fs");
const audio = new Audio();
let stream = fs.createWriteStream("temp.mp4");

let url = ""

function loadVideo(url, title) {
	ytdl(url,{ filter: format => format.container === 'mp4' }).pipe(stream);
	stream.on("close", ()=>{
	    audio.src = "temp.mp4";
	    audio.play();
			document.getElementById("playing").innerHTML = title;
	    audio.onended = () => {
	        fs.unlink("temp.mp4", ()=>{});
					document.getElementById("playing").innerHTML="";
	    }
	})
}

function search(string) {
	var main = document.getElementById("main-container");
  while (main.firstChild) {
    main.removeChild(main.lastChild);
  }
	ytsr(string, {limit: 3}).then(result => {
		result.items.forEach((item, i) => {
			var button = document.createElement("BUTTON");
			button.setAttribute("onClick",`loadVideo( '${item.link}' , '${item.title}' ) `);
			button.setAttribute("class", "searchResult");
			main.appendChild(button);
			button.innerHTML=`<img class="thumbnail" src='${item.thumbnail}'>`;
		});

	});
}
