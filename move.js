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
var is_moving = false; //playボタンで再生中かどうか

var Info = function(board, pos){
  //現在の場面(値渡し)
  this.board = JSON.parse(JSON.stringify(board));
  //選択中の座標
  this.pos = pos;
};


function make_frames(){
  //move_cmdはimagedata/image_val/movedata.jsにある
  let board = new Array(pieces);
  for(let i = 0; i < pieces; i++) board[i] = i;
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
  for(let i = 0; i < pieces; i++){
    const img = create_image_element(i, i);
    canvas.appendChild(img);
  }
}
function calc_recover_pos(){
  const last_board = frames[frames.length - 1].board;
  let mat = new Array(pieces);
  for(let i = 0; i < pieces; i++) mat[last_board[i]] = i;
  return mat;
}

//movedata.jsの実行時に実行される
function start(){
  frames = make_frames();
  init_panels();

  recover_pos = calc_recover_pos();
}


//画像の要素を生成
function create_image_element(id, img_num){
  const y = Math.floor(id / width);
  const x = id % width;
  let img = new Image();
  img.src = "./imagesdata/"+image_val+"/" + img_num + ".png";
  img.id = id;
  img.className = "image";
  img.style.top = y*size + "px";
  img.style.left = x*size + "px";
  img.style.height = size + "px";
  img.style.width = size + "px";
  img.style.zIndex = 0;
  return img;
}
//画像の座標などを初期状態に戻す
function init_image_element(id){
  const y = Math.floor(id / width);
  const x = id % width;
  const img = document.getElementById(id);
  img.style.height = size + "px";
  img.style.width = size + "px";
  img.style.top = y*size + "px";
  img.style.left = x*size + "px";
  img.style.zIndex = 0;
}

async function swap_motion(cur, next, time, board){
  const delay = size / time * 5;
  const sy = Math.floor(cur / width);
  const sx = cur % width;
  const ty = Math.floor(next / width);
  const tx = next % width;
  const ssy = sy * size, ssx = sx * size;
  const sty = ty * size, stx = tx * size;
  let s = document.getElementById(cur);
  let t = document.getElementById(next);
  for(let r = 0; r < 4; r++){
    if(cur + d[r] == next){
      for(let i = 0; i <= size; i += delay){
        s.style.top = ssy + i*dy[r] + "px";
        s.style.left = ssx + i*dx[r] + "px";
        t.style.top = sty + i*dy[(r + 2) % 4] + "px";
        t.style.left = stx + i*dx[(r + 2) % 4] + "px";
        if(!is_moving) break;
        await sleep(1);
      }
      init_image_element(cur);
      init_image_element(next);
      return;
    }
  }
  //壁での交換の動き
  for(let r = 0; r < 4; r++){
    const ny = (sy + dy[r] + height) % height;
    const nx = (sx + dx[r] + width) % width;
    if(ny != ty || nx != tx) continue;
    //座標nextに画像board[cur]を追加する
    let s_temp = create_image_element(next, board[cur]);
    let t_temp = create_image_element(cur, board[next]);
    canvas.appendChild(s_temp);
    canvas.appendChild(t_temp);
    s_temp.style.zIndex = 10;

    const val = [ "100% 100%", "100% 100%", "0% 0%", "0% 0%" ];
    s.style.objectPosition = val[r];
    t.style.objectPosition = val[(r + 2) % 4];
    s_temp.style.objectPosition = val[(r + 2) % 4];
    s_temp.style.border = "1px solid red"; //選択中
    t_temp.style.objectPosition = val[r];
    for(let i = 0; i <= size; i += delay){
      //もともとある画像の移動
      if(r & 1){
        s.style.width = size-i + "px";
        t.style.width = size-i + "px";
      }else{
        s.style.height = size-i + "px";
        t.style.height = size-i + "px";
      }
      if(r == 0) t.style.top = sty + i + "px"; 
      if(r == 1) t.style.left = stx + i + "px";
      if(r == 2) s.style.top = ssy + i + "px";
      if(r == 3) s.style.left = ssx + i + "px";
      //反対側に生成された画像の移動
      if(r & 1){
        s_temp.style.width = i + "px";
        t_temp.style.width = i + "px";
      }else{
        s_temp.style.height = i + "px";
        t_temp.style.height = i + "px";
      }
      if(r == 0) s_temp.style.top = sty + size - i + "px";
      if(r == 1) s_temp.style.left = stx + size - i + "px";
      if(r == 2) t_temp.style.top = ssy + size - i + "px";
      if(r == 3) t_temp.style.left = ssx + size - i + "px";
      if(!is_moving) break;
      await sleep(1);
    }
    init_image_element(cur);
    init_image_element(next);
    canvas.removeChild(s_temp);
    canvas.removeChild(t_temp);
    return;
  }
}
