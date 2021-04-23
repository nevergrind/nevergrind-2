// audio.js
var audio;
!function(Audio, TweenMax, undefined) {
	audio = {
		cache: {},
		isAmbientPlaying: false,
		init,
		playMusic,
		playSound,
		playEquipmentSound,
		playAmbient,
		stopAmbient,
		playAmbientLoop,
		playEnterDoor,
		save,
		fade,
		pause,
		events,
		loadGame,
		setSoundVolume,
	}

	audio.debClick = _.debounce(debClick)

	var key
	const LOOP_BUFFER = .2
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

		audio.playMusic('town', 'wav')
	}
	function save() {
		// somehow my app config data ended up in here lul
		localStorage.setItem('config', JSON.stringify(ng.config))
	}
	function events() {
		querySelector('#bgmusic').addEventListener('timeupdate', musicUpdate)
		querySelector('#bgamb1').addEventListener('timeupdate', ambientUpdate)
		querySelector('#bgamb2').addEventListener('timeupdate', ambientUpdate)
	}
	function musicUpdate() {
		if (!this.duration) return
		if (this.currentTime > this.duration - LOOP_BUFFER) {
			this.currentTime = 0
			this.play()
		}
	}
	function playMusic(track) {
		if (!app.isApp) return
		query.el('#bgmusic').src = ''
		query.el('#bgmusic').volume = ng.config.musicVolume / 100
		query.el('#bgmusic').src = "music/" + track + '.' + 'mp3'

		// var promise = new Audio("music/" + track + ".mp3")
		var promise = query.el('#bgmusic').play()

		//var promise = query.el('#bgmusic').play()
		if (promise !== undefined) {
			promise.then(_ => {})
		}
	}
	function debClick() {
		var sfx = new Audio('sound/click.mp3')
		sfx.volume = ng.config.soundVolume / 100
		sfx.play()
	}
	function playSound(sfx, path = '') {
		if (!sfx) return
		if (path) path += '/'
		var sfx = new Audio('sound/' + path + sfx + '.mp3')
		sfx.volume = ng.config.soundVolume / 100
		sfx.play()
	}
	function playEquipmentSound(data) {
		console.info('playEquipmentSound', data)
		if (data.itemType === 'helms') audio.playSound('item-shield', 'item')
		else if (data.armorType === 'cloth') audio.playSound('item-cloth', 'item')
		else if (data.armorType === 'leather') audio.playSound('item-leather', 'item')
		else if (data.armorType === 'mail') audio.playSound('item-mail', 'item')
		else if (data.armorType === 'plate') audio.playSound('item-plate', 'item')
		else if (data.itemType === 'rings') audio.playSound('item-ring', 'item')
		else if (data.itemType === 'amulets') audio.playSound('item-amulet', 'item')
		else if (data.itemType === 'piercers') audio.playSound('item-weapon', 'item')
		else if (data.itemType === 'bows') audio.playSound('item-wood', 'item')
		else if (data.itemType === 'shields') audio.playSound('item-shield', 'item')
		else if (data.itemType === 'oneHandSlashers') audio.playSound('item-weapon', 'item')
		else if (data.itemType === 'twoHandSlashers') audio.playSound('item-weapon', 'item')
		else if (data.itemType === 'oneHandBlunts') audio.playSound('item-shield', 'item')
		else if (data.itemType === 'twoHandBlunts') audio.playSound('item-shield', 'item')
		else if (data.itemType === 'potion') audio.playSound('item-potion', 'item')
		else if (data.itemType === 'scroll') audio.playSound('item-scroll', 'item')
	}
	function playAmbient(foo, dualDelay) {
		if (audio.isAmbientPlaying) return
		var amb1 = querySelector('#bgamb1')
		amb1.setAttribute('type', 'audio/mp3')
		amb1.src = 'sound/ambient/' + foo + '.mp3'
		amb1.volume = (ng.config.musicVolume / 100) * .5
		amb1.play()
		if (dualDelay) {
			setTimeout(() => {
				var amb2 = querySelector('#bgamb2')
				amb2.setAttribute('type', 'audio/mp3')
				amb2.src = 'sound/ambient/' + foo + '.mp3'
				amb2.volume = (ng.config.musicVolume / 100) * .5
				amb2.play()
			}, dualDelay)
		}
		else {
			querySelector('#bgamb2').pause()
		}
		audio.isAmbientPlaying = true
	}
	function stopAmbient() {
		querySelector('#bgamb1').pause()
		querySelector('#bgamb2').pause()
		audio.isAmbientPlaying = false
	}
	function playAmbientLoop() {
		const zoneName = zones[mission.id].name
		if (zoneName === ZONES.salubrinHaven) audio.playAmbient('darkwds1')
		else if (zoneName === ZONES.tendolinPassage) audio.playAmbient('darkwds2')
		else if (zoneName === ZONES.greenthornCavern) audio.playAmbient('creepywind')
		else if (zoneName === ZONES.lanfeldRefuge) audio.playAmbient('darkwds2')
		else if (zoneName === ZONES.rivenGrotto) audio.playAmbient('steamlp')
		else if (zoneName === ZONES.bastilleCitadel) audio.playAmbient('darkwds2')
		else if (zoneName === ZONES.kordataCove) audio.playAmbient('swmp1')
		else if (zoneName === ZONES.sylongSanctuary) audio.playAmbient('darkwds1')
		else if (zoneName === ZONES.thuleCrypt) audio.playAmbient('tomb')
		else if (zoneName === ZONES.templeOfPrenssor) audio.playAmbient('hell')
		else if (zoneName === ZONES.fahlnirCitadel) audio.playAmbient('hell')
		else if (zoneName === ZONES.anuranRuins) audio.playAmbient('swmp3')
		else if (zoneName === ZONES.galeblastFortress) audio.playAmbient('wind_lp1')
		else if (zoneName === ZONES.ashenflowPeak) audio.playAmbient('hell')
	}
	function playEnterDoor() {
		const zoneName = zones[mission.id].name
		if (zoneName === ZONES.salubrinHaven) audio.playSound('door-wood', 'dungeon')
		else if (zoneName === ZONES.tendolinPassage) audio.playSound('door-wood', 'dungeon')
		else if (zoneName === ZONES.greenthornCavern) audio.playSound('door-stone-closed', 'dungeon')
		else if (zoneName === ZONES.lanfeldRefuge) audio.playSound('door-stone', 'dungeon')
		else if (zoneName === ZONES.rivenGrotto) audio.playSound('door-wood', 'dungeon')
		else if (zoneName === ZONES.bastilleCitadel) audio.playSound('door-metal', 'dungeon')
		else if (zoneName === ZONES.kordataCove) audio.playSound('door-wood-closed', 'dungeon')
		else if (zoneName === ZONES.sylongSanctuary) audio.playSound('door-metal-closed', 'dungeon')
		else if (zoneName === ZONES.thuleCrypt) audio.playSound('door-stone', 'dungeon')
		else if (zoneName === ZONES.templeOfPrenssor) audio.playSound('door-stone', 'dungeon')
		else if (zoneName === ZONES.fahlnirCitadel) audio.playSound('door-metal', 'dungeon')
		else if (zoneName === ZONES.anuranRuins) audio.playSound('door-wood', 'dungeon')
		else if (zoneName === ZONES.galeblastFortress) audio.playSound('door-metal-closed', 'dungeon')
		else if (zoneName === ZONES.ashenflowPeak) audio.playSound('door-stone-closed', 'dungeon')
	}
	function ambientUpdate() {
		if (!this.duration) return
		// console.info(this.currentTime, this.duration)
		if (this.currentTime > this.duration - LOOP_BUFFER) {
			this.currentTime = 0
			this.play()
		}
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