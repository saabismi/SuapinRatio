const ytdl = require("ytdl-core");
const ytsr = require("ytsr");
const fs = require("fs");
window.playing = "Currently not playing anything";
window.time = "--:--/--:--"


let audio = new Audio();

//function to convert seconds to seconds and minutes.
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

//Updetes the time every second
audio.ontimeupdate = () => {
	var currTimeDiv = document.getElementById('songprogress');
	var durationDiv = document.getElementById('songlength');

	var currTime = Math.floor(audio.currentTime).toString();
	var duration = Math.floor(audio.duration).toString();

	currTimeDiv.innerHTML = formatSecondsAsTime(currTime);

	if (isNaN(duration)){
		durationDiv.innerHTML = '--:--';
		currTimeDiv.innerHTML = '--:--';
		window.time = '--:--';
	}
	else{
		durationDiv.innerHTML = formatSecondsAsTime(duration);
		window.time = formatSecondsAsTime(currTime) + ' / ' +  formatSecondsAsTime(duration);
	}
}

//play next song when audio has ended.
audio.onended = () => {
	playTrack('playing', lists.playing.now+1);
}

//Save data on quit
window.onbeforeunload = () => {
	let data = JSON.stringify(lists, null, 2);
	fs.writeFileSync('playlists.json', data);
}

//Declare needed playlists
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
	downloads: {
		name: "downloads",
		target: "downloads",
		items: [],
		now: 0,
		playing: false,
	},
};

let pages = [
	{
		name: "results",
		id:  "page_results",
		active: true,
	},
	{
		name: "downloads",
		id:  "page_downloads",
		active: false,
	},
	{
		name: 'playlists',
		id: 'page_playlists',
		active: false,
	},
]

//Load playlist data and display it
if (fs.existsSync('playlists.json')) {
	lists = require('./../playlists.json');
}
printList('playing', 'currentList', 'display');

function page(target) {
	pages.forEach((item, i) => {
		if (item.name==target) {
			document.getElementById(item.id).style = "display: block;";
			pages[i].active = true;
			updatePage(item.name);
		} else {
			document.getElementById(item.id).style = "display: none;";
			pages[i].active = false;
		}
	});
}

function updatePage(page) {
	switch (page) {
		case 'downloads':
			printList('downloads', 'downloads', 'play');
			break;
		case 'playlists':
			printLists('playlists');
			break;
	}
}

//FUnction to remove track from a playlist, list is the plylist's name (string) and track is the index of the track.
function removeTrack(list, track) {
	lists[list].items.splice(track, 1);
	printList(list, lists[list].target, 'display');
	playTrack(list);
}

//Function to move the player time by -10sec
function prevSong() {
	audio.currentTime-=10;
}

//Function to move the player time by +10sec
function nextSong() {
	audio.currentTime+=10;
}

//Function to play specified track in playlist
function playTrack(list, track) {
	if (!(track === undefined) || !lists[list].playing) {
		if (!lists[list].items[track].source) {
			lists[list].items[track] = loadVideo(list,track);
		} else {
			window.timestamp = new Date();
			//If the track is specified, set the player to play that track.
			if (!(track === undefined)) {lists[list].now=track;}

			if (lists[list].now < 0 || lists[list].now >= lists[list].items.lenght) {
				//If track is nonexistent, reset player.
				lists[list].now = 0;
				lists[list].playing = false;
				document.getElementById('playing').innerText = " ";
				window.playing = "Currently not playing anything";
				return;
			}
			//Update Discord RPC and the marquee
			document.getElementById('playing').innerText = lists[list].items[lists[list].now].title
			window.playing = lists[list].items[lists[list].now].title;
			audio.src = `../${lists[list].items[lists[list].now].source}`;
			audio.play();
			lists[list].playing = true;
		}
	}
}

//(WIP) function to save list
function saveList(name) {
	lists[name]=JSON.parse(JSON.stringify(lists.playing));
	lists[name].name=name;
	printLists("playlists");
}

//Function to play a specified playlist (moves it to currently playing -playlist.)
function playList(list) {
	lists.playing.items = [];
	lists.playing.items = JSON.parse(JSON.stringify(lists[list].items));;
	printList('playing', 'currentList','display');
	playTrack('playing');
}

//Function to print all playlists in memory. Target is the id of HTML element where to print. (WIP)
function printLists(target) {
	div = document.getElementById(target);
	div.innerHTML = "";
	for (let key in lists) {
	    if (lists.hasOwnProperty(key)) {
			button = document.createElement("BUTTON");
			button.setAttribute("class","playlist");
			button.setAttribute("onClick", `playList('${key}');`);
	        div.appendChild(button);
			button.innerText = lists[key].name;
	    }
	}
}

//Loads youtube video. From is the playlist where the video is, id is the index of track.
function loadVideo(from, id) {
	let item = lists[from].items[id];
	//Avoid filesystem messing with onverting " " to "_"
	let destination = `tracks/${item.title.replace(/\ /g,'_')}.mp4`;
	//Make track data
	let track = {
		title: item.title,
		url: item.url,
		thumbnail: item.thumbnail,
		duration: item.duration,
		source: destination,
		playing: false,
	};
	//Do not download the track if it is already in memory.
	if (!fs.existsSync(destination)) {
		let stream = fs.createWriteStream(destination);
		//fetch from YT
		ytdl(item.url,{ filter: format => format.container === 'mp4' }).pipe(stream);
		stream.on("close", ()=>{
			//Register the download (push to download playlist)
			lists.downloads.items.push(track);
			//play the track when downloaded
			playTrack('playing');
		});
	} else {
		//play the track.
		playTrack('playing');
	}
	//Update playlist.
	return track;
}

//Function for loading video from search results
function video(from, id, to) {
	track = loadVideo(from, id);
	//Push track data to list
	lists[to].items.push(track);
	printList('playing', 'currentList','display');
}

//Function to get search results and save them to "search" playlist.
async function search(string) {
	page('results');
	//reset search playlist:
	lists.search.items = [];
	result = await ytsr(string, {limit: 3});
	result.items.forEach((item, i) => {
		//create new track data from search result
		let track = {
			title: item.title,
			url: "http://www.youtube.com/watch?v="+item.id,
			thumbnail: item.bestThumbnail.url,
			duration: item.duration,
			playing: false,
		};
		//append data to playlist "search"
		lists.search.items.push(track);
	});
	//update search list
	printList('search','results','play');
}

//Function to print list items, list is the list to print (string), target is HTML element id where to print and action is the way of displaying.
function printList(list,target,action) {
	let div = document.getElementById(target);
	div.innerHTML = "";
	lists[list].items.forEach((item, i) => {
		let button = document.createElement("BUTTON");
		switch (action) {
			case 'play':
				//Bind a function to the button
				button.setAttribute("onClick",`video('${list}', ${i}, 'playing' ); `);
				//And a class
				button.setAttribute("class", "searchResult");
				div.appendChild(button);
				//Set button text (image in this cae)
				button.innerHTML = (`<img class="thumbnail" src='${item.thumbnail}'><br>${item.title}`);
				break;
			case 'display':
				//button is actually div element
				button = document.createElement("DIV");
				//class
				button.setAttribute("class", "playingTrack");
				div.appendChild(button);
				//Add two buttons to div, one to play that track, one to delete it.
				button.innerHTML = (`<button class='playingTrack_button' onClick="playTrack('${list}',${i});"><img src="${item.thumbnail}"><span class="songtitle">${item.title}</span></button><br><button class="removetrack" onClick="removeTrack('${list}', ${i});">X</button>`);
				break;
		}
	});
}

// Play/pause functionality

function playAndPause() {
	//check if the audio is paused
	if (audio.paused) {
		audio.play(); //audio is paused, therefore play it
	} else {
		audio.pause(); //audio is not paused (= it most likely is playing), therefore pause it
	}
}


// Volume changing functionality

function changeVolume(amount) {
	//set the audio object volume to the value on the slider
	audio.volume = amount;

}
