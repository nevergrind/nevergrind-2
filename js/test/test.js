var test;
(function(Linear, TweenMax, TimelineMax, PIXI, $, undefined) {
	test = {
		pix: {},
		chat: {
			id: 999999999,
			room: chatRoom,
			log: chatLog
		},
		send: send,
		orcs,
		opacity,
		opacityDOM,
		boxShadow,
		dropShadow,
		battle,
		filters: {
			/*
			blur(5px)
			hue-rotate(360deg)
			brightness(100%)
			contrast(100%)
			shadow(100%)
			drop-shadow(0 0 5px #0f0)
			grayscale(100%)
			invert(100%)
			opacity(100%)
			saturate(100%)
			sepia(100%)
			 */
			hueRotate,
			death,
			effect
		},
		socketSub,
		socketPub,
		getItem,
		animateBtn,
		lootItems,
		pixi,
	}

	var c;
	var i;
	var e;
	var z;
	var start;
	var end;
	var filters;
	var pixApp
	var width
	var height
	const innerWidthMax = 1920
	const innerHeightMax = 1080
	const ratio = innerWidthMax / innerHeightMax
	///////////////////////////////////
	function battle() {
		/**
		 * must be called in game
		 * @type {boolean}
		 */
		var singleMob = false;
		var mobKey = '';
		for (var i=0; i<mob.max; i++){
			if (singleMob && i === 2 || !singleMob) {
				mobKey = mob.getRandomMobKey();
				mobKey = 'elephant';
				cache.preloadMob(mobKey);
				mob.setMob(i, mobKey);
			}
		}
	}
	function send(loops) {
		loops = loops || 1e3;
		for (var i=0; i<loops; i++) {
			socket.publish('test', {
				test: ''
			});
		}
	}
	function socketSub() {
		socket.subscribe('test', testRx);
		//////////////////////////
		function testRx(arr, obj) {
			arr = typeof arr[0] === 'object' ?
				arr[0] : obj;
			if (arr.loop === 0) {
				console.info('test received', arr.category, arr.loop, arr.time);
				start = Date.now();
			}
			if (arr.loop === 999) {
				end = Date.now();
				console.warn('Total time: ', end - start, 'ms');
			}
		}
	}
	function socketPub() {
		socket.publish('test', {
			date: Date.now()
		});
	}
	function chatRoom() {
		for (i=0; i<100; i++) {
			c = ng.toJobShort(ng.jobs[~~(rand() * 14)]);
			socket.publish(chat.getChannel(), {
				route: 'chat->add',
				row: test.chat.id+i,
				level: Math.ceil(rand() * 50),
				job: c,
				name: 'WWWWWWWWWWWWWWWW'
			});
		}
	}
	function chatLog() {
		for (i=0; i<10; i++) {
			chat.sendMsg('/flist');
		}
	}
	function orcs(count) {
		var max = count || 100;
		$("#title-container-wrap").css('display', 'none');
		$('#scene-title-select-character, .test-orcs').remove();

		var e2 = getElementById('ng2-logo-wrap');
		for (i=0; i<max; i++){
			e = createElement('img');
			e.id = 'mob' + i;
			e.className = 'test-orcs';
			e.style.position = 'absolute';
			e.style.top = ~~(rand() * 100) +'%';
			e.style.left = ~~(rand() * 100) +'%';
			e.style.transform = 'translate(-50%, -50%)';
			e.src = 'images/test/an orc.png';
			e2.appendChild(e);
			/*TweenMax.to(e, 2, {
				startAt: { rotation: 0 },
				rotation: 360,
				repeat: -1,
				ease: Linear.easeIn,
				yoyo: true
			})*/
		}

		for (i=0; i<max; i++){
			animateOrc(i);
		}
	}
	function animateOrc(i) {
		z = getElementById("mob" + i);

		filters = {
			hue: "hue-rotate(0deg)"
		};

		var tl = new TimelineMax({
			onUpdate: test.filters.hueRotate,
			onUpdateParams: [z, filters],
			repeat: -1
		});
		tl.to(filters, rand() * 6 + 1, {
			hue: "hue-rotate(360deg)"
		});
	}
	function hueRotate(z, filters) {
		z.style.filter = filters.hue;
	}
	function death(z, filters) {
		z.style.filter = filters.opacity + ' ' + filters.brightness;
	}
	function effect(z, filters, key) {
		z.style.filter = filters[key];
	}
	/*
	test.filters.effect(mob.element, {
	  saturate: 'saturate(2500%)'
	}, 'saturate');
	 */
	function getItem(level = 50, rarity = undefined, itemSlot = '', itemName = '') {
		if (itemName) { level = 50 } // because it needs to select any item
		if (itemSlot === 'rings' || itemSlot === 'amulets' && rarity === 'normal') {
			rarity = 'magic'
		}
		rarity = rarity || item.getRarity();
		var drop = item.getItem({
			mobLevel: level,
			rarity: rarity,
			itemSlot: itemSlot,
			itemName: itemName,
			addToInv: true
		})
		tooltip.show(drop)
		return drop
	}
	function animateBtn() {
		for (var i=0; i<=9; i++) {
			startSpin(i);
		}
		////////////////
		function startSpin(i) {
			var o = {
				el: document.getElementById('class-btn-timer-' + i),
				turn: 0
			};
			TweenMax.to(o, 5, {
				turn: 1,
				onUpdate: colorize,
				onUpdateParams: [ o ],
				ease: Linear.easeNone
			});
		}
		function colorize(o) {
			TweenMax.set(o.el, {
				background: 'conic-gradient(#0000 ' + o.turn + 'turn, #000e ' + o.turn + 'turn)'
			});
		}
	}
	function lootItems(count, rarity) {
		count = count || 16
		for (var i=0; i<count; i++) item.getLoot({ mobLevel: 50, rarity: (rarity ? rarity : 'unique') })
	}
	function opacity(count) {
		var max = count || 2000
		$("#title-container-wrap").css('display', 'none')
		$('#scene-title-select-character, .test-orcs').remove()

		var e2 = getElementById('ng2-logo-wrap');
		for (i=0; i<max; i++){
			e = createElement('img');
			e.id = 'mob' + i;
			e.className = 'test-orcs test-opacity-filter';
			e.style.position = 'absolute';
			e.style.top = ~~(rand() * 100) +'%';
			e.style.left = ~~(rand() * 100) +'%';
			e.style.transform = 'translate(-50%, -50%)';
			e.src = 'images/test/an orc.png';
			e2.appendChild(e);
		}
	}
	function opacityDOM(count) {
		var max = count || 2000;
		$("#title-container-wrap").css('display', 'none');
		$('#scene-title-select-character, .test-orcs').remove();

		var e2 = getElementById('ng2-logo-wrap');
		for (i=0; i<max; i++){
			e = createElement('img');
			e.id = 'mob' + i;
			e.className = 'test-orcs test-opacity-dom';
			e.style.position = 'absolute';
			e.style.top = ~~(rand() * 100) +'%';
			e.style.left = ~~(rand() * 100) +'%';
			e.style.transform = 'translate(-50%, -50%)';
			e.src = 'images/test/an orc.png';
			e2.appendChild(e);
		}
	}
	function boxShadow(count) {
		var max = count || 500;
		$("#title-container-wrap").css('display', 'none');
		$('#scene-title-select-character, .test-orcs').remove();

		var e2 = getElementById('ng2-logo-wrap');
		for (i=0; i<max; i++){
			e = createElement('img');
			e.id = 'mob' + i;
			e.className = 'test-orcs';
			e.style.position = 'absolute';
			e.style.top = ~~(rand() * 100) +'%';
			e.style.left = ~~(rand() * 100) +'%';
			e.style.transform = 'translate(-50%, -50%)';
			e.src = 'images/test/an orc.png';
			e2.appendChild(e);
			TweenMax.to(e, 1, {
				startAt: { boxShadow: '0 0 0 #000' },
				x: '+=50',
				boxShadow: '0 0 20px #000',
				repeat: -1,
				ease: Linear.easeIn,
				yoyo: true
			})
		}
	}
	function dropShadow(count) {
		var max = count || 500;
		$("#title-container-wrap").css('display', 'none');
		$('#scene-title-select-character, .test-orcs').remove();

		var e2 = getElementById('ng2-logo-wrap');
		for (i=0; i<max; i++){
			e = createElement('img');
			e.id = 'mob' + i;
			e.className = 'test-orcs';
			e.style.position = 'absolute';
			e.style.top = ~~(rand() * 100) +'%';
			e.style.left = ~~(rand() * 100) +'%';
			e.style.transform = 'translate(-50%, -50%)';
			e.src = 'images/test/an orc.png';
			e2.appendChild(e);
			TweenMax.to(e, 1, {
				startAt: { filter: 'drop-shadow(0px 0px 0px #0f0)' },
				x: '+=50',
				filter: 'drop-shadow(0px 0px 10px #0f0)',
				repeat: -1,
				ease: Linear.easeIn,
				yoyo: true
			})
		}
	}
	function pixi() {
		pixApp = new PIXI.Application({
			width: 1920,
			height: 1080,
			backgroundColor: '#0000'
		});
		console.info('textPix', pixApp)
		console.info('view', pixApp.view)
		pixApp.view.style.position = 'absolute'
		pixApp.view.style.zIndex = 3
		//var renderer = PIXI.autoDetectRenderer(size[0], size[1], null);
		document.body.appendChild(pixApp.view);

		// create a new Sprite from an image path
		const orc = PIXI.Sprite.from('images/test/an orc.png');

		// center the sprite's anchor point
		orc.anchor.set(0.5);

		// move the sprite to the center of the screen
		orc.x = pixApp.screen.width / 2;
		orc.y = pixApp.screen.height / 2;

		pixApp.stage.addChild(orc);

		TweenMax.to(orc, 1, {
			rotation: 2 * PI,
			repeat: -1,
			ease: Linear.easeNone
		})
		window.onresize = pixiResize
		pixiResize()
	}
	function pixiRenderer() {
		pixApp = new PIXI.Application({
			width: 1920,
			height: 1080,
			transparent: true
		});
		console.info('textPix', pixApp)
		console.info('view', pixApp.view)
		console.info('screen', pixApp.screen)
		pixApp.view.style.position = 'absolute'
		pixApp.view.style.zIndex = 3
		document.body.appendChild(pixApp.view)

		// create a new Sprite from an image path
		const orc = PIXI.Sprite.from('images/test/an orc.png');
		// center the sprite's anchor point
		orc.anchor.set(0.5);
		orc.x = pixApp.screen.width / 2;
		orc.y = pixApp.screen.height / 2;
		pixApp.stage.addChild(orc);

		TweenMax.to(orc, 1, {
			rotation: 2 * PI,
			repeat: -1,
			ease: Linear.easeNone
		})
		window.onresize = pixiResize
		pixiResize()
	}
	function pixiClouds() {
		var dur = 555;
		test.pix = new PIXI.Application({
			width: 1920,
			height: 517,
			transparent: true
		});
		console.info('textPix', test.pix)
		console.info('view', test.pix.view)
		console.info('screen', test.pix.screen)
		// style
		test.pix.view.id = 'test-pixi'
		test.pix.view.style.position = 'absolute'
		test.pix.view.style.zIndex = 3

		document.body.appendChild(test.pix.view)

		// create a new Sprite from an image path
		const cloud = PIXI.Sprite.from('images/env/clouds-1.png');
		// center the sprite's anchor point
		cloud.anchor.set(0);
		cloud.x = 0;
		test.pix.stage.addChild(cloud);

		TweenMax.to(cloud, dur / 2, {
			x: -1920,
			ease: Linear.easeNone,
			onComplete: function() {
				TweenMax.to(cloud, dur, {
					startAt: { x: 1920 },
					x: -1920,
					ease: Linear.easeNone,
					repeat: -1
				})
			}
		})

		window.onresize = pixiResizeSky
		pixiResizeSky()
	}
	function pixiResizeSky() {
		// wider than default ratio
		width = window.innerHeight * ratio;
		height = window.innerHeight;
		console.info('pixiResize', width, height)
		test.pix.view.style.width = window.innerWidth + 'px';
		test.pix.view.style.height = ~~(517 / innerHeightMax * window.innerHeight) + 'px';
	}
	function pixiResize() {
		// wider than default ratio
		width = window.innerHeight * ratio;
		height = window.innerHeight;

		console.info('pixiResize', width, height)
		pixApp.view.style.width = width + 'px';
		pixApp.view.style.height = height + 'px';
	}
})(Linear, TweenMax, TimelineMax, PIXI, $);