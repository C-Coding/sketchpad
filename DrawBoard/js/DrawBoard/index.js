import { getElementLeft, getElementTop } from '../common/common'
import BackgroundBoard from './BackgroundBoard'
class Canvas {
    constructor(drawBoardBox) {
        this.ele = drawBoardBox.ele.querySelector('.__drawBoard');
        this.w = drawBoardBox.w;
        this.h = drawBoardBox.ele.dataset.boardheight;
        this.top = () => { return getElementTop(this.ele) };
        this.left = () => { return getElementLeft(this.ele) };

        this.ctx = this.ele.getContext('2d');

        this.tool = 'brush';
        this.color = '';
        this.lineWidth = 10;//初始线宽
        this.lineWidthRange = [1, 40];//线宽范围min，max
        this.eraserRadius = 10;//初始橡皮半径
        this.eraserRadiusRange = [1, 40];

        this.lineArr = [];//轨迹数组
        this.touchPrevious = [];//触摸响应频率有限 防止出现断裂 记录上一个响应点  目前橡皮擦功能使用了此值

        this.backgroundBoard = new BackgroundBoard(drawBoardBox);
    }
    init(drawBoardBox) {
        this.backgroundBoard.init();


        this.ele.width = this.w * window.devicePixelRatio;//定义画板宽高
        this.ele.height = this.h * window.devicePixelRatio;
        this.ele.style.width = '100%';
        this.ele.style.height = this.h + 'px';
        this.ctx.save();


        this.ele.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            e.preventDefault();
            let x = (e.touches[0].pageX - this.left()) * window.devicePixelRatio;
            let y = (e.touches[0].pageY - this.top()) * window.devicePixelRatio;
            switch (this.tool) {
                case 'brush':
                    this.lineArr.push([[x, y]])
                    break;
                case 'eraser':
                    this.clearArc(x, y, this.eraserRadius);
                    this.touchPrevious = [x, y];
                    break;
            }
        })
        this.ele.addEventListener('touchmove', (e) => {
            e.stopPropagation();
            e.preventDefault();
            let x = (e.touches[0].pageX - this.left()) * window.devicePixelRatio;
            let y = (e.touches[0].pageY - this.top()) * window.devicePixelRatio;
            switch (this.tool) {
                case 'brush':
                    this.lineArr[this.lineArr.length - 1].push([
                        x, y
                    ])
                    this.line();
                    break;
                case 'eraser':
                    let xMove = x - this.touchPrevious[0];
                    let yMove = y - this.touchPrevious[1];
                    let pathLength = Math.ceil(Math.sqrt(Math.pow(xMove, 2) + Math.pow(yMove, 2)));
                    if (pathLength > 1) {
                        let xUnitLength = xMove / pathLength;
                        let yUnitLength = yMove / pathLength;
                        for (let i = 0; i < pathLength; i++) {
                            this.clearArc(Math.round(xUnitLength * i + this.touchPrevious[0]), Math.round(yUnitLength * i + this.touchPrevious[1]), this.eraserRadius);
                        }
                    } else {
                        this.clearArc(x, y, this.eraserRadius);
                    }
                    this.touchPrevious = [x, y];
                    break;
            }
        })
    }
    line() {
        let ctx = this.ctx;
        let lineArr = this.lineArr;
        ctx.restore();
        ctx.save();
        ctx.lineWidth = this.lineWidth * window.devicePixelRatio;
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineCap = 'round';
        // ctx.moveTo(lineArr[lineArr.length-1][lineArr[lineArr.length-1].length-2][0],lineArr[lineArr.length-1][lineArr[lineArr.length-1].length-2][1]);
        // ctx.lineTo(lineArr[lineArr.length-1][lineArr[lineArr.length-1].length-1][0],lineArr[lineArr.length-1][lineArr[lineArr.length-1].length-1][1]);
        ctx.lineJoin = 'round';
        for (let j = 0; j < lineArr[lineArr.length - 1].length; j++) {
            ctx.lineTo(lineArr[lineArr.length - 1][j][0], lineArr[lineArr.length - 1][j][1]);
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
        };



    }
    changeLineWidth(v) {
        if (!v) {
            throw new Error('线宽参数为空');
        }
        this.lineWidth = v;
    }
    changeEraserRadius(v) {
        if (!v) {
            throw new Error('参数为空');
        }
        this.eraserRadius = v;
    }

    switchBrush() {
        this.tool = 'brush';
    }
    switchEraser() {
        this.tool = 'eraser';
    }
}

export default Canvas;