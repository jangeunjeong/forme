var http = require('http')
var console = require('console')
var config = require('config')
var dates = require('dates')

module.exports.function = function endMens(mens_enddate, $vivContext) {
  // 유저아이디 가져와서 유저아이디로 정보(menstruation_info)찾기
  var user_id = $vivContext.bixbyUserId;
  let med = dates.ZonedDateTime.fromDate(mens_enddate.date);
  var med_date = med.getYear().toString() + "-" + med.getMonth().toString() + "-" + med.getDay().toString();

  var response = http.getUrl(config.get('remote.url') + 'endMens.do?user_id=' + user_id + "&mens_enddate=" + med_date, { format: "json" });

  console.log(response);
  return response;
}