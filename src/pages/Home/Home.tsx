import useWatchersEyeStore, {AuraSettingsPut, selTradeLink} from "@/store/useWatchersEyeStore";
import {AuraIcon} from "@/components/AuraIcon";
import {useEffect, useRef, useState} from "react";
import {AURA_MAP, AuraKey} from "@/lib/auras";

const CSS = {
	card: 'w-full bg-gray-800 border border-gray-800 shadow-lg rounded-2xl p-4 mb-2',
}


const Home = () => {
	const store = useWatchersEyeStore()
	const selected = useWatchersEyeStore(state => state.auraSettings.filter(x => x.enabled))
	const numSelected = selected.length
	const tradeLink = useWatchersEyeStore(selTradeLink)
	const [loadedURL, setLoadedURL] = useState(false)
	const urlChangeRef = useRef<NodeJS.Timeout>()
	const titleRef = useRef(document.title)

	useEffect(() => {
		if (!loadedURL) {
			console.log("don't update until the URL has been used to populate")
			return
		}
		const query = store.auraSettings.reduce((obj: any, as) => {
			if (!as.enabled) {
				return obj
			}
			obj[as.key] = as.mods.reduce((mods, mod) => {
				if (!mod.enabled) {
					return mods
				}

				mods.push(mod.mod.key + '-' + mod.weight)
				return mods
			}, [] as string[])
			return obj
		}, {})

		const url = new URLSearchParams()
		Object.keys(query).forEach((auraKey) => {
			url.set(auraKey, query[auraKey].length ? query[auraKey].sort().join('_') : '_')
		})

		// This timeout is for when people use the ranges to change the weights. Don't want to add
		// every single number they slide between to their history
		clearTimeout(urlChangeRef.current)
		urlChangeRef.current = setTimeout(() => {
			window.history.replaceState(null, '', '?' + url.toString())
		}, 300)
	}, [loadedURL, tradeLink, numSelected])

	const auraNames = selected.map(x => x.aura.name).join('+')
	useEffect(() => {
		if (selected.length === 0) {
			document.title = titleRef.current
			return
		}

		document.title = auraNames + ' ' + titleRef.current
	}, [auraNames])

	useEffect(() => {
		function onChange () {
			const params = new URL(document.location.toString()).searchParams
			const settingsPut: AuraSettingsPut = {}
			params.forEach((val, k) => {
				const auraKey = k as AuraKey
				const aura = AURA_MAP[auraKey]
				if (!aura) {
					return
				}

				//
				if (val === '_') {
					return
				}

				settingsPut[auraKey] = {}

				const modSettings = val.split('_')
				modSettings.forEach((set) => {
					const [key, weight] = set.split('-')
					settingsPut[auraKey]![key] = parseInt(weight)
				})
			})

			store.setAuraSettings(settingsPut)
			setLoadedURL(true)
		}

		onChange()
		window.addEventListener('popstate', onChange)

		return () => {
			window.removeEventListener('popstate', onChange)
		}
	}, [])

  return (
		<>
			<div className="max-w-screen-md w-full m-4">
				<div>
					<h1 className={'text-center text-xl text-white mb-4'}>Watcher's Eye Search</h1>
				</div>
				<div className={CSS.card}>
					<div className={'w-full flex flex-wrap items-center justify-center'}>
						{store.auraSettings.map((a) => {
							const selected = a.enabled
							const cls = selected ? 'bg-teal-800 border border-teal-900 text-white' : 'bg-gray-900 border border-gray-600 text-gray hover:text-white'
							return <button key={a.key}
								type={'button'}
								className={cls+ ` transition-all hover:border-gray-700 font-bold py-2 px-4 rounded m-2 flex`}
								onClick={() => {
									store.toggleAura(a.key)
								}}
							>
								<AuraIcon aura={a.aura} className={'me-2 transition-all ' + (selected ? 'opacity-100' : 'opacity-70')} />
								<span>
									{a.aura.name}
								</span>
							</button>
						})}
					</div>
				</div>
				<div className={'overflow-hidden transition-all'} style={{maxHeight: numSelected === 0 ? '2000px' : '0px'}}>
					<div className={CSS.card + ' text-center'}>
						{!numSelected && 'Pick some auras to get started.'}
					</div>
				</div>
				<div className={'overflow-hidden'}>
					{store.auraSettings.map((as) => {
					const aura = as.aura
					const enabled = as.enabled
					return <section key={as.key}
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
									<button
										type={'button'}
										onClick={() => {
											store.toggleAura(aura.key)
										}}
										className={'ms-2 text-xs py-1 px-2 border border-gray-600 rounded text-gray-500 hover:text-gray-400 hover:border-gray-400'}>
										X
									</button>
								</h3>
								<button
									type={'button'}
									onClick={() => {
										store.toggleAuraMods(aura.key)
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
												store.setModEnabled(as.key, mod.mod.key, e.target.checked)
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
												store.setModWeight(as.key, mod.mod.key, parseInt(e.target.value))
											}}
											className="join-item w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer bg-gray-600"
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

export default Home;
