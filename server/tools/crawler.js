'use strict';

const cheerio = require('cheerio');
const request = require('request');

var url = 'http://www.lafy.gov.cn/list/fayuanxinwen.html';
let newslists = [];
const crawler = request(url, function (err, res, data) {
  if (err) console.log('err');
  let $ = cheerio.load(data);

  $('.listc li').each(function (i, elem) {
    let _this = $(elem);
    newslists.push({
      id: i,
      time: _this.children('span').text(),
      title: _this.children('a').text(),
      detail_url: 'http://www.lafy.gov.cn' + _this.children('a').attr('href')
    })
  })
  return newslists;
})

module.exports = newslists