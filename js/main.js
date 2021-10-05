'use strict'
const life = '💘'
const PLAY = '😃'
const WIN ='🤑'
const LOSE = '😪'
const FLAG ='🚩';
const MINE = '💣';

var gBoard;
var isTimeON = false;
var gTimerInterval;
var gFirstMove = true
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3
}
var gLevel;
var elLive1 = document.querySelector('.live1')
 var elLive2 = document.querySelector('.live2')
var elLive3 = document.querySelector('.live3')

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
}else if (length === 8)  {
    gLevel.size = length 
     gLevel.mines = mines
} else if (length === 12) {
    gLevel.size = length 
     gLevel.mines = mines
    
}
inIt()
    
}

function inIt() {
    gGame.lives = 3
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
          gBoard[cellIidx][cellJIdx].isShown
            addRandMines(gBoard)
            setMinesNegsCount(gBoard)
            console.table(gBoard)

          
      }
    if (gBoard[cellIidx][cellJIdx].isMine){
        gBoard[cellIidx][cellJIdx].isShown =true
        elCell.innerText = MINE
        elCell.style.backgroundColor = "red"
        gBoard[cellIidx][cellJIdx].isMarked
        gGame.lives--

        decreseLife()
        checkVictory(gBoard)
        if (gGame.lives === 0) {
            GameOver()
        }
        
    }

    if (gBoard[cellIidx][cellJIdx].isShown) return 
        else {
     gBoard[cellIidx][cellJIdx].isShown =true
     gGame.shownCount++
     updaeScore()
    minesNegsCount = getMinesNegsCount(gBoard, cellIidx, cellJIdx)
   if (minesNegsCount===0) {
       gBoard[cellIidx][cellJIdx].isShown =true
       elCell.style.backgroundColor = "#ffd3d3"
     expandShown(gBoard, cellIidx, cellJIdx)
     checkVictory(gBoard)

   }
    else{
        elCell.style.backgroundColor = "#ffd3d3"
        elCell.innerText = minesNegsCount
        checkVictory(gBoard)


            }

    
}

}

function updaeScore() {
    var elScore = document.querySelector('.score span')
    elScore.innerText = gGame.shownCount
    
    
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
    console.log('GAME-OVER');
    clearInterval(gTimerInterval)
  gTimerInterval = null
  gGame.isOn =false

    
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


function expandShown(board, idxI, idxJ) {
    for (var i = idxI-1; i <= idxI+1 ; i++) {
        if(i < 0 ||i >= board.length)continue
        for (var j = idxJ-1; j <= idxJ +1 ; j++) {
            if( j < 0 || j >= board[0].length)continue 
            var pos = {i:i, j:j} 
            if (!board[i][j].isShown) {
                board[i][j].isShown = true
                var elCell = document.querySelector(`.cell${pos.i}-${pos.j}`)
                elCell.innerText = board[pos.i][pos.j].minesAroundCount
                elCell.style.backgroundColor = "#ffd3d3"

            }
          if (board[i][j].isMarked) {
            gGame.markedCount--;

              
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
    elEmoji.innerText= gameMode
    
}
  function checkVictory(board){
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isShown||!(board[i][j].isMine && board[i][j].isMarked)) return
        }   
    }
    renderEmoji(WIN)
    console.log('you win!');

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
        elLive3.innerText = ''
          return   
    }
    else{

        GameOver()
    }
}