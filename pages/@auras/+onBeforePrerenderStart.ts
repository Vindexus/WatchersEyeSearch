import {getPrerenderSlugs} from "../../src/lib/auras";


export async function onBeforePrerenderStart () {
	const slugs = getPrerenderSlugs()
	console.log(`
	Prerendering ${slugs.length} slugs
	`);
	return slugs.map(x => '/' + x)
}
