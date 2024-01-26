import {create, createStore} from 'zustand';
import {logger} from './logger';
import {createContext} from 'react'
import {Aura, AuraName, AURAS, getModNormalizedWeight, Mod} from "../lib/auras";
import {auraSettingToModListString} from "../lib/helpers";

type ModSettings = {
	mod: Mod
	weight: number
	enabled: boolean
}

export type AuraSettings = {
	enabled: boolean
	aura: Aura
	mods: ModSettings[]
}

type AuraModWeights = Record<string, number>

export type AuraSettingsPut = Partial<Record<AuraName, AuraModWeights>>

interface WatchersEyeSearchState {
	auraSettings: AuraSettings[],
}

export interface WatchersEyeSearchStore extends WatchersEyeSearchState {
  toggleAura: (name: AuraName) => void
	setModWeight: (aname: AuraName, modKey: string, value: number) => void
	setModEnabled: (aname: AuraName, modKey: string, value: boolean) => void
	toggleAuraMods: (name: AuraName) => void
	setAuraSettings: (s: AuraSettingsPut) => void
}

const initialState = (opts: WatchersEyeInitialProps) : Pick<WatchersEyeSearchStore, keyof WatchersEyeSearchState> => {
	return {
		auraSettings: AURAS.map((aura) : AuraSettings => {
			const modSettings = opts.modSettings[aura.name] || {}
			const settings : AuraSettings = {
				enabled: opts.auras.includes(aura.name),
				aura: aura,
				mods: aura.mods.map((m) : ModSettings => {
					const value = modSettings[m.key] || 50
					const mSetting : ModSettings = {
						enabled: true,
						weight: value,
						mod: m,
					}
					return mSetting
				})
			}
			return settings

		})
	}
};

type WatchersEyeStore = ReturnType<typeof createWatchersEyeStore>

type WatchersEyeInitialProps = {
	auras: AuraName[]
	modSettings: AuraSettingsPut
}
export const createWatchersEyeStore = (opts: WatchersEyeInitialProps) => {
	return createStore<WatchersEyeSearchStore>()(
		logger<WatchersEyeSearchStore>(
			(set, get) => ({
				...initialState(opts),
				setModEnabled: (ak: AuraName, mk: string, enable: boolean) => {
					set({
						auraSettings: get().auraSettings.map((as) => {
							if (ak !== as.aura.name) {
								return as
							}
							as.mods = as.mods.map((m) => {
								if (m.mod.key === mk) {
									return {
										...m,
										enabled: enable,
									}
								}
								return m
							})
							return as
						})
					})
				},
				setModWeight: (ak: AuraName, mk: string, value: number) => {
					set({
						auraSettings: get().auraSettings.map((as) => {
							if (as.aura.name !== ak) {
								return as
							}
							as.mods = as.mods.map((m) => {
								if (m.mod.key === mk) {
									m.weight = value
								}
								return m
							})
							return as
						}),
					})
				},
				toggleAuraMods: (k: AuraName) => {
					set({
						auraSettings: get().auraSettings.map((as) => {
							if (as.aura.name !== k) {
								return as
							}

							const numEnabled = as.mods.filter(x => x.enabled).length
							const cutoff = Math.ceil(as.mods.length / 2)
							const enable = numEnabled < cutoff

							as.mods = as.mods.map((m) => {
								m.enabled = enable
								return m
							})
							return as
						})
					})
				},
				toggleAura: (k: AuraName) => {
					set(() => ({
						auraSettings: get().auraSettings.map((a) => {
							if (a.aura.name === k) {
								return {
									...a,
									enabled: !a.enabled,
								}
							}
							return a
						})
					}));
				},
				setAuraSettings: (asp: AuraSettingsPut) => {
					set(() => ({
						auraSettings: get().auraSettings.map((a) => {
							const put = asp[a.aura.name]
							if (!put) {
								return {
									...a,
									enabled: false,
								}
							}

							return {
								...a,
								enabled: true,
								mods: a.mods.map((ms) => {
									if (!(ms.mod.key in put)) {
										return {
											...ms,
											enabled: false,
											weight: 50,
										}
									}

									return {
										...ms,
										enabled: true,
										weight: put[ms.mod.key]
									}
								})
							}

						})
					}));
				}
			}),
			'watchersEyeSearchStore'
		)
	);
}

export const WatchersEyeContext = createContext<WatchersEyeStore|null>(null)

type TradeFilter = {
	id: string
	disabled: boolean
	value?: {
		weight?: number
		min?: number
		max?: number
	}
}

type TradeStat = {
	type: 'count' | 'weight'
	disabled: boolean,
	filters: TradeFilter[]
	value: {
		min: number
	}
}

type TradeQuery = {
	status: {
		option: 'online' | 'any'
	},
	stats: TradeStat[]
}

export const selModWeightURLSearchParams = (state: WatchersEyeSearchState, excludeAura?: string) : string => {
	const query = state.auraSettings.reduce((obj: any, as) => {
		if (!as.enabled || excludeAura === as.aura.slug) {
			return obj
		}
		const modList = auraSettingToModListString(as)
		obj[as.aura.slug] = modList
		return obj
	}, {})

	const url = new URLSearchParams()
	Object.keys(query).forEach((auraKey) => {
		if (query[auraKey] !== '_') {
			url.set(auraKey, query[auraKey])
		}
	})
	return url.toString()
}

export const selTradeLink = (state: WatchersEyeSearchState) : null | string => {
	let url = `https://pathofexile.com/trade/search?q=`

	const filters : TradeFilter[] = state.auraSettings.reduce((tfs: TradeFilter[], as) => {
		if (!as.enabled) {
			return tfs
		}
		as.mods.forEach((ms) => {
			const normalizedWeight = getModNormalizedWeight(ms.mod, ms.weight)

			tfs.push({
				disabled: !ms.enabled,
				id: 'explicit.stat_' + ms.mod.stat,
				value: {
					weight: normalizedWeight,
				}
			})
		})
		return tfs
	}, [])

	if (filters.length === 0) {
		return null
	}

	const query : TradeQuery = {
		stats: [
			{
				type: 'weight',
				filters: filters,
				disabled: false,
				value: {
					min: 1,
				}
			},
			// This second block clones all the mods from the weighted sum search, but it
			// groups them just into a "count" query that is disabled
			// This is hear so you can easily swap your search from using weight sums to just going
			// "I want any 2 of these mods" and then selecting them on and off
			{
				type: 'count',
				filters: filters.map((ft) => {
					return {
						disabled: ft.disabled,
						id: ft.id,
					}
				}),
				disabled: true,
				value: {
					min: 1,
				}
			}
		],
		status: {
			option: 'online',
		},
	}

	let str = JSON.stringify({
		query: query,
		sort: {
			//'statgroup.0': 'desc', // This appears to be ignored, so I'm just using price
			price: 'asc',
		}
	})


	const link = url + encodeURIComponent(str)
	return link
}

export function getAurasRoute (slugs: string[]) : string {
	return slugs.filter(x => !!x).sort().join('_')
}
