export type Plan = {
  id: string
  name: string
  plannedAmount: number
  status: 'pending' | 'completed'
  month: string
}

export type HistoryEntry = {
  id: string
  date: string
  name: string
  amount: number
  kind: 'expense' | 'income'
}

export type AppData = {
  month: string
  allowance: number
  extra: number
  plans: Plan[]
  history: HistoryEntry[]
}
