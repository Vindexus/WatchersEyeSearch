import {
	AuraSettings,
	AuraSettingsPut,
	createWatchersEyeStore,
	selModWeightURLSearchParams,
	selTradeLink,
	WatchersEyeContext
} from "../../src/store/useWatchersEyeStore";
import {AuraIcon} from "../../src/components/AuraIcon";
import {useContext, useEffect, useRef} from "react";
import {useData} from "../../renderer/useData";
import type {Data} from './+data'
import {useStore} from 'zustand'
import {Aura, AURA_SLUG_MAP, aurasToSlug} from "../../src/lib/auras";
import {stringToModMap} from "../../src/lib/helpers";


const CSS = {
	card: 'w-full bg-gray-800 border border-gray-800 shadow-lg rounded-2xl p-4 mb-2',
}

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

export const PageInner = () => {
	const store = useContext(WatchersEyeContext)
	if (!store) throw new Error('Missing WatchersEyeContext.Provider in the tree')

	const selected = useStore(store, state => state.auraSettings.filter(x => x.enabled))
	const numSelected = selected.length
	const tradeLink = useStore(store, selTradeLink)
	const urlChangeRef = useRef<NodeJS.Timeout>()
	const toggleAuraMods = useStore(store, s => s.toggleAuraMods)
	const setModEnabled = useStore(store, s => s.setModEnabled)
	const setModWeight = useStore(store, s => s.setModWeight)
	const setAuraSettings = useStore(store, s => s.setAuraSettings)
	const loadedSearchParamsRef = useRef(false)

	useEffect(() => {
		console.log('tradeLink', tradeLink)
		const url = selModWeightURLSearchParams(store.getState())

		// This timeout is for when people use the ranges to change the weights. Don't want to add
		// every single number they slide between to their history
		clearTimeout(urlChangeRef.current)
		urlChangeRef.current = setTimeout(() => {
			const location = window.location
			console.log('location', location)
			const path = location.pathname
			if (!loadedSearchParamsRef.current) {
				window.history.pushState(null, '', path+'?' + url)
			}
			else {
				loadedSearchParamsRef.current = true
				window.history.replaceState(null, '', path+'?' + url)
			}
		}, 300)
	}, [tradeLink, numSelected])

	const auraNames = selected.map(x => x.aura.name).join('+')
	useEffect(() => {
		if (selected.length === 0) {
			//document.title = titleRef.current
			return
		}

		//document.title = auraNames + ' ' + titleRef.current
	}, [auraNames])

	useEffect(() => {
		function onChange () {
			const currentPageUrl = window.location.toString() // TODO: update for vike document.location.toString()
			const params = new URL(currentPageUrl).searchParams
			const settingsPut: AuraSettingsPut = {}
			params.forEach((val, slug) => {
				const aura = AURA_SLUG_MAP[slug]
				if (!aura) {
					return
				}

				if (slug === '_') {
					return
				}

				settingsPut[aura.name] = {}

				const modSettings = stringToModMap(val)
				//setModWeight(aura.name, key, weightI)
				Object.keys(modSettings).forEach((modKey) => {
					setModWeight(aura.name, modKey, modSettings[modKey])
				})
			})
		}

		onChange()
		window.addEventListener('popstate', onChange)

		return () => {
			window.removeEventListener('popstate', onChange)
		}
	}, [])

	const currentState = store.getState()

	function getAuraToggleURL (as: AuraSettings) {
		let linkAuras : Aura[]
		let exclude : string = ''
		if (as.enabled) {
			exclude = as.aura.slug
			linkAuras = selected.filter(x => x !== as.aura.slug).map(a => a.aura)
		}
		else {
			linkAuras = [...selected.map(a => a.aura), as.aura]
		}

		const href = '/' + aurasToSlug(linkAuras)

		if (!store) {
			return href
		}

		const search = selModWeightURLSearchParams(store.getState(), exclude)

		return href + '?' + search
	}

	return (
		<>
			<div className="max-w-screen-md w-full m-4">
				<div>
					<h1 className={'text-center text-xl text-white mb-4'}>Watcher's Eye Search</h1>
				</div>
				<div className={CSS.card}>
					<div className={'w-full flex flex-wrap items-center justify-center'}>
						{currentState.auraSettings.map((a) => {
							const isSelected = a.enabled
							const cls = isSelected ? 'bg-teal-800 border border-teal-900 text-white' : 'bg-gray-900 border border-gray-600 text-gray hover:text-white'

							return <a key={a.aura.name}
												data-key={a.aura.name}
												href={getAuraToggleURL(a)}
												className={cls+ ` transition-all hover:border-gray-700 font-bold py-2 px-4 rounded m-2 flex`}
								/*onClick={() => {
									store.toggleAura(a.key)
								}}*/
							>
								<AuraIcon aura={a.aura} className={'me-2 transition-all ' + (isSelected ? 'opacity-100' : 'opacity-70')} />
								<span>
									{a.aura.name}
								</span>
							</a>
						})}
					</div>
				</div>
				<div className={'overflow-hidden transition-all'} style={{maxHeight: numSelected === 0 ? '2000px' : '0px'}}>
					<div className={CSS.card + ' text-center'}>
						{!numSelected && 'Pick some auras to get started.'}
					</div>
				</div>
				<div className={'overflow-hidden'}>
					{store.getState().auraSettings.map((as) => {
						const aura = as.aura
						const enabled = as.enabled
						const href = getAuraToggleURL(as)
						return <section key={as.aura.name}
														className={'overflow-hidden duration-1000 transition-all ease-in-out ' + (!enabled ? 'opacity-70' : ('opacity-100 '))}
														style={{
															maxHeight: enabled ? `2000px` : '0px',
															transform: `translateY(${enabled ? 0 : -2000}px)`
														}}
						>
							<div className={CSS.card}>
								<div className={'flex items-center justify-between'}>
									<h3 className={'font-bold text-lg mb-2'}>
										{aura.name}
										<a
											href={href}
											className={'ms-2 text-xs py-1 px-2 border border-gray-600 rounded text-gray-500 hover:text-gray-400 hover:border-gray-400'}>
											X
										</a>
									</h3>
									<button
										type={'button'}
										onClick={() => {
											toggleAuraMods(aura.name)
										}}
										className={'text-xs py-1 px-2 border border-gray-600 rounded text-gray-500 hover:text-gray-400 hover:border-gray-400'}>
										Toggle All
									</button>
								</div>
								{as.mods.map((mod) => {
									return <div key={mod.mod.key} className={'mb-4 transition-all ' + (mod.enabled ? 'opacity-100' : 'opacity-50')}>
										<label className={'w-full flex items-center'}>
											<input
												type={'checkbox'}
												onChange={(e) => {
													setModEnabled(as.aura.name, mod.mod.key, e.target.checked)
												}}
												checked={mod.enabled}
												className={'me-1 mt-1'}
											/>
											<span>
												{mod.mod.description}
											</span>
										</label>
										<div className={'join flex align-center items-center transition-all overflow-hidden ' + (mod.enabled ? 'h-6' : 'h-0')}>
											<span className={'text-gray-500 text-xs me-2'}>Weight</span>
											<input
												type="range"
												min={1}
												max={100}
												value={mod.weight}
												onChange={(e) => {
													console.log('value', e.target.value)
													setModWeight(as.aura.name, mod.mod.key, parseInt(e.target.value))
												}}
												className="join-item w-full h-2 animated bg-gray-200 rounded-lg appearance-none cursor-pointer bg-gray-600"
											/>
											<div className={'join-item w-12 p-1 text-right'}>
												{mod.weight}%
											</div>
										</div>
									</div>
								})}
							</div>
						</section>
					})}
				</div>
			</div>
			<div className={'pt-16'}></div>
			<div className={'fixed bottom-0 w-full bg-gray-700 border border-gray-800 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] w-full flex justify-center'}>
				<div className={'max-w-screen-md w-full p-4 flex justify-between items-center'}>
					<a href={tradeLink || ''} target={'_blank'} className={'font-bold py-2 px-4 rounded  bg-teal-700 text-white ' + (!tradeLink ? 'opacity-25 cursor-no-drop' : 'hover:bg-teal-600')}>
						Open Trade Link
					</a>
					<a href='https://ko-fi.com/D1D8QMSKH' target='_blank'>
						<img height='36' style={{border: '0px', 'height':'36px'}} src='https://storage.ko-fi.com/cdn/kofi1.png?v=3' alt='Buy Me a Coffee at ko-fi.com' />
					</a>
				</div>
			</div>
		</>
	);
};

export { Page };
