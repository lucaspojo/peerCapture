const DHT = require('bittorrent-dht');
const magnet = require('magnet-uri');
const colors = require('colors/safe');
const CFonts = require('cfonts');
const torrentToMagnet = require('torrent-to-magnet');
const fs = require('fs');
var express = require('express');


// Config
var app = express();
app.use(express.static('torrents'));
app.use('/torrent', express.static(__dirname + '/torrents'));

// Déclaration des variables.
let magnetList = [];
let ipList = [];
let torrentCount = 0;

// Clear la console.
process.stdout.write('\033c');


// Affichange du logo retro comme dans les film tavu !
CFonts.say("I LOVE|HADOPI", {
    font: 'block',           
    align: 'center',
    colors: ['red'],
    background: 'black',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
});


// Zero utilité mais c'est marrant.
setTimeout(function(){
	console.log(colors.green("                    ╔═════════════════════════════╦═══════╗"))
	console.log(colors.green("                    ║")+" Le piratage c'est du vol :3 "+colors.green("║")+" 1.2.2 "+colors.green("║"));
	console.log(colors.green("                    ╚═════════════════════════════╩═══════╝ \n \n"))

	getTorrentFiles();

}, 1500);



// Convertion des fichier .torrent en magnet link.
function getTorrentFiles() {

	console.log(colors.gray('[INFO]') + " Récupération des fichiers torrent.");

	fs.readdir('./torrents/', (err, files) => {

	  files.forEach(file => {

	  	setTimeout(function(){
		  	console.log(colors.yellow('[WORK]') + " Convertion du fichier : \n      " + colors.blue(file.substring(0, 55)+"..."));
		  	torrentToMagnet('http://127.0.0.1:1337/torrent/'+file, function (err, uri) {
		  		if(!err) {
			    	console.log("      Result : " + colors.green( uri.substring(0, 55)+"..." ));

			    	// Enregistrement du magnet link dans le tableau via un PUSH.
			    	magnetList.push(uri);

				} else {
					console.log("      Result : " + colors.red( uri.substring("ERROR :( </3") ));
				}
			});
		 }, 100 * torrentCount);

	  	torrentCount++;

	  	if(torrentCount >= files.length) {
	  		setTimeout(function(){

	  			console.log("\n " + colors.green("Convertion torrent -> magnet : Terminé !" ));

	  			doIt_Just_DoIt();

	  		}, 100 * torrentCount);
	  	}

	  });
	});
}


// Parcours de la liste de magnet avec un interval de 8 secondes
// ( J'applique un interval de 8 secondes entre chaque torrent pour evité de faire 1 milliar de request d'un coup :3 )
function doIt_Just_DoIt() {
	for(k in magnetList) {

		var magnet_link = magnetList[k];
		getPeers(magnet_link, k);

	}
}

// Récuperation des la liste des peers/seeds via le magnet link.
function getPeers(magnet_link, count) {
	setTimeout(function(){

		process.stdout.write('\033c');

		CFonts.say(count, {
		    font: 'block',           
		    align: 'center',
		    colors: ['red'],
		    background: 'black',
		    letterSpacing: 1,
		    lineHeight: 1,
		    space: true,
		    maxLength: '0',
		});

		console.log(colors.gray('[INFO]') + " Connexion au réseau P2P.");  

		setTimeout(function(){
			var parsed = magnet(magnet_link)
			var btpc = new DHT()

			btpc.listen(14000+count, function () {
				console.log(colors.gray('[INFO]') + " Connexion terminé. " + colors.green('[OK]'));                                                                            
			})
			 
			btpc.on('peer', function (peer, infoHash, from) {
				console.log(colors.gray('['+ipList.length+']') + " Adresse ip détécté -> " + colors.red(peer.host));  
				ipList.push(peer.host);
			})

			btpc.lookup(parsed.infoHash)
		}, 1500);

	}, 8000 * count);
}

var server = app.listen(1337);