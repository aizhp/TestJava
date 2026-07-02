const util = require('../../utils/util.js')

Page({
  data: {
    activeTab: 'all',
    trips: [],
    filteredTrips: [],
    stats: {
      totalDays: 0,
      totalSubsidy: 0,
      totalExpenses: 0,
      pendingCount: 0
    }
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const trips = wx.getStorageSync('tripRecords') || []
    const sortedTrips = trips
      .sort((a, b) => new Date(b.startDate.replace(/-/g, '/')) - new Date(a.startDate.replace(/-/g, '/')))
      .map(t => ({
        ...t,
        statusLabel: util.getTripStatusLabel(t.status)
      }))

    const stats = util.calculateTripStats(trips)

    this.setData({
      trips: sortedTrips,
      filteredTrips: sortedTrips,
      stats
    })
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    let filteredTrips = this.data.trips

    if (tab !== 'all') {
      filteredTrips = this.data.trips.filter(t => t.status === tab)
    }

    this.setData({
      activeTab: tab,
      filteredTrips
    })
  },

  goToAdd() {
    wx.navigateTo({
      url: '/pages/trip/add'
    })
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/trip/detail?id=${id}`
    })
  }
})
