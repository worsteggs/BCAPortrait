import html2canvas from 'html2canvas'
export function saveToFile(elem, name, cb, scrollY) {
  html2canvas(elem, {
    scrollY: scrollY || -window.pageYOffset
  }).then(canvas => {
    var type = 'png'
    var imgData = canvas.toDataURL(type)
    var _fixType = function(type) {
      type = type.toLowerCase().replace(/jpg/i, 'jpeg')
      var r = type.match(/png|jpeg|bmp|gif/)[0]
      return 'image/' + r
    }
    imgData = imgData.replace(_fixType(type), 'image/octet-stream')
    var saveFile = function(data, filename) {
      var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
      save_link.href = data
      save_link.download = filename

      var event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      save_link.dispatchEvent(event)
    }
    var filename = (name || (new Date()).getTime()) + '.' + type
    saveFile(imgData, filename)
    cb && cb()
  })
}

export function saveToImageData(elems) {
  const pros = []
  elems.forEach(e => {
    pros.push(html2canvas(document.getElementById(e), { scrollY: -window.pageYOffset }))
  })
  return Promise.all(pros)
}
