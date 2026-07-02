App({
  onLaunch() {
    // 云开发初始化（在 project.config.json 中配置 cloudfunctionRoot 后生效）
    // 未填写环境ID时不初始化，小程序仍可正常使用本地功能
    if (this.globalData.cloudEnvId) {
      if (wx.cloud) {
        wx.cloud.init({
          env: this.globalData.cloudEnvId,
          traceUser: true
        })
        this.globalData.cloudReady = true
      }
    }

    const vacationRecords = wx.getStorageSync('vacationRecords')
    if (!vacationRecords) {
      const mockData = [
        { id: '1', type: 'annual', direction: 'out', days: 1, date: '2026-06-28', remark: '家里有事' },
        { id: '2', type: 'compensatory', direction: 'in', days: 2, date: '2026-06-20', remark: '周末加班' },
        { id: '3', type: 'annual', direction: 'out', days: 0.5, date: '2026-06-15', remark: '体检' },
        { id: '4', type: 'sick', direction: 'out', days: 1, date: '2026-06-10', remark: '感冒了' }
      ]
      wx.setStorageSync('vacationRecords', mockData)
    }

    const tripRecords = wx.getStorageSync('tripRecords')
    if (!tripRecords) {
      const mockTrips = [
        {
          id: '1',
          name: '上海客户拜访',
          destination: '上海',
          startDate: '2026-06-25',
          endDate: '2026-06-27',
          days: 3,
          subsidy: 450,
          expenses: 2680,
          status: 'reimbursed',
          remark: '见张总，谈合作'
        },
        {
          id: '2',
          name: '深圳产品培训',
          destination: '深圳',
          startDate: '2026-06-10',
          endDate: '2026-06-12',
          days: 3,
          subsidy: 450,
          expenses: 3200,
          status: 'submitted',
          remark: '新产品培训'
        },
        {
          id: '3',
          name: '北京会议',
          destination: '北京',
          startDate: '2026-07-05',
          endDate: '2026-07-06',
          days: 2,
          subsidy: 300,
          expenses: 0,
          status: 'pending',
          remark: '季度总结会'
        }
      ]
      wx.setStorageSync('tripRecords', mockTrips)
    }

    const settings = wx.getStorageSync('settings')
    if (!settings) {
      const defaultSettings = {
        annualLeaveTotal: 10,
        subsidyPerDay: 150,
        reminderDays: 3
      }
      wx.setStorageSync('settings', defaultSettings)
    }
  },

  globalData: {
    userInfo: null,
    cloudEnvId: '',  // 填写云开发环境ID后启用云端同步，留空则仅本地使用
    cloudReady: false
  }
})
