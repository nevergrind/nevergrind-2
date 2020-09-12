var query;
!function($, _, TweenMax, document, undefined) {
	query = {
		cache: {},
		el,
		all,
		resetCache,
	}
	let e
	///////////////////////////////////////////
	function el(selector) {
		if (typeof query.cache[selector] === 'undefined') {
			query.cache[selector] = querySelector(selector)
		}
		return query.cache[selector]
	}

	function all(selector) {
		if (typeof query.cache[selector] === 'undefined') {
			query.cache[selector] = querySelectorAll(selector)
		}
		return query.cache[selector]
	}

	function resetCache() {
		query.cache = {}
	}


}($, _, TweenMax, document);