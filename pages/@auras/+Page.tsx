import {getPrerenderSlugs} from "../../src/lib/auras";

export { Page }
const all = getPrerenderSlugs()

function Page () {
	return <div>
		Hello I am static auras page
	</div>
}
