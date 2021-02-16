var dungeon;
(function(TweenMax, $, _, Power0, undefined) {
	const BOTTOM_PLAYER = MaxHeight - 80
	dungeon = {
		initialized: 0,
		layer: {},
		centerX: [960, 1280, 640, 1600, 320],
		bottom: MaxHeight,
		headY: BOTTOM_PLAYER - 200,
		bottomY: BOTTOM_PLAYER,
		gridElementY: {},
		walking: 0,
		distanceStart: 0,
		distanceCurrent: 0,
		distanceEnd: 200,
		distancePerSecond: 20,
		walkTween: TweenMax.to('#dungeon-floor-horizontal', 0, {}),
		centerY,
		go,
		rxGo,
		init,
		html,
		enterCombat,
		walkForward,
		walkStop,
		walkBackward,
		getWalkDurationEnd,
		getWalkDurationStart,
		animateGrid,
		animateEntities,
		getWalkProgress,
	};
	$('#scene-dungeon').on('mousedown', handleClickDungeon)
	///////////////////////////////////////
	function go(force) {
		if (!force && ng.view === 'dungeon') return
		goTasks()
		if (party.presence[0].isLeader) {
			if (party.hasMoreThanOnePlayer()) {
				socket.publish('party' + my.partyId, {
					route: 'p->goDungeon',
					config: { age: 35 },
				}, true)
			}
			delayedCall(.5, preloadCombatAssets)
		}
	}
	function rxGo(data) {
		goTasks()
		delayedCall(.5, preloadCombatAssets)
	}
	function preloadCombatAssets() {
		console.info('LOADING ASSETS')
		battle.loadTextures()
		cache.preloadPlayerAsk()
	}
	function goTasks() {
		// cleanup sort of activities when going into dungeon
		town.closeVarious()
		tavern.leaders = ''
		game.showScene('scene-dungeon')

		// coming out of battle - save!
		// TODO: change this to update gold+exp+level too later
		if (ng.view === 'battle') {
			mob.killAttacks()
			my.saveCharacterData()
		}
		if (ng.view === 'town') {
			expanse.killAllTweens()
			chat.publishRemove()
		}
		if (my.channel) socket.unsubscribe(chat.getChannel())

		// set new channel data
		my.channel = ''
		// force change to party chat if in town chat
		if (chat.modeCommand === '/say') {
			chat.modeChange(CHAT.PARTY)
		}
		chat.sizeDungeon()
		ng.setScene('dungeon')
		dungeon.init()
		combat.autoAttackDisable()
		// reset some combat data
		mobs.forEach((m, i) => {
			mobs[i].name = ''
			mobs[i].hp = 0
		})
		combat.endCombat()

		TweenMax.to('#scene-dungeon', .5, {
			startAt: { filter: 'brightness(0)' },
			delay: .5,
			filter: 'brightness(1)'
		})
		TweenMax.to('#sky-wrap', .5, {
			startAt: { filter: 'brightness(0)' },
			delay: .5,
			filter: 'brightness(1)'
		})
		battle.reckonGXL()
		mob.earnedExp = 0
		mob.earnedGold = 0
		mob.leveledUp = false
		// draw players
		player.setPlayers()
		player.show()
		mobSkills.initFilter()

		ng.unlock()
	}
	function init() {
		if (zones[mission.id].mobs.length) {
			zones[mission.id].mobs.forEach(v => {
				cache.preloadMob(_.kebabCase(v))
			});
		}
		if (dungeon.initialized) {
			querySelector('#scene-dungeon').style.display = 'block'
		}
		else {
			dungeon.initialized = true
			querySelector('#scene-dungeon').innerHTML = dungeon.html()
			dungeon.gridElementY = querySelector('#dungeon-floor-horizontal')
			dungeon.gridPath = querySelector('#dungeon-path')
			// dungeon layer for ooc buffs
			player.initCanvas()
			combat.updateCanvasLayer()
		}
		dungeon.animateGrid()
		button.setAll()
		chat.scrollBottom()
	}
	function html() {
		return `
			<img id="dungeon-bg-floor" src="images/dungeon/bg-test-floor.jpg">
			<div id="dungeon-grid-parent" class="grid-parent no-pointer">
				<div id="dungeon-stag-black" class="dungeon-floor"></div>
				<div id="dungeon-floor-vertical" class="dungeon-floor"></div>
				<div id="dungeon-floor-horizontal" class="dungeon-floor"></div>
			</div>
			<div id="dungeon-grid-parent" class="grid-parent no-pointer">
				<div id="dungeon-path" class="dungeon-floor"></div>
				<img id="dungeon-mob" class="dungeon-floor dungeon-mob" src="mobs/orc/1.png">
				<img id="dungeon-bg-sky" src="images/dungeon/bg-test-sky.jpg">
			</div>
		`
	}
	function enterCombat() {
		// console.info("ENTERING COMBAT")
	}
	function centerY(index, race) {
		return BOTTOM_PLAYER - 100
	}
	function handleClickDungeon(e) {
		if (party.presence[0].isLeader) {
			console.in
			if (e.shiftKey) {
				if (dungeon.walking === -1) {
					// forward
					dungeon.walkStop()
				}
				else {
					// backwards
					dungeon.walkBackward()
				}

			}
			else {
				if (dungeon.walking !== 0) {
					// forward
					dungeon.walkStop()
				}
				else {
					// stopped
					dungeon.walkForward()
				}
			}
		}
	}
	function getWalkProgress() {
		return dungeon.distanceCurrent / dungeon.distanceEnd
	}
	function getWalkDurationEnd() {
		return (dungeon.distanceEnd - dungeon.distanceCurrent) / dungeon.distancePerSecond
	}
	function getWalkDurationStart() {
		return dungeon.distanceCurrent / dungeon.distancePerSecond
	}
	function setGridPosition() {
		if (dungeon.distanceCurrent <= dungeon.distanceStart) {
			dungeon.distanceCurrent = dungeon.distanceStart
			dungeon.walkStop()
		}
		else if (dungeon.distanceCurrent >= dungeon.distanceEnd) {
			dungeon.distanceCurrent = dungeon.distanceEnd
			dungeon.walkStop()
		}
		// console.info('setGridPosition', dungeon.distanceCurrent)

		dungeon.gridPath.style.backgroundPositionY =
			dungeon.gridElementY.style.backgroundPositionY =
				dungeon.distanceCurrent + 'px'
		dungeon.animateEntities()
	}
	function walkForward() {
		dungeon.walking = 1
		dungeon.walkTween = TweenMax.to(dungeon, dungeon.getWalkDurationEnd(), {
			distanceCurrent: dungeon.distanceEnd,
			ease: Power0.easeIn,
			onUpdate: setGridPosition,
		})
	}
	function walkStop() {
		dungeon.walking = 0
		dungeon.walkTween.pause()

	}
	function walkBackward() {
		if (dungeon.getWalkProgress() < 1) {
			dungeon.walking = -1
			dungeon.walkTween = TweenMax.to(dungeon, dungeon.getWalkDurationStart(), {
				distanceCurrent: dungeon.distanceStart,
				ease: Power0.easeIn,
				onUpdate: setGridPosition,
			})
		}
	}
	function animateGrid() {
		/*TweenMax.to('#dungeon-stag-black', 0, {
			startAt: { rotationX: 35 },
			rotationX: 1,
			repeat: -1,
			yoyo: true,
			ease: Power1.easeInOut,
		});
		TweenMax.to('#dungeon-stag-black', 0, {
			delay: 1,
			startAt: { scaleX: 0 },
			scaleX: 12,
			ease: Power0.easeIn,
		})*/
	}
	function animateEntities() {
		let progress = dungeon.getWalkProgress()
		// 800 * (1 - .865) - 80
		let HalfHeight = MaxHeight * .5
		let y = (800 * (1 - .865)) - HalfHeight + (HalfHeight * progress)
		console.info('progress:', y, progress)
		TweenMax.set('#dungeon-mob', {
			y: y,
			scale: progress * .5,
		})
	}
})(TweenMax, $, _, Power0);