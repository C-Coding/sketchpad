import SizeSlider from '@/components/Slider/SizeSlider';
import s from './index.less';
import html from './index.html';

class Eraser {
    constructor({ mainCanvasCtx }) {
        this.frontCanvasShow = false;//切换到当前组件时 自动关闭front层


        this.mainCanvasCtx = mainCanvasCtx;
        this.dpr = window.devicePixelRatio;
        //橡皮默认直径
        this.lineWidth = 10;
        this.lineWidthRange = [5, 40];

        this.linePathList = [];//记录擦除路径


        this.btnEl = document.createElement('button');
        this.btnEl.style.backgroundImage = `url('${require('./eraser.svg')}')`

        this.optionEl = document.createElement('div');
        this.optionEl.innerHTML = html;
        this.optionEl.className = s.option;

        this.tipEl = this.optionEl.querySelector('.tip');
        this.sizeChange(this.lineWidth);


        const sizeSliderEl = new SizeSlider({
            ratio: (this.lineWidth - this.lineWidthRange[0]) / (this.lineWidthRange[1] - this.lineWidthRange[0])
        }).El;
        sizeSliderEl.addEventListener('sliderChange', (e) => {
            this.sizeChange((this.lineWidthRange[1] - this.lineWidthRange[0]) * e.detail + this.lineWidthRange[0]);
        })


        this.optionEl.querySelector('.sizeSliderBox').appendChild(sizeSliderEl);

    }

    sizeChange(v) {
        this.lineWidth = v;
        this.tipEl.style.width = v + 'px';
        this.tipEl.style.height = v + 'px';
    }
    drawStartFn(e) {
        this.linePathList.push([e.canvasX, e.canvasY]);
        this.render();
    }

    drawMoveFn(e) {
        this.linePathList.push([e.canvasX, e.canvasY]);
        this.render();

    }

    drawEndFn(e) {
        const linePathList = [...this.linePathList];
        this.linePathList = [];


        const color = this.color;
        const lineWidth = this.lineWidth * this.dpr;
        return (ctx) => {
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            if (linePathList.length === 1) {
                const point = linePathList[0];
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(point[0], point[1], lineWidth / 2, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(linePathList[0][0], linePathList[0][1]);
                for (let i = 1; i < linePathList.length; i++) {
                    ctx.lineTo(linePathList[i][0], linePathList[i][1]);
                };
                ctx.stroke();
            }
            ctx.restore();
        }
    }


    render() {
        const ctx = this.mainCanvasCtx;
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        if (this.linePathList.length === 1) {
            const point = this.linePathList[0];
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(point[0], point[1], this.lineWidth / 2 * this.dpr, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        } else {
            const startPoint = this.linePathList[this.linePathList.length - 2]
            const endPoint = this.linePathList[this.linePathList.length - 1]
            ctx.lineWidth = this.lineWidth * this.dpr;
            ctx.strokeStyle = this.color;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(startPoint[0], startPoint[1])
            ctx.lineTo(endPoint[0], endPoint[1]);
            ctx.closePath();
            ctx.stroke();
        }
        ctx.restore();
    }
}



module.exports = Eraser;