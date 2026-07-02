const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { action, data } = event

  const collection = db.collection('user_data')

  try {
    if (action === 'upload') {
      const existing = await collection.where({ _openid: openid }).get()
      if (existing.data.length > 0) {
        await collection.doc(existing.data[0]._id).update({
          data: {
            vacationRecords: data.vacationRecords || [],
            tripRecords: data.tripRecords || [],
            settings: data.settings || {},
            updatedAt: db.serverDate()
          }
        })
      } else {
        await collection.add({
          data: {
            vacationRecords: data.vacationRecords || [],
            tripRecords: data.tripRecords || [],
            settings: data.settings || {},
            createdAt: db.serverDate(),
            updatedAt: db.serverDate()
          }
        })
      }
      return { success: true, message: '上传成功', time: Date.now() }
    } else if (action === 'download') {
      const result = await collection.where({ _openid: openid }).get()
      if (result.data.length > 0) {
        const doc = result.data[0]
        return {
          success: true,
          message: '获取成功',
          data: {
            vacationRecords: doc.vacationRecords || [],
            tripRecords: doc.tripRecords || [],
            settings: doc.settings || {},
            updatedAt: doc.updatedAt
          }
        }
      }
      return { success: false, message: '云端暂无数据' }
    } else if (action === 'check') {
      const result = await collection.where({ _openid: openid }).get()
      if (result.data.length > 0) {
        return {
          success: true,
          hasData: true,
          updatedAt: result.data[0].updatedAt
        }
      }
      return { success: true, hasData: false }
    }
    return { success: false, message: '未知操作' }
  } catch (err) {
    return { success: false, message: '同步失败：' + err.message }
  }
}
