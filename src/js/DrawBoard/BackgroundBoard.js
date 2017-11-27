
class BackgroundBoard {
    constructor(drawBoardBox) {
        this.drawBoardBox = drawBoardBox;
        this.ele = this.drawBoardBox.ele.querySelector('.__backgroundBoard');
        this.w = this.drawBoardBox.w * window.devicePixelRatio;
        this.h = this.drawBoardBox.ele.dataset.boardheight * window.devicePixelRatio;
        this.ctx = this.ele.getContext('2d');
    }
    top() {
        return getElementTop(this.ele)
    }
    left() {
        return getElementLeft(this.ele)
    }
    init() {
        this.ele.width = this.w;//定义画板宽高
        this.ele.height = this.h;
        this.ele.style.width = '100%';
        this.ele.style.height = this.drawBoardBox.ele.dataset.boardheight + 'px';

        let ctx = this.ctx;
        ctx.save();
        ctx.strokeStyle = 'rgb(240,240,240)';
        let num = 16;
        ctx.lineWidth = 1 / window.devicePixelRatio;
        for (let i = 0; i < Math.ceil(this.w / num); i++) {
            ctx.beginPath();
            ctx.moveTo(num * i, 0);
            ctx.lineTo(num * i, this.h);
            ctx.stroke();
        }
        for (let i = 0; i < Math.ceil(this.h / num); i++) {
            ctx.beginPath();
            ctx.moveTo(0, num * i);
            ctx.lineTo(this.w, num * i);
            ctx.stroke();
        }
    }
    resize() {
        this.w = this.drawBoardBox.w * window.devicePixelRatio;
        this.h = this.drawBoardBox.ele.dataset.boardheight * window.devicePixelRatio;
        this.init();

    }
}

export default BackgroundBoard