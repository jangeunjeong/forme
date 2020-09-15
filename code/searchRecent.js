module.exports.function = function searchRecent (keyword,showVideo) {
  const console = require('console');
  const http = require('http');
  const config = require('config');
  const secret = require('secret');
  const dates = require('dates');

  const serviceKey = secret.get('youtubeserviceKey');
  console.log("serviceKey:"+serviceKey);

  const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=생리통%2B"+keyword+"&key="+serviceKey+"&maxResults=15";
    console.log("url : "+url);
    let data = http.getUrl(url, {
    format: 'json' 
  });
  if (!data.items) {
    throw "영상을 얻어오지 못했어요.";
  }
  let videoList = [];

console.log("**data.items.length : "+ data.items.length);
  for (let i=0; i<data.items.length; ++i) {
    let video = data.items[i];

    videoList.push({
      url: "https://www.youtube.com/watch?v=" + video.id.videoId,
      title: video.snippet.title,
      thumbnail: video.snippet.thumbnails.medium.url,
    })
  }
    console.log(videoList);
  return {
    video: videoList,
  };
}
