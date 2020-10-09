class playlist {
    constructor(name, owner, duration) {
        this.listname = name;
        this.listowner = owner;
        this.listduration = duration;
    }
}

testi = new playlist("Hyviä biisejä", "admin", "41:24");


function newList() {

    var name = prompt("Syötä soittolistalle nimi:");
    var owner = "admin";
    var duration = "13:58";

    name
    name = new playlist(name, owner, duration);
}

function addToList() {

    var list = "Hyviä biisejä";
    var song = prompt("Anna syötettävän kappaleen youtube-linkki:");

    list.push(song);
}

console.log("Listan " + testi.listname + " kesto on " + testi.listduration);


function listaaLista(lista) {
    var lista;

    for(let i = 0; i < lista.length; i++) {
        console.log(testi[i]);
    }
}

listaaLista(testi);

let playlists = [
    //example 1
    {
        name: "testi",
        icon: "https://google.com",
        songs: [
            {
                author: "pentti",
                url: "https://google.com"
            },
            {
                author: "pentti2",
                url: "https://google.com"
            }

        ]
    },
    //example 2
    {
        name: "testi",
        icon: "https://google.com",
        songs: [
            {
                author: "pentti",
                url: "https://google.com"
            },
            {
                author: "pentti2",
                url: "https://google.com"
            }

        ]
    },
]
//To add:
playlists.push({
    name: "testi",
    icon: "https://google.com",
    songs: [
        {
            author: "pentti",
            url: "https://google.com"
        },
        {
            author: "pentti2",
            url: "https://google.com"
        }

    ]
})

//Add to playlist
playlists[<index>].push({
    name: "testi",
    icon: "https://google.com",
    songs: [
        {
            author: "pentti",
            url: "https://google.com"
        },
        {
            author: "pentti2",
            url: "https://google.com"
        }

    ]
})

//get by name
async function getByName(name){
    let value = null
    for(let i = 0; i < playlists.length; i++){
        if(playlists[i].name == name){
            value = playlists[i]
            break
        }
    }
    return value
}
console.log(getByName("testi"))