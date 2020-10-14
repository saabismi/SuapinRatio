const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const fs = require("fs");
window.playing = "Currently not playing anything";

let audio = new Audio();

function formatSecondsAsTime(secs, format) {
  var hr  = Math.floor(secs / 3600);
  var min = Math.floor((secs - (hr * 3600))/60);
  var sec = Math.floor(secs - (hr * 3600) -  (min * 60));

  if (min < 10){
    min = "0" + min;
  }
  if (sec < 10){
    sec  = "0" + sec;
  }

  return min + ':' + sec;
}

audio.ontimeupdate = () => {
	var currTimeDiv = document.getElementById('songprogress');
	var durationDiv = document.getElementById('songlength');

	var currTime = Math.floor(audio.currentTime).toString();
	var duration = Math.floor(audio.duration).toString();

	currTimeDiv.innerHTML = formatSecondsAsTime(currTime);

	if (isNaN(duration)){
		durationDiv.innerHTML = '--:--';
		currTimeDiv.innerHTML = '--:--';
	}
	else{
		durationDiv.innerHTML = formatSecondsAsTime(duration);
	}
}

audio.onended = () => {
	playTrack('playing', lists.playing.now+1);
}

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
	printList(list, lists[list].target, 'display');
	playTrack(list);
}

function prevSong() {
	audio.currentTime-=10;
}

function nextSong() {
	audio.currentTime+=10;
}

function playTrack(list, track) {
	if (!(track === undefined) || !lists[list].playing) {
		if (!(track === undefined)) {lists[list].now=track;}

		if (lists[list].now < 0 || lists[list].now >= lists[list].items.lenght) {
			lists[list].now = 0;
			lists[list].playing = false;
			document.getElementById('playing').innerText = " "
			window.playing = "Currently not playing anything";
			return;
		}
		document.getElementById('playing').innerText = lists[list].items[lists[list].now].title
		window.playing = lists[list].items[lists[list].now].title;

		audio.src = `../${lists[list].items[lists[list].now].source}`;
		audio.time = 0;
		audio.play();
		lists[list].playing = true;
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
				button.innerHTML = (`<img class="thumbnail" src='${item.thumbnail}'><br>${item.title}`);
				break;
			case 'display':
				button = document.createElement("DIV");
				button.setAttribute("class", "playingTrack");
				div.appendChild(button);
				button.innerHTML = (`<button class='playingTrack_button' onClick="playTrack('playing',${i});">${item.title}</button><br><button onClick="removeTrack('playing', ${i});">Delete</button>`);
				break;
			}
	});
}

//hillon juttui

function playAndPause() {

	if (audio.paused) {
		audio.play();
		console.log("Playback continued");
	} else {
		audio.pause()
		console.log("Playback paused");
	}
}
