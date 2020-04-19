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

	function getId(el, id) {
		// example: pix.getId(pix.sky, 'test')
		console.info('getId', el)
		return _.find(el.stage.children, {
			id: id
		})
	}
}(PIXI, _, $, Linear, Power1, Power2, Power3, Power4, window, TweenMax, Expo);