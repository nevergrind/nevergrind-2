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
		play,
		init,
		save,
		fade,
		pause,
		events,
		loadGame,
		loadTitle,
		musicStart,
		gameMusicInit,
		setSoundVolume,
		setMusicVolume,
		gameMusicPlayNext,
	}
	///////////////////////////////////////////
	function init(){
		var config = localStorage.getItem('config');
		var initComplete = false;
		var musicSlider = $("#musicSlider");
		var soundSlider = $("#soundSlider");

		if (config === null){
			// initialize
			audio.save();
		}
		else {
			config = JSON.parse(config);
			if (ng.config.audio.musicOn === undefined){
				ng.config.audio = config.audio;
			}
		}
		// console.info("Initializing audio...", g.config.audio);
		audio.loadTitle();
		if (!ng.config.audio.musicVolume){
			audio.pause();
		}
		else {
			audio.musicStart();
		}
		if (musicSlider.length){
			musicSlider.slider({
				min: 0,
				max: 100,
				value: ng.config.audio.musicVolume,
				formatter: function(value) {
					if (initComplete){
						audio.setMusicVolume(value);
						return value;
					}
					else {
						return ng.config.audio.musicVolume;
					}
				}
			}).slider('setValue', ng.config.audio.musicVolume);
		}
		if (soundSlider.length){
			soundSlider.slider({
				min: 0,
				max: 100,
				value: ng.config.audio.soundVolume,
				tooltip_position: 'bottom',
				formatter: function(value) {
					if (initComplete){
						audio.setSoundVolume(value);
						return value;
					}
					else {
						return ng.config.audio.soundVolume
					}
				}
			}).on('slideStop', function(val){
				audio.play('machine0');
			}).slider('setValue', ng.config.audio.soundVolume);
		}
		initComplete = true;
	}
	function events() {
		$("#bgmusic").on('ended', function() {
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
		});
	}
	function play(track, bg) {
		if (track) {
			if (bg){
				// music
				if (ng.config.audio.musicVolume){
					dom.bgmusic.pause();
					dom.bgmusic.src = "music/" + track + ".mp3";
					dom.bgmusic.volume = ng.config.audio.musicVolume / 100;
				}
			}
			else {
				// sfx
				if (ng.config.audio.soundVolume){
					var sfx = new Audio("sound/" + track + ".mp3");
					sfx.volume = ng.config.audio.soundVolume / 100;
					sfx.play();
				}
			}
		}
	}
	function save() {
		// save to storage
		localStorage.setItem('config', JSON.stringify(ng.config));
	}
	function setMusicVolume(val) {
		if (ng.config.audio.musicVolume){
			if (!val){
				audio.pause();
			}
		} else {
			// start playing music
			audio.musicStart();
		}
		dom.bgmusic.volume = val / 100;
		ng.config.audio.musicVolume = val;
		audio.save();
	}
	function setSoundVolume(val) {
		ng.config.audio.soundVolume = val;
		audio.save();
	}
	function pause() {
		dom.bgmusic.pause();
	}
	function gameMusicInit() {
		if (ng.config.audio.musicVolume){
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
		dom.bgmusic.volume = ng.config.audio.musicVolume / 100;
		dom.bgmusic.onended = function(){
			audio.gameMusicPlayNext();
		}
		console.info("PLAYING: ", nowPlaying);
	}
	function fade() {
		var x = {
			vol: ng.config.audio.musicVolume / 100
		}
		TweenMax.to(x, 2.5, {
			vol: 0,
			ease: Linear.easeNone,
			onUpdate: function(){
				dom.bgmusic.volume = x.vol;
			}
		});
	}
	function loadTitle() {
		var x = [
			'bash'
		];
		for (var i=0, len=x.length; i<len; i++){
			var z = x[i];
			audio.cache[z] = new Audio("sound/" + z + ".mp3");
		}
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
	function musicStart() {
		if (ng.view !== 'game'){
			// audio.play("ArcLight", 1);
			// audio.play("WaitingBetweenWorlds", 1);
		} else {
			audio.gameMusicPlayNext();
		}
	}
})();