module.exports.function = function getMyPosition (pointaddr, point) {
  var console = require('console')
  console.log(point)
  console.log(pointaddr)
  return {
      mypos: {
        longitude: point.longitude, 
        latitude : point.latitude
      },
      addr : pointaddr
  }; 
}
