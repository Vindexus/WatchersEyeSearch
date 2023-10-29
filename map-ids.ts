/**
 * What is this weird file??
 *
 * You do not need to use this file. I'm leaving it her for posterity.
 *
 * I had started hand-writing all the auras and their mods. I then wrote this script to take some information
 * I copy and pasted from the trade site into here. It then merged that data with what I already had in src/lib/aura.ts
 * and wrote it to a new file. Then I took that code and copy and pasted it over the old declaration code in aura.ts
 */

const fs = require('fs')
// I ran this this file with npx ts-node -O "{\"module\": \"commonjs\"}" map-ids.ts

/* global exports, Map */
/**
 * Calculate similarity between two strings
 * @param {string} str1 First string to match
 * @param {string} str2 Second string to match
 * @param {number} [substringLength=2] Optional. Length of substring to be used in calculating similarity. Default 2.
 * @param {boolean} [caseSensitive=false] Optional. Whether you want to consider case in string matching. Default false;
 * @returns Number between 0 and 1, with 0 being a low match score.
 */
export const stringSimilarity = (str1: string, str2: string, substringLength: number = 2, caseSensitive: boolean = false) => {
	if (!caseSensitive) {
		str1 = str1.toLowerCase();
		str2 = str2.toLowerCase();
	}

	if (str1.length < substringLength || str2.length < substringLength)
		return 0;

	const map = new Map();
	for (let i = 0; i < str1.length - (substringLength - 1); i++) {
		const substr1 = str1.substr(i, substringLength);
		map.set(substr1, map.has(substr1) ? map.get(substr1) + 1 : 1);
	}

	let match = 0;
	for (let j = 0; j < str2.length - (substringLength - 1); j++) {
		const substr2 = str2.substr(j, substringLength);
		const count = map.has(substr2) ? map.get(substr2) : 0;
		if (count > 0) {
			map.set(substr2, count - 1);
			match++;
		}
	}

	return (match * 2) / (str1.length + str2.length - ((substringLength - 1) * 2));
};
export default stringSimilarity;

/**
 * This file is for combining the payload that we see on the PoE trade site with the list of mods selected
 * for that payload.
 * That way we can map the explicit stat ids of each watcher's eye mod to that mod in our data without
 * having to do each one by hand
 * Instead you do the following:
 * Go to the trade site
 * Select every Watcher's Eye mod
 * Open the Network tab
 * Click "Search"
 * Find the request that went out. Copy its payload and past it below
 * Run the javascript listed below and paste its results into the mods variable
 * Run this file with "npx tsc map-ids.ts"
 */

//import {AURAS} from "./src/lib/auras";
const {AURAS} = require('./src/lib/auras')

const query = {
	"query": {
		"status": {
			"option": "online"
		},
		"stats": [
			{
				"type": "count",
				"filters": [
					{
						"id": "explicit.stat_3111519953"
					},
					{
						"id": "explicit.stat_3627458291"
					},
					{
						"id": "explicit.stat_3337107517"
					},
					{
						"id": "explicit.stat_3624529132"
					},
					{
						"id": "explicit.stat_3742808908"
					},
					{
						"id": "explicit.stat_3692646597"
					},
					{
						"id": "explicit.stat_1873457881"
					},
					{
						"id": "explicit.stat_68410701"
					},
					{
						"id": "explicit.stat_2457540491"
					},
					{
						"id": "explicit.stat_3207781478"
					},
					{
						"id": "explicit.stat_2383304564"
					},
					{
						"id": "explicit.stat_380220671"
					},
					{
						"id": "explicit.stat_2831391506"
					},
					{
						"id": "explicit.stat_556659145"
					},
					{
						"id": "explicit.stat_1699077932"
					},
					{
						"id": "explicit.stat_1853636813"
					},
					{
						"id": "explicit.stat_1313498929"
					},
					{
						"id": "explicit.stat_3765507527"
					},
					{
						"id": "explicit.stat_80470845"
					},
					{
						"id": "explicit.stat_991194404"
					},
					{
						"id": "explicit.stat_1016185292"
					},
					{
						"id": "explicit.stat_3332055899"
					},
					{
						"id": "explicit.stat_207635700"
					},
					{
						"id": "explicit.stat_1424006185"
					},
					{
						"id": "explicit.stat_1346311588"
					},
					{
						"id": "explicit.stat_2806391472"
					},
					{
						"id": "explicit.stat_1653848515"
					},
					{
						"id": "explicit.stat_3772841281"
					},
					{
						"id": "explicit.stat_2048747572"
					},
					{
						"id": "explicit.stat_3375743050"
					},
					{
						"id": "explicit.stat_1817023621"
					},
					{
						"id": "explicit.stat_2720072724"
					},
					{
						"id": "explicit.stat_1779027621"
					},
					{
						"id": "explicit.stat_2647344903"
					},
					{
						"id": "explicit.stat_4012281889"
					},
					{
						"id": "explicit.stat_2736708072"
					},
					{
						"id": "explicit.stat_3643449791"
					},
					{
						"id": "explicit.stat_4104891138"
					},
					{
						"id": "explicit.stat_34059570"
					},
					{
						"id": "explicit.stat_3468843137"
					},
					{
						"id": "explicit.stat_1138813382"
					},
					{
						"id": "explicit.stat_65331133"
					},
					{
						"id": "explicit.stat_1710207583"
					},
					{
						"id": "explicit.stat_1722775216"
					},
					{
						"id": "explicit.stat_873224517"
					},
					{
						"id": "explicit.stat_3223142064"
					},
					{
						"id": "explicit.stat_281949611"
					},
					{
						"id": "explicit.stat_254131992"
					},
					{
						"id": "explicit.stat_1567542124"
					},
					{
						"id": "explicit.stat_2567659895"
					},
					{
						"id": "explicit.stat_3357049845"
					},
					{
						"id": "explicit.stat_418293304"
					},
					{
						"id": "explicit.stat_121436064"
					},
					{
						"id": "explicit.stat_1077131949"
					},
					{
						"id": "explicit.stat_2255914633"
					},
					{
						"id": "explicit.stat_2106756686"
					},
					{
						"id": "explicit.stat_2444534954"
					},
					{
						"id": "explicit.stat_2163419452"
					},
					{
						"id": "explicit.stat_2434030180"
					},
					{
						"id": "explicit.stat_214835567"
					},
					{
						"id": "explicit.stat_2091518682"
					},
					{
						"id": "explicit.stat_1919069577"
					},
					{
						"id": "explicit.stat_2731416566"
					},
					{
						"id": "explicit.stat_3371719014"
					},
					{
						"id": "explicit.stat_4173751044"
					},
					{
						"id": "explicit.stat_1011863394"
					},
					{
						"id": "explicit.stat_576528026"
					},
					{
						"id": "explicit.stat_3772848194"
					},
					{
						"id": "explicit.stat_371612541"
					},
					{
						"id": "explicit.stat_1798459983"
					},
					{
						"id": "explicit.stat_3308185931"
					},
					{
						"id": "explicit.stat_1173690938"
					},
					{
						"id": "explicit.stat_3656959867"
					},
					{
						"id": "explicit.stat_4259701244"
					},
					{
						"id": "explicit.stat_362838683"
					},
					{
						"id": "explicit.stat_2690790844"
					},
					{
						"id": "explicit.stat_1165583295"
					}
				],
				"value": {
					"min": 1
				}
			}
		]
	},
	"sort": {
		"price": "asc"
	}
}

/**
 * I got this list of mods from the trade site by running this in the dev console:

const els = document.querySelectorAll('#trade > div.top > div > div.search-bar.search-advanced > div > div.search-advanced-pane.brown > div.filter-group.expanded > div.filter-group-body > div > span.filter-body > div > span');
const names = []
els.forEach((el) => names.push(el.innerText));
console.log(names.join('\n'))

 * Do this on the same page that you get the request up above

 */

const mods = `Damage Penetrates #% Fire Resistance while affected by Anger
+#% to Critical Strike Multiplier while affected by Anger
#% increased Fire Damage while affected by Anger
#% of Physical Damage Converted to Fire Damage while affected by Anger
+# to Armour while affected by Determination
+#% Chance to Block Attack Damage while affected by Determination
#% additional Physical Damage Reduction while affected by Determination
You take #% reduced Extra Damage from Critical Strikes while affected by Determination
#% reduced Reflected Physical Damage taken while affected by Determination
Unaffected by Vulnerability while affected by Determination
#% of Damage taken from Mana before Life while affected by Clarity
#% of Damage taken while affected by Clarity Recouped as Mana
Gain #% of Maximum Mana as Extra Maximum Energy Shield while affected by Clarity
#% increased Mana Recovery Rate while affected by Clarity
#% chance to Recover 10% of Mana when you use a Skill while affected by Clarity
Non-Channelling Skills have +# to Total Mana Cost while affected by Clarity
+#% Chance to Block Spell Damage while affected by Discipline
Gain # Energy Shield per Enemy Hit while affected by Discipline
#% increased Energy Shield Recovery Rate while affected by Discipline
Regenerate #% of Energy Shield per Second while affected by Discipline
#% faster start of Energy Shield Recharge while affected by Discipline
#% increased Cooldown Recovery Rate of Movement Skills used while affected by Haste
Debuffs on you expire #% faster while affected by Haste
You gain Onslaught for # seconds on Kill while affected by Haste
You have Phasing while affected by Haste
Unaffected by Temporal Chains while affected by Haste
Cannot be Blinded while affected by Precision
Gain a Flask Charge when you deal a Critical Strike while affected by Precision
#% increased Attack Damage while affected by Precision
#% increased Attack Speed while affected by Precision
+#% to Critical Strike Multiplier while affected by Precision
Immune to Freeze while affected by Purity of Ice
#% of Physical Damage from Hits taken as Cold Damage while affected by Purity of Ice
Unaffected by Chilled Ground while affected by Purity of Ice
Unaffected by Frostbite while affected by Purity of Ice
+#% to Damage over Time Multiplier while affected by Malevolence
#% increased Recovery rate of Life and Energy Shield while affected by Malevolence
Unaffected by Bleeding while affected by Malevolence
Unaffected by Poison while affected by Malevolence
Damaging Ailments you inflict deal Damage #% faster while affected by Malevolence
+#% to Chaos Resistance while affected by Purity of Elements
#% reduced Reflected Elemental Damage taken while affected by Purity of Elements
#% of Physical Damage from Hits taken as Cold Damage while affected by Purity of Elements
#% of Physical Damage from Hits taken as Fire Damage while affected by Purity of Elements
#% of Physical Damage from Hits taken as Lightning Damage while affected by Purity of Elements
Unaffected by Elemental Weakness while affected by Purity of Elements
Immune to Shock while affected by Purity of Lightning
#% of Physical Damage from Hits taken as Lightning Damage while affected by Purity of Lightning
Unaffected by Conductivity while affected by Purity of Lightning
Unaffected by Shocked Ground while affected by Purity of Lightning
#% increased Critical Strike Chance while affected by Wrath
#% increased Lightning Damage while affected by Wrath
#% of Lightning Damage is Leeched as Energy Shield while affected by Wrath
Damage Penetrates #% Lightning Resistance while affected by Wrath
Gain #% of Physical Damage as Extra Lightning Damage while affected by Wrath
#% of Physical Damage Converted to Lightning Damage while affected by Wrath
#% increased Cast Speed while affected by Zealotry
Effects of Consecrated Ground you create while affected by Zealotry Linger for # seconds
Consecrated Ground you create while affected by Zealotry causes enemies to take #% increased Damage
#% increased Critical Strike Chance against Enemies on Consecrated Ground while affected by Zealotry
Critical Strikes Penetrate #% of Enemy Elemental Resistances while affected by Zealotry
Gain Arcane Surge for 4 seconds when you create Consecrated Ground while affected by Zealotry
#% increased Maximum total Energy Shield Recovery per second from Leech while affected by Zealotry
#% chance to deal Double Damage while using Pride
#% chance to Impale Enemies on Hit with Attacks while using Pride
Impales you inflict last # additional Hits while using Pride
#% increased Physical Damage while using Pride
Your Hits Intimidate Enemies for 4 seconds while you are using Pride
Immune to Ignite while affected by Purity of Fire
#% of Physical Damage from Hits taken as Fire Damage while affected by Purity of Fire
Unaffected by Burning Ground while affected by Purity of Fire
Unaffected by Flammability while affected by Purity of Fire
#% of Damage leeched as Life while affected by Vitality
Gain # Life per Enemy Hit while affected by Vitality
#% increased Life Recovery from Flasks while affected by Vitality
#% increased Life Recovery Rate while affected by Vitality
Regenerate #% of Life per second while affected by Vitality`.split('\n')

const start : Partial<Record<string, number>> = {}
const atlas : Partial<Record<string, number>> = mods.reduce((atl, mod, idx) => {
	const filter = query.query.stats[0].filters[idx]
	console.log('filter', filter)
	const num = filter.id.replace('explicit.stat_', '')
	atl[mod as string] = parseInt(num)
	return atl
}, start)

console.log('atlas', atlas)

// Now we shall create some code from this data
const snippets : string[] = []
AURAS.forEach((aura: any) => {
	const searchedMods = mods.filter(x => x.indexOf(aura.name) >= 0)

	let snippet = `
auras.push({
	key: '${aura.key}',
	name: '${aura.name}',
	stat: '${aura.stat}',
	mods: [
		${aura.mods.map((mod: any) => {
			const sortedSearches = searchedMods.sort((a: string, b: string) => {
				return stringSimilarity(mod.description, a) > stringSimilarity(mod.description, b) ? -1 : 1
			})
			
			const sorted = sortedSearches[0]
		
			console.log(sorted, '===', mod.description)
			
			return `
		newMod('${mod.description}', '${mod.key}', ${mod.stat || atlas[sorted]})`
		}).join(',')}
	]
})
`
	snippets.push(snippet)
})



console.log(snippets.join('\n\n'))

fs.writeFileSync('./aura-snippets.ts', snippets.join('\n\n'))
