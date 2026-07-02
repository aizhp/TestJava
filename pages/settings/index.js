const util = require('../../utils/util.js')
const share = require('../../utils/share.js')
const sync = require('../../utils/sync.js')

Page({
  data: {
    settings: {
      annualLeaveTotal: 10,
      subsidyPerDay: 150,
      reminderDays: 3
    },
    stats: {
      vacationRecords: 0,
      tripRecords: 0
    },
    cloudReady: false,
    syncTime: '从未同步',
    syncing: false
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const settings = wx.getStorageSync('settings') || {}
    const vacationRecords = wx.getStorageSync('vacationRecords') || []
    const tripRecords = wx.getStorageSync('tripRecords') || []
    const app = getApp()

    this.setData({
      settings,
      stats: {
        vacationRecords: vacationRecords.length,
        tripRecords: tripRecords.length
      },
      cloudReady: app.globalData.cloudReady,
      syncTime: sync.formatSyncTime()
    })
  },

  editAnnualLeave() {
    wx.showModal({
      title: '设置年假天数',
      editable: true,
      placeholderText: '请输入年假总天数',
      content: String(this.data.settings.annualLeaveTotal),
      confirmColor: '#FF6B9D',
      success: (res) => {
        if (res.confirm && res.content) {
          const days = parseInt(res.content)
          if (days > 0 && days <= 365) {
            const settings = { ...this.data.settings, annualLeaveTotal: days }
            wx.setStorageSync('settings', settings)
            this.setData({ settings })
            wx.showToast({ title: '保存成功', icon: 'success' })
          } else {
            wx.showToast({ title: '请输入合理的天数', icon: 'none' })
          }
        }
      }
    })
  },

  editSubsidy() {
    wx.showModal({
      title: '设置每日补贴',
      editable: true,
      placeholderText: '请输入每日补贴金额',
      content: String(this.data.settings.subsidyPerDay),
      confirmColor: '#FF6B9D',
      success: (res) => {
        if (res.confirm && res.content) {
          const amount = parseFloat(res.content)
          if (amount >= 0) {
            const settings = { ...this.data.settings, subsidyPerDay: amount }
            wx.setStorageSync('settings', settings)
            this.setData({ settings })
            wx.showToast({ title: '保存成功', icon: 'success' })
          } else {
            wx.showToast({ title: '请输入合理的金额', icon: 'none' })
          }
        }
      }
    })
  },

  clearData() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有数据吗？此操作不可恢复！',
      confirmText: '全部清除',
      confirmColor: '#FF4D4F',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('vacationRecords')
          wx.removeStorageSync('tripRecords')
          wx.removeStorageSync('settings')
          wx.showToast({ title: '已清除', icon: 'success' })
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }, 1000)
        }
      }
    })
  },

  exportData() {
    wx.showToast({
      title: '导出功能开发中',
      icon: 'none'
    })
  },

  uploadToCloud() {
    if (!this.data.cloudReady) {
      wx.showModal({
        title: '云同步未开启',
        content: '请在 app.js 的 globalData.cloudEnvId 中填写云开发环境ID，并部署云函数后使用。',
        showCancel: false,
        confirmColor: '#FF6B9D'
      })
      return
    }
    if (this.data.syncing) return
    this.setData({ syncing: true })
    wx.showLoading({ title: '上传中...', mask: true })
    sync.uploadToCloud()
      .then((res) => {
        wx.hideLoading()
        this.setData({ syncing: false, syncTime: sync.formatSyncTime() })
        wx.showToast({ title: '上传成功', icon: 'success' })
      })
      .catch((err) => {
        wx.hideLoading()
        this.setData({ syncing: false })
        wx.showToast({ title: err.message, icon: 'none' })
      })
  },

  downloadFromCloud() {
    if (!this.data.cloudReady) {
      wx.showModal({
        title: '云同步未开启',
        content: '请在 app.js 的 globalData.cloudEnvId 中填写云开发环境ID，并部署云函数后使用。',
        showCancel: false,
        confirmColor: '#FF6B9D'
      })
      return
    }
    if (this.data.syncing) return
    wx.showModal({
      title: '从云端恢复',
      content: '将用云端数据覆盖本地数据，确定继续吗？',
      confirmColor: '#FF6B9D',
      success: (res) => {
        if (!res.confirm) return
        this.setData({ syncing: true })
        wx.showLoading({ title: '恢复中...', mask: true })
        sync.downloadFromCloud()
          .then((res) => {
            wx.hideLoading()
            this.setData({ syncing: false, syncTime: sync.formatSyncTime() })
            this.loadData()
            wx.showToast({ title: '恢复成功', icon: 'success' })
          })
          .catch((err) => {
            wx.hideLoading()
            this.setData({ syncing: false })
            wx.showToast({ title: err.message, icon: 'none' })
          })
      }
    })
  },

  about() {
    wx.showModal({
      title: '关于',
      content: '我的假期 v1.0\n\n一个帮你管理假期和出差的小助手~',
      showCancel: false,
      confirmColor: '#FF6B9D'
    })
  },

  shareToFriend() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    wx.showToast({
      title: '请点击右上角"..."分享',
      icon: 'none',
      duration: 2000
    })
  },

  copyShareLink() {
    share.copyShareText('settings')
  },

  onShareAppMessage() {
    return share.getShareConfig('settings')
  },

  onShareTimeline() {
    return share.getShareConfig('settings')
  }
})
