// global objects
let items = {
	inv: [],
	eq: [],
	bank: [],
	merchant: [],
	blacksmith: [],
	apothecary: [],
	tavern: [],
	tradeTo: [],
	tradeFrom: [],
}

// where app code is invoked upon initial load
login.init()
ng.init()
audio.init()
context.init()
mission.init()
button.init()
timers.init()
mob.initMobData()
$('script').remove()