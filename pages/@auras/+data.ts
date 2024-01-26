// https://vike.dev/data
import {AURA_NAME_MAP, AURA_SLUG_MAP, AURAS, aurasSlugToAuras, aurasToSlug} from "../../src/lib/auras";
import { redirect } from 'vike/abort'


export { data }
export type Data = ReturnType<typeof data>

import type { PageContextServer } from 'vike/types'
import {oxfordJoin, stringToModMap} from "../../src/lib/helpers";
import {AuraSettingsPut} from "../../src/store/useWatchersEyeStore";

const data = (pageContext: PageContextServer) => {
	const rawSlug = pageContext.routeParams['auras']
	const auras = aurasSlugToAuras(rawSlug)
	const aurasSlug = aurasToSlug(auras)

	console.log('rawSlug', rawSlug)
	console.log('aurasSlug', aurasSlug)

	if (aurasSlug !== rawSlug && aurasSlug) {
		console.log('THROWING')
		throw redirect('/' + aurasSlug)
	}

	let aurasStr = ''
	if (auras.length) {
		aurasStr = oxfordJoin(auras.map(a => a.name))
	}

	const modSettings : AuraSettingsPut = {}
	console.log('auraStr', aurasStr)

	if (pageContext.urlParsed.search) {
		console.log('pageContext.urlParsed.search', pageContext.urlParsed.search)
		Object.keys(pageContext.urlParsed.search).forEach((slug) => {
			console.log('slug from search', slug)
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

	console.log('data got got')

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
