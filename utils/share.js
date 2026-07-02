// 分享配置工具
// 统一管理各页面分享文案、路径、配图

const getShareConfig = (pageName, data = {}) => {
  const configs = {
    index: {
      title: '我的假期 - 假期出差管理小助手 🐰',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    },
    vacationList: {
      title: '我的假期 - 轻松管理年假和调休 🌴',
      path: '/pages/vacation/list',
      imageUrl: '/images/share.png'
    },
    vacationAdd: {
      title: '我的假期 - 记一笔请假，余额一目了然',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    },
    tripList: {
      title: '我的假期 - 出差报销不遗漏 ✈️',
      path: '/pages/trip/list',
      imageUrl: '/images/share.png'
    },
    tripDetail: {
      title: `出差：${data.name || ''} - 费用清清楚楚`,
      path: `/pages/trip/detail?id=${data.id || ''}`,
      imageUrl: '/images/share.png'
    },
    tripAdd: {
      title: '我的假期 - 记一笔出差，补贴报销算得明明白白',
      path: '/pages/index/index',
      imageUrl: '/images/share.png'
    },
    settings: {
      title: '我的假期 - 你的专属假期管家 🐰',
      path: '/pages/settings/index',
      imageUrl: '/images/share.png'
    }
  }
  return configs[pageName] || configs.index
}

// 复制分享文案到剪贴板
const copyShareText = (pageName, data = {}) => {
  const config = getShareConfig(pageName, data)
  const text = `${config.title}\n快来一起用「我的假期」小程序管理假期和出差吧～`
  wx.setClipboardData({
    data: text,
    success: () => {
      wx.showToast({
        title: '已复制分享文案',
        icon: 'success'
      })
    }
  })
}

module.exports = {
  getShareConfig,
  copyShareText
}
