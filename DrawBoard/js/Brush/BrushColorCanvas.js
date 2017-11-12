import colorArr from '../common/colorArr'
import { getElementLeft, getElementTop } from '../common/common'
class BrushColorCanvas {
    constructor(drawBoardBox, drawBoard) {
        this.drawBoardBox = drawBoardBox;
        this.ele = this.drawBoardBox.ele.querySelector('.__palette');
        this.w = this.drawBoardBox.ele.querySelector('.__brushColor').offsetWidth;
        this.h = 40;

        this.ctx = this.ele.getContext('2d');
    }
    top() {
        return getElementTop(this.ele)
    }
    left() {
        return getElementLeft(this.ele)
    }
    init(drawBoardBox, drawBoard) {
        this.ele.width = this.w;
        this.ele.height = this.h;


        let ctx = this.ctx;
        ctx.save();
        for (let i = 0; i < colorArr.length; i++) {
            ctx.fillStyle = `rgb(${colorArr[i][0]},${colorArr[i][1]},${colorArr[i][2]})`;
            ctx.fillRect(i * this.w / colorArr.length, 0, 1, 40);
        };

        let colorChangeFn = (e) => {
            e.preventDefault();
            e.stopPropagation();
            let x = e.touches[0].pageX - this.left();
            let i = Math.round(x * colorArr.length / this.w);
            if (i <= 0) {//防止触摸超出canvas
                i = 0;
            } else if (i >= colorArr.length) {
                i = colorArr.length - 1;
            }
            let color = drawBoard.color = `rgb(${colorArr[i][0]},${colorArr[i][1]},${colorArr[i][2]})`;
            drawBoardBox.ele.querySelector('.__brushSize>.__currentStyle>span').style.backgroundColor = color;
        }

        this.ele.addEventListener('touchstart', colorChangeFn);
        this.ele.addEventListener('touchmove', colorChangeFn);
    }
    resize() {
        this.w = this.ele.width = this.drawBoardBox.ele.querySelector('.__brushColor').offsetWidth;
        let ctx = this.ctx;
        for (let i = 0; i < colorArr.length; i++) {
            ctx.fillStyle = `rgb(${colorArr[i][0]},${colorArr[i][1]},${colorArr[i][2]})`;
            ctx.fillRect(i * this.w / colorArr.length, 0, 1, 40);
        };
    }
}

export default BrushColorCanvas;