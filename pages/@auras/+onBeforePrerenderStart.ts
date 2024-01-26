import {getPrerenderSlugs} from "../../src/lib/auras";


export async function onBeforePrerenderStart () {
	const slugs = getPrerenderSlugs()
	console.log(`Found ${slugs.length} routes to prerender`)

	slugs.splice(10)

	return slugs.map(x => '/' + x)
}
