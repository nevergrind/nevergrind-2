/**
 * a config object to easily configure behavior throughout the app for easier testing
 * this will help you centralize settings instead of searching throughout the code
 * @type {{deathEnabled: boolean, defaultZone: number, walkFast: boolean}}
 */
const Config = {
	consoleDisabled: false,
	guaranteedLoot: false,
	deathEnabled: true,
	walkFast: true,
	defaultZone: zones.find(z => z.name === ZONES.tendolinPassage).id,
	showMapNumbers: false,
	autoAcceptPartyInvites: true,
	forceUnique: false,
	forceChampion: false,
}