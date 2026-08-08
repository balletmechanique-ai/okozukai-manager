import { useEffect, useMemo, useState } from 'react'
import {
  Alert, AppBar, Box, Button, Chip, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, Fab, IconButton, List, ListItem, ListItemButton,
  ListItemText, Paper, Stack, TextField, Toolbar, Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import type { AppData, HistoryEntry, Plan } from './types'
import { currentMonth, formatMonth, loadData, nextMonth, saveData } from './storage'

type Page = 'home' | 'plans'
type DialogType = 'menu' | 'plan' | 'expense' | 'income' | 'allowance' | null
type PlanDialogMode = 'add' | 'edit' | 'record'

const yen = (value: number) => `¥${value.toLocaleString('ja-JP')}`
const id = () => crypto.randomUUID()
const today = () => new Date().toISOString()
const planMonths = () => [currentMonth(), nextMonth()]

export default function App() {
  const [data, setData] = useState<AppData>(() => {
    const saved = loadData()
    if (saved.month !== currentMonth()) {
      if (window.confirm('新しい月になりました。追加したお小遣いをリセットしますか？')) {
        return { ...saved, month: currentMonth(), extra: 0 }
      }
      return { ...saved, month: currentMonth() }
    }
    return saved
  })
  const [page, setPage] = useState<Page>('home')
  const [viewMonth, setViewMonth] = useState(currentMonth())
  const [dialog, setDialog] = useState<DialogType>(null)
  const [planDialogMode, setPlanDialogMode] = useState<PlanDialogMode>('add')
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => saveData(data), [data])

  const monthPlans = useMemo(
    () => data.plans.filter((plan) => plan.month === viewMonth),
    [data.plans, viewMonth],
  )

  const monthRecords = useMemo(
    () => data.history
      .filter((entry) => entry.date.slice(0, 7) === data.month)
      .sort((a, b) => b.date.localeCompare(a.date)),
    [data.history, data.month],
  )

  const totals = useMemo(() => {
    const planned = data.plans
      .filter((plan) => plan.month === data.month && plan.status === 'pending')
      .reduce((sum, plan) => sum + plan.plannedAmount, 0)
    const spent = data.history
      .filter((entry) => entry.kind === 'expense' && entry.date.slice(0, 7) === data.month)
      .reduce((sum, entry) => sum + entry.amount, 0)
    return { planned, spent, remaining: data.allowance + data.extra - planned - spent }
  }, [data])

  const tone = totals.remaining < 0 ? 'error' : totals.remaining <= 2000 ? 'warning' : 'success'
  const resetForm = () => { setName(''); setAmount(''); setSelectedPlan(null); setPlanDialogMode('add') }
  const closeDialog = () => { setDialog(null); resetForm() }
  const numberAmount = Number(amount)
  const validNonNegativeAmount = Number.isFinite(numberAmount) && numberAmount >= 0
  const validPositiveAmount = Number.isFinite(numberAmount) && numberAmount > 0

  const addPlan = () => {
    if (!name.trim() || !validNonNegativeAmount) return
    setData((old) => ({
      ...old,
      plans: [...old.plans, {
        id: id(),
        name: name.trim(),
        plannedAmount: numberAmount,
        status: 'pending',
        month: viewMonth,
      }],
    }))
    closeDialog()
    setPage('plans')
  }

  const updatePlan = () => {
    if (!selectedPlan || !name.trim() || !validNonNegativeAmount) return
    setData((old) => ({
      ...old,
      plans: old.plans.map((plan) => plan.id === selectedPlan.id
        ? { ...plan, name: name.trim(), plannedAmount: numberAmount }
        : plan),
    }))
    closeDialog()
  }

  const deletePlan = (plan: Plan) => {
    if (!window.confirm(`「${plan.name}」を削除しますか？`)) return
    setData((old) => ({ ...old, plans: old.plans.filter((item) => item.id !== plan.id) }))
  }

  const addExpense = () => {
    if (!name.trim() || !validNonNegativeAmount) return
    setData((old) => ({
      ...old,
      history: [...old.history, { id: id(), date: today(), name: name.trim(), amount: numberAmount, kind: 'expense' }],
    }))
    closeDialog()
  }

  const addIncome = () => {
    if (!validPositiveAmount) return
    setData((old) => ({
      ...old,
      extra: old.extra + numberAmount,
      history: [...old.history, { id: id(), date: today(), name: 'お小遣い追加', amount: numberAmount, kind: 'income' }],
    }))
    closeDialog()
  }

  const recordPlan = (actualAmount: number) => {
    if (!selectedPlan || actualAmount < 0) return
    setData((old) => ({
      ...old,
      plans: old.plans.map((plan) => plan.id === selectedPlan.id ? { ...plan, status: 'completed' } : plan),
      history: [...old.history, { id: id(), date: today(), name: selectedPlan.name, amount: actualAmount, kind: 'expense' }],
    }))
    closeDialog()
  }

  const deleteRecord = (entry: HistoryEntry) => {
    if (!window.confirm(`「${entry.name}」の記録を削除しますか？`)) return
    setData((old) => ({
      ...old,
      extra: entry.kind === 'income' ? Math.max(0, old.extra - entry.amount) : old.extra,
      history: old.history.filter((item) => item.id !== entry.id),
    }))
  }

  const saveAllowance = () => {
    if (!validPositiveAmount) return
    setData((old) => ({ ...old, allowance: numberAmount }))
    closeDialog()
  }

  const openAddPlan = (month = viewMonth) => {
    setViewMonth(month)
    setPlanDialogMode('add')
    setDialog('plan')
  }

  const openRecordPlan = (plan: Plan) => {
    if (plan.status === 'completed') return
    setSelectedPlan(plan)
    setPlanDialogMode('record')
    setAmount(String(plan.plannedAmount))
    setDialog('plan')
  }

  const openEditPlan = (plan: Plan, event?: React.MouseEvent) => {
    event?.stopPropagation()
    setSelectedPlan(plan)
    setPlanDialogMode('edit')
    setName(plan.name)
    setAmount(String(plan.plannedAmount))
    setDialog('plan')
  }

  return (
    <Box sx={{ minHeight: '100vh', pb: 10 }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ maxWidth: 600, width: '100%', mx: 'auto' }}>
          {page !== 'home' && (
            <IconButton color="inherit" edge="start" onClick={() => setPage('home')}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {page === 'home' ? '💰 おこづかい' : '予定一覧'}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
        {page === 'home' && <>
          <Paper sx={{ p: 2.5 }}>
            <Stack spacing={1.5}>
              <SummaryRow label="今月" value={data.allowance} onClick={() => { setAmount(String(data.allowance)); setDialog('allowance') }} />
              <SummaryRow label="追加" value={data.extra} />
              <Divider />
              <SummaryRow label="予定" value={totals.planned} />
              <SummaryRow label="使った" value={totals.spent} />
            </Stack>
          </Paper>

          <Paper sx={{ mt: 2, p: 3, textAlign: 'center', bgcolor: `${tone}.light`, color: `${tone}.contrastText` }}>
            <Typography variant="body1">残り</Typography>
            <Typography variant="h3" sx={{ fontWeight: 800, my: 1 }}>{yen(totals.remaining)}</Typography>
            {totals.remaining < 0 && (
              <Typography sx={{ fontWeight: 700 }}>⚠ あと{yen(Math.abs(totals.remaining))}不足しています</Typography>
            )}
          </Paper>

          <Button
            fullWidth
            size="large"
            variant="outlined"
            startIcon={<CalendarMonthIcon />}
            sx={{ mt: 2 }}
            onClick={() => { setViewMonth(data.month); setPage('plans') }}
          >
            予定一覧
          </Button>

          <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 3, mb: 1.5 }}>使った・もらった記録</Typography>
          {monthRecords.length === 0 ? (
            <Empty text="記録はまだありません" />
          ) : (
            <Paper>
              <RecordList entries={monthRecords} onDelete={deleteRecord} />
            </Paper>
          )}
        </>}

        {page === 'plans' && <>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {planMonths().map((month) => (
              <Button
                key={month}
                fullWidth
                variant={viewMonth === month ? 'contained' : 'outlined'}
                onClick={() => setViewMonth(month)}
              >
                {formatMonth(month)}
              </Button>
            ))}
          </Stack>

          {monthPlans.length === 0 ? (
            <Empty text={`${formatMonth(viewMonth)}の予定はまだありません`} />
          ) : (
            <Paper>
              <List disablePadding>
                {monthPlans.map((plan, index) => (
                  <Box key={plan.id}>
                    {index > 0 && <Divider />}
                    <ListItem disablePadding secondaryAction={
                      <Stack direction="row" spacing={0.5}>
                        {plan.status === 'pending' && (
                          <IconButton edge="end" aria-label="編集" onClick={(event) => openEditPlan(plan, event)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        )}
                        <IconButton edge="end" aria-label="削除" onClick={() => deletePlan(plan)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    }>
                      <ListItemButton onClick={() => openRecordPlan(plan)} disabled={plan.status === 'completed'}>
                        <ListItemText primary={plan.name} secondary={yen(plan.plannedAmount)} />
                        <Chip
                          size="small"
                          label={plan.status === 'pending' ? '予定中' : '完了'}
                          color={plan.status === 'pending' ? 'primary' : 'default'}
                          sx={{ mr: plan.status === 'pending' ? 7 : 5 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Box>
                ))}
              </List>
            </Paper>
          )}

          <Button
            fullWidth
            size="large"
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            onClick={() => openAddPlan(viewMonth)}
          >
            {formatMonth(viewMonth)}の予定を追加
          </Button>
        </>}
      </Box>

      {page === 'home' && (
        <Fab
          color="primary"
          aria-label="追加"
          onClick={() => setDialog('menu')}
          sx={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)' }}
        >
          <AddIcon />
        </Fab>
      )}

      <Dialog open={dialog === 'menu'} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>追加するもの</DialogTitle>
        <DialogContent>
          <Stack spacing={1} sx={{ pt: 1 }}>
            <Button size="large" variant="outlined" onClick={() => openAddPlan(data.month)}>予定を追加</Button>
            <Button size="large" variant="outlined" onClick={() => setDialog('expense')}>予定外の支出</Button>
            <Button size="large" variant="outlined" onClick={() => setDialog('income')}>お小遣いを追加</Button>
          </Stack>
        </DialogContent>
      </Dialog>

      <FormDialog
        open={dialog === 'plan' && planDialogMode === 'add'}
        title={`${formatMonth(viewMonth)}の予定を追加`}
        onClose={closeDialog}
        onSave={addPlan}
        saveDisabled={!name.trim() || !validNonNegativeAmount}
      >
        <TextField autoFocus label="項目名" value={name} onChange={(event) => setName(event.target.value)} fullWidth />
        <MoneyField label="予定金額" value={amount} onChange={setAmount} min={0} />
      </FormDialog>

      <FormDialog
        open={dialog === 'plan' && planDialogMode === 'edit'}
        title="予定を編集"
        onClose={closeDialog}
        onSave={updatePlan}
        saveDisabled={!name.trim() || !validNonNegativeAmount}
      >
        <TextField autoFocus label="項目名" value={name} onChange={(event) => setName(event.target.value)} fullWidth />
        <MoneyField label="予定金額" value={amount} onChange={setAmount} min={0} />
      </FormDialog>

      <FormDialog
        open={dialog === 'expense'}
        title="予定外の支出"
        onClose={closeDialog}
        onSave={addExpense}
        saveDisabled={!name.trim() || !validNonNegativeAmount}
      >
        <TextField autoFocus label="項目名" value={name} onChange={(event) => setName(event.target.value)} fullWidth />
        <MoneyField label="金額" value={amount} onChange={setAmount} min={0} />
      </FormDialog>

      <FormDialog open={dialog === 'income'} title="お小遣いを追加" onClose={closeDialog} onSave={addIncome} saveDisabled={!validPositiveAmount}>
        <MoneyField autoFocus label="追加金額" value={amount} onChange={setAmount} />
      </FormDialog>

      <FormDialog open={dialog === 'allowance'} title="今月のお小遣いを変更" onClose={closeDialog} onSave={saveAllowance} saveDisabled={!validPositiveAmount}>
        <MoneyField autoFocus label="お小遣い" value={amount} onChange={setAmount} />
      </FormDialog>

      <Dialog open={dialog === 'plan' && planDialogMode === 'record'} onClose={closeDialog} fullWidth maxWidth="xs">
        <DialogTitle>{selectedPlan?.name}</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">予定金額</Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{yen(selectedPlan?.plannedAmount ?? 0)}</Typography>
          <MoneyField label="実際の金額" value={amount} onChange={setAmount} min={0} />
          {validNonNegativeAmount && selectedPlan && numberAmount > selectedPlan.plannedAmount && (
            <Alert severity="warning" sx={{ mt: 2 }}>予定より{yen(numberAmount - selectedPlan.plannedAmount)}多い支出です</Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, display: 'grid', gap: 1 }}>
          <Button fullWidth variant="outlined" onClick={() => recordPlan(selectedPlan?.plannedAmount ?? 0)}>
            予定どおり使った
          </Button>
          <Button fullWidth variant="contained" onClick={() => recordPlan(numberAmount)} disabled={!validNonNegativeAmount}>
            実際の金額で記録
          </Button>
          <Button fullWidth color="inherit" onClick={closeDialog}>キャンセル</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function RecordList({ entries, onDelete }: { entries: HistoryEntry[]; onDelete: (entry: HistoryEntry) => void }) {
  return (
    <List disablePadding>
      {entries.map((entry, index) => (
        <Box key={entry.id}>
          {index > 0 && <Divider />}
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="削除" onClick={() => onDelete(entry)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            }
          >
            <ListItemText
              primary={entry.name}
              secondary={new Date(entry.date).toLocaleDateString('ja-JP')}
            />
            <Typography sx={{ fontWeight: 700, color: entry.kind === 'income' ? 'success.main' : 'text.primary', mr: 5 }}>
              {entry.kind === 'income' ? '+' : '-'}{yen(entry.amount)}
            </Typography>
          </ListItem>
        </Box>
      ))}
    </List>
  )
}

function SummaryRow({ label, value, onClick }: { label: string; value: number; onClick?: () => void }) {
  return (
    <Stack
      direction="row"
      onClick={onClick}
      sx={{ justifyContent: 'space-between', alignItems: 'center', ...(onClick && { cursor: 'pointer' }) }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography variant="h6" sx={{ fontWeight: 700 }}>{yen(value)}</Typography>
    </Stack>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <Paper sx={{ p: 5, textAlign: 'center' }}>
      <Typography color="text.secondary">{text}</Typography>
    </Paper>
  )
}

function MoneyField({
  label,
  value,
  onChange,
  autoFocus = false,
  min = 1,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  autoFocus?: boolean
  min?: number
}) {
  return (
    <TextField
      autoFocus={autoFocus}
      label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type="number"
      slotProps={{ htmlInput: { min, inputMode: 'numeric' } }}
      fullWidth
    />
  )
}

function FormDialog({
  open,
  title,
  children,
  onClose,
  onSave,
  saveDisabled,
}: {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  onSave: () => void
  saveDisabled: boolean
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>{children}</Stack></DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose}>キャンセル</Button>
        <Button variant="contained" onClick={onSave} disabled={saveDisabled}>保存</Button>
      </DialogActions>
    </Dialog>
  )
}
