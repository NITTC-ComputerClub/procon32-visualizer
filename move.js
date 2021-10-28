const height = 8;
const width = 8;
const pieces = height * width;
const size = 800 / height;
let canvas = document.getElementById("canvas");
const direc = ['U', 'L', 'D', 'R'];
const dy = [-1,0,1,0], dx = [0,-1,0,1];
const d = [-width, -1, width, 1]; //1次元でのdy,dx
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

var frames = []; //info
var recover_pos = []; //完成後の位置 初期i,jにいて最後にrecover_pos[i][j]にいる状態


var Info = function(board, pos){
  //現在の場面(値渡し)
  this.board = JSON.parse(JSON.stringify(board));
  //選択中の座標
  this.pos = pos;
};


function make_frames(){
  //move_cmdはimagedata/image_val/movedata.jsにある
  let board = new Array(pieces);
  for(let i = 0; i < pieces; i++){
    board[i] = i;
  }
  function swap(s, t){
    const temp = board[s];
    board[s] = board[t];
    board[t] = temp;
  }
  let frames = [];
  for(let cur = 0; cur < move_cmd.length; cur++){
    let y = move_cmd[cur][1];
    let x = move_cmd[cur][0];
    frames.push(new Info(board, y*width+x));
    for(let i = 0; i < move_cmd[cur][2].length; i++){
      for(let j = 0; j < 4; j++){
        if(direc[j] == move_cmd[cur][2][i]){
          const ny = (y + dy[j] + height) % height;
          const nx = (x + dx[j] + width) % width;
          swap(y*width+x, ny*width+nx);
          y = ny;
          x = nx;
        }
      }
      frames.push(new Info(board, y*width+x));
    }
  }
  return frames;
}
function init_panels(){
  for(let i = 0; i < height; i++){
    for(let j = 0; j < width; j++){
      let img = new Image();
      //img.src = "./images/" + i + "_" + j + ".png";
      const pos = i * width + j;
      img.src = "./imagesdata/"+image_val+"/" + pos + ".png";
      img.id = pos;
      img.className = "image";
      img.style.top = i*size + "px";
      img.style.left = j*size + "px";
      img.style.height = size + "px";
      img.style.width = size + "px";
      canvas.appendChild(img);
    }
  }
}
function calc_recover_pos(){
  const last = move_cmd.length;
  let mat = new Array(pieces);
  for(let i = 0; i < pieces; i++){
    const t = frames[last].board[i];
    mat[t.pos] = i;
  }
  return mat;
}

//movedata.jsの実行時に実行される
function start(){
  frames = make_frames();
  init_panels();

  recover_pos = calc_recover_pos();
}



/*
//左上から原画像の回転を行う
function rotate_imgs(str){
  for(let i = 0; i < height; i++){
    for(let j = 0; j < width; j++){
      let img = document.getElementById(i + "_" + j);
      img.style.transform = "rotate(" + str[i*width+j]*90 + "deg)";
    }
  }
}
//動き付き
async function rotate_imgs_motion(str){
  const deg_time = 7; //1度動かすのにかける時間
  const next_turn_wait_time = 300; //次動かすまでの時間
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
*/


//壁を通過する場合は通常の動きで処理する
async function swap_motion(cur, next, time){
  const delay = size / time * 5;
  const sy = Math.floor(cur / width);
  const sx = cur % width;
  const ty = Math.floor(next / width);
  const tx = next % width;
  for(let r = 0; r < 4; r++){
    if(cur + d[r] == next){
      let s = document.getElementById(cur);
      let t = document.getElementById(next);
      for(let i = 1; i <= size; i += delay){
        s.style.top = sy*size + i*dy[r] + "px";
        s.style.left = sx*size + i*dx[r] + "px";
        t.style.top = ty*size + i*dy[(r + 2) % 4] + "px";
        t.style.left = tx*size + i*dx[(r + 2) % 4] + "px";
        await sleep(1);
      }
      s.style.top = sy*size + "px";
      s.style.left = sx*size + "px";
      t.style.top = ty*size + "px";
      t.style.left = tx*size + "px";
      return;
    }
  }
}
