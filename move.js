let height = 16;
let width = 16;
let board = [];
let canvas = document.getElementById("canvas");
const direc = ['U', 'L', 'D', 'R'];
const dy = [-1,0,1,0], dx = [0,-1,0,1];

(function(){
  for(let i = 0; i < height; i++){
    let row = document.createElement("div");
    let temp = [];
    for(let j = 0; j < width; j++){
      img = new Image();
      img.src = "./images/" + i + "_" + j + ".png"
      img.id = i + "_" + j
      img.className = "image";
      row.appendChild(img);
      temp.push([i,j]);
    }
    row.className = "row";
    row.style.height = "50px";
    canvas.appendChild(row);
    board.push(temp);
  }
}());



function swap(sy, sx, ty, tx){
  const temp = [board[sy][sx][0], board[sy][sx][1]];
  board[sy][sx] = board[ty][tx];
  board[ty][tx] = temp;
  document.getElementById(sy + "_" + sx).src = "./images/" + board[sy][sx][0] + "_" + board[sy][sx][1] + ".png";
  document.getElementById(ty + "_" + tx).src = "./images/" + board[ty][tx][0] + "_" + board[ty][tx][1] + ".png";
}

function move(str, y, x){
  let n = str.length;
  for(let i = 0; i < n; i++){
    for(let j = 0; j < 4; j++){
      if(direc[j] == str[i]){
        const ny = (y + dy[j] + height) % height;
        const nx = (x + dx[j] + width) % width;
        swap(y, x, ny, nx);
        y = ny;
        x = nx;
      }
    }
  }
}