var http = require('http')
var console = require('console')
var config = require('config')
var dates = require('dates')

module.exports.function = function insertMens(mens_startdate, $vivContext) {
  // 유저아이디 가져와서 유저아이디로 정보(menstruation_info)찾기
  var user_id = $vivContext.bixbyUserId;
  console.log(user_id);
  console.log(mens_startdate);
  let msd = dates.ZonedDateTime.fromDate(mens_startdate.date);
  var msd_date=msd.getYear().toString() + "-" + msd.getMonth().toString() + "-" + msd.getDay().toString();
  console.log(msd_date);
  
  var response = http.getUrl(config.get('remote.url') + 'insertMens.do?user_id=' + user_id + "&mens_startdate=" + msd_date, {format : 'json'});

  console.log(response);
  return response;
}