const util = require('../../utils/util.js')

Page({
  data: {
    direction: 'out',
    type: 'annual',
    typeList: [
      { value: 'annual', label: '年假' },
      { value: 'compensatory', label: '调休假' },
      { value: 'personal', label: '事假' },
      { value: 'sick', label: '病假' },
      { value: 'other', label: '其他' }
    ],
    date: '',
    days: 1,
    remark: ''
  },

  onLoad() {
    this.setData({
      date: util.getTodayStr()
    })
  },

  switchDirection(e) {
    const direction = e.currentTarget.dataset.direction
    const update = { direction }
    // 获得 调休时，类型锁定为调休假
    if (direction === 'in') {
      update.type = 'compensatory'
    }
    this.setData(update)
  },

  selectType(e) {
    this.setData({
      type: e.currentTarget.dataset.type
    })
  },

  onDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },

  onDaysChange(e) {
    const value = parseFloat(e.detail.value) || 0
    this.setData({
      days: Math.max(0, value)
    })
  },

  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  subtractDays() {
    if (this.data.days > 0.5) {
      this.setData({
        days: Math.round((this.data.days - 0.5) * 10) / 10
      })
    }
  },

  addDays() {
    this.setData({
      days: Math.round((this.data.days + 0.5) * 10) / 10
    })
  },

  save() {
    if (!this.data.date) {
      wx.showToast({ title: '请选择日期', icon: 'none' })
      return
    }
    if (this.data.days <= 0) {
      wx.showToast({ title: '天数必须大于0', icon: 'none' })
      return
    }

    const records = wx.getStorageSync('vacationRecords') || []
    const newRecord = {
      id: util.generateId(),
      type: this.data.type,
      direction: this.data.direction,
      days: this.data.days,
      date: this.data.date,
      remark: this.data.remark,
      createdAt: Date.now()
    }

    records.unshift(newRecord)
    wx.setStorageSync('vacationRecords', records)

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })

    setTimeout(() => {
      wx.navigateBack()
    }, 1000)
  }
})
