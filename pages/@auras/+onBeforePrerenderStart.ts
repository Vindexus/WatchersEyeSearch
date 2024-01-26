import {getPrerenderSlugs} from "../../src/lib/auras";


export async function onBeforePrerenderStart () {
	const slugs = getPrerenderSlugs()

	return slugs.map(x => '/' + x)
}
