import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import API from '../api/axios'

const CATEGORIES = ['Food', 'Rent', 'Transport', 'Health', 'Entertainment', 'Shopping', 'Salary', 'Other']
const COLORS = ['#4f46e5', '#7c3aed', '#db2777', '#dc2626', '#d97706', '#059669', '#0891b2', '#6b7280']

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [summary, setSummary] = useState({ total_income: 0, total_expense: 0, balance: 0, category_totals: {} })
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'expense', amount: '', category: 'Food', note: '', date: new Date().toISOString().split('T')[0] })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
    else {
      fetchTransactions()
      fetchSummary()
    }
  }, [])

  const fetchTransactions = async () => {
    try {
      const res = await API.get('/transactions/')
      setTransactions(res.data)
    } catch {
      navigate('/login')
    }
  }

  const fetchSummary = async () => {
    try {
      const res = await API.get('/transactions/summary')
      setSummary(res.data)
    } catch {}
  }

  const handleAdd = async () => {
    if (!form.amount || !form.date) {
      setError('Amount and date are required')
      return
    }
    try {
      await API.post('/transactions/', { ...form, amount: parseFloat(form.amount) })
      setForm({ type: 'expense', amount: '', category: 'Food', note: '', date: new Date().toISOString().split('T')[0] })
      setShowForm(false)
      setError('')
      fetchTransactions()
      fetchSummary()
    } catch {
      setError('Failed to add transaction')
    }
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`)
      fetchTransactions()
      fetchSummary()
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  // Prepare pie chart data
  const pieData = Object.entries(summary.category_totals).map(([name, value]) => ({ name, value }))

  // Prepare bar chart data
  const barData = [
    { name: 'Income', amount: summary.total_income },
    { name: 'Expense', amount: summary.total_expense }
  ]

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>💰 Expense Tracker</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      {/* Balance Cards */}
      <div style={styles.cardRow}>
        <div style={{ ...styles.balanceCard, backgroundColor: '#4f46e5' }}>
          <p style={styles.cardLabel}>Balance</p>
          <p style={styles.cardAmount}>${summary.balance.toFixed(2)}</p>
        </div>
        <div style={{ ...styles.balanceCard, backgroundColor: '#059669' }}>
          <p style={styles.cardLabel}>Income</p>
          <p style={styles.cardAmount}>${summary.total_income.toFixed(2)}</p>
        </div>
        <div style={{ ...styles.balanceCard, backgroundColor: '#bf76d2' }}>
          <p style={styles.cardLabel}>Expenses</p>
          <p style={styles.cardAmount}>${summary.total_expense.toFixed(2)}</p>
        </div>
      </div>

      {/* Charts */}
      {transactions.length > 0 && (
        <div style={styles.chartRow}>
          {/* Bar Chart */}
          <div style={styles.chartCard}>
            <h4 style={styles.chartTitle}>Income vs Expenses</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#4841cc" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <div style={styles.chartCard}>
              <h4 style={styles.chartTitle}>Spending by Category</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Add Transaction Button */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h3 style={styles.sectionTitle}>Transactions</h3>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ Add Transaction'}
          </button>
        </div>

        {/* Add Transaction Form */}
        {showForm && (
          <div style={styles.form}>
            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.formRow}>
              <select style={styles.input} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <select style={styles.input} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={styles.formRow}>
              <input style={styles.input} type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
              <input style={styles.input} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <input style={styles.input} type="text" placeholder="Note (optional)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            <button style={styles.submitBtn} onClick={handleAdd}>Add Transaction</button>
          </div>
        )}

        {/* Transaction List */}
        {transactions.length === 0 ? (
          <p style={styles.empty}>No transactions yet. Add your first one!</p>
        ) : (
          transactions.map(t => (
            <div key={t.id} style={styles.transaction}>
              <div style={styles.transactionLeft}>
                <span style={styles.category}>{t.category}</span>
                <span style={styles.note}>{t.note || t.date}</span>
              </div>
              <div style={styles.transactionRight}>
                <span style={{ ...styles.amount, color: t.type === 'income' ? '#059669' : '#dc2626' }}>
                  {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                </span>
                <button style={styles.deleteBtn} onClick={() => handleDelete(t.id)}>✕</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  headerTitle: { margin: 0, color: '#1a1a2e' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#f0f2f5', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  cardRow: { display: 'flex', gap: '16px', marginBottom: '24px' },
  balanceCard: { flex: 1, padding: '20px', borderRadius: '12px', color: 'white' },
  cardLabel: { margin: '0 0 8px 0', opacity: 0.85, fontSize: '14px' },
  cardAmount: { margin: 0, fontSize: '24px', fontWeight: 'bold' },
  chartRow: { display: 'flex', gap: '16px', marginBottom: '24px' },
  chartCard: { flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  chartTitle: { margin: '0 0 12px 0', color: '#1a1a2e' },
  section: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  sectionTitle: { margin: 0, color: '#1a1a2e' },
  addBtn: { padding: '8px 16px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  form: { backgroundColor: '#f8f9ff', padding: '16px', borderRadius: '10px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' },
  formRow: { display: 'flex', gap: '10px' },
  input: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  submitBtn: { padding: '10px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: 'red', margin: 0, fontSize: '14px' },
  empty: { textAlign: 'center', color: '#999', padding: '40px 0' },
  transaction: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f2f5' },
  transactionLeft: { display: 'flex', flexDirection: 'column', gap: '4px' },
  category: { fontWeight: 'bold', color: '#1a1a2e' },
  note: { fontSize: '13px', color: '#999' },
  transactionRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  amount: { fontWeight: 'bold', fontSize: '16px' },
  deleteBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: '14px' }
}