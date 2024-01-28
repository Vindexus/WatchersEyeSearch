import {createWatchersEyeStore, WatchersEyeContext} from "../../src/store/useWatchersEyeStore";
import {useRef} from "react";
import {useData} from "../../renderer/useData";
import type {Data} from './+data'
import {PageInner} from "./PageInner";


const Page = () => {
	const data = useData<Data>()
	const store = useRef(createWatchersEyeStore({
		auras: data.auras.map(x => x.name),
		modSettings: data.modSettings,
	})).current


	return <WatchersEyeContext.Provider value={store}>
		<PageInner />
	</WatchersEyeContext.Provider>
}

export { Page };
