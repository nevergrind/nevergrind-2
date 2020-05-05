var battle;
(function(TweenMax, $, _, undefined) {
	battle = {
		initialized: 0,
		// 1080p defaults
		boxCoordsCenter: [192,576,960,1344,1728,384,768,1152,1536],
		// never changes
		boxCoordsBottom: [180,180,180,180,180,280,280,280,280],
		go,
		show,
		html,
		events,
		getBox,
		setTarget,
		getResponsiveCenter,
	}
	//////////////////////////////////////
	function go() {
		if (ng.view === 'battle') return
		town.closeVarious()
		chat.sizeSmall();
		mob.init();
		game.emptyScenesExcept('scene-battle');
		querySelector('#town-footer-wrap').style.display = 'none'
		ng.setScene('battle')
		if (!ng.isApp) {
			// setup some mission data
			mission.inProgress = true
			mission.id = 1
			mission.title = _.cloneDeep(_.find(zones, { id: mission.id })).missions[0].title
			my.quest = _.cloneDeep(_.find(zones, { id: mission.id }))
			my.zoneMobs = _.cloneDeep(_.find(zones, { id: mission.id }).mobs)
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
		button.init();
		// add this to test out mob placement etc;
		// also required to configure the mobs images array properly
		var singleMob = true;
		var mobKey = '';
		for (var i=0; i<mob.max; i++){
			if (singleMob && i === 2 || !singleMob) {
				mobKey = mob.getRandomMobKey();
				mobKey = 'orc';
				cache.preloadMob(mobKey);
				mob.setMob(i, mobKey);
			}
		}
	}
	function html() {
		var s =
			'<img id="battle-bg" src="images/battle/tendolin-hollow-2.png">' +
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
	function events() {
		$(".mob-alive, .mob-dead, .mob-details").on('click', function(){
			battle.setTarget(this.getAttribute('index') * 1);
		});
	}
	function show() {
		ng.setScene('battle');
		if (battle.initialized) {
			getElementById('scene-battle').style.display = 'block';
		}
		else {
			getElementById('scene-battle').innerHTML = battle.html();
			battle.events();
			battle.isInit = 1;
		}
	}
	function setTarget(i) {
		console.info("Setting target ", i, Date.now());
	}
	function getResponsiveCenter(i) {
		// responsive center
		return ~~(battle.boxCoordsCenter[i] * (window.innerWidth / 1920));
	}
	function getBox(i) {
		// return absolute positioning about a specific mob box
		var c = battle.getResponsiveCenter(i),
			cy = ~~(battle.boxCoordsBottom[i] + (mobs[i].imgCy * mobs[i].size));

		return x = {
			x: ~~(c - (mobs[i].width * .5)),
			y: battle.boxCoordsBottom[i],
			cx: c,
			cy: cy
		}
	}
})(TweenMax, $, _);
