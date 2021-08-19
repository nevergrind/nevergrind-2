/**
 * a config object to easily configure behavior throughout the app for easier testing
 * this will help you centralize settings instead of searching throughout the code
 */
const Config = {
	url: '',
	socketUrl: '',
	isApp: location.protocol === 'chrome-extension:',
	autoAttackEnabled: true, // huh?
	consoleDisabled: false,
	guaranteedLoot: false,
	deathEnabled: true,
	walkFast: true,
	showMapNumbers: false,
	autoAcceptPartyInvites: true,
	forceUnique: false,
	forceChampion: false,
	mockFullParty: false,
	mockFullPartySize: 5,
	disableCooldowns: false,
	easeMagicItemTesting: false,
	enableFastCast: false,
	enablePageUpZoning: false,
	testMob: true,
	safeAnimate: false,
	enableMobTestClass: false, // makes it easy to test against specific mob jobs
	forceMobSkills: false,
	forceTownPhase: true,
	forceHugeGuild: true,
	fastQuestTransitions: true,
	forceRain: false,
	forceLightning: false
}
if (Config.isApp) {
	Config.forceLightning = false
	Config.forceRain = false
	Config.autoAttackEnabled = true
	Config.consoleDisabled = false
	Config.guaranteedLoot = false
	Config.deathEnabled = true
	Config.walkFast = false
	Config.showMapNumbers = false
	Config.autoAcceptPartyInvites = false
	Config.forceUnique = false
	Config.forceChampion = false
	Config.mockFullParty = false
	Config.mockFullPartySize = 5
	Config.disableCooldowns = false
	Config.easeMagicItemTesting = false
	Config.enableFastCast = false
	Config.enablePageUpZoning = false
	Config.testMob = false
	Config.safeAnimate = true
	Config.enableMobTestClass = false
	Config.forceMobSkills = false
	Config.forceTownPhase = false
	Config.forceHugeGuild = false
	Config.fastQuestTransitions = false
}
!function() {
	Config.url = getUrl()
	// Config.socketUrl - populated from init-game.php
	/*
	app.socketUrl = Config.isApp ? 'ws://34.220.110.228:9090/' : 'ws://127.0.0.1:9090'
	 */

	function getUrl() {
		if (location.protocol === 'chrome-extension:') {
			return 'http://34.220.110.228/ng2/server/'
		}
		else {
			return 'server/'
		}
	}
}()