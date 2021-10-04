'use strict'
const FLAG ='🚩';
const MINE = '💣';
var gBoard;
var isTimeON = false;
var gTimerInterval;
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
   }
   var gLevel = {
    size: 4,
    mines: 2
   };


function inIt() {
  gBoard = createBoard(gLevel.size, gLevel.mines)
  printMat(gBoard, '.board')
 setMinesNegsCount(gBoard)
 
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
        addRandMines(board)
        
    console.table(board)
    return board
}


function setMinesNegsCount(board) {
    var countMines;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine)continue
                // var elCurrTile = document.querySelector(`.cell${i}-${j}`)
                // elCurrTile.innerText =MINE
    
            countMines = getMinesNegsCount(board, i, j)
            if (countMines === 0) continue
            board[i][j].minesAroundCount = countMines
            // var elCurrTile = document.querySelector(`.cell${i}-${j}`)
            // elCurrTile.innerText = countMines
            }
        }
    }




function getMinesNegsCount(board, celli, cellj) {
    var count = 0;
    for (var i = celli-1; i <= celli+1; i++) {
        if(i < 0 ||i >= board.length)continue
        for (var j = cellj-1; j <= cellj+1; j++) {
            if (i === celli && j === cellj) continue;
            if( j < 0 || j >= board[0].length)continue  
           if (board[i][j].isMine) {
               board[i][j].minesAroundCount = 0;
                count++
            }
        }
    }
    return count
}



function cellClicked(elCell, cellIidx, cellJIdx) {
    if (!gGame.isOn) return

    if (!isTimeON) {
        startTimer(Date.now())
        isTimeON = true
      }
    
    if (gBoard[cellIidx][cellJIdx].isMine){
        gBoard[cellIidx][cellJIdx].isMarked =true
        elCell.innerText = MINE
        elCell.style.backgroundColor = "red"

        console.log(elCell);
        GameOver()
        
    }

    else {
    gBoard[cellIidx][cellJIdx].isShown =true
    gGame.shownCount++
    showScore()
   var minesNegsCount = getMinesNegsCount(gBoard, cellIidx, cellJIdx)
   if (minesNegsCount===0) {
    elCell.style.backgroundColor="#ffd3d3"
    // expandShown(gBoard, elCell ,cellIidx, cellJIdx)
   }
       
   
    else{
   elCell.innerText = minesNegsCount
    }
       
    }
    
}
function addRandMines(board) {
var count = 0
while(count !== gLevel.mines){
var ranICell =getRandomInt(0, gLevel.size -1)
var ranJCell =getRandomInt(0,gLevel.size-1)
if (board[ranICell][ranJCell].isMine) continue
  
board[ranICell][ranJCell] = {
 minesAroundCount : 0,
isShown: false,
isMine: true,
isMarked: true
}
count++

}
}

function showScore() {
    var elScore = document.querySelector('.score')
    elScore.innerText = `score: ${gGame.shownCount} `
    
    
}

function restartGame() {
var timer = document.querySelector('.timer')
  timer.innerText = '00:00:00'
  clearInterval(gTimerInterval)
  gTimerInterval = null
  var elScore = document.querySelector('.score')
  elScore.innerText = `score: 0 `
  
  inIt()
    
}

function GameOver() {
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
            elCell.innerHTML = '';
        } else if (gGame.markedCount < gLevel.MINES) {
            cell.isMarked = true;
            gGame.markedCount++;
            elCell.innerHTML = FLAG;
        }
    }
}




function resetGame() {
    var timer = document.querySelector('.timer')
    timer.innerText = '00:00:00'
    clearInterval(gTimerInterval)
    gTimerInterval = null
    inIt()
  }


// function expandShown(board, elCell, idxI, idxJ) {
//     var elCurrTile
//     var MinesNegcount
//     for (var i = idxI -1; i <idxI+1 ; i++) {
//         if(i < 0 ||i >= board.length)continue
//         for (var j = idxJ -1; j <= idxJ +1 ; j++) {
//             board[idxI][idxJ].isShown = true;
//             if (i === idxI && j === idxJ) continue;
//             if( j < 0 || j >= board[0].length)continue  
//           elCurrTile = document.querySelector(`.cell${i}-${j}`)
//           MinesNegcount =getMinesNegsCount(board, i, j)
//          elCurrTile.innerText =MinesNegcount
        
         

//         }

    
// }
// }