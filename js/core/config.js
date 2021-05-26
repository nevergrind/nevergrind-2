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
	defaultZone: 0, // id in zones.js
	showMapNumbers: false,
	autoAcceptPartyInvites: true,
	forceUnique: true,
	forceChampion: false,
}