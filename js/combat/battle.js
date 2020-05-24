var battle;
(function(TweenMax, $, _, undefined) {
	battle = {
		initialized: 0,
		getSplashTarget,
		go,
		show,
		html,
		getBox,
		getResponsiveCenter,
		targetIsFrontRow,
		targetIsBackRow,
		updateTarget,
	}

	let index, splashTgt
	const splashOrder = [0, 5, 1, 6, 2, 7, 3, 8, 4]
	init()
	//////////////////////////////////////
	function getSplashTarget(shift) {
		shift = shift || 0
		index = _.findIndex(splashOrder, val => val === my.target)
		index = splashOrder[index + shift]
		return splashOrder.includes(index) ? index : -1
	}
	function init() {
		$('#scene-battle')
			.on('click', '.mob-alive, .mob-details', handleMobClick)
			.on('mouseenter', '.mob-alive, .mob-details', handleMobEnter)
			.on('mouseleave', '.mob-alive, .mob-details', handleMobLeave)
	}
	function targetIsFrontRow(tgt) {
		tgt = tgt || my.target
		return tgt >= 0 && tgt < 5
	}
	function targetIsBackRow(tgt) {
		tgt = tgt || my.target
		return tgt > 4
	}
	function handleMobClick() {
		my.setTarget(this.getAttribute('index') * 1)
	}
	function handleMobEnter() {
		index = this.getAttribute('index') * 1
		my.hoverTarget = index
		if (my.target !== index) querySelector('#mob-details-' + index).classList.add('block-imp')
	}
	function handleMobLeave() {
		index = this.getAttribute('index') * 1
		my.hoverTarget = -1
		if (my.target !== index) querySelector('#mob-details-' + index).classList.remove('block-imp')
	}
	function go(data) {
		if (ng.view === 'battle') return
		town.closeVarious()
		item.resetDrop()
		chat.sizeSmall()
		mob.init()
		game.emptyScenesExcept('scene-battle')

		querySelector('#town-footer-wrap').style.display = 'none'
		ng.setScene('battle')
		if (!ng.isApp) {
			// setup some mission data
			mission.inProgress = true
			mission.id = 1
		}
		TweenMax.to('#scene-battle', .5, {
			startAt: { filter: 'brightness(0)' },
			delay: .5,
			filter: 'brightness(1)'
		});
		TweenMax.to('#sky-wrap', .5, {
			startAt: { filter: 'brightness(0)' },
			delay: .5,
			filter: 'brightness(1)'
		})
		my.channel = ''
		if (!mob.initialized) {
			// initialization things only
			mob.initialized = 1;
			mob.imageKeys = Object.keys(mobs.images);
			mob.index = mob.imageKeys.length - 1;
		}
		button.setAll();
		combat.initCombatTextLayer()
		// add this to test out mob placement etc;
		// also required to configure the mobs images array properly
		if (typeof data === 'object' && typeof data.config === 'object' && data.config.length) {
			warn('data in from goBattle', data.config)
			setupMobs(data.config)
		}
		else {
			setupMobs()
		}
		my.fixTarget()
		battle.updateTarget()
		if (party.presence[0].isLeader) {
			info('txData!', mob.txData)
			socket.publish('party' + my.partyId, {
				route: 'party->goBattle',
				config: mob.txData
			})
		}
	}
	function setupMobs(config) {
		if (typeof config === 'object') {
			// followers
			config.forEach((mobData, index) => {
				if (mobData.name) {
					mob.setMob(index, mobData)
				}
			})
		}
		else {
			// leader
			let minLevel = ~~(quests[mission.questId].level * .7)
			if (minLevel < 1) minLevel = 1
			let maxLevel = quests[mission.questId].level

			let availableSlots = []
			mob.txData = []
			for (var i=0; i<mob.max; i++) {
				mob.txData.push({})
				availableSlots.push(i)
			}
			let minMobs = 1
			let maxMobs = ceil(quests[mission.questId].level / 7)
			if (maxMobs > mob.max) maxMobs = mob.max

			let totalMobs = _.random(minMobs, maxMobs)

			if (!ng.isApp) {
				totalMobs = 5
				minLevel = 40
				maxLevel = 55
			}
			info('levels', minLevel, maxLevel)
			var mobSlot
			for (i=0; i<totalMobs; i++) {
				if (!i) mobSlot = 2
				else mobSlot = _.random(0, availableSlots.length - 1)

				let mobConfig = mob.configMobType({
					img: 'orc',
					name: 'orc legionnaire',
					minLevel: minLevel,
					maxLevel: maxLevel,
				})
				mob.setMob(availableSlots[mobSlot], mobConfig)
				_.remove(availableSlots, val => val === availableSlots[mobSlot])
			}
		}
	}

	let targetHtml = ''
	function updateTarget(drawInstant) {
		if (combat.isValidTarget()) {
			targetHtml =  '<div id="mob-target-name" class="'+ combat.getDiffClass(mobs[my.target].level) +'">'+ mobs[my.target].name +'</div>' +
				'<div id="mob-target-bar-wrap">'+
					'<div id="mob-target-hp-wrap">'+
						'<div id="mob-target-hp"></div>' +
						'<div class="mob-health-grid"></div>' +
					'</div>' +
					'<img id="mob-target-hp-plate" class="mob-plate-'+ mobs[my.target].type +'" src="images/ui/bar-'+ mobs[my.target].type +'.png">' +
				'</div>' +
				//'<div id="mob-target-level">'+ mobs[my.target].level +'</div>' +
				'<div id="mob-target-percent">'+
					ceil(100 - bar.getRatio('hp', mobs[my.target])) +
				'%</div>' +
				'<div id="mob-target-details">' +
					'<div id="mob-target-traits">'+ mobs[my.target].traits.join('|') +'</div>' +
				'</div>'
			querySelector('#mob-target-wrap').innerHTML = targetHtml
			mob.drawMobBar(my.target, drawInstant)
		}
	}

	function html() {
		info('target:', my.target)
		var s =
			'<img id="battle-bg" src="'+ mission.getZoneImg() +'">' +
			'<img id="battle-fg" src="images/battle/tendolin-hollow-2-fg.png" class="no-pointer">';

		s += '<div id="mob-target-wrap" class="text-shadow3"></div>'
		for (var i=0; i<mob.max; i++){
			//test = i === 2 ? "" : " test";
			test = '';
			s +=
			'<div id="mob-center-' +i+ '" class="mob-center"></div>' +
			'<div id="mob-wrap-' +i+ '" class="mob-wrap' + (i > 4 ? ' mob-back-row' : ' mob-front-row') +'">' +
				'<div id="mob-details-' +i+ '" class="mob-details" index="' + i + '">' +
					'<div id="mob-name-' +i+ '" class="mob-name text-shadow3"></div>' +
					'<div id="mob-bar-' +i+ '" class="mob-bar">' +
						'<div id="mob-health-' +i+ '" class="mob-health"></div>' +
						'<div class="mob-health-grid"></div>' +
					'</div>' +
				'</div>' +
				'<div id="mob-shadow-' +i+ '" class="mob-shadow"></div>' +
				'<div class="mob-img-wrap">' +
					'<img id="mob-img-' +i+ '" class="mob-img" src="images/blank.png">' +
				'</div>' +
				'<div id="mob-alive-' +i+ '" class="mob-alive" index="' + i + '"></div>' +
				'<div id="mob-dead-' +i+ '" class="mob-dead" index="' + i + '"></div>' +
			'</div>';
		}
		return s;
	}
	function show() {
		ng.setScene('battle');
		if (battle.initialized) {
			getElementById('scene-battle').style.display = 'block'
		}
		else {
			getElementById('scene-battle').innerHTML = battle.html()
			battle.isInit = 1;
		}
	}
	function getResponsiveCenter(i) {
		// responsive center
		return ~~(mob.centerX[i] * (window.innerWidth / 1920));
	}
	function getBox(i) {
		// return absolute positioning about a specific mob box
		var c = battle.getResponsiveCenter(i),
			cy = ~~(mob.bottomY[i] + (mobs[i].imgCy * mobs[i].size));

		return x = {
			x: ~~(c - (mobs[i].width * .5)),
			y: mob.bottomY[i],
			cx: c,
			cy: cy
		}
	}
})(TweenMax, $, _);
