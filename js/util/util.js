var util;
!function($, _, TweenMax, document, Math, undefined) {
	util = {
		bezierDefaults: {},
		init,
		toRadiansSin,
		toRadiansCos,
		toDegrees,
		rotation,
		removeElements,
		getBezierValues,
	}
	const radianValue = Math.PI / 180
	const degreeValue = 180 / Math.PI
	let len, i
	///////////////////////////////////////////
	function init() {
		util.bezierDefaults = {
			points: 3,
			randomness: .25,
			minRandomX: 100,
			minRandomY: 100,
			xStart: MaxWidth * .5,
			yStart: MaxHeight * .5,
			xEnd: dungeon.centerX[0],
			yEnd: ask.centerY(0, false)
		}
	}
	function removeElements(els) {
		len = els.length
		for (i=0; i<len; i++) {
			els[i].parentNode.removeChild(els[i])
		}
	}
	function toRadiansSin(angle) {
		return Math.sin(angle * radianValue)
	}
	function toRadiansCos(angle) {
		return Math.cos(angle * radianValue)
	}
	function toDegrees(radians) {
		return radians * degreeValue
	}
	function rotation(angle) {
		return (angle / 180) * PI
	}

	/**
	 * creates array of random x,y values to animate from and to two points using a bezier curve
	 * @param config
	 * @returns {[]}
	 */
	function getBezierValues(config) {
		config = {
			...util.bezierDefaults,
			...config
		}
		let x
		let y
		let intervalX = (config.xEnd - config.xStart) / (config.points - 1)
		let intervalY = (config.yEnd - config.yStart) / (config.points - 1)
		let randomnessX = intervalX * config.randomness
		let randomnessY = intervalY * config.randomness
		let resp = []
		for (var i=0; i<config.points; i++) {
			if (i === 0) {
				resp.push({
					x: config.xStart,
					y: config.yStart,
				})
			}
			else if (i === config.points - 1) {
				resp.push({
					x: config.xEnd,
					y: config.yEnd,
				})
			}
			else {
				if (!randomnessX) {
					x = config.xStart + (intervalX * i) + _.random(-config.minRandomX, config.minRandomX)
				}
				else {
					x = config.xStart + (intervalX * i) + _.random(-randomnessX, randomnessX)
				}
				if (!randomnessY) {
					y = config.yStart + (intervalY * i) + _.random(-config.minRandomY, config.minRandomY)
				}
				else {
					y = config.yStart + (intervalY * i) + _.random(-randomnessY, randomnessY)
				}
				resp.push({
					x: ~~x,
					y: ~~y,
				})
			}
		}
		return resp
	}
}($, _, TweenMax, document, Math);