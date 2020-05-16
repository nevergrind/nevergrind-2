var pix
!function(PIXI, _, $, Linear, Power1, Power2, Power3, Power4, window, TweenMax, Expo, undefined) {
	pix = {
		sky: {},
		getId,
	}
	//////////////////////////////
	/**
	 * TweenMax Pixi Plugin examples
	 * combineCMF: true - retains previous filter settings
	 * TweenLite.to(image, 1, {pixi:{colorize:"red", colorizeAmount:1}});
	 * TweenLite.to(image, 1, {pixi:{saturation:0}});
	 * TweenLite.to(image, 1, {pixi:{hue:180}});
	 * TweenLite.to(image, 1, {pixi:{brightness:3}});
	 * TweenLite.to(image, 1, {pixi:{contrast:3}});
	 * TweenLite.to(image, 1, {pixi:{blur:20}});
	 * TweenLite.to(image, 1, {pixi:{colorMatrixFilter:null, blur:0}}); (reset)
	 * @param el
	 * @param id
	 * @returns {*|Mixed}
	 */
	/*
	var filter = new PIXI.filters.ColorMatrixFilter();
	filter.sepia();
	TweenMax.to(image, 2, { pixi: { colorMatrixFilter: filter } });


	//blur on both the x and y axis to a blur amount of 15
	TweenMax.to(image, 2, { pixi: { blurX: 15, blurY: 15 } });

	TweenLite.to(image, 1, {pixi:{colorize:"red", colorizeAmount:1}});

	TweenLite.to(image, 1, {pixi:{saturation:0}});

	TweenLite.to(image, 1, {pixi:{hue:180}});
	combineCMF: true/false

	TweenLite.to(image, 1, {pixi:{colorMatrixFilter:null, blur:0}});

	TweenMax.set(pix.moon, {
		y: 100,
		pixi: {
			saturation: 1,
			brightness: 1,
			colorize: "red",
			colorizeAmount: 1,
		}
	});
	var filter = new PIXI.filters.ColorMatrixFilter();
	filter.sepia();

	colorBunny.tint = `0x${Math.floor(Math.random() * 16777215).toString(16)}`;

	TweenMax.to(bunny3, time, {
		pixi: { tint: 'rgb(0,0,255)' }, repeat: -1, yoyo: true,
	});

	gsap.to(bunny3.scale, {
		x: 2.0, y: 2.0, duration: time, repeat: -1, yoyo: true,
	});

	gsap.to(bunny4, {
		rotation: 2 * Math.PI, duration: time, repeat: -1, yoyo: true,
	});
	TweenMax.set(pix.moon, {
		y: 100,
		pixi: {
			scale: 1.2,
			rotation: 90,
			colorize: 'orange',
			colorizeAmount: 1,
		}
	});
	*/
	function getId(el, id) {
		// example: pix.getId(pix.sky, 'test')
		// console.info('getId', el)
		return _.find(el.stage.children, {
			id: id
		})
	}
}(PIXI, _, $, Linear, Power1, Power2, Power3, Power4, window, TweenMax, Expo);