const TYPE = Object.freeze({
	OBJECT: 'object',
	STRING: 'string',
	NUMBER: 'number',
	FUNCTION: 'function',
})
const CHAT = Object.freeze({
	SAY: { mode: '/say' },
	PARTY: { mode: '/party' },
})
const CSS = Object.freeze({
	ACTIVE: 'active',
	DISABLED: 'disabled',
	CHAT_WARNING: 'chat-warning',
	CHAT_ALERT: 'chat-alert',
	CHAT_HEAL: 'chat-heal',
	CASTBAR_ZERO: { castBar: 0 },
	X_ZERO: { x: '-100%' },
	DISPLAY_BLOCK: { display: 'block' },
	DISPLAY_NONE: { display: 'none' },
	DISPLAY_FLEX: { display: 'flex' },
})
const RACE = Object.freeze({
	BARBARIAN: 'Barbarian',
	DARK_ELF: 'Dark Elf',
	DWARF: 'Dwarf',
	GNOME: 'Gnome',
	HALF_ELF: 'Half Elf',
	HALFLING: 'Halfling',
	HIGH_ELF: 'High Elf',
	HUMAN: 'Human',
	ORC: 'Orc',
	SERAPH: 'Seraph',
	TROLL: 'Troll',
	WOOD_ELF: 'Wood Elf',
})
const JOB = Object.freeze({
	BARD: 'BRD',
	CLERIC: 'CLR',
	CRUSADER: 'CRU',
	DRUID: 'DRU',
	ENCHANTER: 'ENC',
	MONK: 'MNK',
	RANGER: 'RNG',
	ROGUE: 'ROG',
	SHADOW_KNIGHT: 'SHD',
	SHAMAN: 'SHM',
	TEMPLAR: 'TMP',
	WARLOCK: 'WLK',
	WARRIOR: 'WAR',
	WIZARD: 'WIZ',
})
const CLASS = Object.freeze({
	BARD: 'Bard',
	CLERIC: 'Cleric',
	CRUSADER: 'Crusader',
	DRUID: 'Druid',
	ENCHANTER: 'Enchanter',
	MONK: 'Monk',
	RANGER: 'Ranger',
	ROGUE: 'Rogue',
	SHADOW_KNIGHT: 'Shadow Knight',
	SHAMAN: 'Shaman',
	TEMPLAR: 'Templar',
	WARLOCK: 'Warlock',
	WARRIOR: 'Warrior',
	WIZARD: 'Wizard',
})
const PROP = Object.freeze({
	RESIST_BLOOD: 'resistBlood',
	RESIST_POISON: 'resistPoison',
	RESIST_ARCANE: 'resistArcane',
	RESIST_LIGHTNING: 'resistLightning',
	RESIST_FIRE: 'resistFire',
	RESIST_ICE: 'resistIce',
	RESIST_ALL: 'resistAll',
	ADD_SPELL_BLOOD: 'addSpellBlood',
	ADD_SPELL_POISON: 'addSpellPoison',
	ADD_SPELL_ARCANE: 'addSpellArcane',
	ADD_SPELL_LIGHTNING: 'addSpellLightning',
	ADD_SPELL_FIRE: 'addSpellFire',
	ADD_SPELL_ICE: 'addSpellIce',
	ADD_SPELL_ALL: 'addSpellAll',
	ATTACK: 'attack',
	OFFENSE: 'offense',
	DEFENSE: 'defense',
	ONE_HAND_SLASH: 'oneHandSlash',
	ONE_HAND_BLUNT: 'oneHandBlunt',
	PIERCING: 'piercing',
	ARCHERY: 'archery',
	HAND_TO_HAND: 'handToHand',
	TWO_HAND_SLASH: 'twoHandSlash',
	TWO_HAND_BLUNT: 'twoHandBlunt',
	DODGE: 'dodge',
	PARRY: 'parry',
	RIPOSTE: 'riposte',
	ALTERATION: 'alteration',
	CONJURATION: 'conjuration',
	EVOCATION: 'evocation',
	DUAL_WIELD: 'dualWield',
	DOUBLE_ATTACK: 'doubleAttack',
	ALL_SKILLS: 'allSkills',
	STR: 'str',
	STA: 'sta',
	AGI: 'agi',
	DEX: 'dex',
	INTEL: 'intel',
	WIS: 'wis',
	CHA: 'cha',
	ALL_STATS: 'allStats',
	HP: 'hp',
	HP_MAX: 'hpMax',
	MP: 'mp',
	MP_MAX: 'mpMax',
	SP: 'sp',
	SP_MAX: 'spMax',
	HP_REGEN: 'hpRegen',
	MP_REGEN: 'mpRegen',
	SP_REGEN: 'spRegen',
	CRIT: 'crit',
	LEECH: 'leech',
	WRAITH: 'wraith',
	HASTE: 'haste',
	ADD_BLOOD: 'addBlood',
	ADD_POISON: 'addPoison',
	ADD_ARCANE: 'addArcane',
	ADD_LIGHTNING: 'addLightning',
	ADD_FIRE: 'addFire',
	ADD_ICE: 'addIce',
	INCREASED_BLOCK: 'increasedBlock',
	DAMAGE_TAKEN_TO_MANA: 'damageTakenToMana',
	DAMAGE_TAKEN_TO_SPIRIT: 'damageTakenToSpirit',
	ENHANCED_DAMAGE_TO_HUMANOIDS: 'enhancedDamageToHumanoids',
	ENHANCED_DAMAGE_TO_BEASTS: 'enhancedDamageToBeasts',
	ENHANCED_DAMAGE_TO_UNDEAD: 'enhancedDamageToUndead',
	ENHANCED_DAMAGE_TO_DEMONS: 'enhancedDamageToDemons',
	ENHANCED_DAMAGE_TO_DRAGONKIN: 'enhancedDamageToDragonkin',
	ENHANCED_DAMAGE_TO_MYSTICAL: 'enhancedDamageToMystical',
	ENHANCED_DAMAGE_TO_GIANTS: 'enhancedDamageToGiants',
	PHY_MIT: 'phyMit',
	MAG_MIT: 'magMit',
	RESIST_PHYSICAL: 'resistPhysical',
	ENHANCE_BLOOD: 'enhanceBlood',
	ENHANCE_POISON: 'enhancePoison',
	ENHANCE_ARCANE: 'enhanceArcane',
	ENHANCE_LIGHTNING: 'enhanceLightning',
	ENHANCE_FIRE: 'enhanceFire',
	ENHANCE_ICE: 'enhanceIce',
	ENHANCE_ALL: 'enhanceAll',
	RESIST_PARALYZE: 'resistParalyze',
	RESIST_FEAR: 'resistFear',
	RESIST_STUN: 'resistStun',
	RESIST_SILENCE: 'resistSilence',
	INCREASE_HP_PERCENT: 'increaseHpPercent',
	INCREASE_MP_PERCENT: 'increaseMpPercent',
	HP_KILL: 'hpKill',
	MP_KILL: 'mpKill',
	SP_KILL: 'spKill',
})
const LABEL = Object.freeze({
	STR: 'Strength',
	ONE_HAND_SLASH: 'One-hand Slash',
})
const DAMAGE_TYPE = Object.freeze({
	PHYSICAL: 'physical',
	BLOOD: 'blood',
	POISON: 'poison',
	ARCANE: 'arcane',
	LIGHTNING: 'lightning',
	FIRE: 'fire',
	ICE: 'ice',
})
const MOB_TYPE = Object.freeze({
	HUMANOID: 'humanoid',
	DEMON: 'demon',
	BEAST: 'beast',
	DRAGONKIN: 'dragonkin',
	MYSTICAL: 'mystical',
	UNDEAD: 'undead',
	GIANT: 'giant',
})
const KEYS = Object.freeze({
	DATA: ['data'],
	NAME: ['name'],
	ID: ['id'],
	INDEX: ['index'],
	RANK: ['rank'],
	MOB_OMIT: [ 'maxLevel', 'minLevel', ],
	SET_FACE: [ 'gender', 'race', 'face' ],
	ITEM_ENTER: [ 'index', 'type' ],
	PLAYER_CLICK: [ 'row', 'name' ],
	DAMAGE_MOB: [ 'damage', 'key', 'index', 'row', 'effects' ],
	DOT_MOB: [ 'damage', 'index', 'level' ],
	HEAL_HERO: ['damage', 'index', 'key'],
	BUFF_HERO: ['damage', 'index', 'key', 'level'],
	PARTY_PROPS: [
		'name',
		'hp',
		'hpMax',
		'mp',
		'mpMax',
		'sp',
		'spMax',
		'job',
		'partyId',
		'avatar'
	],
	MY_PROPS: [
		'str',
		'sta',
		'agi',
		'dex',
		'wis',
		'intel',
		'cha',
		'offense',
		'defense',
		'oneHandSlash',
		'twoHandSlash',
		'oneHandBlunt',
		'twoHandBlunt',
		'piercing',
		'archery',
		'handToHand',
		'dodge',
		'parry',
		'riposte',
		'dualWield',
		'doubleAttack',
		'alteration',
		'conjuration',
		'evocation',
		'skills',
	],
})