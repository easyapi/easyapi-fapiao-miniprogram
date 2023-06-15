function ifNoLogin() {
  if(!wx.getStorageSync('Authorization')){
    return true
  } else {
    return false
  }
}

module.exports = {
  ifNoLogin: ifNoLogin,
}