// 获取新闻列表
const newslist = require('../tools/crawler.js')

module.exports = async (ctx, next) => {
  ctx.body = newslist;
}