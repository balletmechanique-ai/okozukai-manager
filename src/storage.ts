import type { AppData } from './types'

const STORAGE_KEY = 'okozukai-manager-v1'

export const currentMonth = () => new Date().toISOString().slice(0, 7)

export const nextMonth = (month = currentMonth()) => {
  const date = new Date(`${month}-01T00:00:00`)
  date.setMonth(date.getMonth() + 1)
  return date.toISOString().slice(0, 7)
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
