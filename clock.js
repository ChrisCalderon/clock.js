const CANVAS = document.getElementById('canvas')
const CTX = CANVAS.getContext('2d')
CTX.font = "20px serif"
CTX.textAlign = "center"
const TWO_PI = Math.PI*2
const PI_OVER_TWO = TWO_PI / 4
const HOUR_ANGLE = TWO_PI/12
const MINUTE_ANGLE = TWO_PI/60
const R = 200
const START_DATE = new Date()
const START_HOUR = START_DATE.getHours()
const START_MINUTE = START_DATE.getMinutes()
const START_SECOND = START_DATE.getSeconds()

var boundaries
function updateBoundaries(){
  boundaries = CANVAS.getBoundingClientRect()
  CANVAS.width = boundaries.width
  CANVAS.height = boundaries.height
}

function updateClock(timestamp){
  var center = {X: boundaries.width/2, Y: boundaries.height/2}

  // clear the clock face
  CTX.clearRect(
    center.X - R - 2, center.Y - R - 2,
    center.X + R + 2, center.Y + R + 2
  )

  // set the line color to black
  CTX.strokeStyle = '#000000'

  // draw outer border of the clock
  CTX.lineWidth = 2
  CTX.beginPath()
  CTX.arc(center.X, center.Y, R, 0, TWO_PI, true)
  CTX.stroke()

  // hour tick marks + numbers
  CTX.lineWidth = 6
  CTX.beginPath()
  for(var hr = PI_OVER_TWO, cos=0, sin=1; hr > (PI_OVER_TWO - TWO_PI + HOUR_ANGLE); hr -= HOUR_ANGLE, cos=Math.cos(hr), sin=Math.sin(hr)){
      CTX.moveTo(
        center.X + (R - 2)*cos,
        center.Y + (R - 2)*sin
      )
      CTX.lineTo(
        center.X + (R - 14)*cos,
        center.Y + (R - 14)*sin
      )
      var time = (Math.abs(Math.floor(hr/HOUR_ANGLE-3))||12).toString()
      //var text = CTX.measureText(time)
      CTX.fillText(
        time,
        center.X + (R - 30)*cos,
        center.Y - (R - 30)*sin
      )
  }
  CTX.stroke()

  // minute tick marks
  CTX.lineWidth = 1
  CTX.beginPath()
  for(var min = 0, cos=1, sin=0; min < TWO_PI; min += MINUTE_ANGLE, cos=Math.cos(min), sin=Math.sin(min)){
    if(min%HOUR_ANGLE==0) continue
    CTX.moveTo(
      center.X + (R - 2)*cos,
      center.Y + (R - 2)*sin
    )
    CTX.lineTo(
      center.X + (R - 6)*cos,
      center.Y + (R - 6)*sin
    )
  }
  CTX.stroke()

  var current_second = START_SECOND + timestamp/1000
  var current_minute = START_MINUTE + current_second/60
  var current_hour = START_HOUR + current_minute/60

  // hour hand
  var current_hour_angle = PI_OVER_TWO - (current_hour%12)*HOUR_ANGLE
  CTX.lineWidth = 10
  CTX.beginPath()
  CTX.moveTo(
    center.X + (R - 50)*Math.cos(current_hour_angle),
    center.Y - (R - 50)*Math.sin(current_hour_angle)
  )
  CTX.lineTo(center.X, center.Y)
  CTX.stroke()

  // minute hand
  var current_minute_angle = PI_OVER_TWO - (current_minute%60)*MINUTE_ANGLE
  CTX.lineWidth = 5
  CTX.beginPath()
  CTX.moveTo(
    center.X + (R - 30)*Math.cos(current_minute_angle),
    center.Y - (R - 30)*Math.sin(current_minute_angle)
  )
  CTX.lineTo(center.X, center.Y)
  CTX.stroke()

  // seconds hand
  var current_seconds_angle = PI_OVER_TWO - (current_second%60)*MINUTE_ANGLE
  CTX.lineWidth = 3
  CTX.strokeStyle = '#ff0000'
  CTX.beginPath()
  CTX.moveTo(
    center.X + (R - 20)*Math.cos(current_seconds_angle),
    center.Y - (R - 20)*Math.sin(current_seconds_angle)
  )
  CTX.lineTo(center.X, center.Y)
  CTX.stroke()

  requestAnimationFrame(updateClock)
}

updateBoundaries()
requestAnimationFrame(updateClock)
