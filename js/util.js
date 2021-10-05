function printMat(mat, selector) {
    var strHTML = '<table ><tbody>';
    for (var i = 0; i < mat.length; i++) {
      strHTML += '<tr>';
      for (var j = 0; j < mat[0].length; j++) {
        var cell = mat[i][j];
        var className = `cell cell${i}-${j} `
        strHTML += `<td class="${className}" onclick="cellClicked(this ,${i},${j},)" oncontextmenu="flagMark(this,${i},${j})"></td>`
      }
      strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function startTimer() {
    var startTime = Date.now();
    updateTimer(startTime);
}


function startTimer(startTime) {
  var elTimer = document.querySelector('.timer')
  gTimerInterval = setInterval(() => {
    var totalSecs = Math.floor((Date.now() - startTime) / 1000)
    var hour = Math.floor(totalSecs / 3600)
    var minute = Math.floor((totalSecs - hour * 3600) / 60)
    var seconds = totalSecs - (hour * 3600 + minute * 60)
    if (hour < 10) hour = '0' + hour
    if (minute < 10) minute = '0' + minute
    if (seconds < 10) seconds = '0' + seconds
    elTimer.innerHTML = `${hour}:${minute}:${seconds}`
  }, 1000)
}