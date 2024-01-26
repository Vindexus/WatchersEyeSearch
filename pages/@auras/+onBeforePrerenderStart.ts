import {getPrerenderSlugs} from "../../src/lib/auras";


export async function onBeforePrerenderStart () {
	const slugs = getPrerenderSlugs()
	console.log(`Found ${slugs.length} routes to prerender`)

	return slugs.map(x => '/' + x)
}
