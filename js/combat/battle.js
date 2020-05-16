var battle;
(function(TweenMax, $, _, undefined) {
	battle = {
		initialized: 0,
		go,
		show,
		html,
		getBox,
		getResponsiveCenter,
	}

	let index
	init()
	//////////////////////////////////////
	function init() {
		$('#scene-battle')
			.on('click', '.mob-alive, .mob-details', handleMobClick)
			.on('mouseenter', '.mob-alive, .mob-details', handleMobEnter)
			.on('mouseleave', '.mob-alive, .mob-details', handleMobLeave)
	}
	function handleMobClick() {
		my.setTarget(this.getAttribute('index') * 1)
	}
	function handleMobEnter() {
		index = this.getAttribute('index') * 1
		my.hoverTarget = index
		if (my.target !== index) querySelector('#mob-details-' + index).classList.add('block')
	}
	function handleMobLeave() {
		index = this.getAttribute('index') * 1
		my.hoverTarget = -1
		if (my.target !== index) querySelector('#mob-details-' + index).classList.remove('block')
	}
	function go() {
		if (ng.view === 'battle') return
		town.closeVarious()
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
		var singleMob = false;
		var mobKey = '';
		for (var i=0; i<mob.max; i++){
			if (singleMob && i === 2 || !singleMob) {
				/*mobKey = mob.getRandomMobKey();
				mobKey = 'orc';*/
				mob.setMob(i, mob.configMobType({
					img: 'orc',
					level: 1
				}));
			}
		}
		my.fixTarget()
	}
	function html() {
		var s =
			'<img id="battle-bg" src="'+ mission.getZoneImg() +'">' +
			'<img id="battle-fg" src="images/battle/tendolin-hollow-2-fg.png" class="no-pointer">';
		var test = '';

		for (var i=0; i<mob.max; i++){
			//test = i === 2 ? "" : " test";
			test = '';
			s +=
			'<div id="mob-center-' +i+ '" class="mob-center"></div>' +
			'<div id="mob-wrap-' +i+ '" class="mob-wrap' + test + (i > 4 ? ' mob-back-row' : ' mob-front-row') +'">' +
				'<div id="mob-details-' +i+ '" class="mob-details" index="' + i + '">' +
					'<div id="mob-name-' +i+ '" class="mob-name text-shadow"></div>' +
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
