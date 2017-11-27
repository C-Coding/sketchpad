# Drawing-board
canvas 画板

画笔工具 支持大小、颜色自定义
橡皮工具 支持大小自定义

新增另存为图片功能


支持鼠标或触摸屏

## demo
[https://c-coding.github.io/drawing-board/](https://c-coding.github.io/drawing-board/)

# 兼容性
支持canvas的现代浏览器

# 如何使用
## 直接引入
引入docs 中DrawBoard.js
```
<div id="demo" data-boardHeight="300">//通过data-boardHeight属性指定画板高度 画板宽度自动等于容器宽度且支持resize
</div>
<script src="docs/DrawBoard.js"><script>
<script>
    window.onload = function () {
        DrawBoardInit('#demo');
    }
</script>
```
## webpack打包
```
npm i git+https://github.com/C-Coding/drawing-board.git#1.0.0 --save

<div id="demo" data-boardHeight="300">

var db=require('drawing-board');
db.DrawBoardInit('#demo');

打包工具依赖 babel及相关工具 css-loader style-loader less less-loader url-loader
```