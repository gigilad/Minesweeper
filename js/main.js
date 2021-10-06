'use strict'
const HINT ='💡'
const life = '💘'
const PLAY = '😃'
const WIN ='🤑'
const LOSE = '😪'
const FLAG ='🚩';
const MINE = '💣';
var isHint = false;
var bestScore = 0;
var gBoard;
var isTimeON = false;
var gTimerInterval;
var gFirstMove = true
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    safeClick:3,
    hints:3
}
var gLevel;
var elLive1 = document.querySelector('.live1')
 var elLive2 = document.querySelector('.live2')
var elLive3 = document.querySelector('.live3')
var elHint1 = document.querySelector('.hint1')
 var elHint2 = document.querySelector('.hint2')
var elHint3 = document.querySelector('.hint3')

 gLevel = {
    size: 4,
    mines: 2

};

function setLevel(length, mines){
    gFirstMove= true
    elLive1.innerText = life
    elLive2.innerText = life
    elLive3.innerText = life
if (length === 4)  {
    gLevel.size = length 
     gLevel.mines = mines
     gLevel.bestScore = 0;
}else if (length === 8)  {
    gLevel.size = length 
     gLevel.mines = mines
     gLevel.bestScore=0;

} else if (length === 12) {
    gLevel.size = length 
     gLevel.mines = mines
     gLevel.bestScore = 0;

    
}
inIt()
    
}

function inIt() {
    const noContext = document.getElementById('noContextMenu');
  noContext.addEventListener('contextmenu', e => {
  e.preventDefault();
});
    elHint1.innerText =HINT
    elHint2.innerText =HINT
    elHint3.innerText =HINT
    clearInterval(gTimerInterval)
  gTimerInterval = null
    isTimeON = false
    var elTimer = document.querySelector('.timer')
    elTimer.innerText = '00:00:00'
    gGame.safeClick=3
    gGame.lives = 3
    gGame.hints =3;
    gGame.shownCount = 0
    renderEmoji(PLAY)
    gGame.isOn = true
    var elScore = document.querySelector('.score span')
    elScore.innerText = gGame.shownCount
    gBoard = createBoard(gLevel.size, gLevel.mines)
    printMat(gBoard, '.board')
    
}

function createBoard(size, mines ) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount : 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    console.table(board)
    return board
}

function addRandMines(board) {
  var minesCount=0;
//add random mines acoording to the amount
while(minesCount !== gLevel.mines){
var ranICell =getRandomInt(0, gLevel.size -1)
var ranJCell =getRandomInt(0,gLevel.size-1)
if (board[ranICell][ranJCell].isMine) continue
if (board[ranICell][ranJCell].isShown) continue
  
board[ranICell][ranJCell] = {
 minesAroundCount : 0,
isShown: false,
isMine: true,
isMarked: false
}
minesCount++

}
}

function setMinesNegsCount(board) {
    //set mines count for each cell for the model
    var countMines;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine)continue
                
            countMines = getMinesNegsCount(board, i, j)
            if (countMines === 0) continue
            board[i][j].minesAroundCount = countMines

            
            }
        }
    }

function getMinesNegsCount(board, celli, cellj) {
    //get the number of mines for specific cell
    var count = 0;
    for (var i = celli-1; i <= celli+1; i++) {
        if(i < 0 ||i >= board.length)continue
        for (var j = cellj-1; j <= cellj+1; j++) {
            if (i === celli && j === cellj) continue;
            if( j < 0 || j >= board[0].length)continue 
           if (board[i][j].isMine) {
                count++
            }
            
        }

    }
    return count
}


function cellClicked(elCell, cellIidx, cellJIdx) {
    if (!gGame.isOn) return

    var minesNegsCount
      if (gFirstMove) {
          gFirstMove = false
          if (!isTimeON) {
            startTimer(Date.now())
            isTimeON = true
          }
          gGame.shownCount++
          gBoard[cellIidx][cellJIdx].isShown= true
          elCell.innerText = gBoard[cellIidx][cellJIdx].minesAroundCount
          elCell.style.backgroundColor = "#ffd3d3"
          addRandMines(gBoard)
          setMinesNegsCount(gBoard)
        //   expandShown(gBoard, cellIidx, cellJIdx)
            console.table(gBoard) 
            
            updaeScore()
            return
      }
      if (isHint) {
          expandShownForSec(gBoard, cellIidx, cellJIdx)
          gGame.hints--
          isHint = false;
          return

          
      }

    if (gBoard[cellIidx][cellJIdx].isMine){
        gBoard[cellIidx][cellJIdx].isShown =true
        elCell.innerText = MINE
        elCell.style.backgroundColor = "red"
        gBoard[cellIidx][cellJIdx].isMarked
        gBoard[cellIidx][cellJIdx].isShown
        gGame.markedCount++
        gGame.lives--
        if (gGame.lives === 0) {
            elLive3.innerText= ''
            GameOver()
        }else{
        decreseLife()
        checkVictory(gBoard)
        return
        }
    }

    if (!gBoard[cellIidx][cellJIdx].isShown)  {
     gBoard[cellIidx][cellJIdx].isShown =true
     gBoard[cellIidx][cellJIdx].innerText=gBoard[cellIidx][cellJIdx].minesAroundCount
     gGame.shownCount++
     updaeScore()
    minesNegsCount = getMinesNegsCount(gBoard, cellIidx, cellJIdx)
   if (minesNegsCount===0) {
       gBoard[cellIidx][cellJIdx].isShown =true
       elCell.style.backgroundColor = "#ffd3d3"
     expandShown(gBoard, cellIidx, cellJIdx)
     updaeScore()
     checkVictory(gBoard)

   }
    else{
        elCell.style.backgroundColor = "#ffd3d3"
        elCell.innerText = minesNegsCount
            }
}
checkVictory(gBoard)


}

function updaeScore() {
    var elScore = document.querySelector('.score span')
    elScore.innerText = gGame.shownCount
    
    
}

function flagMark(elCell, i, j) {
    console.log(gBoard);
    var cell = gBoard[i][j];
    if (!cell.isShown) {
        if (cell.isMarked) {
            cell.isMarked = false;
            gGame.markedCount++;
            elCell.innerText = '';
        } else if (gGame.markedCount < gLevel.mines) {
            cell.isMarked = true;
            gGame.markedCount++;
            elCell.innerText = FLAG;
            checkVictory(gBoard)

        }
    }
}
function restartGame() {
var timer = document.querySelector('.timer')
  timer.innerText = '00:00:00'
  clearInterval(gTimerInterval)
  gTimerInterval = null
  var elScore = document.querySelector('.score span')
  elScore.innerText = gGame.shownCount
  elLive1.innerText =life
  elLive2.innerText =life
  elLive3.innerText =life
  gFirstMove= true
  isTimeON =false
  inIt()
    
}

function GameOver() {
    renderEmoji(LOSE)
    for (var i = 0; i < gBoard.length; i++) {
for (var j = 0; j < gBoard[0].length; j++) {
if (gBoard[i][j].isMine){
    var pos = {i:i, j:j}
    var elCell = document.querySelector(`.cell${i}-${j}`)
    elCell.innerText = MINE
    elCell.style.backgroundColor = "red"
}
}        
    }
        clearInterval(gTimerInterval)
  gTimerInterval = null
  gGame.isOn =false
  if(gGame.shownCount > gLevel.bestScore){
 gLevel.bestScore =gGame.shownCount
  setLocalStorage(gLevel.size)
  console.log(localStorage);
  }

}

function expandShown(board, idxI, idxJ) {
    for (var i = idxI-1; i <= idxI+1 ; i++) {
        if(i < 0 ||i >= board.length)continue
        for (var j = idxJ-1; j <= idxJ +1 ; j++) {
            if(i === idxI && j ===idxJ)continue
            if( j < 0 || j >= board[0].length)continue 
            var pos = {i:i, j:j} 
            if (!board[i][j].isShown) {
                board[i][j].isShown = true
                var elCell = document.querySelector(`.cell${pos.i}-${pos.j}`)
                elCell.innerText = board[pos.i][pos.j].minesAroundCount
                elCell.style.backgroundColor = "#ffd3d3"
                gGame.shownCount++
                if (board[pos.i][pos.j].minesAroundCount ===0) {
                    expandShown(gBoard, pos.i, pos.j)
                }

            }
         
        }

    
}
}
function renderCell(pos, value) {
    var elCell = document.querySelector(`.cell${pos.i}-${pos.j}`)
    elCell.innerText = value
    elCell.style.backgroundColor = "#ffd3d3"

  }
function renderEmoji(gameMode) {
    var elEmoji = document.querySelector('.emoji')
    elEmoji.innerText= `${gameMode} RESTART`
    
}
  function checkVictory(board){
      if ((gGame.shownCount === (gLevel.size *gLevel.size) -gLevel.mines) &&(gGame.markedCount === gLevel.mines)) {
        renderEmoji(WIN)
        alert('GOOD JOB!')
        if(gGame.shownCount > gLevel.bestScore){
            gLevel.bestScore =gGame.shownCount
           setLocalStorage(gLevel.size)
           console.log(localStorage);
        }
        clearInterval(gTimerInterval)
        gTimerInterval = null
        gGame.isOn =false
     
      } 
    
  }
  function decreseLife() {

      if (elLive1.innerText === life){
          elLive1.innerText = ''
          return
      }
      if (elLive2.innerText === life){
        elLive2.innerText = ''
          return   
      }
      if (elLive3.innerText === life){
        elLive3.innerText= ''
          return   
    }
    else{

        GameOver()
    }
}

function safeClick(elSafeBtn){
    if (gFirstMove) return
    if (elSafeBtn.innerText === '') return
    if (gGame.safeClick === 0) {
        alert('NO SAFE CLICK LEFT')
        return }
    

    var emptyCells=[]
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine || currCell.isShown) continue
            emptyCells.push({i:i, j:j})    
        }
        
    }
    if (!emptyCells.length) {
    console.log('NO EMPTYCELLS');
}else{
    gGame.safeClick--
     elSafeBtn.innerText = `${gGame.safeClick} safe click left`
    var randomIdx = getRandomInt(0, emptyCells.length-1)
    var pos = {i:emptyCells[randomIdx].i, j:emptyCells[randomIdx].j}
    console.log(pos);
      var elCell = document.querySelector(`.cell${pos.i}-${pos.j}`);
      elCell.style.backgroundColor ='lightseagreen'
      setTimeout(() => {
        elSafeBtn.innerText = 'SAFE CLICK'
        elCell.style.backgroundColor ='#f1d483'

      
      }, 3000);
    }
    }
    function setLocalStorage(levelSize){
        if (levelSize === 4) {
            if (!localStorage.getItem("easy-mode")) {
                localStorage.setItem("easy-mode",`${gLevel.bestScore}`)  
            }else {
                localStorage.removeItem("easy-mode")
                localStorage.setItem("easy-mode",`${gLevel.bestScore}`)  

            }
            return
        }
        if (levelSize === 8) {
            if (!localStorage.getItem("medium-mode")) {
                localStorage.setItem("medium-mode",`${gLevel.bestScore}`)  
            }else {
                localStorage.removeItem("medium-mode")
                localStorage.setItem("medium-mode",`${gLevel.bestScore}`)  

            }         
            return   
        }
        if (levelSize === 12) {
            if (!localStorage.getItem("hard-mode")) {
                localStorage.setItem("hard-mode",`${gLevel.bestScore}`)  
            }else {
                localStorage.removeItem("hard-mode")
                localStorage.setItem("hard-mode",`${gLevel.bestScore}`)  

            }            
        }

    }
function getHint(elHint) {
    if (gGame.hints === 0) {
        alert('sorry no hints left..')
        return
    }
    
    isHint = true
    elHint.innerText =''
    
}
function expandShownForSec(board, idxI,idxJ) {
    for (var i = idxI-1; i <= idxI+1 ; i++) {
        if(i < 0 ||i >= board.length)continue
        for (var j = idxJ-1; j <= idxJ +1 ; j++) {
            if( j < 0 || j >= board[0].length)continue 
            var pos = {i:i, j:j} 
            if (!board[i][j].isShown) {
                var elCell = document.querySelector(`.cell${pos.i}-${pos.j}`)
                elCell.innerText = board[pos.i][pos.j].minesAroundCount
                elCell.style.backgroundColor = "#ffd3d3"
            }
}
    }
 setTimeout(() => {
 for (var i = idxI-1; i <= idxI+1 ; i++) {
      if(i < 0 ||i >= board.length)continue
        for (var j = idxJ-1; j <= idxJ +1 ; j++) {
                if( j < 0 || j >= board[0].length)continue 
                var pos = {i:i, j:j} 
                if (!board[i][j].isShown) {
                    var elCell = document.querySelector(`.cell${pos.i}-${pos.j}`)
                    elCell.innerText = ''
                    elCell.style.backgroundColor = "#f1d483"
                    
                }
    }
        }
    }, 3000);
}