const result = require('./data/Food.js')
const messages = require('./data/Messages.js')
const ans=require('./data/ResultFood.js')
module.exports.function = function informationFood(food) {
  var goodfoods = ['쑥', '생강', '석류', '땅콩', '우엉', '시금치', '해바라기씨', '오트밀', '콩', '고등어', '오징어', '호박', '유자'];
  var badfoods = ['초콜릿', '사탕', '케이크', '커피', '홍차', '탄산음료', '소세지', '탄산', '햄', '소시지', '과자', '마가린', '술'];
  var console = require("console");

  ans=new Array(5);

  let myArr = [];
  for (let i = 0; i < goodfoods.length; i++) {
    if (goodfoods[i] == food) {
      messages.message = goodfoods[i] + "은(는) 생리통에 좋은 음식입니다.";
      messages.second = "이외에도 생리통에 좋은 음식은";
      let idx = 0;
      while (myArr.length < 6) {
        let tmp = Math.floor(Math.random() * 13);
        var flag = false;
        for (var i = 0; i < idx; i++) {
          if (myArr[i] == goodfoods[tmp]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          myArr[idx] = goodfoods[tmp];
          ans[idx]=result[tmp];
          idx++;
        }
      }
      break;
    }
  }
  for (let i = 0; i < badfoods.length; i++) {
    if (badfoods[i] == food) {
      messages.message = badfoods[i] + "은(는) 생리통에 좋지 않은 음식입니다.";
      messages.second = "생리통에 좋은 음식은 ";
      let idx = 0;
      while (myArr.length < 6) {
        let tmp = Math.floor(Math.random() * 13);
        var flag = false;
        for (var i = 0; i < idx; i++) {
          if (myArr[i] == goodfoods[tmp]) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          myArr[idx] = goodfoods[tmp];
          ans[idx]=result[tmp];
          idx++;
        }
      }
      break;
    }
  }
  if (myArr.length == 0) {
    messages.message = "잘 모르겠습니다 ";
    messages.second = " 생리통에 좋은 음식은 ";
​
​
    let idx = 0;
    while (myArr.length < 6) {
      let tmp = Math.floor(Math.random() * 13);
      var flag = false;
      for (var i = 0; i < idx; i++) {
        if (myArr[i] == goodfoods[tmp]) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        myArr[idx] = goodfoods[tmp];
        ans[idx]=result[tmp];
        idx++;
      }
    }
  }

  return { message: messages.message, second: messages.second, foods: ans, devide: false };
}
