/**
 * a config object to easily configure behavior throughout the app for easier testing
 * this will help you centralize settings instead of searching throughout the code
 */
const Config = {
	autoAttackEnabled: true, // huh?
	consoleDisabled: false,
	guaranteedLoot: false,
	deathEnabled: true,
	walkFast: true,
	defaultPageUpZone: zones.find(z => z.name === ZONES.ashenflowPeak).id,
	showMapNumbers: false,
	autoAcceptPartyInvites: true,
	forceUnique: false,
	forceChampion: false,
	mockFullParty: false,
	mockFullPartySize: 5,
	disableCooldowns: true,
	easeMagicItemTesting: false,
	enableFastCast: false,
	enablePageUpZoning: false,
	testMob: true,
	safeAnimate: false,
	enableMobTestClass: false, // makes it easy to test against specific mob jobs
	forceMobSkills: false,
	forceTownPhase: true,
	forceHugeGuild: true,
	fastQuestTransitions: false
}
if (app.isApp) {
	Config.autoAttackEnabled = true
	Config.consoleDisabled = false
	Config.guaranteedLoot = false
	Config.deathEnabled = true
	Config.walkFast = false
	Config.defaultPageUpZone = 'Salubrin Haven'
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