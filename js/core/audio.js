// audio.js
var audio;
!function(Audio, TweenMax, _, clearInterval, setInterval, undefined) {
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
		playerHit,
		playerDeath,
		startWalk,
		playWalk,
		playAutoAttack,
		castSoundStart,
		castSoundEnd,
	}

	audio.debClick = _.debounce(debClick)

	var key
	const LOOP_BUFFER = .2
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
			end: 'spell-legacy-end-heal'
		},
		'Fungal Growth': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Shimmering Orb': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Spirit of the Hunter': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
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
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Static Suffocation': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Mind Blitz': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Subversion': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Color Shift': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Phase Blade': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Stasis Field': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Shifting Ether': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Serene Sigil': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Augmentation': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Clarity': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Enthrall': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		// BRD
		'Bellow': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Sonic Boom': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
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
			end: 'spell-legacy-end-heal'
		},
		'Battle Hymn': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Militant Cadence': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Consonant Chain': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Melody of Mana': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Righteous Rhapsody': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Chromatic Sonata': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'TEST': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		// CRU
		'Seal of Damnation': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Holy Wrath': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Divine Judgment': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Blessed Hammer': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Seal of Sanctuary': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Divine Grace': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Benevolence': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
		},
		'Jubilee': {
			start: 'spell-legacy-start-conjuration-dot',
			end: 'spell-legacy-end-heal'
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
	function playMusic(fileName) {
		if (!app.isApp) return
		query.el('#bgmusic').src = ''
		query.el('#bgmusic').volume = ng.config.musicVolume / 100
		query.el('#bgmusic').src = "music/" + fileName + '.' + 'mp3'

		// var promise = new Audio("music/" + track + ".mp3")
		var promise = query.el('#bgmusic').play()

		//var promise = query.el('#bgmusic').play()
		if (promise !== undefined) {
			promise.then(_ => {})
		}
	}
	function debClick() {
		const sfx = new Audio('sound/click.mp3')
		sfx.volume = ng.config.soundVolume / 100
		sfx.play()
	}
	function playSound(fileName, path = '') {
		if (!fileName) return
		if (path) path += '/'
		const sfx = new Audio('sound/' + path + fileName + '.mp3')
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

	function playAutoAttack(key) {
		if (key.includes('Hand-to-hand')) {
			audio.playSound('auto-h2h', 'combat')
		}
		else if (key.includes('autoAttackOne-hand') ||
			key.includes('autoAttackPiercing')) {
			audio.playSound('auto-1h', 'combat')
		}
		else {
			audio.playSound('auto-2hs', 'combat')
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
				playerHitCrunch()
			}
			else {
				audio.playSound('hit', 'combat')
				playerHitRegular(index)
			}
		}
		else {
			if (damage > party.presence[index].hpMax * .05) {
				playerHitCrunch()
			}
			else if (damage > party.presence[index].hpMax * .03) {
				audio.playSound('hit', 'combat')
				playerHitRegular(index)
			}
			else {
				audio.playSound('hit', 'combat')
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
		audio.playSound(hitSound, 'player')
	}
	function playerHitCrunch() {
		audio.playSound('hit-crunch', 'combat')
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
		audio.playSound(deathSound, 'player')
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
		sfx && playCastingSound(index, sfx)
	}
	function castSoundEnd(index, name) {
		// console.info('castSoundEnd', index, name)
		if (name) {
			pauseCastingSound(index)
			if (typeof castData[name].end === 'string') {
				audio.playSound(castData[name].end, 'spells')
			}
			else if (typeof castData[name].end === 'function') {
				audio.playSound(castData[name].end(), 'spells')
			}
		}
		else {
			pauseCastingSound(index)
		}
	}
	function playCastingSound(index, sfx) {
		// console.info('playCastingSound', index, sfx)
		var el = querySelector('#cast-' + party.getIndexByRow(index))
		el.src = 'sound/spells/' + sfx + '.mp3'
		el.volume = (ng.config.soundVolume / 100) * .5
		el.play()
	}
	function pauseCastingSound(index) {
		// console.info('pauseCastingSound', index)
		querySelector('#cast-' + party.getIndexByRow(index)).pause()
	}
}(Audio, TweenMax, _, clearInterval, setInterval)