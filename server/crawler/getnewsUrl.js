//依赖
const cheerio = require('cheerio');
const request = require('request');
// const eventproxy = require('eventproxy');
const rp = require('request-promise');
const qcloud = require('../qcloud.js')
const { mysql } = qcloud;
// var ep = new eventproxy();

const url = 'http://www.lafy.gov.cn/list/fayuanxinwen.html'
var newId = 0;
mysql('courtNewsList').del()       
                    .returning('*')
                    .then(() => {
                      console.log('mysql del success')
                    })

// 获取网址网址
const getNewsDetailUrl = async (url) => {
  const options = {
    uri: url,
    transform: function (body) {
      return cheerio.load(body);
    }
  }
  var $ = await rp(options);
  var newsUrls = [];
  console.log(1)
  $('.listc li').each(function () {
    let _this = $(this);
    var articleItem = 'http://www.lafy.gov.cn' + _this.children('a').attr('href');
    newsUrls.push(articleItem);
  })
  return newsUrls
}
// news Item
const getNewsDetailContentItem = async (newsUrlItem) => {
  var options = {
    uri: newsUrlItem,
    transform: function (body) {
      return cheerio.load(body);
    }
  }
  var $ = await rp(options);
  var newsObj = {};
  $('.box .hd').each(function () {
    let _this = $(this);
    var title = _this.children('h1').text();
    var time = _this.find('span').text().slice(0, 11);
    var readnum = _this.find('strong').text();
    newsObj.newId = newId++;
    newsObj.title = title;
    newsObj.time = time;
    newsObj.readnum = readnum;
  })
  var pageImgUrl = [];
  var pageContent = [];
  // 正文
  $('#zoom p').each(function () {
    let _this = $(this);
    if (_this.is(':has(img)')) {
      pageImgUrl.push('http://www.lafy.gov.cn' + _this.find('img').attr('src'));
    } else {
      pageContent.push(_this.text())
    }
  })
  newsObj.pageImgUrl = pageImgUrl.join('+');
  newsObj.pageContent = pageContent.join('\n');
  return newsObj;
}

const start = async () => {
  var newsConentsData = []
  var newsUrlArr = await getNewsDetailUrl(url);
  var newsConents = await Promise.all(newsUrlArr.map(item => getNewsDetailContentItem(item)))
  const compare = property => {
    return function (obj1, obj2) {
      var value1 = obj1[property];
      var value2 = obj2[property];
      return value1 - value2;     // 升序
    }
  }
  newsConentsData = newsConents.sort(compare('newId')); //
  newsConentsData.map(item =>{
    mysql('courtNewsList').insert(item)
                          .returning('*')
                          .then(res =>{
                            console.log('mysql success',res)
                          })
  })
}
start();
