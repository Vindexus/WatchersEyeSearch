import {PageInner} from "../@auras/+Page";
import {useRef} from "react";
import {createWatchersEyeStore, WatchersEyeContext} from "../../src/store/useWatchersEyeStore";

export { Page }

function Page () {
	const store = useRef(createWatchersEyeStore({
		auras: [],
		modSettings: {},
	})).current


	return <WatchersEyeContext.Provider value={store}>
		<PageInner />
	</WatchersEyeContext.Provider>
}
