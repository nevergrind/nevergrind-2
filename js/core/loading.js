var loading;
!function($, _, TweenMax, undefined) {
	loading = {
		index: 0
	}
	///////////////////////////////////////////
	loading.tips = [
		'Ranged archery attacks are all considered piercing attacks, which cannot be riposted.',
		'Enemy ripostes are considered piercing attacks. Piercing attacks cannot be dodged, parried, or riposted.',
		'Don\'t confuse piercing weapons and piercing attacks! Piercing weapons are a type of weapon skill. Piercing attacks bypass passive defensive skills.',
		'Blocking with a shield is a great way to improve survivability. Blocking cannot be pierced unlike other passive defensive skills.',
		'When you successfully block with a shield, you reduce both all damage by 50%. Unlike other defensive skill checks, it does not depend on passive skills and it applies to all damage types.',
		'Ranged attacks hit the back row for full damage. This is one of the key benefits of playing a Ranger.',
		'All melee damage to the back row is reduced by 50%. This should affect which targets you decide to target first.',
		'Each monster has its own hate list. Managing how much each mob hates you is important to your survival.',
		'Some skills allow you to reduce how much each monster hates you. Highly efficient parties manage their hate effectively.',
	]
	loading.tipCount = loading.tips.length

}($, _, TweenMax);