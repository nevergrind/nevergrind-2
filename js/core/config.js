/**
 * a config object to easily configure behavior throughout the app for easier testing
 * this will help you centralize settings instead of searching throughout the code
 */
const Config = {
	autoAttackEnabled: true,
	consoleDisabled: false,
	guaranteedLoot: false,
	deathEnabled: true,
	walkFast: true,
	enablePageUpZoning: false,
	defaultPageUpZone: zones.find(z => z.name === ZONES.ashenflowPeak).id,
	showMapNumbers: false,
	autoAcceptPartyInvites: true,
	forceUnique: false,
	forceChampion: false,
}
if (app.isApp) {
	Config.consoleDisabled = true
	Config.deathEnabled = true
	Config.walkFast = false
	Config.autoAcceptPartyInvites = false
	Config.enablePageUpZoning = false
}