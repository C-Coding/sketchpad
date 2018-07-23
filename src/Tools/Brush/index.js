import SizeSlider from '@/components/Slider/SizeSlider'
import ColorSlider from '@/components/Slider/ColorSlider';
import s from './index.less';
import html from './index.html';

class Brush {
    constructor({ mainCanvasCtx }) {//接收Sketchpad传递的mainCanvasCtx
        this.mainCanvasCtx = mainCanvasCtx;



        this.dpr = window.devicePixelRatio;

        //定义笔刷属性
        this.lineWidth = 10;//画笔默认线宽  tip直径
        this.lineWidthRange = [5, 40];
        this.color = 'black';//默认颜色

        this.linePathList = [];//画笔路径坐标数组




        //暴露btn
        this.btnEl = document.createElement('button');
        this.btnEl.style.backgroundImage = `url(${require('./brush.png')})`;

        //暴露option
        this.optionEl = document.createElement('div');
        this.optionEl.className = s.option;
        this.optionEl.innerHTML = html;

        //定义size标识
        this.tipEl = this.optionEl.querySelector('.tip');





        const sizeSliderBoxEl = new SizeSlider({
            ratio: (this.lineWidth - this.lineWidthRange[0]) / (this.lineWidthRange[1] - this.lineWidthRange[0]),
            sliderSize: 30
        }).sizeSliderBoxEl;
        sizeSliderBoxEl.addEventListener('sliderChange', (e) => {
            const size = (this.lineWidthRange[1] - this.lineWidthRange[0]) * e.detail + this.lineWidthRange[0];
            this.sizeChange(size)
        })
        this.optionEl.querySelector('.sizeSliderBox').appendChild(sizeSliderBoxEl);


        const colorSliderBoxEl = new ColorSlider().colorSliderBoxEl;
        colorSliderBoxEl.addEventListener('colorSliderChange', (e) => {
            this.colorChange(e.detail);
        })


        this.optionEl.querySelector('.colorOption').appendChild(colorSliderBoxEl);


        this.sizeChange(this.lineWidth);
        this.colorChange(this.color);
    }

    sizeChange(v) {
        this.lineWidth = v;
        this.tipEl.style.width = v  + 'px';
        this.tipEl.style.height = v  + 'px';
    }

    colorChange(color) {
        this.color = color;
        this.tipEl.style.backgroundColor = color;
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
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(linePathList[0][0], linePathList[0][1]);
            for (let i = 0; i < linePathList.length; i++) {
                ctx.lineTo(linePathList[i][0], linePathList[i][1]);
            };
            ctx.stroke();
            ctx.restore();
        }
    }


    render() {
        let startPoint;
        let endPoint = this.linePathList[this.linePathList.length - 1];
        if (this.linePathList.length === 1) {
            startPoint = this.linePathList[this.linePathList.length - 1]
        } else {
            startPoint = this.linePathList[this.linePathList.length - 2]
        }

        const ctx = this.mainCanvasCtx;
        ctx.save();
        ctx.lineWidth = this.lineWidth * this.dpr;
        ctx.strokeStyle = this.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(startPoint[0], startPoint[1])
        ctx.lineTo(endPoint[0], endPoint[1]);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }




}

module.exports = Brush;