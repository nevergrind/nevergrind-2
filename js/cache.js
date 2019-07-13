var cache;
(function() {
	cache = {
		images: [], // actual image in memory
		imageStrings: [], // string values
		audio: [],
		audioStrings: [],
		clearAll: clearAll,
		preloadMob: preloadMob,
		clearAudio: clearAudio,
		clearImages: clearImages,
		preloadAudio: preloadAudio,
		preloadImages: preloadImages,
	}
	///////////////////////
	function preloadMob(type) {
		var a = [];
		for (var i = 1; i <= 105; i++) {
			a[i] = 'mobs/' + type + '/' + i + '.png';
		}
		cache.preloadImages(a);
	}
	function preloadImages(a) {
		var e;
		a.forEach(function(v){
			if (v && !~cache.imageStrings.indexOf(v)) {
				e = new Image();
				e.src = v;
				cache.images.push(e);
				cache.imageStrings.push(v);
			}
		});
	}
	function preloadAudio(a) {
		var e;
		a.forEach(function(v){
			if (!~cache.audioStrings.indexOf(v)) {
				e = new Audio();
				e.src = v;
				cache.audio.push(e);
				cache.audioStrings.push(v);
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