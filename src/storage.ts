import type { AppData } from './types'

const STORAGE_KEY = 'okozukai-manager-v1'

export const currentMonth = () => {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export const nextMonth = (month = currentMonth()) => {
  const [year, value] = month.split('-').map(Number)
  const nextYear = value === 12 ? year + 1 : year
  const nextValue = value === 12 ? 1 : value + 1
  return `${nextYear}-${String(nextValue).padStart(2, '0')}`
}

export const formatMonth = (month: string) => {
  const [year, value] = month.split('-')
  return `${Number(year)}年${Number(value)}月`
}

export const initialData = (): AppData => ({
  month: currentMonth(),
  allowance: 30000,
  extra: 0,
  plans: [],
  history: [],
})

function migrateData(parsed: Partial<AppData>): AppData {
  const base = { ...initialData(), ...parsed }
  return {
    ...base,
    plans: (base.plans ?? []).map((plan) => ({
      ...plan,
      month: plan.month ?? base.month,
    })),
  }
}

export function loadData(): AppData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? migrateData(JSON.parse(saved)) : initialData()
  } catch {
    return initialData()
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
