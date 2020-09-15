var http = require('http')
var console = require('console')
var config = require('config')
var dates = require('dates')
module.exports.function = function findUserMens($vivContext) {
 // 유저아이디 가져와서 유저아이디로 정보(menstruation_info)찾기
 var user_id = $vivContext.bixbyUserId;
 var response = http.getUrl(config.get('remote.url') + 'findUserMens.do?user_id=' + user_id, { format: "json" });
 var mens_startdate = response.mens_startdate;
 var period = response.mens_period;
 var split = response.mens_startdate.split("-");
 var d1 = new Date(split[0], split[1] - 1, split[2], 0, 0, 0, 0);
 d1.setDate(d1.getDate() + period);
 console.log(d1);
 console.log(d1.toString());
 var nextyear = d1.getUTCFullYear();
 var nextmonth = d1.getUTCMonth() + 1;
 var nextday = d1.getUTCDate();
 var nextdate = nextyear + "년 " + nextmonth + "월 " + nextday + "일";
 return nextdate;
}