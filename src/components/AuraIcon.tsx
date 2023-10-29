import {Aura} from "@/lib/auras";

type Props = {
	aura: Aura
	className?: string
}
export function AuraIcon ({aura, className = ''}: Props) {
	const filename = aura.name.toString().split(' ').join('-').toLowerCase()
	return <span className={'aura-icon inline-block ' +  className} style={{backgroundImage: `url(/WatchersEyeSearch/auras/${filename}.png`}}>

	</span>
}
