export default class {
  constructor(drawBoardBox, drawBoard) {
    this.drawBoardBox = drawBoardBox;
    this.drawBoard = drawBoard;
    this.ele = this.drawBoardBox.ele.querySelector(".__tools>.__saveImg");
  }
  init() {
    this.ele.style.backgroundImage = `url(${require("./save.png")})`;
    let saveImgFn = () => {
      let canvas = document.createElement("canvas");
      canvas.width = this.drawBoard.w;
      canvas.height = this.drawBoard.h;
      let ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(this.drawBoard.ele, 0, 0);
      try {
        //ie特殊储存方法
        var blob = canvas.msToBlob();
        window.navigator.msSaveBlob(blob, "ff.png");
      } catch (error) {
        //普通base64储存方法
        let a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = "画板.png";
        //模拟鼠标点击a标签
        var event = document.createEvent("MouseEvents");
        event.initMouseEvent(
          "click",
          true,
          true,
          document.defaultView,
          0,
          0,
          0,
          0,
          0,
          false,
          false,
          false,
          false,
          0,
          null
        );
        a.dispatchEvent(event);
      }
    };
    this.ele.addEventListener("touchstart", saveImgFn);
    this.ele.addEventListener("mousedown", saveImgFn);
  }
}
