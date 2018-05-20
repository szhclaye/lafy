const getnewsUrl = require('../class/getnewsUrl.js')

module.exports = async (ctx, next) => {
  getnewsUrl();
  // ctx.body = newsUrl;
}