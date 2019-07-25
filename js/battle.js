var battle;
(function() {
	battle = {
		initialized: 0,
		// 1080p defaults
		boxCoordsCenter: [192,576,960,1344,1728,384,768,1152,1536],
		// never changes
		boxCoordsBottom: [180,180,180,180,180,280,280,280,280],
		go: go,
		show: show,
		html: html,
		events: events,
		getBox: getBox,
		testInit: testInit,
		setTarget: setTarget,
		getResponsiveCenter: getResponsiveCenter,
	}
	//////////////////////////////////////
	function go() {
		if (ng.view === 'battle') return;
		chat.sizeSmall();
		mob.init();
		game.emptyScenesExcept('scene-battle');
		ng.setScene('battle');
		TweenMax.to('#scene-battle', .5, {
			delay: .5,
			opacity: 1
		});
		if (!mob.initialized) {
			// initialization things only
			mob.initialized = 1;
			mob.imageKeys = _.keys(mobs.images);
			mob.index = mob.imageKeys.length - 1;
		}
		button.init();
		// add this to test out mob placement etc;
		// also required to configure the mobs images array properly
		test.battle();
	}
	function html() {
		var s = '<img id="battle-bg" class="img-bg" src="images/bg/fw2.jpg">',
			test = '';

		for (var i=0; i<mob.max; i++){
			//test = i === 2 ? "" : " test";
			test = '';
			s +=
			'<div id="mob-center-' +i+ '" class="mob-center"></div>' +
			'<div id="mob-wrap-' +i+ '" class="mob-wrap' + test +'">' +
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
		$(".mob-alive, .mob-dead, .mob-details").on('mousedown', function(){
			battle.setTarget(this.getAttribute('index') * 1);
		});
	}
	function show() {
		ng.setScene('battle');
		if (battle.initialized) {
			getById('scene-battle').style.display = 'block';
		}
		else {
			getById('scene-battle').innerHTML = battle.html();
			battle.events();
			battle.isInit = 1;
		}
	}
	function setTarget(i) {
		console.info("Setting target ", i, Date.now());
	}
	function testInit() {
		var mobKey = '';
		mob.test = 1;
		for (var i=0; i<mob.max; i++){
			// mobKey = mob.getRandomMobKey();
			mobKey = 'toadlok';
			cache.preloadMob(mobKey);
			mob.setMob(i, mobKey);
		}
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
			x: ~~(c - (mobs[i].w * .5)),
			y: battle.boxCoordsBottom[i],
			cx: c,
			cy: cy
		}
	}
})();
