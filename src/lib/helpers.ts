import {AuraSettings} from "../store/useWatchersEyeStore";

export function oxfordJoin (list: (string | number)[], ending: string = ' and') : string {
	if (list.length === 0) {
		return '[empty list]'
	}
	const copy = [...list]
	const last = copy.pop()
	if (!last) {
		return ''
	}
	if (copy.length === 0 && last) {
		return last.toString()
	}
	let str = copy.join(', ')
	if (last && str) {
		str += ending + ', ' + last
	}
	return str
}

export function toTitleCase (str: string) : string {
	return str.substring(0,1).toUpperCase() + str.substring(1)
}

export function auraSettingToModListString (as: AuraSettings) : string {
	if (as.mods.every(m => m.weight === 50)) {
		return '_'
	}
	const strings = as.mods.reduce((mods, mod) => {
		if (!mod.enabled) {
			return mods
		}

		mods.push(mod.mod.key + mod.weight.toString())
		return mods
	}, [] as string[])
	return strings.length > 0 ? strings.join('') : '_'
}

export function stringToModMap (val: string) : Record<string, number> {
	if (val === '_' || !val) {
		return {}
	}
	const match = val.match(/([a-z]+)([0-9]+)/g)
	const map : Record<string, number> = {}
	if (!match) {
		return map
	}
	match.forEach((m) => {
		const key = m.replace(/[0-9]+/, '')
		const number = parseInt(m.replace(/[a-z]+/, ''))
		map[key] = number
	})
	return map
}
