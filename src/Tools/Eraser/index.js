import SizeSlider from '@/components/Slider/SizeSlider';
import s from './index.less';
import html from './index.html';

class Eraser {
    constructor({ mainCanvasCtx }) {
        this.frontCanvasShow = false;//切换到当前组件时 自动关闭front层


        this.mainCanvasCtx = mainCanvasCtx;
        this.dpr = window.devicePixelRatio;
        //橡皮默认直径
        this.size = 10;
        this.sizeRange = [5, 40];

        this.clearPathList = [];//记录擦除路径


        this.btnEl = document.createElement('button');
        this.btnEl.style.backgroundImage = `url('${require('./eraser.png')}')`

        this.optionEl = document.createElement('div');
        this.optionEl.innerHTML = html;
        this.optionEl.className = s.option;

        this.tipEl = this.optionEl.querySelector('.tip');
        this.sizeChange(this.size);


        const sizeSliderEl = new SizeSlider({
            ratio: (this.size - this.sizeRange[0]) / (this.sizeRange[1] - this.sizeRange[0])
        }).sizeSliderBoxEl;
        sizeSliderEl.addEventListener('sliderChange', (e) => {
            this.sizeChange((this.sizeRange[1] - this.sizeRange[0]) * e.detail + this.sizeRange[0]);
        })


        this.optionEl.querySelector('.sizeSliderBox').appendChild(sizeSliderEl);

    }

    sizeChange(v) {
        this.size = v;
        this.tipEl.style.width = v + 'px';
        this.tipEl.style.height = v + 'px';
    }


    clearArc(ctx, r, x0, y0, x1, y1) {
        let x, y;
        let length;
        let radian;
        if (x1 === undefined && y1 === undefined) {
            x = 0;
            y = 0;
            radian = 0;
            length = 0;
        } else {
            x = x1 - x0;
            y = y1 - y0;
            if (x === 0) {
                radian = y >= 0 ? -Math.PI / 2 : Math.PI / 2;
            } else {
                radian = Math.atan(y / x);

                if (radian >= 0) {
                    if (y < 0) {
                        radian = Math.PI + radian;
                    }
                } else {
                    if (y >= 0) {
                        radian = -(Math.PI - radian);
                    }
                }

            }
            length = Math.sqrt(x * x + y * y);
        }

        ctx.save();
        ctx.translate(x0, y0);
        ctx.rotate(radian);//x轴旋转

        ctx.moveTo(0, 0);
        for (let i = 0; i < r; i++) {
            let c = Math.round(Math.sqrt(r * r - Math.pow(r - i, 2)));
            ctx.clearRect(-r + i, -c, 1, 2 * c);
        }
        ctx.clearRect(0, -r, length, 2 * r);

        for (let i = 0; i < r; i++) {
            let c = Math.round(Math.sqrt(r * r - Math.pow(i, 2)));
            ctx.clearRect(length + i, -c, 1, 2 * c);
        }

        ctx.restore();
    }

    drawStartFn(e) {
        this.clearPathList.push([e.canvasX, e.canvasY])
        this.clearArc(this.mainCanvasCtx, this.size / 2 * this.dpr, e.canvasX, e.canvasY);
    }

    drawMoveFn(e) {
        const prevPoint = this.clearPathList[this.clearPathList.length - 1];
        this.clearArc(this.mainCanvasCtx, this.size / 2 * this.dpr, prevPoint[0], prevPoint[1], e.canvasX, e.canvasY);
        this.clearPathList.push([e.canvasX, e.canvasY])
    }

    drawEndFn(e) {
        const clearPathList = [...this.clearPathList];
        const r = this.size / 2 * this.dpr;
        this.clearPathList = [];


        const renderFn = (ctx) => {
            if (clearPathList.length === 1) {
                this.clearArc(ctx, r, clearPathList[0][0], clearPathList[0][1])

            } else {
                for (let i = 0; i < clearPathList.length - 1; i++) {
                    this.clearArc(ctx, r, clearPathList[i][0], clearPathList[i][1], clearPathList[i + 1][0], clearPathList[i + 1][1])
                }
            }

        }
        return renderFn;
    }
}



module.exports = Eraser;