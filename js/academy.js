var academy;
!function($, _, TweenMax, undefined) {
	academy = {
		getBodyHtml,
		trainSkill,
		selectedSkill: '',
	}
	/**
	 * skills need:
	 * img job-index
	 * name
	 * rank
	 */
	var str
	///////////////////////////////////////////
	function getBodyHtml() {
		str =
		'<div id="various-body" class="flex-column flex-max">' +
			'<div id="academy-skill-wrap" class="flex-column flex-max" style="margin: .1rem .2rem">' +
				'<div id="academy-body" class="flex-column flex-max">' +
					'asdf' +
				'</div>' +
			'</div>' +
			'<div id="buy-sell-row" class="flex-row align-center" style="margin-bottom: 0">' +
				'<div id="town-value-wrap" class="flex-row">'+
					'<i style="margin-top: .2rem" class="ra ra-gold-bar"></i>' +
					'<div id="town-value">0</div>' +
				'</div>' +
				'<div class="flex-row" style="height: 100%">' +
					'<div id="town-buy" class="ng-btn merchant-btn">Train</div>' +
				'</div>' +
			'</div>' +
		'</div>'
		return str
	}
	function trainSkill() {
		if (!academy.selectedSkill) {
			ng.splitText('various-description', 'Select a skill to train first!')
		}
		else {
			ng.splitText('various-description', 'Do you want to train ' + academy.selectedSkill + '?')
		}
	}
}($, _, TweenMax);