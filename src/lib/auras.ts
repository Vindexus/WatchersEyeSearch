import {toTitleCase} from "./helpers";
console.log('toTitleCase', toTitleCase)

export type AuraName = 'Anger' |
'Clarity' |
'Determination' |
'Discipline' |
'Grace' |
'Haste' |
'Hatred' |
'Malevolence' |
'Precision' |
'Pride' |
'Purity of Elements' |
'Purity of Fire' |
'Purity of Ice' |
'Purity of Lightning' |
'Vitality' |
'Wrath' |
'Zealotry'


type AuraDef = {
	name: AuraName
	mods: Mod[]
	stat: 'dex' | 'int' | 'str'
}

export type Aura = AuraDef & {
	slug: string
}

export type Mod = {
	stat: number
	key: string
	description: string
	minVal: number
	maxVal: number
	flipped?: boolean // For the negative ones like Clarity mana cost? I dunno
}

function getRange (str: string) : [number, number] {
	const numbers = str.replace('(', '').replace(')', '').split('-').map(x => new Number(x))

	return numbers as [number, number]
}

/**
 * We change the final weight number we send to PoE to account for mods with vastly different ranges
 * PoE multiplies by the numeric value for weighting, not by how good the roll is
 * 		IE: Assuming "weight' is given to PoE trade as 1.
 * 		A +1-2 crit chance mod that rolls max (2) would have a weight of 2
 * 		A mod that rolls from 5-2000 and rolls	minimum (5) would have a weight of 5.
 * 		If it rolls 2000 its weight would be 2000
 * This isn't desirable because we want to sort by how well the stat rolled IN ITS RANGE, not just
 * how high its raw number is
 *
 * This function takes in the weight the user has selected on our site, and ensures that most middle
 * roll of the stat gives a weight of 50. I wanted the weight to always be a number from 1-100 but I'm
 * not sure how to do that?
 */
export function getModNormalizedWeight (mod: Mod, weight: number) : number {
	const targetAvgRollWeight = 50
	const avgRoll = (mod.minVal + mod.maxVal) / 2
	const mult = targetAvgRollWeight / avgRoll

	return mult * (weight/100)
}

function newMod (description: string, key: string, stat: number) : Mod {
	const matches = description.match(/(\([0-9\.]+\-[0-9\.]+\))+/g)

	let minVal = 0
	let maxVal = 0
	// Mods like 'Unaffected by Enfeeble' don't have ranges
	if (!matches || description.indexOf('(') === -1) {
		minVal = 1
		maxVal = 1
	}
	else if (matches.length === 1) {
		[minVal, maxVal] = getRange(matches![0])
	}
	else if (matches.length === 2) {
		const [lowMin, lowMax] = getRange(matches![0])
		const [highMin, highMax] = getRange(matches![1])
		minVal = (lowMin + highMin) / 2
		maxVal = (lowMax + highMax) / 2
	}
	else {
		throw new Error("Does not look like an actual mod")
	}

	return {
		description,
		key,
		stat,
		minVal,
		maxVal,
	}
}



let auraDefs : AuraDef[] = []

auraDefs.push({
	name: 'Anger',
	stat: 'str',
	mods: [
		newMod('(1-1.5)% of Fire Damage Leeched as Life while affected by Anger', 'l', 2312747856),
		newMod('Damage Penetrates (10-15)% Fire Resistance while affected by Anger', 'p', 3111519953),
		newMod('+(30-50)% to Critical Strike Multiplier while affected by Anger', 'm', 3627458291),
		newMod('(40-60)% increased Fire Damage while affected by Anger', 'i', 3337107517),
		newMod('Gain (15-25)% of Physical Damage as Extra Fire Damage while affected by Anger', 'g', 3624529132),
		newMod('(25-40)% of Physical Damage Converted to Fire Damage while affected by Anger', 'c', 3624529132)
	]
})

auraDefs.push({
	name: 'Determination',
	stat: 'str',
	mods: [
		newMod('+(600-1000) to Armour while affected by Determination', 'a', 3742808908),
		newMod('+(5-8)% Chance to Block Attack Damage while affected by Determination', 'b', 3692646597),
		newMod('(5-8)% additional Physical Damage Reduction while affected by Determination', 'p', 1873457881),
		newMod('You take (60-40)% reduced Extra Damage from Critical Strikes while affected by Determination', 'c', 68410701),
		newMod('(50-40)% reduced Reflected Physical Damage taken while affected by Determination', 'r', 2457540491),
		newMod('Unaffected by Vulnerability while affected by Determination', 'v', 3207781478)
	]
})

auraDefs.push({
	name: 'Pride',
	stat: 'str',
	mods: [
		newMod('(8-12)% chance to deal Double Damage while using Pride', 'd', 3371719014),
		newMod('25% chance to Impale Enemies on Hit with Attacks while using Pride', 'im', 4173751044),
		newMod('Impales you inflict last 2 additional Hits while using Pride', 'h', 1011863394),
		newMod('(40-60)% increased Physical Damage while using Pride', 'p', 576528026),
		newMod('Your Hits Intimidate Enemies for 4 seconds while you are using Pride', 'in', 3772848194)
	]
})

auraDefs.push({
	name: 'Purity of Fire',
	stat: 'str',
	mods: [
		newMod('Immune to Ignite while affected by Purity of Fire', 'i', 371612541),
		newMod('(6-10)% of Physical Damage from Hits taken as Fire Damage while affected by Purity of Fire', 'p', 1798459983),
		newMod('Unaffected by Burning Ground while affected by Purity of Fire', 'b', 3308185931),
		newMod('Unaffected by Flammability while affected by Purity of Fire', 'f', 1173690938)
	]
})

auraDefs.push({
	name: 'Vitality',
	stat: 'str',
	mods: [
		newMod('(0.8-1.2)% of Damage leeched as Life while affected by Vitality', 'l', 3656959867),
		newMod('Gain (20-30) Life per Enemy Hit while affected by Vitality', 'h', 4259701244),
		newMod('(50-70)% increased Life Recovery from Flasks while affected by Vitality', 'f', 362838683),
		newMod('(10-15)% increased Life Recovery Rate while affected by Vitality', 'rc', 2690790844),
		newMod('Regenerate (1-1.5)% of Life per second while affected by Vitality', 'rg', 1165583295)
	]
})

auraDefs.push({
	name: 'Grace',
	stat: 'dex',
	mods: [
		newMod('+(5-8)% chance to Evade Attack Hits while affected by Grace', 'e', 969576725),
		newMod('(30-50)% chance to Blind Enemies which Hit you while affected by Grace', 'b', 2548097895),
		newMod('+(12-15)% chance to Suppress Spell Damage while affected by Grace', 's', 4071658793),
		newMod('(10-15)% increased Movement Speed while affected by Grace', 'm', 3329402420),
		newMod('Unaffected by Enfeeble while affected by Grace', 'u', 2365917222)
	]
})

auraDefs.push({
	name: 'Haste',
	stat: 'dex',
	mods: [
		newMod('(30-50)% increased Cooldown Recovery Rate of Movement Skills used while affected by Haste', 'c', 3332055899),
		newMod('Debuffs on you expire (20-15)% faster while affected by Haste', 'x', 207635700),
		newMod('You gain Onslaught for 4 seconds on Kill while affected by Haste', 'o', 1424006185),
		newMod('You have Phasing while affected by Haste', 'p', 1346311588),
		newMod('Unaffected by Temporal Chains while affected by Haste', 't', 2806391472)
	]
})

auraDefs.push({
	name: 'Hatred',
	stat: 'dex',
	mods: [
		newMod('(40-60)% increased Cold Damage while affected by Hatred', 'i', 1413864591),
		newMod('(25-40)% of Physical Damage Converted to Cold Damage while affected by Hatred', 'ph', 664849247),
		newMod('Adds (58-70) to (88-104) Cold Damage while affected by Hatred', 'a', 2643562209),
		newMod('Damage Penetrates (10-15)% Cold Resistance while affected by Hatred', 'pe', 1222888897),
		newMod('+(1.2-1.8)% to Critical Strike Chance while affected by Hatred', 'c', 2753985507)
	]
})

auraDefs.push({
	name: 'Precision',
	stat: 'dex',
	mods: [
		newMod('Cannot be Blinded while affected by Precision', 'b', 1653848515),
		newMod('Gain a Flask Charge when you deal a Critical Strike while affected by Precision', 'f', 3772841281),
		newMod('(40-60)% increased Attack Damage while affected by Precision', 'd', 2048747572),
		newMod('(10-15)% increased Attack Speed while affected by Precision', 's', 3375743050),
		newMod('+(20-30)% to Critical Strike Multiplier while affected by Precision', 'm', 1817023621)
	]
})

auraDefs.push({
	name: 'Purity of Ice',
	stat: 'dex',
	mods: [
		newMod('Immune to Freeze while affected by Purity of Ice', 'i', 2720072724),
		newMod('(6-10)% of Physical Damage from Hits taken as Cold Damage while affected by Purity of Ice', 'p', 1779027621),
		newMod('Unaffected by Chilled Ground while affected by Purity of Ice', 'c', 2647344903),
		newMod('Unaffected by Frostbite while affected by Purity of Ice', 'f', 4012281889)
	]
})

auraDefs.push({
	name: 'Clarity',
	stat: 'int',
	mods: [
		newMod('(6-10)% of Damage taken from Mana before Life while affected by Clarity', 'l', 2383304564),
		newMod('(15-20)% of Damage taken while affected by Clarity Recouped as Mana', 'rm', 380220671),
		newMod('Gain (6-10)% of Maximum Mana as Extra Maximum Energy Shield while affected by Clarity', 'e', 2831391506),
		newMod('(10-15)% increased Mana Recovery Rate while affected by Clarity', 'rr', 556659145),
		newMod('(10-15)% chance to Recover 10% of Mana when you use a Skill while affected by Clarity', 'rs', 1699077932),
		newMod('Non-Channelling Skills have -(10-5) to Total Mana Cost while affected by Clarity', 'mc', 1853636813)
	]
})

auraDefs.push({
	name: 'Discipline',
	stat: 'int',
	mods: [
		newMod('+(5-8)% Chance to Block Spell Damage while affected by Discipline', 'b', 1313498929),
		newMod('Gain (20-30) Energy Shield per Enemy Hit while affected by Discipline', 'h', 3765507527),
		newMod('(10-15)% increased Energy Shield Recovery Rate while affected by Discipline', 'ra', 80470845),
		newMod('Regenerate (1.5-2.5)% of Energy Shield per Second while affected by Discipline', 're', 991194404),
		newMod('(30-40)% faster start of Energy Shield Recharge while affected by Discipline', 's', 1016185292)
	]
})

auraDefs.push({
	name: 'Malevolence',
	stat: 'int',
	mods: [
		newMod('+(18-22)% to Damage over Time Multiplier while affected by Malevolence', 'd', 2736708072),
		newMod('(8-12)% increased Recovery rate of Life and Energy Shield while affected by Malevolence', 'r', 3643449791),
		newMod('Unaffected by Bleeding while affected by Malevolence', 'b', 4104891138),
		newMod('Unaffected by Poison while affected by Malevolence', 'p', 34059570),
		newMod('Damaging Ailments you inflict deal Damage (10-15)% faster while affected by Malevolence', 'a', 3468843137)
	]
})

auraDefs.push({
	name: 'Purity of Elements',
	stat: 'int',
	mods: [
		newMod('+(30-50)% to Chaos Resistance while affected by Purity of Elements', 'cr', 1138813382),
		newMod('(50-40)% reduced Reflected Elemental Damage taken while affected by Purity of Elements', 'r', 65331133),
		newMod('(8-12)% of Physical Damage from Hits taken as Cold Damage while affected by Purity of Elements', 'c', 1710207583),
		newMod('(8-12)% of Physical Damage from Hits taken as Fire Damage while affected by Purity of Elements', 'f', 1722775216),
		newMod('(8-12)% of Physical Damage from Hits taken as Lightning Damage while affected by Purity of Elements', 'l', 873224517),
		newMod('Unaffected by Elemental Weakness while affected by Purity of Elements', 'ew', 3223142064)
	]
})

auraDefs.push({
	name: 'Purity of Lightning',
	stat: 'int',
	mods: [
		newMod('Immune to Shock while affected by Purity of Lightning', 's', 281949611),
		newMod('(6-10)% of Physical Damage from Hits taken as Lightning Damage while affected by Purity of Lightning', 'p', 254131992),
		newMod('Unaffected by Conductivity while affected by Purity of Lightning', 'c', 1567542124),
		newMod('Unaffected by Shocked Ground while affected by Purity of Lightning', 'g', 2567659895)
	]
})

auraDefs.push({
	name: 'Wrath',
	stat: 'int',
	mods: [
		newMod('(70-100)% increased Critical Strike Chance while affected by Wrath', 'c', 3357049845),
		newMod('(40-60)% increased Lightning Damage while affected by Wrath', 'd', 418293304),
		newMod('(1-1.5)% of Lightning Damage is Leeched as Energy Shield while affected by Wrath', 'l', 121436064),
		newMod('Damage Penetrates (10-15)% Lightning Resistance while affected by Wrath', 'p', 1077131949),
		newMod('Gain (15-25)% of Physical Damage as Extra Lightning Damage while affected by Wrath', 'x', 2255914633),
		newMod('(25-40)% of Physical Damage Converted to Lightning Damage while affected by Wrath', 'ph', 2106756686)
	]
})

auraDefs.push({
	name: 'Zealotry',
	stat: 'int',
	mods: [
		newMod('(10-15)% increased Cast Speed while affected by Zealotry', 'cs', 2444534954),
		newMod('Effects of Consecrated Ground you create while affected by Zealotry Linger for 2 seconds', 'g', 2163419452),
		newMod('Consecrated Ground you create while affected by Zealotry causes enemies to take (8-10)% increased Damage', 'i', 2434030180),
		newMod('(100-120)% increased Critical Strike Chance against Enemies on Consecrated Ground while affected by Zealotry', 'cg', 214835567),
		newMod('Critical Strikes Penetrate (8-10)% of Enemy Elemental Resistances while affected by Zealotry', 'p', 2091518682),
		newMod('Gain Arcane Surge for 4 seconds when you create Consecrated Ground while affected by Zealotry', 'a', 1919069577),
		newMod('30% increased Maximum total Energy Shield Recovery per second from Leech while affected by Zealotry', 'r', 2731416566)
	]
})

export const AURAS : Aura[] = auraDefs.sort((a, b) => {
	if (a.stat === b.stat) {
		return a.name < b.name ? -1 : 1
	}

	if (a.stat === 'str') {
		return -1
	}

	if (b.stat === 'str') {
		return 1
	}

	return a.stat < b.stat ? -1 : 1
}).map((def) => {
	return {
		...def,
		slug: def.name.split(' ').map(x => toTitleCase(x)).join('')
	}
})

const auraModKeys : Partial<Record<string, string[]>> = {}

export const AURA_SLUG_MAP : Record<string, Aura> = AURAS.reduce((map: Record<string, Aura>, aura) => {
	map[aura.slug] = aura
	return map
}, {})

export const AURA_NAME_MAP : Partial<Record<AuraName, Aura>> = AURAS.reduce((map, aura) => {
	map[aura.name] = aura
	auraModKeys[aura.name] = []
	aura.mods.forEach((m) => {
		if (auraModKeys[aura.name]?.includes(m.key)) {
			console.warn(`Aura ${aura.name} has more than one mod with key "${m.key}"`)
		}
		auraModKeys[aura.name]!.push(m.key)
	})
	return map
}, {} as Partial<Record<AuraName, Aura>>)


export function aurasSlugToAuras (slug: string) : Aura[] {
	const slugs = slug.split('-').filter(x => !!x)
	console.log('slugs', slugs)
	const slugMap : Record<string, boolean> = {}
	slugs.forEach((slug) => {
		const aura = AURAS.find(x => x.slug.toLowerCase() === slug.toLowerCase())
		if (aura) {
			slugMap[aura.slug] = true
		}
	})

	const sortedKeys = Object.keys(slugMap).sort()
	console.log('sorted keys', sortedKeys)

	return sortedKeys.map(slug => AURA_SLUG_MAP[slug])
}

export function aurasToSlug (auras: Aura[]) : string {
	return auras.slice().sort((a,b) => {
		return a.slug < b.slug ? -1 : 1
	}).map(a => a.slug).join('-')
}

function getPagesWithAddedAura (pages: string[][], auraSlug: string) : string[][] {
	const newPages : string[][] = [
	]
	pages.forEach((auraSlugs) => {
		if (!auraSlugs.includes(auraSlug) && auraSlugs.length <= 2) {
			newPages.push([...auraSlugs, auraSlug].sort())
		}
	})
	newPages.push([auraSlug])
	return pages.concat(newPages)
}

export function getPrerenderSlugs () : string[] {
	let starting : string[][] = []
	AURAS.forEach((aura, i) => {
		if (i >= 12) {
			return
		}
		starting = getPagesWithAddedAura(starting, aura.slug)
	})
	return starting.map(x => x.join('-')).sort()
}
