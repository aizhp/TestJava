const util = require('../../utils/util.js')

Page({
  data: {
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    days: 0,
    subsidy: 0,
    expenses: 0,
    status: 'pending',
    remark: '',
    subsidyPerDay: 150
  },

  onLoad() {
    const settings = wx.getStorageSync('settings') || {}
    const today = util.getTodayStr()
    this.setData({
      startDate: today,
      endDate: today,
      days: 1,
      subsidyPerDay: settings.subsidyPerDay || 150,
      subsidy: settings.subsidyPerDay || 150
    })
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [field]: e.detail.value
    })
  },

  onStartDateChange(e) {
    const startDate = e.detail.value
    let endDate = this.data.endDate
    if (endDate < startDate) {
      endDate = startDate
    }
    const days = util.diffDays(startDate, endDate)
    const subsidy = days * this.data.subsidyPerDay
    this.setData({
      startDate,
      endDate,
      days,
      subsidy
    })
  },

  onEndDateChange(e) {
    const endDate = e.detail.value
    if (endDate < this.data.startDate) {
      wx.showToast({
        title: '结束日期不能早于开始日期',
        icon: 'none'
      })
      return
    }
    const days = util.diffDays(this.data.startDate, endDate)
    const subsidy = days * this.data.subsidyPerDay
    this.setData({
      endDate,
      days,
      subsidy
    })
  },

  onExpensesInput(e) {
    const value = parseFloat(e.detail.value) || 0
    this.setData({
      expenses: value
    })
  },

  selectStatus(e) {
    this.setData({
      status: e.currentTarget.dataset.status
    })
  },

  save() {
    if (!this.data.name) {
      wx.showToast({ title: '请输入出差名称', icon: 'none' })
      return
    }
    if (!this.data.destination) {
      wx.showToast({ title: '请输入目的地', icon: 'none' })
      return
    }

    const trips = wx.getStorageSync('tripRecords') || []
    const newTrip = {
      id: util.generateId(),
      name: this.data.name,
      destination: this.data.destination,
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      days: this.data.days,
      subsidy: parseFloat(this.data.subsidy) || 0,
      expenses: parseFloat(this.data.expenses) || 0,
      status: this.data.status,
      remark: this.data.remark,
      createdAt: Date.now()
    }

    trips.unshift(newTrip)
    wx.setStorageSync('tripRecords', trips)

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })

    setTimeout(() => {
      wx.navigateBack()
    }, 1000)
  }
})
