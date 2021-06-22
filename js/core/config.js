/**
 * a config object to easily configure behavior throughout the app for easier testing
 * this will help you centralize settings instead of searching throughout the code
 * @type {{deathEnabled: boolean, defaultZone: number, walkFast: boolean}}
 */
const Config = {
	autoAttackEnabled: true,
	consoleDisabled: false,
	guaranteedLoot: false,
	deathEnabled: true,
	walkFast: false,
	defaultZone: zones.find(z => z.name === ZONES.bastilleCitadel).id,
	showMapNumbers: false,
	autoAcceptPartyInvites: true,
	forceUnique: false,
	forceChampion: false,
}