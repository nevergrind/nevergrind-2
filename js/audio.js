// audio.js
var audio;
(function() {
	audio = {
		ext: 'mp3',
		on: true,
		// rotating music tracks in game
		trackIndex: ~~(rand() * 8),
		tracks: [
			'ArcLight',
			'Blackmoor Colossus',
			'Blackmoor Tides',
			'Dark Descent',
			'Heroic Demise',
			"Ireland's Coast",
			'Salt Marsh Birds',
			'Snowland Loop',
			'soliliquoy',
			'The Dark Amulet'
		],
		cache: {},
		playMusic,
		playSound,
		init,
		save,
		fade,
		pause,
		events,
		loadGame,
		gameMusicInit,
		setSoundVolume,
		setMusicVolume,
		gameMusicPlayNext,
	}
	///////////////////////////////////////////

	function init(){
		var config = localStorage.getItem('config');

		if (config === null) audio.save()
		else ng.config = Object.assign(ng.getDefaultOptions(), JSON.parse(config));

		console.info("Initializing audio...", ng.config);
		audio.playMusic("WaitingBetweenWorlds")
	}
	function events() {
		/*$("#bgmusic").on('ended', function() {
			var x = getById('bgmusic');
			x.currentTime = 0;
			x.play();
		});
		$("#bgamb1").on('ended', function() {
			var x = getById('bgamb1');
			x.currentTime = 0;
			x.play();
		});
		$("#bgamb2").on('ended', function() {
			var x = getById('bgamb2');
			x.currentTime = 0;
			x.play();
		});*/
	}
	function playMusic(track) {
		dom.bgmusic.src = ''
		console.info('ng.config.musicVolume', ng.config)
		dom.bgmusic.volume = ng.config.musicVolume / 100
		dom.bgmusic.src = "music/" + track + ".mp3"

		// var promise = new Audio("music/" + track + ".mp3")
		var promise = dom.bgmusic.play()

		//var promise = dom.bgmusic.play()
		if (promise !== undefined) {
			promise.then(_ => {})
		}
	}
	function playSound(sfx) {
		var sfx = new Audio("sound/" + sfx + ".mp3")
		sfx.volume = ng.config.soundVolume / 100
		sfx.play()
		console.info('playSound', sfx)
	}
	function save() {
		// save to storage
		console.info('saving config... ', ng.config)
		localStorage.setItem('config', JSON.stringify(ng.config))
	}
	function setMusicVolume(val) {
		if (ng.config.musicVolume){
			if (!val){
				audio.pause();
			}
		} else {
			// start playing music
			audio.musicStart();
		}
		dom.bgmusic.volume = val / 100;
		ng.config.musicVolume = val;
		audio.save();
	}
	function setSoundVolume(val) {
		ng.config.soundVolume = val;
		audio.save();
	}
	function pause() {
		dom.bgmusic.pause();
	}
	function gameMusicInit() {
		if (ng.config.musicVolume){
			audio.pause();
			dom.bgmusic.loop = false;
			audio.gameMusicPlayNext();
		}
	}
	function gameMusicPlayNext() {
		// FIX IT SO IT USES BGAUDIO
		audio.totalTracks = audio.tracks.length;
		var nowPlaying = audio.tracks[++audio.trackIndex % audio.totalTracks];
		dom.bgmusic.pause();
		dom.bgmusic.src = "music/" + nowPlaying +".mp3";
		dom.bgmusic.volume = ng.config.musicVolume / 100;
		dom.bgmusic.onended = function(){
			audio.gameMusicPlayNext();
		}
		console.info("PLAYING: ", nowPlaying);
	}
	function fade() {
		var x = {
			vol: ng.config.musicVolume / 100
		}
		TweenMax.to(x, 2.5, {
			vol: 0,
			ease: Linear.easeNone,
			onUpdate: function(){
				dom.bgmusic.volume = x.vol;
			}
		});
	}
	function loadGame() {
		var x = [
			'bash'
		];
		for (var i=0, len=x.length; i<len; i++){
			var z = x[i];
			audio.cache[z] = new Audio("sound/" + z + ".mp3");
		}
	}
})();