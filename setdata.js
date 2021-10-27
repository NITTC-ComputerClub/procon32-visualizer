const image_val = Math.floor(Math.random() * 37) + 1; //そろえる画像の種類

//そろえる画像の移動データファイルを読み込む
//move.jsより前に変数が定義される
(function(){
  let file = document.createElement("script");
  file.src = "./imagesdata/" + image_val + "/movedata.js";
  file.type = "text/javascript";
  document.body.appendChild(file);
}());
