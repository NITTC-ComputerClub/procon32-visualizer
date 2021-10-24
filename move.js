let height = 12;
let width = 12;
let board = [];
let canvas = document.getElementById("canvas");
const direc = ['U', 'L', 'D', 'R'];
const dy = [-1,0,1,0], dx = [0,-1,0,1];
const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );

var frames = []; //info
var recover_pos = []; //完成後の位置 初期i,jにいて最後にrecover_pos[i][j]にいる状態

const move_cmd = "LULLLUURDRUULDLURDLLURDDDDDDLDLUURDLUURDLUURDLUURDLUURDRULDRRUULDDDDDDLDDLLUURDLUURDLUURDLUURDRUULDRUULDRULDRRULDRRULDRRUULDLLDDRRULDRRUULDRULDRRUULDRRRRRRRUULLDRDLLURULLDRULLDRDLLURDDDDDDDDDDRDLUURDLUURDRUULDRUULDLUURDRUULDRUULDLUURDRUULDRUULDLURDDDDDDDLDDLLUURDLUURDRUULDRUULDRUULDRUULDLUURDRULDRRULDRRUULDDDDRDLUURDRUULDRUULDRUULDDDDDRRUULDRUULDRUULDRUULDDRDDRDDRDDRRUULDRUULDRUULDRUULDRUULDRUULDLURDLLUURDLURULLDRDLLLLLDRRULDRRULDRRULDRRULDRRUULDDDDDLUURDLUURDRUULDRUULDRRRDDRDRUULDLURULDLURDDRRRDRRRDDDDDDDRRUULDLUURDLUURDRUULDLUURDRUULDLUURDRULURRDLDRRULDRRULDRRULDRRUULDRUULDDDDDDLDRUULDLUURDLUURDRULDRRUULDRUULDRULDRRUULDDDDLLDRUULDRULDRRUULDRULDRRUULDRULDRRUULDRRRDDRDLUURDRUULDRUULLDRULLDRULDLURDLDRRUULDDDDDDDDRUULDRUULDRUULDRUULDRULDRRUULDRUULDRUULDDRRRRDRUULDLUURDLURDLLURDLLURDRDRDRUULDLURULDLURDLDLLDLUURDRULDRRULDRRULDRRUULDDDDDDDRDRDRUULDLUURDLUURDLUURDLUURDLUURDLUURDLUURDLURDDDDLUURDLUURDLURULDLLDDLLUURDRULDRRULDRRULDRRULDRRULDRDRULDRRUULDLLLLULLDRULLDRULLDRULLDRDLLUURDLURDLLURDDDDDDDDLUURDLUURDLUURDRUULDLUURDLUURDRUULDDDDDDDDLLUURDRUULDRUULDLUURDRUULDLUURDRULDRRULDRRUULDRRRDDDDRRDDRRUULDRUULDLUURDLUURDRUULDRUULLDRDLLURDLLURDLLUURDLURDLLURDDLDLDRUULDRUULDRULDRRULDRRUULDRDRUULDRDRUULDDDDDDDRUULDRUULDLUURDRUULDRUULDRULDRRUULDDLDDLLLDLLLLLDDDLLDLUURDRUULDLUURDLUURDLUURDLUURDLUURDRUULDLDLDDDDDLLUURDRUULDLUURDRULURDRUULDRULDRRULDRRUULDLDDLLLLDLUURDLURULDLURDLLURDLLURDLLURDRDDDRRRDRRRDRULDRRULDRRUULDRUULDLUURDLUURDLUURRDLDRRULDRRULDRRUULDDLLLDDDDLDLDLUURDLUURDRUULDLUURDLUURDRUULDLURULDLURDLLURDLLURDLLURDLLURDDLDDLDLDRRULURRDLDRRUULDRUULDRUULDRUULDRUULDDDDRDRRRDDLLURDLLURULDRUULDLUURDLUURDLUURDRUULDRRRDRDLLUURDLUURDLURDLLURRRRRDLLURDLLURDLLURDDDDRRUULDLUURDLUURDLURDLLDRRULDRRUULDDDDDDRUULDRUULDRUULDRUULDRULDRRUULDDDDLLLDDRRULDRRULDRRULDRRUULDRUULDLUURDRUULDRUULDLLLLLLDDLLURDLLURULLDRULLDRDLLUURDLURULDDRDRRDRRRRDDDRDRUULDRUULDLURDLLURULLDRDLLUURDLUURDLUURDLURULLDRDLLUURDLURDDDDDDLDLUURDRUULDLUURDRUULDLUURDRULDRRUULDDLDRULDRRULURDRUULDDDDLDRRUULDRUULDRULDRRUULDRUULDRDRUULDDDRRRDDDRRRDRUULDRUULLDRULLDRDLLUURDLURDLLURDLLURULDRUULDLUURDRUULDRURRRDDRDRUULDLURULLDRULDLURDDRRUULDLURRDDDLLLLLLLDDLLURDLLURDLLURDLLUURDLUURDLUURDLUURDLURDDLURULDDRDDDRRRRDLURDLLUURDRUULDRUULDLURDLLUURDLURDRDRRRRDRDDRDLUURDLUURDRULURRDLURDRULURRDLDRRULURDRUULDDRRRDDRDLLURDLLURDLLUURDLUURDLUURDRUULDDLDLDLLLDLDLUURDRUULDLURDLLURDLLURDLLURDLLUURDLUURDLUURDLURDDDDRDRUULDLUURDRUULDLUURDLURDRRDRUULDLURDLLURDDRRRDDRDLUURDLUURDRUULDLURDLLURULLDRDLLUURDLURDDRRDRUULDLUURDLURDLLURDLDLLDDRRULDRRUULDRUULDRULDRRUULDDDDLDDLLUURDRUULDRULDRRULDRRUULDRUULDRULDRRUULDDDDDRRDLUURDLUURDLUURDLUURDLUURDLURDLDRUULDRLLLLLDLLURDLLURDLLURDLLURDDRDRUULLDRDLLUURDRUULDDRRUULDLDRULDRRULDRRUULDLDRRULDRRUULDRDRUULDRDDDRRRRRDRUULDRUULDLUURDLURDLLUURDLURDLLURDLLURDLLURDLDDDLLLLLDLUURDRUULDRUULDLURDLLURDLLURDLLUURDLURDLLURDLDDLLLDLLDLUURDRUULDLUURRDLDRRULDRRULURRDLDRRULDRRULURDRUULDRDLURULDRRRRDLURDLLURDLDLDLUURDRULDRRULDRRUULDDDLLUURDRULDRRULDRRUULDDDRDRUULDRUULDRUULDLDLDLLLLDRUULDLUURDRUULLDRDLLURDLLURDLLUURDLURDLLURDRURDDLLLLDLDRUULDRUULDRULDRRULDRRULDRRULDRRULDRRUULDLLLLDRULDRRULDRRULDRRULDRRULDRRUULDRDRUULDDRRUULDDRDLLUURDRUULDLDLLURDLLURDLLURDLLURDLLURDLLURDLLURDLLURRRRRRRRDLLURDLLURDLLURDLLURDLDRRUULDRRRRRDLURDLLURULDLURDLLURRRDLLURDLDRRUULDRRURDLLURDDLLLLLLDRUULDRULDRRULDRRULDRRULDRRULDRRULDRRUULDDRDRUULDRUULDRULDRRRRDLURDLLURRRDDLLURULDRRRRRRDLUURDLURDLLURDLLURDLLURDLLURDLDRULDRRUULDDRRUULDLLLLDRULDRRULDRRULDRRULDRRULDRRUULDRRRDLURDLLUURDLURDLDRRUULDRDRUULDRURRDLURDLLLDRRULDRRUULDLLLLLLLLLLDRRRURDLLURDLLURDLLURDRULDRRRURDLLURDLLURDLLURRRRRRRRRRDLLURDLLURDLLURDLLURDLLURDLLURDLLURDLLURDLURRDLULDRURDLURDLLURRRDLURDLLURDRULDLURRRRDLURDLLURDLLURRDLURDLLURRRRRDLLURDLLURDLLURDRULDLURRRRRRDLURDLLURDLLURDLLURDLLURRRRRDLURDLLURDLLURDLLURDLLURRDLURRRRDLLURDLLURDLURRRDLLURRDLLURDR";
const rotate_cmd = "121112000333203211001210310312230301323200111011300223001001300231111023301201032012003002101033200220201303031131320310200100022300100300031330";
const n = move_cmd.length;

let y = 8;
let x = 5;

var info = function(board, y, x){
  this.board = [];
  for(let i = 0; i < height; i++){
    let temp = [];
    for(let j = 0; j < width; j++){
      temp.push(board[i][j]);
    }
    this.board.push(temp);
  }
  this.y = y;
  this.x = x;
};


(function(){
  //画像の描画
  for(let i = 0; i < height; i++){
    let temp = [];
    for(let j = 0; j < width; j++){
      let img = new Image();
      img.src = "./images/" + i + "_" + j + ".png";
      img.id = i + "_" + j;
      img.className = "image";
      img.style.top = i*66 + "px";
      img.style.left = j*66 + "px";
      img.style.height = "66px";
      img.style.width = "66px";
      canvas.appendChild(img);
      temp.push([i,j]);
    }
    board.push(temp);
  }

  //各手数での盤面をframesに入れる
  frames.push(new info(board, y, x));
  for(let i = 0; i < move_cmd.length; i++){
    for(let j = 0; j < 4; j++){
      if(direc[j] == move_cmd[i]){
        const ny = (y + dy[j] + height) % height;
        const nx = (x + dx[j] + width) % width;
        swap(y, x, ny, nx);
        y = ny;
        x = nx;
      }
    }
    frames.push(new info(board, y, x));
  }

  calc_recover_pos();
  //rotate_imgs_motion(rotate_cmd);
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
//動き付き
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
}
//壁を通過する場合は通常の動きで処理する
async function swap_motion(sy, sx, ty, tx, time){
  const delay = 66 / time * 5;
  for(let r = 0; r < 4; r++){
    const ny = sy + dy[r];
    const nx = sx + dx[r];
    if(ny == ty && nx == tx){
      let s = document.getElementById(sy + "_" + sx);
      let t = document.getElementById(ty + "_" + tx);
      for(let i = 1; i <= 66; i += delay){
        s.style.top = sy*66 + i*dy[r] + "px";
        s.style.left = sx*66 + i*dx[r] + "px";
        t.style.top = ty*66 + i*dy[(r + 2) % 4] + "px";
        t.style.left = tx*66 + i*dx[(r + 2) % 4] + "px";
        await sleep(1);
      }
      s.style.top = sy*66 + "px";
      s.style.left = sx*66 + "px";
      t.style.top = ty*66 + "px";
      t.style.left = tx*66 + "px";
      return;
    }
  }
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

function calc_recover_pos(){
  let last = move_cmd.length;
  recover_pos = new Array(height);
  for(let i = 0; i < height; i++) recover_pos[i] = new Array(width);
  for(let i = 0; i < height; i++){
    for(let j = 0; j < width; j++){
      const t = frames[last].board[i][j];
      recover_pos[t[0]][t[1]] = [i,j];
    }
  }
}