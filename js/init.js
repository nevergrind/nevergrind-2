// reserved objects
var buff = []
var items = {
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
//audio.gameMusicInit();
context.init()
mission.init()
$('script').remove()