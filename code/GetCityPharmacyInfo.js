module.exports.function = function getCityPharmacyInfo(pharmacyvocab, point, pointaddr, sword, city, sigungu) {
  const console = require('console');
  var result = [];
  if (city[city.length - 1] == "시") {
    city = city.substring(0, city.length - 1);
  }

  if (city == "충남" || city == "충청남") {
    city = "충청남도";
  } if (city == "충북" || city == "충청북") {
    city = "충청북도";
  } if (city == "전남" || city == "전라남") {
    city = "전라남도";
  } if (city == "전북" || city == "전라북") {
    city = "전라북도";
  } if (city == "경기") {
    city = "경기도";
  } if (city == "경남" || city == "경상남") {
    city = "경상남도";
  } if (city == "경북" || city == "경상북") {
    city = "경상북도";
  } if (city == "강원") {
    city = "강원";
  } if (city == "제주" || city == "제주특별자치") {
    city = "제주특별자치도";
  }


  console.log(city);
  console.log(sigungu);
  var input = ["근처", "주변", "가까운", "근방", "가장 가까운", "진짜 가까운", "완전 가까운", "근처 가까운", "근방 가까운"];
  var flag = true;
  var Data = null;
  for (let i = 0; i < input.length; i++) {
    if (city == input[i]) {
      console.log("들어옴");
      var addrs = getMyPosition(pointaddr, point);
      // console.log(addrs.addr.locality);
      // console.log(addrs.addr.subLocalityOne);
      Data = getPharmacy_around(point.point.latitude, point.point.longitude, addrs.addr.locality, addrs.addr.subLocalityOne);
      flag = false;
      break;
    }
  }

  if (flag) {
    Data = getPharmacy(city, sigungu);
  }
  // if(Data.length == 0) {
  //   throw "해당 위치에는 공공데이터에 등록된 약국이 없습니다.";
  // }

  for (let i = 0; i < Data.length; i++) {
    if (i > 10) {
      break;
    }

    Data[i].username = '사용자';
    Data[i].routeurl = makeRouteURL(point.point.latitude, point.point.longitude, Data[i].point.latitude, Data[i].point.longitude);
    Data[i].mypoint = Object.assign({}, point);
    // console.log(Data[i].url);


    let srclat = point.point.latitude;
    let srclon = point.point.longitude;
    let dstlat = Data[i].point.point.latitude;
    let dstlon = Data[i].point.point.longitude;

    Data[i].routeurl = makeRouteURL(srclat, srclon, dstlat, dstlon);
    Data[i].mypoint = Object.assign({}, point);


    result.push(Data[i]);
  }
  /////[ 약국 정렬 ]//////////////////////////
  if (!flag) {
    result.sort(function (a, b) {
      return a.distance - b.distance;
    })

  }
  //////////////////////////////////////////
  console.log(result);
  return result;
}


function getMyPosition(pointaddr, point) {
  var console = require('console')
  // console.log(point)
  // console.log(pointaddr)
  return {
    mypos: {
      longitude: point.longitude,
      latitude: point.latitude
    },
    addr: pointaddr
  };
}



function makeMapURL(lat, lon) {
  var googleMapURL = 'https://www.google.com/maps/place/';

  return googleMapURL + lat + ',' + lon;
}

function makeRouteURL(lat1, lon1, lat2, lon2) {
  var googleRouteURL = 'https://www.google.com/maps/dir/'

  return googleRouteURL + lat1 + ',' + lon1 + '/' + lat2 + ',' + lon2;
}

//////////////////////////////////////////////////////

function getPharmacy(city, sigungu) {
  const console = require('console');
  const config = require('config');
  const secret = require('secret');
  const http = require('http');

  const pharmacyBaseUrl = config.get('pharmacybaseUrl');
  const serviceKey = secret.get('mapserviceKey');
  const numOfRows = config.get('numOfRows');
  console.log("pharmacyBaseUrl : " + pharmacyBaseUrl);
  console.log("serviceKey : " + serviceKey);

  var options = {
    format: 'xmljs',
    headers: {
      'accept': 'application/xml'
    },
  };

  //전체 정보 받아오기

  // Q0 : 주소 (시도) , Q1 : 주소(시군구)
  let Q0 = encodeURIComponent(city); // 주소 (시도)
  let Q1 = encodeURIComponent(sigungu); //주소(시군구)
  console.log("Q0 : " + Q0);
  console.log("Q1 : " + Q1);
  var pharUrl = pharmacyBaseUrl + "getParmacyListInfoInqire?" + "serviceKey=" + serviceKey + "&Q0=" + Q0 + "&Q1=" + Q1 + "&QT=1&pageNo=1&numOfRows=" + numOfRows; //&ORD=NAME
  console.log("pharUrl : " + pharUrl);

  var response = http.getUrl(pharUrl, options);
  var NOR = response.response.body.totalCount;
  console.log("NOR (totalCount): " + NOR);

  var bodyItems = response.response.body.items;
  console.log("item : " + bodyItems.item);
  console.log("items : " + bodyItems.items);
  var lAllreqData = [];
  for (let i = 0; i < NOR; i++) {
    if (bodyItems.item[i] != undefined) {
      var wLat = bodyItems.item[i].wgs84Lat;
      var wLon = bodyItems.item[i].wgs84Lon;
      ///////////////////////////////////////////////////////////
      let dummyData = require("./data/PharmacyInfo.js");
      let dummyPointPoint = Object.assign({}, { latitude: wLat, longitude: wLon });
      let dummyPoint = { point: dummyPointPoint };

      dummyData[0].point = Object.assign({}, dummyPoint);
      dummyData[0].dutyaddr = bodyItems.item[i].dutyAddr;
      dummyData[0].dutyname = bodyItems.item[i].dutyName;
      dummyData[0].dutytel = phoneFomatter(bodyItems.item[i].dutyTel1);
      dummyData[0].endtime = timeFomatter(bodyItems.item[i].dutyTime1s, bodyItems.item[i].dutyTime1c);
      dummyData[0].url = makeMapURL(wLat, wLon);

      let deepCopy = Object.assign({}, dummyData[0]);
      lAllreqData.push(deepCopy);
    }
  }
  return lAllreqData;
}

function getPharmacy_around(lat, lon, city, sigungu) {

  const console = require('console');
  const config = require('config');
  const secret = require('secret');
  const http = require('http');
  console.log("lat:" + lat);
  console.log("lon:" + lon);
  console.log("city:" + city);
  console.log("sigungu:" + sigungu);

  const pharmacyBaseUrl = config.get('pharmacybaseUrl');
  const serviceKey = secret.get('mapserviceKey');
  const numOfRows = config.get('numOfRows');
  console.log("pharmacyBaseUrl : " + pharmacyBaseUrl);
  console.log("serviceKey : " + serviceKey);
  console.log("lat : " + lat);
  console.log("lon : " + lon);

  var options = {
    format: 'xmljs',
    headers: {
      'accept': 'application/xml'
    },
  };

  var mywLat = lat;
  var mywLon = lon;

  // Q0 : 주소 (시도) , Q1 : 주소(시군구)
  let Q0 = encodeURIComponent(city); // 주소 (시도)
  let Q1 = encodeURIComponent(sigungu); //주소(시군구)

  console.log("Q0 : " + Q0);
  console.log("Q1 : " + Q1);
  var pharUrl = pharmacyBaseUrl + "getParmacyListInfoInqire?" + "serviceKey=" + serviceKey + "&Q0=" + Q0 + "&Q1=" + Q1 + "&QT=1&pageNo=1&numOfRows=" + numOfRows; //&ORD=NAME
  console.log("pharUrl : " + pharUrl);

  var response = http.getUrl(pharUrl, options);
  var NOR = response.response.body.totalCount;
  console.log("NOR (totalCount): " + NOR);

  var bodyItems = response.response.body.items;
  console.log("item : " + bodyItems.item);
  console.log("items : " + bodyItems.items);
  var lAllreqData = [];
  for (let i = 0; i < NOR; i++) {
    if (bodyItems.item[i] != undefined) {
      var wLat = bodyItems.item[i].wgs84Lat;
      var wLon = bodyItems.item[i].wgs84Lon;
      ///////////////////////////////////////////////////////////
      var distanceKiloMeter = distance(mywLat, mywLon, wLat, wLon, "kilometer");
      if (distanceKiloMeter < 10) {    // 거리가 5키로 이하일 때
        let dummyData = require("./data/PharmacyInfo.js");
        let dummyPointPoint = Object.assign({}, { latitude: wLat, longitude: wLon });
        let dummyPoint = { point: dummyPointPoint };

        dummyData[0].point = Object.assign({}, dummyPoint);
        dummyData[0].distance = distanceKiloMeter;
        dummyData[0].dutyaddr = bodyItems.item[i].dutyAddr;
        dummyData[0].dutyname = bodyItems.item[i].dutyName;
        dummyData[0].dutytel = phoneFomatter(bodyItems.item[i].dutyTel1);
        dummyData[0].endtime = timeFomatter(bodyItems.item[i].dutyTime1s, bodyItems.item[i].dutyTime1c);
        dummyData[0].url = makeMapURL(wLat, wLon);

        let deepCopy = Object.assign({}, dummyData[0]);
        lAllreqData.push(deepCopy);
      }
    }
  }
  return lAllreqData;
}
///////////////////////////////////////////////////////////////////
function distance(lat1, lon1, lat2, lon2, unit) {
  var theta = lon1 - lon2;
  var dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
  dist = Math.acos(dist);
  dist = rad2deg(dist);
  dist = dist * 60 * 1.1515;
  if (unit == "kilometer") {
    dist = dist * 1.609344;
  }

  return (dist);
}

// This function converts decimal degrees to radians
function deg2rad(deg) {
  return (deg * Math.PI / 180.0);
}

// This function converts radians to decimal degrees
function rad2deg(rad) {
  return (rad * 180 / Math.PI);
}




function phoneFomatter(num) { //병원 연락처
  var formatNum = '';

  if (typeof (num) != 'undefined') {
    if (num.length == 11) {
      formatNum = num.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (num.length == 8) {
      formatNum = num.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else {
      if (num.indexOf('02') == 0) {
        formatNum = num.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
      } else {
        formatNum = num.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      }
    }
  }

  return formatNum;
}



function timeFomatter(stime, ctime) {
  var formatTime = '';
  if (typeof (stime) != 'undefined' || typeof (ctime) != 'undefined') {
    if (stime.length == 4 || ctime.length == 4) {
      if (Number(ctime.substring(0, 2)) > 24) {
        formatTime = '24시간 영업'
      } else {
        formatTime = stime.substring(0, 2) + ':' + stime.substring(2, 4) + ' ~ ' + ctime.substring(0, 2) + ':' + ctime.substring(2, 4);
      }
    } else {
      formatTime = '영업시간 알 수 없음'
    }
  }
  return formatTime;
}