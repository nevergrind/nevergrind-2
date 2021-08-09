var cache;
(function(Image, Audio, undefined) {
	cache = {
		images: [], // actual image in memory
		imageStrings: [], // string values
		audio: [],
		audioStrings: [],
		clearAll,
		preloadMob,
		clearAudio,
		clearImages,
		preloadAudio,
		preloadImages,
		preloadPlayerAsk,
	}
	var mob, image, audio, index, len
	///////////////////////
	function preloadPlayerAsk() {
		let path = 'images/ask/'
		let ext = '.png'
		let asks = [
			path + 'tornado' + ext,
			path + 'tornado1' + ext,
			path + 'tornado2' + ext,
			path + 'fireBolt' + ext,
			path + 'fireBolt1' + ext,
			path + 'fireBolt2' + ext,
		]
		cache.preloadImages(asks)
	}
	function preloadMob(type) {
		mob = [];
		for (var i = 1; i <= 105; i++) {
			mob[i] = 'mobs/' + type + '/' + i + '.png';
		}
		cache.preloadImages(mob);
	}
	function preloadImages(a) {
		a.forEach(loadImage)
	}
	function loadImage(v) {
		if (v && !cache.imageStrings.includes(v)) {
			image = new Image()
			image.src = v
			cache.images.push(image)
			cache.imageStrings.push(v)

			!function(image) {
				image.onload = () => {
					index = cache.images.indexOf(image)
					if (index !== -1) {
						cache.images.push(image)
					}
				}

			}(image);
		}
	}
	function preloadAudio(a) {
		a.forEach(loadAudio);
	}
	function loadAudio(v) {
		if (!cache.audioStrings.includes(v)) {
			audio = new Audio()
			audio.src = v
			cache.audio.push(audio)
			cache.audioStrings.push(v)

			!function(audio) {
				audio.onload = () => {
					index = cache.audio.indexOf(this)
					if (index !== -1) {
						cache.images.push(audio)
					}
				}
			}(audio)
		}
	}
	function clearAll() {
		cache.clearImages();
		cache.clearAudio();
	}
	function clearImages() {
		cache.images = [];
		cache.imageStrings = [];
	}
	function clearAudio() {
		cache.audio = [];
		cache.audioStrings = [];
	}
})(Image, Audio);