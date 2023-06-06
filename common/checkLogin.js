/**
 * 检查登录状态
 */
export const checkLoginStatus = (from) => {
  const userInfo = wx.getStorageSync('user')
  if (!userInfo) {
    getApp().globalData.from = from
    wx.redirectTo({
      url: '/pages/login/login/login',
    })
  }
}