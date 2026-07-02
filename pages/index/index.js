const util = require('../../utils/util.js')
const share = require('../../utils/share.js')

Page({
  data: {
    statusBarHeight: 20,
    greeting: '',
    todayStr: '',
    vacation: {
      annualTotal: 10,
      annualUsed: 0,
      annualLeft: 10,
      compTotal: 0,
      compUsed: 0,
      compLeft: 0
    },
    tripStats: {
      monthDays: 0,
      monthSubsidy: 0,
      monthExpenses: 0,
      totalDays: 0,
      totalSubsidy: 0,
      totalExpenses: 0,
      pendingCount: 0
    },
    recentRecords: [],
    recentTrips: []
  },

  onLoad() {
    const sysInfo = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: sysInfo.statusBarHeight || 20 })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const greeting = util.getGreeting()
    const todayStr = util.formatDateCN(util.getTodayStr())

    const records = wx.getStorageSync('vacationRecords') || []
    const settings = wx.getStorageSync('settings') || {}
    const trips = wx.getStorageSync('tripRecords') || []

    const vacation = util.calculateVacationBalance(records, settings)
    const tripStats = util.calculateTripStats(trips)

    const recentRecords = records
      .sort((a, b) => new Date(b.date.replace(/-/g, '/')) - new Date(a.date.replace(/-/g, '/')))
      .slice(0, 3)
      .map(r => ({
        ...r,
        typeLabel: util.getVacationTypeLabel(r.type),
        dateCN: util.formatDateCN(r.date)
      }))

    const recentTrips = trips
      .sort((a, b) => new Date(b.startDate.replace(/-/g, '/')) - new Date(a.startDate.replace(/-/g, '/')))
      .slice(0, 2)
      .map(t => ({
        ...t,
        statusLabel: util.getTripStatusLabel(t.status)
      }))

    this.setData({
      greeting,
      todayStr,
      vacation,
      tripStats,
      recentRecords,
      recentTrips
    })
  },

  goToAddVacation() {
    wx.navigateTo({
      url: '/pages/vacation/add'
    })
  },

  goToAddTrip() {
    wx.navigateTo({
      url: '/pages/trip/add'
    })
  },

  goToVacationList() {
    wx.switchTab({
      url: '/pages/vacation/list'
    })
  },

  goToTripList() {
    wx.switchTab({
      url: '/pages/trip/list'
    })
  },

  goToTripDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/trip/detail?id=${id}`
    })
  },

  onShareAppMessage() {
    return share.getShareConfig('index')
  },

  onShareTimeline() {
    return share.getShareConfig('index')
  },

  copyLink() {
    share.copyShareText('index')
  }
})
