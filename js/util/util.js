var util;
!function($, _, TweenMax, document, Math, undefined) {
	util = {
		toRadiansSin,
		toRadiansCos,
		toDegrees,
		rotation,
	}
	const radianValue = Math.PI / 180
	const degreeValue = 180 / Math.PI
	///////////////////////////////////////////
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
}($, _, TweenMax, document, Math);