const qcloud = require('../qcloud.js')
const { mysql } = qcloud;

module.exports = async (ctx, next) => {
  var data = [];
  // const compare = p => {
  //   return function (obj1, obj2) {
  //     var value1 = obj1[p];
  //     var value2 = obj2[p];
  //     return value2 - value1;     // 升序
  //   }
  // }
  await mysql('courtNewsList').select('*')
                  .returning('*')
                  .then((res) => {
                      // data = res.sort(compare('newId'))
                      data = res;
                      console.log(data)
                  });
  ctx.body= data;
}