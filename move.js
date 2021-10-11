let height = 12;
let width = 12;
let board = [];
let canvas = document.getElementById("canvas");
const direc = ['U', 'L', 'D', 'R'];
const dy = [-1,0,1,0], dx = [0,-1,0,1];
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

let move_wait_time = 5;

(function(){
  //画像の描画
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
    row.style.height = "66px";
    canvas.appendChild(row);
    board.push(temp);
  }
}());

//左上から原画像の回転を行う
function rotate_imgs(str){
  if(str.length != height * width){
    console.log("文字列の長さが異なります");
    return;
  }
  for(let i = 0; i < height; i++){
    for(let j = 0; j < width; j++){
      let img = document.getElementById(i + "_" + j);
      img.style.transform = "rotate(" + str[i*width+j]*90 + "deg)";
    }
  }
}
async function rotate_imgs_motion(str){
  const deg_time = 7; //1度動かすのにかける時間
  const next_turn_wait_time = 300; //次動かすまでの時間
  if(str.length != height * width){
    console.log("文字列の長さが異なります");
    return;
  }
  const num = [1,2,-1];
  for(let c = 0; c < 3; c++){
    for(let r = 0; r <= 90; r++){
      for(let i = 0; i < height; i++){
        for(let j = 0; j < width; j++){
          if(str[i*width+j] != c+1) continue;
          let img = document.getElementById(i + "_" + j);
          img.style.transform = "rotate(" + r*num[c] + "deg)";
        }
      }
      await sleep(deg_time);
    }
    await sleep(next_turn_wait_time);
  }
}

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
async function move_motion(str, y, x){
  let n = str.length;
  for(let i = 0; i < n; i++){
    for(let j = 0; j < 4; j++){
      if(direc[j] == str[i]){
        const ny = (y + dy[j] + height) % height;
        const nx = (x + dx[j] + width) % width;
        swap(y, x, ny, nx);
        y = ny;
        x = nx;
        await sleep(move_wait_time);
      }
    }
  }
}