var battle;
(function() {
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
		if (ng.view === 'battle') return;
		town.closeVarious()
		chat.sizeSmall();
		mob.init();
		game.emptyScenesExcept('scene-battle');
		ng.setScene('battle');
		TweenMax.to('#scene-battle', .5, {
			delay: .5,
			opacity: 1
		});
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
		test.battle();
	}
	function html() {
		var s =
			'<div id="battle-sky"></div>' +
			'<div id="battle-clouds"></div>' +
			'<img id="battle-bg" src="images/bg/tendolin-hollow-2.png">' +
			'<img id="battle-fg" src="images/bg/prototype-fg.png" class="no-pointer">';
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
			setBackground()
			battle.isInit = 1;
		}
	}
	function setBackground() {
		var skyColors = [ '#135', '#579' ]
		getElementById('battle-sky').style.backgroundImage = 'linear-gradient(to top, #135, #579)';
		var cloud = 2;
		getElementById('battle-clouds').style.backgroundImage = 'url("images/env/cloud' + cloud + '.png")';
		TweenMax.to('#battle-clouds', 16000, {
			startAt: { 'background-position': 0 },
			'background-position': 3840,
			ease: Linear.easeIn,
			repeat: -1
		});
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
})();
