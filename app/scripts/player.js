const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const fs = require("fs");
window.playing = "Currently not playing anything";

let audio = new Audio();

let lists = {
	search: {
		name: "search",
		target: "results",
		items: [],
		now: 0,
		playing: false,
	},
	playing: {
		name: "playing",
		target: "currentList",
		items: [],
		now: 0,
		playing: false,
	},
};

function removeTrack(list, track) {
	lists[list].items.splice(track, 1);
	playTrack(list)
}

function playTrack(list, track) {
	if (!(track === undefined) || !lists[list].playing) {
		if (!(track === undefined)) {lists[list].now=track;}
		document.getElementById('playing').innerText = lists[list].items[lists[list].now].title
		window.playing = lists[list].items[lists[list].now].title;

		audio.src = `../${lists[list].items[lists[list].now].source}`;
		audio.time = 0;
		audio.play();
		lists[list].playing = true;
		audio.onended = () => {
			if (lists[list].now+1 >= lists[list].items.lenght) {
				lists[list].now = 0;
				lists[list].playing = false;
				document.getElementById('playing').innerText = " "
				window.playing = "Currently not playing anything";
				return;
			}
			playTrack('playing', lists[list].now+1);
		}
	}
}

function saveList(name) {
	lists[name]=lists.playing;
	lists[name].name=name;
	printLists("playlists");
}

function playList(list) {
	lists.playing.items = [];
	lists.playing.items = lists[list].items;
}

function printLists(target) {
	div = document.getElementById(target);
	for (let key in lists) {
	    if (p.hasOwnProperty(key)) {
			button = document.createElement("BUTTON");
			button.setAttribute("class","playlist");
			button.setAttribute("onClick", `playList(${key});`);
	        div.appendChild(button);
			button.innerText = lists[key].name;
	    }
	}
}


function loadVideo(from, id, to) {
	let item = lists[from].items[id];
	let destination = `tracks/${item.title.replace(/\ /g,'_')}.mp4`;
	let track = {
		title: item.title,
		url: item.link,
		thumbnail: item.thumbnail,
		duration: item.duration,
		source: destination,
		playing: false,
	};
	lists[to].items.push(track);
	if (!fs.existsSync(destination)) {
		let stream = fs.createWriteStream(destination);
		ytdl(item.url,{ filter: format => format.container === 'mp4' }).pipe(stream);
		stream.on("close", ()=>{
			playTrack('playing');
		})
	} else {
		playTrack('playing');
	}
	printList('playing', 'currentList','display');
}

function search(string) {
	lists.search.items = [];
	ytsr(string, {limit: 3}).then(result => {
		result.items.forEach((item, i) => {
			let track = {
				title: item.title,
				url: item.link,
				thumbnail: item.thumbnail,
				duration: item.duration,
				playing: false,
			};
			lists.search.items.push(track);
		});
		printList('search','results','play');
	});
}

function printList(list,target,action) {
	let div = document.getElementById(target);
	div.innerHTML = "";
	lists[list].items.forEach((item, i) => {
		let button = document.createElement("BUTTON");
		switch (action) {
			case 'play':
				button.setAttribute("onClick",`loadVideo('search', ${i}, 'playing' ); `);
				button.setAttribute("class", "searchResult");
				div.appendChild(button);
				button.innerHTML = (`<img class="thumbnail" src='${item.thumbnail}'>${item.title}`);
				break;
			case 'display':
				button.setAttribute("onClick",`playTrack('playing',${i})`);
				button.setAttribute("class", "playingTrack");
				div.appendChild(button);
				button.innerHTML = (`${item.title}`);
				break;
			}
	});
}
