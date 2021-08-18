var test;
(function(Linear, TweenMax, TimelineMax, PIXI, $, undefined) {
	test = {
		revealMap,
		setupMissionData,
		getMob,
		projectionTest,
		getTestLootItemWeapon,
		disableConsole,
		disableEvents,
		getHate,
		send,
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
			grayscale(100%)
			drop-shadow(0 0 5px #0f0)
			invert(100%)
			opacity(100%)
			saturate(100%) (this is grayscale) (saturation in pixi)
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
		mobImage,
		mobPix,
		pix: {},
		chat: {
			id: 999999999,
			room: chatRoom,
			log: chatLog
		},
		textures: [],
	}

	var c
	var i
	var e
	var z
	var start
	var end
	var filters
	var pixApp
	var width
	var height
	const ratio = MAX_WIDTH / MAX_HEIGHT
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
				mob.setMob(i, mobKey);
			}
		}
	}
	let sendStart = 0
	function send(loops) {
		// about 150ms per 1k data packets sent to 4 players
		loops = loops || 1e3;
		for (var i=0; i<loops; i++) {
			if (i === 0) sendStart = Date.now()
			socket.publish('test', {
				test: 'asdfasdf',
				loop: i,
				isLastSend: i === loops - 1,
				age: 35,
				name: 'asdflkajsdlfkjaslkdjflkasjdfklj',
				isDumb: true
			});
		}
	}
	function socketSub() {
		// socket.subscribe('test', testRx);
		//////////////////////////
		function testRx(arr, obj) {
			arr = typeof arr[0] === 'object' ?
				arr[0] : obj;
			if (arr.loop === 0) {
				console.info('socketRx first data test received', arr.loop);
				start = Date.now();
			}
			if (arr.isLastSend) {
				end = Date.now();
				// console.warn('socketRx Send Total time: ', end - sendStart, 'ms');
				// console.warn('socketRx Rx Total time: ', end - start, 'ms');
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

		var e2 = getElementById('scene-title-landing');
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
		if (itemSlot === ITEM_TYPE.RINGS || itemSlot === ITEM_TYPE.AMULETS && rarity === ITEM_RARITY.normal) {
			rarity = ITEM_RARITY.magic
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
		for (var i=0; i<=12; i++) {
			startSpin(i);
		}
		////////////////
		function startSpin(i) {
			var o = {
				el: document.getElementById('skill-timer-' + i),
				turn: 0
			};
			TweenMax.to(o, 5, {
				turn: 1,
				onUpdate: rotator,
				onUpdateParams: [ o ],
				ease: Linear.easeNone
			});
		}
		function rotator(o) {
			TweenMax.set(o.el, {
				background: 'conic-gradient(#0000 ' + o.turn + 'turn, #000e ' + o.turn + 'turn)'
			});
		}
	}
	function lootItems(count = 16, rarity = ITEM_RARITY.unique, itemSlot = '', itemName = '', store = true) {
		for (var i=0; i<count; i++) {
			// item.findLoot(2, undefined, 50)
			item.findLoot(2, 6)
		}
	}
	function opacity(count) {
		var max = count || 2000
		$("#title-container-wrap").css('display', 'none')
		$('#scene-title-select-character, .test-orcs').remove()

		var e2 = getElementById('scene-title-landing');
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

		var e2 = getElementById('scene-title-landing');
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

		var e2 = getElementById('scene-title-landing');
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

		var e2 = getElementById('scene-title-landing');
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
			width: MAX_WIDTH,
			height: MAX_HEIGHT,
			backgroundColor: '#0000'
		});
		// console.info('textPix', pixApp)
		// console.info('view', pixApp.view)
		pixApp.view.style.position = 'absolute'
		pixApp.view.style.zIndex = 3
		//var renderer = PIXI.autoDetectRenderer(size[Zero], size[1], null);
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
			rotation: util.rotation(360),
			repeat: -1,
			ease: Linear.easeNone
		})
		window.onresize = pixiResize
		pixiResize()
	}
	function pixiRenderer() {
		pixApp = new PIXI.Application({
			width: MAX_WIDTH,
			height: MAX_HEIGHT,
			transparent: true
		});
		// console.info('textPix', pixApp)
		// console.info('view', pixApp.view)
		// console.info('screen', pixApp.screen)
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
			rotation: util.rotation(360),
			repeat: -1,
			ease: Linear.easeNone
		})
		window.onresize = pixiResize
		pixiResize()
	}
	function pixiClouds() {
		var dur = 555;
		test.pix = new PIXI.Application({
			width: MAX_WIDTH,
			height: MAX_HEIGHT,
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
			x: -MAX_WIDTH,
			ease: Linear.easeNone,
			onComplete: function() {
				TweenMax.to(cloud, dur, {
					startAt: { x: MAX_WIDTH },
					x: -MAX_WIDTH,
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
		test.pix.view.style.height = ~~(517 / MAX_HEIGHT * window.innerHeight) + 'px';
	}
	function pixiResize() {
		// wider than default ratio
		width = window.innerHeight * ratio;
		height = window.innerHeight;

		console.info('pixiResize', width, height)
		pixApp.view.style.width = width + 'px';
		pixApp.view.style.height = height + 'px';
	}
	function mobImage() {
		let el = createElement('img')
		el.style.position = 'absolute'
		el.style.zIndex = 999
		el.style.left = _.random(-300, 800) + 'px'
		el.style.top = _.random(-200, 300) + 'px'
		el.src = 'mobs/orc/1.png'
		document.body.appendChild(el)
		let o = {
			frame: 1
		}
		TweenMax.to(o, 1.75, {
			frame: 105,
			onUpdate: setImg,
			onUpdateParams: [el, o],
			ease: Linear.easeNone,
			repeat: -1,
		})
		////////////////////////////////
		function setImg(el, o) {
			el.src = 'mobs/orc/' + ~~o.frame + '.png'
		}
	}
	function mobPix(mobName) {
		mobName = mobName || [MOB_IMAGES.orc]
		const hoverIcon = "url('css/cursor/pointer.png'), auto"
		if (!test.mob) {
			test.mob = new PIXI.Application({
				width: MAX_WIDTH,
				height: MAX_HEIGHT,
				transparent: true
			});
			test.mob.view.style.position = 'absolute'
			test.mob.view.style.zIndex = 999
			test.mob.view.style.left = '0px'
			test.mob.view.style.top = '0px'

			test.textures = []
			for (var i=1; i<=105; i++) {
				test.textures[i] = PIXI.Texture.from('mobs/'+ mobName +'/'+ i +'.png')
			}
		}
		querySelector('body').appendChild(test.mob.view)

		let mobSprite = PIXI.Sprite.from('mobs/'+ mobName +'/1.png')
		let x = _.random(-480, MAX_WIDTH - 960)
		let y = _.random(-400, MAX_HEIGHT - 800)
		mobSprite.x = x
		mobSprite.y = y
		mobSprite.interactive = true
		mobSprite.buttonMode = true
		//mobSprite.hitArea = mob.getHitArea(mobName)
		mobSprite.cursor = hoverIcon
		mobSprite.on('pointerdown', onMobClick)
		test.mob.stage.addChild(mobSprite)

		let o = { frame: 1 }
		TweenMax.to(o, 1.75, {
			frame: 105,
			onUpdate: setPix,
			onUpdateParams: [mobSprite, o],
			ease: Linear.easeNone,
			repeat: -1,
		})
		////////////////////////////////
		function setPix(el, o) {
			el.texture = test.textures[~~o.frame]
		}
		function onMobClick(e) {
			console.info('click!', e)
		}
	}

	function getHate() {
		for (var i=0; i<mob.max; i++) {
			console.info('hate:', i, mobs[i].hate)
		}
	}
	function disableConsole() {
		console.debug = console.log = console.warn = console.info = ng.noop
	}
	function disableEvents(delay) {
		delayedCall(delay, () => {
			$(document).add('*').off()
		})
	}
	function getTestLootItemWeapon(itemSlot = ITEM_TYPE.ONE_HAND_BLUNTS) {
		return item.getLoot({
			store: true,
			rarity: ITEM_RARITY.unique,
			mobLevel: 50,
			itemSlot: itemSlot,
		})
	}
	function projectionTest(empty = false) {
		if (empty) player.layer.removeChildren()

		test.container = new PIXI.projection.Container2d();
		test.container.position.set(player.layer.screen.width / 2, player.layer.screen.height);

		test.plane = new PIXI.projection.Sprite2d(PIXI.Texture.from('images/bg_plane-512.jpg'));
		test.plane.anchor.set(.5, 1)
		/*test.plane.width = player.layer.screen.width
		test.plane.height = player.layer.screen.height*/
		test.plane.x = 0
		test.plane.y = 0
		test.container.addChild(test.plane)
		player.layer.stage.addChild(test.container)
	}
	function leftoverMapCode() {

	/*function getEventConfig() {
		// click center of map
		let styleMapRoot = getComputedStyle(querySelector('#mini-map'))
		let styleMapParent = getComputedStyle(map.miniMapParent)
		let right = parseInt(styleMapRoot.right, 10)
		let bottom = parseInt(styleMapRoot.bottom, 10)
		let halfDragMapWidth = parseInt(styleMapParent.width, 10) * .5
		let halfDragMapHeight = parseInt(styleMapParent.height, 10) * .5

		let clientX = window.innerWidth - right - MAP_PADDING - halfDragMapWidth
		let clientY = window.innerHeight - bottom - MAP_PADDING - halfDragMapHeight
		let el = document.elementFromPoint(clientX, clientY)
		return {
			el: el,
			clientX: clientX,
			clientY: clientY,
		}
	}
	function clickZoomIn() {
		let config = getEventConfig()
		const wheelEvent = $.Event( 'wheel', {
			originalEvent: {
				deltaY: -650,
				clientX: config.clientX,
				clientY: config.clientY,
				preventDefault: ng.noop
			}
		})
		$(config.el).trigger(wheelEvent)
	}
	function clickZoomOut() {
		let config = getEventConfig()
		const wheelEvent = $.Event( 'wheel',{
			originalEvent: {
				deltaY: 650,
				clientX: config.clientX,
				clientY: config.clientY,
				preventDefault: ng.noop
			}
		})
		$(config.el).trigger(wheelEvent)
	}*/
	}
	function setFromTransformOrigins() {
		// TOP LEFT
		// -200 @ .5 scale // (((map.scale * .01) * map.width) * .5) - 300 * .5
		// 0 @ 1 scale
		// 400 @ 2 scale // 1600 - 300 * .5

		// CENTER
		// -250 @ .5 scale
		// -250 @ 1 scale // 800 * .5 - 300 * .5
		// -250 @ 2 scale

		// BOTTOM RIGHT
		// -300 @ .5 scale
		// -500 @ 1 scale
		// -900 @ 2

		// preserve original origin
		map.originX1 = map.originX2
		map.originY1 = map.originY2
		// 800x800 map in a 300x300 portlet
		let parentWidth = map.miniMapParent.offsetWidth // 300
		let parentHeight = map.miniMapParent.offsetHeight // 300
		let parentWidthHalf = parentWidth * .5 // 150
		let parentHeightHalf = parentHeight * .5 // 150
		let dragWidth = map.miniMapDrag.offsetWidth // 800
		let dragHeight = map.miniMapDrag.offsetHeight // 800
		let halfMapWidth = dragWidth * .5
		let halfMapHeight = dragHeight * .5
		let centerX = (halfMapWidth - parentWidthHalf) * -1 // 400 - 150 === 250
		let centerY = (halfMapHeight - parentHeightHalf) * -1 // 400 - 150 === 250

		// scale === 2 - zoomed in BIG X, Y MOVEMENT 1600x1600 map in 300x300 portlet
		let maxMapHalfWidth = (((SCALE_OUT_MAX * .01) * map.width) * .5) // 800
		let maxMapHalfHeight = (((SCALE_OUT_MAX * .01) * map.height) * .5) // 800
		// top-left
		let scaleMaxOutMinX = centerX + maxMapHalfWidth - parentWidthHalf // -250 + 800 - 150 === 400?
		let scaleMaxOutMinY = centerY + maxMapHalfHeight - parentHeightHalf // -250 + 800 - 150 === 400?
		// bottom-right
		let scaleMaxOutMaxX = centerX - maxMapHalfWidth + parentWidthHalf // -250 - 800 + 150 === -900
		let scaleMaxOutMaxY = centerY - maxMapHalfHeight + parentHeightHalf // -250 - 800 + 150 === -900

		// scale === .5 - zoomed out SMALL X, Y MOVEMENT 400x400 map in 300x300 portlet
		let minMapHalfWidth = (((SCALE_IN_MAX * .01) * map.width) * .5) // 200
		let minMapHalfHeight = (((SCALE_IN_MAX * .01) * map.height) * .5) // 200
		// top-left
		let scaleMaxInMinX = centerX + minMapHalfWidth - parentWidthHalf // -250 + 200 - 150 === -200
		let scaleMaxInMinY = centerY + minMapHalfHeight - parentHeightHalf // -250 + 200 - 150 === -200
		// bottom-right
		let scaleMaxInMaxX = centerX - minMapHalfWidth + parentWidthHalf // -250 - 200 + 150 === -300
		let scaleMaxInMaxY = centerY - minMapHalfHeight + parentHeightHalf // -250 - 200 + 150 === -300

		let dynamicHalfWidth = (((map.scale * .01) * map.width) * .5)
		let dynamicHalfHeight = (((map.scale * .01) * map.height) * .5)
		let scaleDynamicX = map.dragMap.x > centerX ?
			centerX + dynamicHalfWidth - parentWidthHalf :
			centerX - dynamicHalfWidth + parentWidthHalf
		let scaleDynamicY = map.dragMap.y > centerY ?
			centerY + dynamicHalfHeight - parentHeightHalf :
			centerY - dynamicHalfHeight + parentHeightHalf

		let transformOriginX = centerX
		let transformOriginY = centerY

		let coords = {
			x: map.dragMap.x,
			y: map.dragMap.y,
			parentWidth,
			parentHeight,
			dragWidth,
			dragHeight,
			centerX,
			centerY,
			scaleMaxOutMinX,
			scaleMaxOutMaxX,
			scaleMaxOutMinY,
			scaleMaxOutMaxY,
			scaleMaxInMinX,
			scaleMaxInMaxX,
			scaleMaxInMinY,
			scaleMaxInMaxY,
			dynamicHalfWidth,
			dynamicHalfHeight,
			scaleDynamicX,
			scaleDynamicY,
			transformOriginX,
			transformOriginY,
		}
		/*let minOriginX = map.miniMapParent.offsetWidth * .5
		let maxOriginX = map.miniMapParent.offsetWidth * .5*/

		// console.info('trans x, y', transformOriginX, transformOriginY)
		/*
		console.info('coords', coords)*/
		// console.info('dynamic x, y', coords.scaleDynamicX, coords.scaleDynamicY, coords);
		let xDiff = (map.dragMap.minX - map.dragMap.maxX) * .25 // half of a half // 25?
		let originAdjX = map.dragMap.x < centerX ? halfMapWidth - xDiff : halfMapWidth + xDiff
		let yDiff = (map.dragMap.minY - map.dragMap.maxY) * .25 // half of a half
		let originAdjY = map.dragMap.y < centerY ? halfMapHeight - xDiff : halfMapHeight + yDiff

		console.info('scale, x, y', map.scale * .01, map.dragMap.x, map.dragMap.y)
		console.info('dragMap min/max', map.dragMap.minX, map.dragMap.minY, '/', map.dragMap.maxX, map.dragMap.maxY)
		map.originX2 = originAdjX
		map.originY2 = originAdjY

		// fallback
		map.originX2 = map.mouseX
		map.originY2 = map.mouseY
		console.warn('origin coords', originAdjX, originAdjY)
	}
	function setTransformOrigin(tween) {
		TweenMax.set(map.miniMapDrag, {
			transformOrigin: (map.width - tween.x) + 'px ' + (map.height - tween.y) + 'px',
		})
	}
	function turnLeft() {
		if (dungeon.walking || TURN_DISABLED) return
		dungeon.walking = 1
		let x = dungeon.entity.x
		let y = dungeon.entity.y
		let xEnd = 0
		let yEnd = 0
		let alphaEnd = 1
		let distance = dungeon.getEntityDistanceFromMe()
		let yEase = Power0.easeNone
		if (x === 0) {
			if (y <= -CLOSEST_MOB_DISTANCE) {
				// front
				xEnd = distance
				yEnd = 0
				alphaEnd = 0
				yEase = Circ.easeIn
			}
			else {
				// back
				xEnd = -distance
				yEnd = 0
			}
		}
		else {
			if (x > 0) {
				// right
				xEnd = 0
				yEnd = distance
				alphaEnd = 0
				dungeon.entity.alpha = 0
			}
			else {
				// left
				xEnd = 0
				yEnd = -distance
				yEase = Circ.easeOut
				dungeon.entity.alpha = 1
			}
		}
		TweenMax.to(dungeon.tiling.tileTransform, TURN_SPEED, {
			pixi: { rotation: '+=' + TURN_INTERVAL },
			ease: Power0.easeIn,
		})
		TweenMax.to(dungeon.entity, TURN_SPEED, {
			x: xEnd,
			ease: Power0.easeNone,
		})
		TweenMax.to(dungeon.entity, TURN_SPEED, {
			y: yEnd,
			ease: yEase,
			onComplete: () => {
				dungeon.entity.alpha = alphaEnd
				dungeon.walkStop()
			}
		})
		map.compass -= TURN_INTERVAL
	}
	function turnRight() {
		if (dungeon.walking || TURN_DISABLED) return
		dungeon.walking = 1
		let x = dungeon.entity.x
		let y = dungeon.entity.y
		let xEnd = 0
		let yEnd = 0
		let alphaStart = 1
		let alphaEnd = 1
		let distance = dungeon.getEntityDistanceFromMe()
		let yEase = Power0.easeNone

		if (x === 0) {
			if (y <= -CLOSEST_MOB_DISTANCE) {
				// front
				xEnd = -distance
				yEnd = 0
				alphaEnd = 0
				yEase = Circ.easeIn
			}
			else {
				// back
				xEnd = distance
				yEnd = 0
			}
		}
		else {
			if (x > 0) {
				// right
				xEnd = 0
				yEnd = -distance
				yEase = Circ.easeOut
				dungeon.entity.alpha = 1
			}
			else {
				// left
				xEnd = 0
				yEnd = distance
				alphaEnd = 0
				dungeon.entity.alpha = 0
			}
		}

		TweenMax.to(dungeon.tiling.tileTransform, TURN_SPEED, {
			pixi: { rotation: '-=' + TURN_INTERVAL },
			ease: Power0.easeIn,
		})
		TweenMax.to(dungeon.entity, TURN_SPEED, {
			x: xEnd,
			ease: Power0.easeNone,
		})
		TweenMax.to(dungeon.entity, TURN_SPEED, {
			y: yEnd,
			ease: yEase,
			onComplete: () => {
				dungeon.entity.alpha = alphaEnd
				dungeon.walkStop()
			}
		})
		map.compass += TURN_INTERVAL
	}
	function addFloorTiles3d() {
		dungeon.containerFloor = new PIXI.projection.Container2d()
		dungeon.containerFloor.zIndex = 3
		dungeon.containerFloor.position.set(MAX_WIDTH * .5, MAX_HEIGHT)
		dungeon.containerFloor.proj.setAxisY({
			x: 0,
			y: MAX_HEIGHT * .5,
		}, -1)
		dungeon.layer.stage.addChild(dungeon.containerFloor)


		dungeon.camera = new PIXI.projection.Camera3d();
		dungeon.camera.setPlanes(300, 10, 1000, false);
		dungeon.camera.position.set(MAX_WIDTH * .5, MAX_HEIGHT * .5);
		dungeon.camera.position3d.y = 0; // camera is above the ground
		dungeon.layer.stage.addChild(dungeon.camera);

		dungeon.groundLayer = new PIXI.projection.Container3d();
		dungeon.groundLayer.euler.x = Math.PI * .5;
		dungeon.camera.addChild(dungeon.groundLayer);

		dungeon.bgLayer = new PIXI.projection.Container3d();
		dungeon.bgLayer.proj.affine = PIXI.projection.AFFINE.AXIS_X;
		dungeon.camera.addChild(dungeon.bgLayer);
		dungeon.bgLayer.position3d.z = 80;

		dungeon.mainLayer = new PIXI.projection.Container3d();
		dungeon.mainLayer.proj.affine = PIXI.projection.AFFINE.AXIS_X;
		dungeon.camera.addChild(dungeon.mainLayer);

		// background sprite
		dungeon.bg = new PIXI.Sprite(PIXI.Texture.from('images/dungeon/bg-test-sky.jpg'))
        dungeon.bg.position.x = 0;
        dungeon.bg.anchor.set(.5, .5)
        dungeon.bgLayer.addChild(dungeon.bg);

        dungeon.fg = new PIXI.projection.Sprite3d(PIXI.Texture.from('images/dungeon/bg_plane-512.jpg'));
        dungeon.fg.anchor.set(.5, .5);
        dungeon.fg.position.x = 0;
        dungeon.bgLayer.addChild(dungeon.fg);
        // use position or position3d here, its not important,
        // unless you need Z - then you need position3d

        // dungeon.groundLayer.addChild(dungeon.fg);

        dungeon.sky.alpha = 0
		dungeon.tiling.alpha = 0
	}
	function getMob(query, zoneName) {
		if (typeof query === 'undefined') {
			query = {
				level: 1,
				img: [MOB_IMAGES.orc]
			}
		}
		let result = mob.getRandomMobByZone(query, zoneName)
		console.warn(result.name, result.level)
		for (var key in result) {
			console.info(key, result[key])
		}
		return result
	}
	function setupMissionData() {
		mission.inProgress = true
		// TODO: something broken here lol
		// const zoneName = zones.find(z => z.id === Config.defaultPageUpZone).name
		mission.id = Config.defaultPageUpZone
		mission.questId = 0
	}

	function revealMap() {
		$('#mini-map-drag *').css({
			visibility: 'visible',
			opacity: 1
		})
	}
	/*
	https://greensock.com/docs/v2/Plugins/BezierPlugin
	bezier types
"thru" (the default) - the plugin figures out how to draw the Bezier naturally through the supplied values using a proprietary algorithm. The values you provide in the array are essentially treated as anchors on the Bezier and the plugin calculates the control points. The target's current/starting values are used as the initial anchor. You can define a curviness special property that allows you to adjust the tension on the Bezier where 0 has no curviness (straight lines), 1 is normal curviness, 2 is twice the normal curviness, etc. Since "thru" is the default Bezier type, you don't need to define a type at all if this is the one you want.
"soft" - the values that you provide in the array act almost like magnets that attract the curve towards them, but the Bezier doesn't typically travel through them. They are treated as control points on a Quadratic Bezier and the plugin creates the necessary intermediate anchors. The target's current/starting values are used as the initial anchor.
"quadratic" - allows you to define standard Quadratic Bezier data (Quadratic Beziers have 1 control point between each anchor). The array should start with the first anchor, then control point, then anchor, control point, etc. for as many iterations as you want, but obviously make sure that it starts and ends with anchors.
"cubic" - allows you to define standard Cubic Bezier data (Cubic Beziers have 2 control points between each anchor). The array should start with the first anchor, then 2 control points, then anchor, 2 control points, anchor, etc. for as many iterations as you want, but obviously make sure that it starts and ends with anchors.
	 */
})(Linear, TweenMax, TimelineMax, PIXI, $);