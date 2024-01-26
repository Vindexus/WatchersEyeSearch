import {AURAS} from "../../src/lib/auras";

export async function onBeforePrerenderStart () {
	return null

	const routes = AURAS.map(a => {
		return '/'+ a.slug
	})
	console.log('routes! in index !!', routes)
	return routes
}
