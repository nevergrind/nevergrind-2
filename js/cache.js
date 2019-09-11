var cache;
(function() {
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
	}
	var mob
	var image
	var audio
	var index
	///////////////////////
	function preloadMob(type) {
		mob = [];
		for (var i = 1; i <= 105; i++) {
			mob[i] = 'mobs/' + type + '/' + i + '.png';
		}
		cache.preloadImages(mob);
	}
	function preloadImages(a) {
		image;
		a.forEach(function(v){
			if (v && !cache.imageStrings.includes(v)) {
				image = new Image()
				image.src = v
				cache.images.push(image)
				cache.imageStrings.push(v)

				image.onload = function() {
					index = cache.images.indexOf(this)
					if (index !== -1) {
						cache.images.splice(index, 1)
					}
				}
			}
		})
	}
	function preloadAudio(a) {
		audio;
		a.forEach(function(v){
			if (!cache.audioStrings.includes(v)) {
				audio = new Audio()
				audio.src = v
				cache.audio.push(audio)
				cache.audioStrings.push(v)

				audio.onload = function() {
					index = cache.audio.indexOf(this)
					if (index !== -1) {
						cache.images.splice(index, 1)
					}
				}
			}
		});
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
})();