import { create } from 'zustand';
import { logger } from './logger';
import {Aura, Mod, AuraKey, AURAS, getModNormalizedWeight} from "@/lib/auras";

type ModSettings = {
	mod: Mod
	weight: number
	enabled: boolean
}

type AuraSettings = {
	enabled: boolean
	key: AuraKey
	aura: Aura
	mods: ModSettings[]
}

type AuraModWeights = Record<string, number>

export type AuraSettingsPut = Partial<Record<AuraKey, AuraModWeights>>

interface WatchersEyeSearchState {
	auraSettings: AuraSettings[],
}

export interface WatchersEyeSearchStore extends WatchersEyeSearchState {
  toggleAura: (key: AuraKey) => void
	setModWeight: (akey: AuraKey, modKey: string, value: number) => void
	setModEnabled: (akey: AuraKey, modKey: string, value: boolean) => void
	toggleAuraMods: (key: AuraKey) => void
	setAuraSettings: (s: AuraSettingsPut) => void
}

const initialState: Pick<WatchersEyeSearchStore, keyof WatchersEyeSearchState> = {
	auraSettings: AURAS.map((aura) : AuraSettings => {
		const settings : AuraSettings = {
			key: aura.key,
			enabled: false,
			aura: aura,
			mods: aura.mods.map((m) : ModSettings => {
				const mSetting : ModSettings = {
					enabled: true,
					weight: 50,
					mod: m,
				}
				return mSetting
			})
		}
		return settings

	}),
};

const useWatchersEyeStore = create<WatchersEyeSearchStore>()(
  logger<WatchersEyeSearchStore>(
    (set, get) => ({
      ...initialState,
			setModEnabled: (ak: AuraKey, mk: string, enable: boolean) => {
				set({
					auraSettings: get().auraSettings.map((as) => {
						as.mods = as.mods.map((m) => {
							if (m.mod.key === mk) {
								return {
									...m,
									enabled: enable,
								}
							}
							return m
						})
					})
				})
			},
			setModWeight: (ak: AuraKey, mk: string, value: number) => {
      	set({
					auraSettings: get().auraSettings.map((as) => {
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
			toggleAuraMods: (k: AuraKey) => {
				set({
					auraSettings: get().auraSettings.map((as) => {
						if (as.key !== k) {
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
			toggleAura: (k: AuraKey) => {
        set(() => ({
					auraSettings: get().auraSettings.map((a) => {
						if (a.key === k) {
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
						const put = asp[a.key]
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


type TradeFilter = {
	id: string
	disabled: boolean
	value: {
		weight?: number
		min?: number
		max?: number
	}
}

type TradeStat = {
	type: 'count' | 'weight'
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
			//'statgroup.0': 'desc', // This appears to be ignored, so I'm just using price: 'desc'
			price: 'desc',
		}
	})


	const link = url + encodeURIComponent(str)
	return link
}

export default useWatchersEyeStore;
