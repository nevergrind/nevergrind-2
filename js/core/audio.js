// audio.js
var audio;
!function(Audio, TweenMax, _, clearInterval, setInterval, Power0, undefined) {
	audio = {
		debounceMap: {},
		ambientTrackPlaying: 1,
		ambientIsFading: false,
		ambientTrackDuration: 0,
		isAmbientPlaying: false,
		ambientVolume: .5,
		allyVolume: .2,
		cache: {},
		musicTimeout: 0,
		musicTween: 0,
		init,
		playMusic,
		playSound,
		playEquipmentSound,
		playAmbient,
		stopAmbient,
		playAmbientLoop,
		playEnterDoor,
		save,
		fadeMusic,
		pauseMusic,
		events,
		setSoundVolume,
		playerHit,
		playerDeath,
		startWalk,
		playWalk,
		playAutoAttack,
		castSoundStart,
		castSoundEnd,
		getVolumeMod,
		getVolume,
	}

	const bgmusicElement = query.el('#bgmusic')
	const bgamb1Element = query.el('#bgamb1')
	const bgamb2Element = query.el('#bgamb2')

	var key
	const MUSIC_BUFFER = .2
	const AMBIENT_BUFFER = 2
	// cast start/stop audio files for all spells
	const castData = {
		// RNG
		'Burning Embers': {
			start: 'spell-legacy-start-conjuration-dd',
			end: 'spell-legacy-end-conjuration-buff'
		},
		'Shock Nova': {
			start: 'spell-legacy-start-conjuration-dd',
			end: () => 'zap' + _.random(1, 4)
		},
		'Faerie Flame': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-conjuration-buff'
		},
		'Fungal Growth': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Shimmering Orb': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Spirit of the Hunter': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		// CLR
		'Smite': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'spell-legacy-end-evocation-dd-slam'
		},
		'Deliverance': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-alteration-buff-fire'
		},
		'Condemnation': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'spell-legacy-end-conjuration-buff'
		},
		'Sacred Revelation': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-evocation-dd-slam'
		},
		'Holy Sanctuary': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-conjuration-buff'
		},
		'Force of Glory': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-evocation-dd-slam'
		},
		'Binding Grace': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-heal'
		},
		'Guardian Angel': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Divine Light': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-heal'
		},
		'Circle of Prayer': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-heal'
		},
		'Seal of Redemption': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Zealous Resolve': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		// DRU
		'Starfire': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-evocation-dd'
		},
		'Fissure': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'windcast'
		},
		'Lightning Blast': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'zap1'
		},
		'Blizzard': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'icespike1'
		},
		'Toxic Spores': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Molten Boulder': {
			start: 'spell-legacy-start-conjuration-dd',
			end: 'windcast'
		},
		'Barbed Thicket': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Tornado': {
			start: 'spell-legacy-start-conjuration-dd',
			end: 'windcast'
		},
		'Nature\'s Touch': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Moss Breath': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Synthesize': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Branch Spirit': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		// WIZ
		'Fire Bolt': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-evocation-dd'
		},
		'Ice Bolt': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'blue3'
		},
		'Lightning Bolt': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'zap4'
		},
		'Magic Missiles': {
			start: 'spell-legacy-start-evocation-magic',
			end: ''
		},
		'Fireball': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-evocation-dd'
		},
		'Chain Lightning': {
			start: 'spell-legacy-start-evocation-magic',
			end: ''
		},
		'Frost Nova': {
			start: 'spell-legacy-start-evocation-fire',
			end: ''
		},
		'Meteor': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'meteor-launch'
		},
		'Frozen Barrier': {
			start: 'spell-legacy-start-conjuration-dd',
			end: 'icespike1'
		},
		'Mirror Image': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Mana Shell': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Deep Freeze': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-evocation-dd-slam'
		},
		// TMP
		'Lava Bolt': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-evocation-dd'
		},
		'Thunderclap': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'thunder1'
		},
		'Frozen Orb': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'icebolt2'
		},
		'Static Storm': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'lightning2'
		},
		'Fire Wall': {
			start: 'spell-legacy-start-conjuration-dd',
			end: 'windcast'
		},
		'Glacial Spike': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-evocation-dd-slam'
		},
		'Primordial Sludge': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Arclight': {
			start: 'spell-legacy-start-conjuration-dot',
			end: ''
		},
		'Primeval Withering': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Molten Aegis': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Conviction': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Celestial Frenzy': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		// SHD
		'Astral Blade': {
			start: 'spell-legacy-start-conjuration-dd',
			end: 'redemption'
		},
		'Ravaging Plague': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-evocation-dd'
		},
		'Decaying Doom': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-evocation-dd'
		},
		'Blood Terror': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Life Tap': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Vampiric Feast': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff-fire'
		},
		'Sanguine Harvest': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Mark of Remphan': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-alteration-buff-fire'
		},
		// SHM
		'Frost Rift': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-evocation-dd-slam'
		},
		'Poison Nova': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-alteration-buff-fire'
		},
		'Scourge': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-evocation-dd'
		},
		'Poison Bolt': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-conjuration-buff'
		},
		'Vampiric Gaze': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Glacial Shard': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'spell-legacy-end-evocation-dd-slam'
		},
		'Affliction': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Devouring Swarm': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-conjuration-buff'
		},
		'Rejuvinate': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-heal'
		},
		'Mystical Glow': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Vampiric Allure': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Boreal Talisman': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		// WLK
		'Venom Bolt': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-evocation-dd'
		},
		'Explosive Plague': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-conjuration-buff'
		},
		'Blood Fire': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-conjuration-buff'
		},
		'Demonic Pact': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-alteration-buff-fire'
		},
		'Haunting Vision': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-start-evocation-magic'
		},
		'Icing Death': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'icespike3'
		},
		'Curse of Shadows': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Panic Strike': {
			start: 'spell-legacy-start-conjuration-dd',
			end: 'spell-legacy-start-evocation-magic'
		},
		'Drain Soul': {
			start: 'spell-legacy-start-conjuration-dd',
			end: 'spell-legacy-end-alteration-buff-fire'
		},
		'Lich Form': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Engulfing Darkness': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Profane Spirit': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-conjuration-buff'
		},
		// ENC
		'Gravity Flux': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'holybolt'
		},
		'Static Suffocation': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'spell-legacy-end-heal'
		},
		'Mind Blitz': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'lightning2'
		},
		'Subversion': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Color Shift': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-start-evocation-fire'
		},
		'Phase Blade': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Stasis Field': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-conjuration-buff'
		},
		'Shifting Ether': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Serene Sigil': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Augmentation': {
			start: 'spell-legacy-start-buff',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Clarity': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Enthrall': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-alteration-buff'
		},
		// BRD
		'Bellow': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-conjuration-buff'
		},
		'Sonic Boom': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-evocation-dd'
		},
		'Euphonic Dirge': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Subverted Symphony': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Crashing Chords': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-evocation-dd-slam'
		},
		'Battle Hymn': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Militant Cadence': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Consonant Chain': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-alteration-buff-fire'
		},
		'Litany of Life': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-heal'
		},
		'Melody of Mana': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-heal'
		},
		'Righteous Rhapsody': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-conjuration-buff'
		},
		'Chromatic Sonata': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-alteration-buff'
		},
		// CRU
		'Seal of Damnation': {
			start: 'spell-legacy-end-conjuration-buff',
			end: 'spell-legacy-end-heal'
		},
		'Holy Wrath': {
			start: 'spell-legacy-start-evocation-fire',
			end: 'spell-legacy-end-evocation-dd-slam'
		},
		'Divine Judgment': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'spell-legacy-end-conjuration-buff'
		},
		'Blessed Hammer': {
			start: 'spell-legacy-start-evocation-magic',
			end: 'handofgod'
		},
		'Seal of Sanctuary': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-alteration-buff'
		},
		'Divine Grace': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-heal'
		},
		'Benevolence': {
			start: 'spell-legacy-start-heal',
			end: 'spell-legacy-end-heal'
		},
		'Jubilee': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-conjuration-buff'
		},
	}
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
			const defaultConfig = ng.getDefaultOptions()
			ng.config = {
				...defaultConfig,
				...savedConfig,
			}
			for (key in defaultConfig.hotkey) {
				ng.config.hotkey[key] = defaultConfig.hotkey[key]
			}
			for (key in savedConfig.hotkey) {
				ng.config.hotkey[key] = savedConfig.hotkey[key]
			}
		}

		audio.playMusic('intro', .5)
	}
	function save() {
		// somehow my app config data ended up in here lul
		localStorage.setItem('config', JSON.stringify(ng.config))
	}
	function events() {
		bgmusicElement.addEventListener('timeupdate', loopMusic)
		bgamb1Element.addEventListener('timeupdate', loopAmbient)
		bgamb2Element.addEventListener('timeupdate', loopAmbient)
	}
	function loopMusic() {
		if (!this.duration) return
		// console.info(this.currentTime, this.duration)
		if (this.currentTime > this.duration - MUSIC_BUFFER) {
			this.currentTime = 0
			this.play()
		}
	}
	// TODO: Perfect ambient loop by fading them in and out - detect track length and fade 2 seconds from end
	function loopAmbient() {
		if (!this.duration) return
		audio.ambientTrackDuration = this.duration
		// console.info(this.currentTime, this.duration)
		if (this.currentTime > this.duration - AMBIENT_BUFFER) {
			if (!audio.ambientIsFading) {
				audio.ambientIsFading = true
				if (audio.ambientTrackPlaying === 1) {
					fadeAmbientOut(bgamb1Element)
					fadeAmbientIn(bgamb2Element)
					audio.ambientTrackPlaying = 2
				}
				else {
					fadeAmbientOut(bgamb2Element)
					fadeAmbientIn(bgamb1Element)
					audio.ambientTrackPlaying = 1
				}
				/*this.currentTime = 0
				this.play()*/
			}
		}
	}

	function stopAmbient() {
		bgamb1Element.pause()
		bgamb2Element.pause()
		audio.isAmbientPlaying = false
	}

	function playAmbientLoop() {
		audio.playAmbient(_.kebabCase(zones[mission.id].name))
	}

	function playAmbient(foo) {
		// console.info('playAmbient', audio.isAmbientPlaying)
		if (audio.isAmbientPlaying) return
		audio.ambientTrackPlaying = 1
		bgamb1Element.setAttribute('type', 'audio/mp3')
		bgamb1Element.src = 'sound/ambient/' + foo + '.mp3'
		bgamb1Element.volume = (ng.config.musicVolume / 100) * audio.ambientVolume
		bgamb1Element.play()
		audio.isAmbientPlaying = true

		bgamb2Element.volume = (ng.config.musicVolume / 100) * audio.ambientVolume
		bgamb2Element.setAttribute('type', 'audio/mp3')
		bgamb2Element.src = 'sound/ambient/' + foo + '.mp3'
		// console.info('playAmbient SUCCESS', audio.isAmbientPlaying)
	}

	function fadeAmbientOut(el) {
		var x = { vol: ng.config.musicVolume / 100 * audio.ambientVolume }
		TweenMax.to(x, AMBIENT_BUFFER, {
			vol: 0,
			ease: Power0.easeNone,
			onUpdate: () => {
				el.volume = x.vol
			},
			onComplete: () => {
				el.currentTime = 0
				el.pause()
				audio.ambientIsFading = false
			}
		})
	}
	function fadeAmbientIn(el) {
		el.currentTime = 0
		el.play()
		var x = { vol: 0 }
		TweenMax.to(x, AMBIENT_BUFFER, {
			vol: ng.config.musicVolume / 100 * audio.ambientVolume,
			ease: Power0.easeNone,
			onUpdate: () => {
				// console.info('fadeAmbientIn', x.vol)
				el.volume = x.vol
			},
		})
	}
	function pauseMusic() {
		bgmusicElement.pause()
	}
	function fadeMusic(duration = 2.5) {
		var x = {
			vol: ng.config.musicVolume / 100
		}
		TweenMax.to(x, duration, {
			vol: 0,
			ease: Linear.easeNone,
			onUpdate: () => {
				bgmusicElement.volume = x.vol
			},
			onComplete: () => {
				bgmusicElement.src = ''
			}
		})
	}
	function playMusic(fileName, fade = .25, delay = 0) {
		if (!fade) {
			bgmusicElement.src = ''
		}

		const tween = {
			volume: ng.config.musicVolume / 100,
		}
		if (typeof audio.musicTween === 'object') {
			audio.musicTween.kill()
		}
		clearTimeout(audio.musicTimeout)
		audio.musicTween = TweenMax.to(tween, fade, {
			volume: 0,
			ease: Power0.easeNone,
			onUpdate: () => {
				bgmusicElement.volume = tween.volume
			},
			onComplete: () => {
				audio.musicTimeout = setTimeout(() => {
					bgmusicElement.volume = ng.config.musicVolume / 100
					bgmusicElement.src = 'music/' + fileName + '.' + 'mp3'
					const promise = bgmusicElement.play()
					if (promise !== undefined) {
						promise.then(_ => {})
					}
				}, delay)
			}
		})
	}

	function playSound(
		fileName,
		path = '',
		volumeMod = 1,
		debounceTime = 25
	) {
		if (!fileName) return
		if (path) path += '/'
		if (debounceTime) {
			if (typeof audio.debounceMap[path + fileName] === 'undefined') {
				audio.debounceMap[path + fileName] = Date.now()
			}
			else {
				const d = Date.now()
				if (d - audio.debounceMap[path + fileName] < debounceTime) return
				audio.debounceMap[path + fileName] = d
			}
		}
		const sfx = new Audio('sound/' + path + fileName + '.mp3')
		sfx.volume = (ng.config.soundVolume * volumeMod) / 100
		sfx.play()
	}
	function playEquipmentSound(data) {
		// console.info('playEquipmentSound', data)
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

	function playEnterDoor() {
		if (dungeon.suppressDoorAudio) {
			dungeon.suppressDoorAudio = false
			audio.playSound('sit')
			return
		}
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

	function playAutoAttack(o) {
		const volMod = getVolumeMod(party.getIndexByRow(o.row) > 0)
		if (o.key.includes('Hand-to-hand')) {
			audio.playSound('punch-1', 'combat', volMod)
		}
		else if (o.key.includes('autoAttackOne-hand') ||
			o.key.includes('autoAttackPiercing')) {
			audio.playSound('auto-1h', 'combat', volMod)
		}
		else {
			audio.playSound('auto-2hs', 'combat', volMod)
		}
	}

	const walkInterval = 500
	function startWalk() {
		clearInterval(dungeon.walkSoundInterval)
		dungeon.walkSoundInterval = setInterval(audio.playWalk, walkInterval)
	}
	function playWalk() {
		audio.playSound('walk-' + _.random(1, 4), 'player')
	}
	function setSoundVolume(val) {
		ng.config.soundVolume = val;
		audio.save();
	}

	const BIG_RACES = [
		'orc',
		'troll'
	]
	const SMALL_RACES = [
		'halfling',
		'gnome',
		'dwarf'
	]
	let hitSound = ''
	function playerHit(damage, index) {
		if (party.presence[index].hp / party.presence[index].hpMax < .33) {
			// below 33% health - more crunchiness
			if (damage > party.presence[index].hpMax * .025) {
				playerHitCrunch(index > 0)
			}
			else {
				audio.playSound('hit', 'combat', getVolumeMod(index > 0))
				playerHitRegular(index)
			}
		}
		else {
			if (damage > party.presence[index].hpMax * .05) {
				playerHitCrunch(index > 0)
			}
			else if (damage > party.presence[index].hpMax * .03) {
				audio.playSound('hit', 'combat', getVolumeMod(index > 0))
				playerHitRegular(index)
			}
			else {
				audio.playSound('hit', 'combat', getVolumeMod(index > 0))
			}
		}
	}
	function playerHitRegular(index) {
		hitSound = 'hit-' + _.random(1, 4) + '-' + (!party.presence[index].gender ? 'male' : 'female')
		if (BIG_RACES.includes(party.presence[index].race)) {
			hitSound += '-big'
		}
		else if (SMALL_RACES.includes(party.presence[index].race)) {
			hitSound += '-small'
		}
		audio.playSound(hitSound, 'player', getVolumeMod(index > 0))
	}
	function playerHitCrunch(isAlly = false) {
		audio.playSound('hit-crunch', 'combat', getVolumeMod(isAlly))
	}
	let deathSound = ''
	function playerDeath(index) {
		deathSound = 'death-' + (!party.presence[index].gender ? 'male' : 'female')
		if (BIG_RACES.includes(party.presence[index].race)) {
			deathSound += '-big'
		}
		else if (SMALL_RACES.includes(party.presence[index].race)) {
			deathSound += '-small'
		}
		audio.playSound(deathSound, 'player', getVolumeMod(index > 0))
	}
	function castSoundStart(index, name) {
		// console.info('castSoundStart', index, name)
		let sfx = ''
		if (typeof castData[name].start === 'string' && castData[name].start) {
			sfx = castData[name].start
		}
		else if (typeof castData[name] === 'function') {
			sfx = castData[name].start()
		}
		sfx && playCastingStartSound(index, sfx)
	}

	function castSoundEnd(index, name, isAlly = false) {
		// console.info('castSoundEnd', index, name)
		if (name) {
			// console.info('isAlly', isAlly, getVolumeMod(isAlly))
			pauseCastingSound(index)
			if (typeof castData[name].end === 'string') {
				audio.playSound(
					castData[name].end,
					'spells',
					getVolumeMod(isAlly)
				)
			}
			else if (typeof castData[name].end === 'function') {
				audio.playSound(castData[name].end(), 'spells', getVolumeMod(isAlly))
			}
		}
		else {
			pauseCastingSound(index)
		}
	}
	function playCastingStartSound(index, sfx) {
		// console.info('playCastingStartSound', index, sfx)
		const partyIndex = party.getIndexByRow(index)

		var el = querySelector('#cast-' + partyIndex)
		el.src = 'sound/spells/' + sfx + '.mp3'
		el.volume = (ng.config.soundVolume / 100) * (getVolumeMod(partyIndex > 0) * .5)
		el.play()
	}
	function pauseCastingSound(index) {
		// console.info('pauseCastingSound', index)
		querySelector('#cast-' + party.getIndexByRow(index)).pause()
	}

	/**
	 * Returns the proper volume mod for player or ally
	 * @param isAlly
	 * @returns {number}
	 */
	function getVolumeMod(isAlly) {
		return isAlly ? audio.allyVolume : 1
	}

	/**
	 * Gets volume for any sfx based on if it's player's or an ally's
	 * @param o
	 * @returns {number}
	 */
	function getVolume(row) {
		return getVolumeMod(party.getIndexByRow(row) > 0)
	}
}(Audio, TweenMax, _, clearInterval, setInterval, Power0)