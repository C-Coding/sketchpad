import { getElementLeft, getElementTop } from "../common/common";
import BackgroundBoard from "./BackgroundBoard";
class Canvas {
  constructor(drawBoardBox) {
    this.drawBoardBox = drawBoardBox;
    this.ele = drawBoardBox.ele.querySelector(".__drawBoard");
    this.w = this.drawBoardBox.w * window.devicePixelRatio;
    this.h =
      this.drawBoardBox.ele.dataset.boardheight * window.devicePixelRatio;

    this.ctx = this.ele.getContext("2d");

    this.tool = "brush";
    this.color = "";
    this.lineWidth = 10; //初始线宽
    this.lineWidthRange = [1, 40]; //线宽范围min，max
    this.eraserRadius = 10; //初始橡皮半径
    this.eraserRadiusRange = [1, 40];

    this.lineArr = []; //轨迹数组
    this.touchPrevious = []; //触摸响应频率有限 防止出现断裂 记录上一个响应点  目前橡皮擦功能使用了此值

    this.backgroundBoard = new BackgroundBoard(drawBoardBox);
  }
  top() {
    return getElementTop(this.ele);
  }
  left() {
    return getElementLeft(this.ele);
  }
  init(drawBoardBox) {
    this.backgroundBoard.init();

    this.ele.width = this.w; //定义画板宽高
    this.ele.height = this.h;
    this.ele.style.width = "100%";
    this.ele.style.height = this.drawBoardBox.ele.dataset.boardheight + "px";
    this.ctx.save();

    this.ele.addEventListener("touchstart", function(e) {
      // e.stopPropagation();
      e.preventDefault();
    });
    this.ele.addEventListener("touchmove", function(e) {
      // e.stopPropagation();
      e.preventDefault();
    });
    this.ele.addEventListener("mousedown", function(e) {
      // e.stopPropagation();
      e.preventDefault();
    });
    this.ele.addEventListener("mousemove", function(e) {
      // e.stopPropagation();
      e.preventDefault();
    });
    this.ele.addEventListener("mouseup", function(e) {
      // e.stopPropagation();
      e.preventDefault();
    });
  }
  line(arr) {
    //接收一个数组
    let ctx = this.ctx;
    ctx.restore();
    ctx.save();
    ctx.lineWidth = this.lineWidth * window.devicePixelRatio;
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (let i = 0; i < arr.length; i++) {
      ctx.lineTo(arr[i][0], arr[i][1]);
    }
    ctx.stroke();
  }
  clearArc() {
    let ctx = this.ctx;

    let x = arguments[0];
    let y = arguments[1];
    let r = arguments[2];
    for (let i = 0; i < 2 * r; i++) {
      let c = Math.round(Math.sqrt(r * r - Math.pow(r - i, 2)));

      ctx.clearRect(x - c, y - r + i, 2 * c, 1);
    }
  }
  changeLineWidth(v) {
    if (!v) {
      throw new Error("线宽参数为空");
    }
    this.lineWidth = v;
  }
  changeEraserRadius(v) {
    if (!v) {
      throw new Error("参数为空");
    }
    this.eraserRadius = v;
  }

  resize() {
    this.backgroundBoard.resize();

    let canvasCopy = document.createElement("canvas");
    canvasCopy.width = this.ele.width;
    canvasCopy.height = this.ele.height;
    canvasCopy.getContext("2d").drawImage(this.ele, 0, 0);

    this.ele.width = this.w = this.drawBoardBox.w * window.devicePixelRatio; //定义画板宽高
    this.ele.height = this.h =
      this.drawBoardBox.ele.dataset.boardheight * window.devicePixelRatio;

    this.ctx.drawImage(canvasCopy, 0, 0);
    canvasCopy = null;
  }
}

export default Canvas;
