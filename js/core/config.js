/**
 * a config object to easily configure behavior throughout the app for easier testing
 * this will help you centralize settings instead of searching throughout the code
 * @type {{deathEnabled: boolean, defaultZone: number, walkFast: boolean}}
 */
const config = {
	consoleDisabled: false,
	guaranteedLoot: false,
	deathEnabled: true,
	walkFast: true,
	defaultZone: 3,
	showMapNumbers: false,
	autoAcceptPartyInvites: true,
}