
class BackgroundBoard {
    constructor(drawBoardBox) {
        this.ele = drawBoardBox.ele.querySelector('.__backgroundBoard');
        this.w = drawBoardBox.w;
        this.h = drawBoardBox.ele.dataset.boardheight;
        this.top = () => { return getElementTop(this.ele) };
        this.left = () => { return getElementLeft(this.ele) };

        this.ctx = this.ele.getContext('2d');
    }
    init() {
        this.ele.width = this.w * window.devicePixelRatio;//定义画板宽高
        this.ele.height = this.h * window.devicePixelRatio;
        this.ele.style.width = '100%';
        this.ele.style.height = this.h + 'px';
        
        let ctx=this.ctx;
        ctx.save();
        ctx.strokeStyle='rgb(240,240,240)';
        let num=16;
        ctx.lineWidth=1/window.devicePixelRatio;
        for (let i = 0; i < Math.ceil(this.ele.width/num); i++) {
            ctx.beginPath();
            ctx.moveTo(num*i,0);
            ctx.lineTo(num*i,this.ele.height);
            ctx.stroke();
        }
        for (let i = 0; i < Math.ceil(this.ele.height/num); i++) {
            ctx.beginPath();
            ctx.moveTo(0,num*i);
            ctx.lineTo(this.ele.width,num*i);
            ctx.stroke();
        }
    }
}

export default BackgroundBoard