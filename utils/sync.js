// 云端同步工具
// 本地为主，云端手动触发上传/下载
// 未配置云开发环境时自动降级为仅本地

const isCloudReady = () => {
  const app = getApp()
  if (!app || !app.globalData || !app.globalData.cloudEnvId) {
    return false
  }
  return true
}

const uploadToCloud = () => {
  return new Promise((resolve, reject) => {
    if (!isCloudReady()) {
      reject(new Error('未配置云开发环境'))
      return
    }
    const data = {
      vacationRecords: wx.getStorageSync('vacationRecords') || [],
      tripRecords: wx.getStorageSync('tripRecords') || [],
      settings: wx.getStorageSync('settings') || {}
    }
    wx.cloud.callFunction({
      name: 'syncData',
      data: { action: 'upload', data },
      success: (res) => {
        if (res.result && res.result.success) {
          wx.setStorageSync('lastSyncTime', res.result.time)
          resolve(res.result)
        } else {
          reject(new Error(res.result ? res.result.message : '上传失败'))
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '网络错误'))
      }
    })
  })
}

const downloadFromCloud = () => {
  return new Promise((resolve, reject) => {
    if (!isCloudReady()) {
      reject(new Error('未配置云开发环境'))
      return
    }
    wx.cloud.callFunction({
      name: 'syncData',
      data: { action: 'download' },
      success: (res) => {
        if (res.result && res.result.success) {
          const data = res.result.data
          if (data.vacationRecords) wx.setStorageSync('vacationRecords', data.vacationRecords)
          if (data.tripRecords) wx.setStorageSync('tripRecords', data.tripRecords)
          if (data.settings) wx.setStorageSync('settings', data.settings)
          wx.setStorageSync('lastSyncTime', Date.now())
          resolve(res.result)
        } else {
          reject(new Error(res.result ? res.result.message : '云端暂无数据'))
        }
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '网络错误'))
      }
    })
  })
}

const checkCloudData = () => {
  return new Promise((resolve, reject) => {
    if (!isCloudReady()) {
      reject(new Error('未配置云开发环境'))
      return
    }
    wx.cloud.callFunction({
      name: 'syncData',
      data: { action: 'check' },
      success: (res) => {
        resolve(res.result)
      },
      fail: (err) => {
        reject(new Error(err.errMsg || '网络错误'))
      }
    })
  })
}

const formatSyncTime = () => {
  const time = wx.getStorageSync('lastSyncTime')
  if (!time) return '从未同步'
  const date = new Date(time)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hour}:${minute}`
}

module.exports = {
  isCloudReady,
  uploadToCloud,
  downloadFromCloud,
  checkCloudData,
  formatSyncTime
}
