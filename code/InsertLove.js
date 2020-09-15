var http = require('http')
var console = require('console')
var config = require('config')
var dates = require('dates')

module.exports.function = function insertLove(love_date, $vivContext) {
  // 유저아이디 가져와서 유저아이디로 정보(menstruation_info)찾기
  var user_id = $vivContext.bixbyUserId;

  let love = dates.ZonedDateTime.fromDate(love_date.date);
  var l_date = love.getYear().toString() + "-" + love.getMonth().toString() + "-" + love.getDay().toString();

  var response = http.getUrl(config.get('remote.url') + 'insertLove.do?user_id=' + user_id + "&love_date=" + l_date, { format: 'json' });

  console.log(response);
  return response;
}