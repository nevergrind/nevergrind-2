// audio.js
var audio;
!function(Audio, TweenMax, undefined) {
	audio = {
		cache: {},
		playMusic,
		playSound,
		init,
		save,
		fade,
		pause,
		events,
		loadGame,
		setSoundVolume,
	}
	var key
	const Buffer = .2
	///////////////////////////////////////////

	function init(){
		var config = localStorage.getItem('config');

		if (typeof config !== 'string') {
			// is null - inits to default ng.config
			audio.save()
		}
		else {
			// previous data found. put config on top of default
			const savedConfig = JSON.parse(config)
			ng.config = {
				...ng.getDefaultOptions(),
				...savedConfig,
			}
			for (key in savedConfig.hotkey) {
				ng.config.hotkey[key] = savedConfig.hotkey[key]
			}
		}

		audio.playMusic('intro', 'wav')
	}
	function save() {
		// somehow my app config data ended up in here lul
		localStorage.setItem('config', JSON.stringify(ng.config))
	}
	function events() {
		querySelector('#bgmusic').addEventListener('timeupdate', musicUpdate)
		///////////////////////////
		function musicUpdate() {
			if (this.currentTime > this.duration - Buffer) {
				this.currentTime = 0
				this.play()
			}
		}
	}
	function playMusic(track, extension = 'mp3') {
		query.el('#bgmusic').src = ''
		query.el('#bgmusic').volume = ng.config.musicVolume / 100
		query.el('#bgmusic').src = "music/" + track + '.' + extension

		// var promise = new Audio("music/" + track + ".mp3")
		var promise = query.el('#bgmusic').play()

		//var promise = query.el('#bgmusic').play()
		if (promise !== undefined) {
			promise.then(_ => {})
		}
	}
	function playSound(sfx) {
		var sfx = new Audio("sound/" + sfx + ".mp3")
		sfx.volume = ng.config.soundVolume / 100
		sfx.play()
	}
	function setSoundVolume(val) {
		ng.config.soundVolume = val;
		audio.save();
	}
	function pause() {
		query.el('#bgmusic').pause();
	}
	function fade() {
		var x = {
			vol: ng.config.musicVolume / 100
		}
		TweenMax.to(x, 2.5, {
			vol: 0,
			ease: Linear.easeNone,
			onUpdate: function(){
				query.el('#bgmusic').volume = x.vol;
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
}(Audio, TweenMax)