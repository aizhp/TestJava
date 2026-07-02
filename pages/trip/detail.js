const util = require('../../utils/util.js')

Page({
  data: {
    trip: null,
    expenses: []
  },

  onLoad(options) {
    const id = options.id
    this.loadTrip(id)
  },

  loadTrip(id) {
    const trips = wx.getStorageSync('tripRecords') || []
    const trip = trips.find(t => t.id == id)
    if (trip) {
      trip.statusLabel = util.getTripStatusLabel(trip.status)
      this.setData({
        trip,
        expenses: trip.expenseDetails || []
      })
    }
  },

  changeStatus(e) {
    const status = e.currentTarget.dataset.status
    const trips = wx.getStorageSync('tripRecords') || []
    const index = trips.findIndex(t => t.id == this.data.trip.id)
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
          trips = trips.filter(t => t.id != this.data.trip.id)
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
  }
})
