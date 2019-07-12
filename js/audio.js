// audio.js
var audio = {
	init: function() {
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
		audio.load.title();
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
	},
	events: function(){
		$("#bgmusic").on('ended', function() {
			var x = document.getElementById('bgmusic');
			x.currentTime = 0;
			x.play();
		});
		$("#bgamb1").on('ended', function() {
			var x = document.getElementById('bgamb1');
			x.currentTime = 0;
			x.play();
		});
		$("#bgamb2").on('ended', function() {
			var x = document.getElementById('bgamb2');
			x.currentTime = 0;
			x.play();
		});
	},
	ext: 'mp3',
	on: true,
	play: function(track, bg){
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
	},
	save: function(){
		// save to storage
		localStorage.setItem('config', JSON.stringify(ng.config));
	},
	setMusicVolume: function(val){
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
	},
	setSoundVolume: function(val){
		ng.config.audio.soundVolume = val;
		audio.save();
	},
	pause: function(){
		dom.bgmusic.pause();
	},
	gameMusicInit: function(){
		if (ng.config.audio.musicVolume){
			audio.pause();
			dom.bgmusic.loop = false;
			audio.gameMusicPlayNext();
		}
	},
	// rotating music tracks in game
	trackIndex: ~~(Math.random() * 8),
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
	gameMusicPlayNext: function(){
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
	},
	fade: function(){
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
	},
	cache: {},
	load: {
		title: function(){
			var x = [
				'bash'
			];
			for (var i=0, len=x.length; i<len; i++){
				var z = x[i];
				audio.cache[z] = new Audio("sound/" + z + ".mp3");
			}
		},
		game: function(){
			var x = [
				'bash'
			];
			for (var i=0, len=x.length; i<len; i++){
				var z = x[i];
				audio.cache[z] = new Audio("sound/" + z + ".mp3");
			}
		}
	},
	musicStart: function(){
		if (ng.view !== 'game'){
			// audio.play("ArcLight", 1);
			// audio.play("WaitingBetweenWorlds", 1);
		} else {
			audio.gameMusicPlayNext();
		}
	}
}