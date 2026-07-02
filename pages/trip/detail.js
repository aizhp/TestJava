const util = require('../../utils/util.js')
const share = require('../../utils/share.js')

Page({
  data: {
    trip: null,
    expenses: []
  },

  onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    const id = options.id
    this.loadTrip(id)
  },

  loadTrip(id) {
    const trips = wx.getStorageSync('tripRecords') || []
    const trip = trips.find(t => String(t.id) === String(id))
    if (trip) {
      trip.statusLabel = util.getTripStatusLabel(trip.status)
      trip.total = Math.round((trip.subsidy + trip.expenses) * 100) / 100
      this.setData({
        trip,
        expenses: trip.expenseDetails || []
      })
    }
  },

  changeStatus(e) {
    const status = e.currentTarget.dataset.status
    const trips = wx.getStorageSync('tripRecords') || []
    const index = trips.findIndex(t => String(t.id) === String(this.data.trip.id))
    if (index > -1) {
      trips[index].status = status
      wx.setStorageSync('tripRecords', trips)
      this.loadTrip(trips[index].id)
      wx.showToast({
        title: '状态已更新',
        icon: 'success'
      })
    }
  },

  editTrip() {
    wx.showToast({
      title: '编辑功能开发中',
      icon: 'none'
    })
  },

  deleteTrip() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条出差记录吗？',
      confirmColor: '#FF6B9D',
      success: (res) => {
        if (res.confirm) {
          let trips = wx.getStorageSync('tripRecords') || []
          trips = trips.filter(t => String(t.id) !== String(this.data.trip.id))
          wx.setStorageSync('tripRecords', trips)
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        }
      }
    })
  },

  onShareAppMessage() {
    return share.getShareConfig('tripDetail', this.data.trip)
  },

  onShareTimeline() {
    return share.getShareConfig('tripDetail', this.data.trip)
  }
})
