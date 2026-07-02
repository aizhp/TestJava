const formatDate = (date) => {
  if (!date) {
    date = new Date()
  } else if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateCN = (dateStr) => {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  return `${parts[0]}年${parts[1]}月${parts[2]}日`
}

const diffDays = (date1, date2) => {
  const d1 = new Date(date1.replace(/-/g, '/'))
  const d2 = new Date(date2.replace(/-/g, '/'))
  return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) + 1
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 22) return '晚上好'
  return '夜深了'
}

const getTodayStr = () => {
  return formatDate(new Date())
}

const getMonthDays = (year, month) => {
  return new Date(year, month, 0).getDate()
}

const getCurrentMonthStr = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

const getVacationTypeLabel = (type) => {
  const map = {
    annual: '年假',
    compensatory: '调休假',
    personal: '事假',
    sick: '病假',
    marriage: '婚假',
    maternity: '产假',
    other: '其他'
  }
  return map[type] || type
}

const getTripStatusLabel = (status) => {
  const map = {
    pending: '待报销',
    submitted: '已提交',
    reimbursed: '已报销'
  }
  return map[status] || status
}

const calculateVacationBalance = (records, settings) => {
  let annualUsed = 0
  let compIn = 0
  let compOut = 0

  records.forEach(record => {
    if (record.type === 'annual' && record.direction === 'out') {
      annualUsed += record.days
    }
    if (record.type === 'compensatory') {
      if (record.direction === 'in') {
        compIn += record.days
      } else {
        compOut += record.days
      }
    }
  })

  return {
    annualTotal: settings.annualLeaveTotal || 10,
    annualUsed: annualUsed,
    annualLeft: (settings.annualLeaveTotal || 10) - annualUsed,
    compTotal: compIn,
    compUsed: compOut,
    compLeft: compIn - compOut
  }
}

const calculateTripStats = (trips) => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  let monthDays = 0
  let monthSubsidy = 0
  let monthExpenses = 0
  let totalDays = 0
  let totalSubsidy = 0
  let totalExpenses = 0
  let pendingCount = 0

  trips.forEach(trip => {
    const tripDate = new Date(trip.startDate.replace(/-/g, '/'))
    totalDays += trip.days
    totalSubsidy += trip.subsidy
    totalExpenses += trip.expenses

    if (tripDate.getMonth() === currentMonth && tripDate.getFullYear() === currentYear) {
      monthDays += trip.days
      monthSubsidy += trip.subsidy
      monthExpenses += trip.expenses
    }

    if (trip.status === 'pending' || trip.status === 'submitted') {
      pendingCount++
    }
  })

  return {
    monthDays,
    monthSubsidy,
    monthExpenses,
    totalDays,
    totalSubsidy,
    totalExpenses,
    pendingCount
  }
}

const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

module.exports = {
  formatDate,
  formatDateCN,
  diffDays,
  getGreeting,
  getTodayStr,
  getMonthDays,
  getCurrentMonthStr,
  getVacationTypeLabel,
  getTripStatusLabel,
  calculateVacationBalance,
  calculateTripStats,
  generateId
}
