var test;
(function() {
	var c;
	var i;
	var e;
	var z;
	var start;
	var end;
	var filters;

	test = {
		chat: {
			id: 999999999,
			room: chatRoom,
			log: chatLog
		},
		send: send,
		orcs,
		battle,
		filters: {
			/*
			blur(5px)
			hue-rotate(360deg)
			brightness(100%)
			contrast(100%)
			shadow(100%) (chrome not supported?)
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
	}
	///////////////////////////////////
	function battle() {
		var singleMob = false;
		var mobKey = '';
		for (var i=0; i<mob.max; i++){
			if (singleMob && i === 2 || !singleMob) {
				mobKey = mob.getRandomMobKey();
				mobKey = 'rat';
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

		var e2 = getById('ng2-logo-wrap');
		for (i=0; i<max; i++){
			e = createElement('img');
			e.id = 'mob' + i;
			e.className = 'test-orcs';
			e.style.position = 'absolute';
			e.style.top = ~~(rand() * 100) +'%';
			e.style.left = ~~(rand() * 100) +'%';
			e.style.transform = 'translate(-50%, -50%)';
			e.src = 'images/an orc.png';
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
		z = getById("mob" + i);

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
		z.style.filter = 'grayscale(100%) sepia(100%) saturate(1000%) ' + filters.hue;
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
	function getItem(level = 50, rarity = 'normal', itemSlot = '', itemName = '') {
		if (itemName) { level = 50 } // because it needs to select any item
		rarity = item.getRarity();
		var drop = item.getItem({
			mobLevel: level,
			rarity: rarity,
			itemSlot: itemSlot,
			itemName: itemName,
		})

		_.each(drop, function(val, key) {
			//console.info('prop', key, val)
		})
		tooltip.show(drop)
		return drop
	}
})();