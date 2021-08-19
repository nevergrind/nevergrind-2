// primitives
const MAX_HERO_LEVEL = 50
const MAX_WIDTH = 1920
const MAX_HEIGHT = 1080
const ASPECT_RATIO = MAX_WIDTH / MAX_HEIGHT
const PARALYZE_RATE = .5
const RESIST_CAP = 100
const EMPTY_OBJECT = {}
const HALLWAY_WIDTH = 16
const HALLWAY_LENGTH = 100
const MAX_GOLD = 4294967295

const POTION_COOLDOWN = 15
const MAX_SKILL_LEVEL = 7

// non-primitives
const HybridJobs = [JOB.CRUSADER, JOB.SHADOW_KNIGHT, JOB.RANGER]
const ShiftKeyFalse = { shiftKey: false }

const ANIMATE_CANDLE = RoughEase.ease.config({
	template: Power0.easeOut,
	strength: 3,
	points: 50,
	taper: 'both',
	randomize: true,
	clamp: true
})