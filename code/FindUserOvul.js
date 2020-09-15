var http = require('http')
var console = require('console')
var config = require('config')
var dates = require('dates')
module.exports.function = function findUserOvul($vivContext) {
  // 유저아이디 가져와서 유저아이디로 정보(menstruation_info)찾기
  var user_id = $vivContext.bixbyUserId;
  var response = http.getUrl(config.get('remote.url') + 'findUserMens.do?user_id=' + user_id, { format: "json" });
  var loveResponse = http.getUrl(config.get('remote.url') + 'findMyLove.do?user_id=' + user_id, { format: "json" });
  console.log(loveResponse);

  //가임기 저장
  var mens_startdate = response.mens_startdate;
  var period = response.mens_period;
  var split = response.mens_startdate.split("-");
  //다음 생리 예정일
  var d1 = new Date(split[0], split[1] - 1, split[2], 0, 0, 0, 0);
  d1.setDate(d1.getDate() + period);

  
  //가임기 마지막날 저장
  d1.setDate(d1.getDate() - 11);
  console.log(d1);
  var ovuldeMonth = d1.getUTCMonth() + 1;
  var ovulEnddate = d1.getUTCFullYear() + "년 " + ovuldeMonth + "월 " + d1.getUTCDate() + "일";
  console.log(ovulEnddate);

  //배란일 저장
  d1.setDate(d1.getDate()-3);
  var ovulMonth = d1.getUTCMonth() + 1;
  var ovuldate = d1.getUTCFullYear() + "년 " + ovulMonth + "월 " + d1.getUTCDate() + "일";

  //가임기 첫날 저장
  d1.setDate(d1.getDate() - 3);
  console.log(d1);
  var ovuldsMonth = d1.getUTCMonth() + 1;
  var ovulStartdate = d1.getUTCFullYear() + "년 " + ovuldsMonth + "월 " + d1.getUTCDate() + "일";


  var loveresult = [];
  var idx = 0;
  for (var item in loveResponse) {
    console.log(loveResponse[item].love_date);
    loveresult[idx++] = loveResponse[item].love_date;
  }
  return {
    ovuldate: ovuldate,
    ovulation_startdate: ovulStartdate,
    ovulation_enddate: ovulEnddate,
    love_date: loveresult
  };
}