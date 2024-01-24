// https://vike.dev/data
import {AURA_NAME_MAP, AURA_SLUG_MAP, AURAS} from "../../src/lib/auras";
import { redirect } from 'vike/abort'


export { data }
export type Data = ReturnType<typeof data>

import type { PageContextServer } from 'vike/types'
import {oxfordJoin, stringToModMap} from "../../src/lib/helpers";
import {AuraSettingsPut} from "@/store/useWatchersEyeStore";

const data = (pageContext: PageContextServer) => {
	console.log('pageContext.routeParams[\'*\']', pageContext.routeParams['*'])
	const glob = pageContext.routeParams['*']
	console.log('search', pageContext.urlParsed.search)
	const slugs = glob.split('/').filter(x => !!x)
	const slugMap = {}
	const auras = slugs.map((slug) => {
		const aura = AURAS.find(x => x.slug.toLowerCase() === slug.toLowerCase())
		if (!aura) {
			throw redirect('/')
			throw new Error(`Could not find aura with key "${slug}"`)
		}
		slugMap[slug] = true
		return aura
	})


	const slugsPath = '/' + Object.keys(slugMap).sort().join('/')

	if (slugsPath !== glob && slugsPath) {
		throw redirect(slugsPath)
	}

	let aurasStr = ''
	if (auras.length) {
		aurasStr = oxfordJoin(auras.map(a => a.name))
	}

	const modSettings : AuraSettingsPut = {}

	if (pageContext.urlParsed.search) {
		console.log('pageContext.urlParsed.search', pageContext.urlParsed.search)
		Object.keys(pageContext.urlParsed.search).forEach((slug) => {
			if (!AURA_SLUG_MAP[slug]) {
				return
			}

			if (!pageContext.urlParsed.search[slug]) {
				return
			}

			const vals = stringToModMap(pageContext.urlParsed.search[slug])
			modSettings[AURA_SLUG_MAP[slug].name] = vals
		})
	}

	return {
		auras,
		modSettings,
		description: aurasStr ? `Find Watcher's Eye for ${aurasStr} on PoE trade site` : `Tool for finding Watcher's Eyes on PoE trade site`,
		title: aurasStr ? `Watcher's Eye for ${aurasStr} - Trade Search Path of Exile Tool` : `Watcher's Eye Trade Search Tool for Path of Exile`
	}
}

function sleep(milliseconds: number) {
	return new Promise((r) => setTimeout(r, milliseconds))
}
