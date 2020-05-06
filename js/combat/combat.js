var combat;
!function($, _, TweenMax, undefined) {
	combat = {
		damageMobMelee,
		targetChanged,
	}
	var el
	///////////////////////////////////////////
	function damageMobMelee(index, damage) {
		mobs[index].hp -= damage
		if (mobs[index].hp <= 0) {
			warn('mob is dead!')
		}
		mob.drawMobBar(index)
	}
	function targetChanged() {
		querySelectorAll('.mob-name')
		for (el of querySelectorAll('.mob-name')) {
			el.classList.remove('targeted')
		}
		info('targetChanged my.target', my.target)
		querySelector('#mob-name-' + my.target).classList.add('targeted')
	}
}($, _, TweenMax);