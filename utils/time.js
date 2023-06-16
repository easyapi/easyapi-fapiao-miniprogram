function timestampToTime(time) {
  var date = new Date(time)
  var len = time.toString().length;
  if (len < 13) {
    var sub = 13 - len;
    sub = Math.pow(10, sub);
    date = new Date(time * sub);
  }
  var y = date.getFullYear() + '年';
  var M = date.getMonth() + 1;
  M = (M < 10 ? '0' + M : M) + '月';
  var d = date.getDate();
  d = (d < 10 ? '0' + d : d) + '日';
  var h = date.getHours();
  h = (h < 10 ? '0' + h : h) + ':';
  var m = date.getMinutes();
  m = (m < 10 ? '0' + m : m);
  return y + M + d + h + m;
}

module.exports = {
  timestampToTime,
}