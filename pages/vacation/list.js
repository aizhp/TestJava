const util = require('../../utils/util.js')

Page({
  data: {
    activeTab: 'all',
    vacation: {
      annualTotal: 10,
      annualUsed: 0,
      annualLeft: 10,
      compTotal: 0,
      compUsed: 0,
      compLeft: 0
    },
    records: [],
    filteredRecords: []
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const records = wx.getStorageSync('vacationRecords') || []
    const settings = wx.getStorageSync('settings') || {}
    const vacation = util.calculateVacationBalance(records, settings)

    const sortedRecords = records
      .sort((a, b) => new Date(b.date.replace(/-/g, '/')) - new Date(a.date.replace(/-/g, '/')))
      .map(r => ({
        ...r,
        typeLabel: util.getVacationTypeLabel(r.type),
        dateCN: util.formatDateCN(r.date)
      }))

    this.setData({
      records: sortedRecords,
      vacation,
      filteredRecords: sortedRecords
    })
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    let filteredRecords = this.data.records

    if (tab !== 'all') {
      filteredRecords = this.data.records.filter(r => r.type === tab)
    }

    this.setData({
      activeTab: tab,
      filteredRecords
    })
  },

  goToAdd() {
    wx.navigateTo({
      url: '/pages/vacation/add'
    })
  },

  deleteRecord(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条记录吗？',
      confirmColor: '#FF6B9D',
      success: (res) => {
        if (res.confirm) {
          const records = wx.getStorageSync('vacationRecords') || []
          const newRecords = records.filter(r => r.id !== id)
          wx.setStorageSync('vacationRecords', newRecords)
          this.loadData()
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
        }
      }
    })
  }
})
