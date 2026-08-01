import type { AppData } from './types'

const STORAGE_KEY = 'okozukai-manager-v1'

export const currentMonth = () => new Date().toISOString().slice(0, 7)

export const initialData = (): AppData => ({
  month: currentMonth(),
  allowance: 30000,
  extra: 0,
  plans: [],
  history: [],
})

export function loadData(): AppData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...initialData(), ...JSON.parse(saved) } : initialData()
  } catch {
    return initialData()
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
