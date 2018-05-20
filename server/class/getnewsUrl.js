//依赖
const cheerio = require('cheerio');
const request = require('request');
const eventproxy = require('eventproxy');
const rp = require('request-promise');
const qcloud = require('../qcloud.js')
const { mysql } = qcloud;
var ep = new eventproxy();

const url = 'http://www.lafy.gov.cn/list/fayuanxinwen.html'
var newsUrls = []; //存放新闻的网址 
var newsObjs = [];
var newsObj = {};
var newId = 0;

// 获取网址网址
function getNewsDetailUrl(url) {
  var options = {
    uri: url,
    transform: function (body) {
      return cheerio.load(body);
    }
  }
  rp(options)
    .then(function ($) {
      // Process html like you would with jQuery...
      $('.listc li').each(function (i, elem) {
        let _this = $(elem);
        var articleItem = 'http://www.lafy.gov.cn' + _this.children('a').attr('href');
        newsUrls.push(articleItem);
      })

      ep.emit('BlogArticleHtml', newsUrls);
      return newsUrls
    })
    .catch(function (err) {
      return console.log(err)
    });

  ep.after('BlogArticleHtml', 1, async (newsUrls) => {
    // console.log('ep after')
    // console.log('newsUrls->', newsUrls[0])
    // console.log('<-newsUrls end->')
    await getNewsDetailContent(newsUrls[0])
  });
}

// 获取详细新闻内容
function getNewsDetailContent(newsUrls) {
  console.log('newsUrls------->', newsUrls)
  newsUrls.map(function (elem) {
    getNewsDetailContentItem(elem);
    // console.log('newsObj------->', JSON.stringify(newsObj))  
  })

  // ep.after('NewsPageHtml', newsUrls.length-1, async (newsObj) => {
  //   console.log('NewsPageHtml', newsObj)
  //   // mysql('courtNewsList').insert(newsObj)
  //   //                       .returning('*')
  //   //                       .then(res =>{
  //   //                         console.log('mysql success',res)
  //   //                       })
  //   newsObjs.push(newsObj);
  // });
}
async function getNewsDetailContentItem(newUrl) {
  console.log('getNewsDetailContentItem,newUrl', newUrl)
  newsObj = {};
  var options = {
    uri: newUrl,
    transform: function (body) {
      return cheerio.load(body);
    }
  }
  rp(options)
    .then(function ($) {
      // Process html like you would with jQuery...
      // Header
      $('.box .hd').each(function (i, elem) {
        let _this = $(elem);
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
      $('#zoom p').each(function (i, elem) {
        let _this = $(elem);
        if (_this.is(':has(img)')) {
          pageImgUrl.push('http://www.lafy.gov.cn' + _this.find('img').attr('src'));
        } else {
          pageContent.push(_this.text())
        }
      })
      newsObj.pageImgUrl = pageImgUrl.join('+');
      newsObj.pageContent = pageContent.join('\n');
      mysql('courtNewsList').insert(newsObj)
                          .returning('*')
                          .then(res =>{
                            console.log('mysql success',res)
                          })
    })
    .catch(function (err) {
      return console.log(err)
    });
}



module.exports = async () => {
  await getNewsDetailUrl(url);
}