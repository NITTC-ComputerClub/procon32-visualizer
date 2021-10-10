#画像の分割を行う
#python [ファイル名] [高さ] [幅]
import sys
from PIL import Image
def split_img(filename, h, w):
  orig = Image.open(filename)
  img_height = orig.height
  img_width = orig.width
  if(img_height // h != img_width // w):
    print("分割数が間違っています")
    return
  piece_size = img_height // h
  for i in range(h):
    for j in range(w):
      img = orig.crop((piece_size*j, piece_size*i,  piece_size*(j+1), piece_size*(i+1)))
      img = img.resize((50, 50))
      img.save("images/%d_%d.png" %(i, j))

def main():
  args = sys.argv
  if len(args) > 4:
    print("引数の数が多すぎます")
  if len(args) < 4:
    print("引数の数が少ないです")
    print("python split.py [filename] [height] [width]")

  filename, h, w = args[1], args[2], args[3]
  split_img(filename, int(h), int(w))

if __name__ == "__main__":
  main()
