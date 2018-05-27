const qcloud = require('../qcloud.js')
const { mysql } = qcloud;

function stringToDate(fDate) {
  var fullDate = fDate.split("-");
  console.log('fullDate',fullDate)
  return new Date(fullDate[0], fullDate[1]-1, fullDate[2]);
} 

module.exports = async (ctx, next) => {
  var data = [];
  const compare = p => {
    return function (obj1, obj2) {
      var value1 = obj1[p];
      var value2 = obj2[p];
      return value2 - value1;     // 升序
    }
  }
  await mysql('courtNewsList').select('*')
    .returning('*')
    .then((res) => {
      Array.prototype.forEach.call(res, function (el) {
        var newsObj = {};
        newsObj.newId = el.newId;
        newsObj.title = el.title;
        newsObj.time = el.time.replace(/-/g, '');;
        newsObj.readnum = el.readnum;
        newsObj.pageContent = el.pageContent;
        newsObj.pageImgUrl = el.pageImgUrl.replace(/^\s+|\s+$/g, "").split('+');
        data.push(newsObj);
      });
      cdata = data.sort(compare('time'))    //按时间先后排序
      // data = res;
      console.log(cdata)
    });
  ctx.body = cdata;
}