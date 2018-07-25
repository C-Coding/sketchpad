import SizeSlider from '@/components/Slider/SizeSlider'
import ColorSlider from '@/components/Slider/ColorSlider';
import s from './index.less';
import html from './index.html';

class Brush {
    constructor({ frontCanvasEl, frontCanvasCtx }) {//接收Sketchpad传递的mainCanvasCtx
        this.frontCanvasShow = true;
        this.frontCanvasEl = frontCanvasEl;
        this.frontCanvasCtx = frontCanvasCtx;

        this.dpr = window.devicePixelRatio;

        //定义笔刷属性
        this.lineWidth = 10;//画笔默认线宽  tip直径
        this.lineWidthRange = [5, 40];
        this.color = 'black';//默认颜色

        this.startPoint = [];
        this.endPoint = null;




        //暴露btn
        this.btnEl = document.createElement('button');
        this.btnEl.style.backgroundImage = `url(${require('./line.svg')})`;

        //暴露option
        this.optionEl = document.createElement('div');
        this.optionEl.className = s.option;
        this.optionEl.innerHTML = html;

        //定义size标识
        this.tipEl = this.optionEl.querySelector('.tip');





        const sizeSliderEl = new SizeSlider({
            ratio: (this.lineWidth - this.lineWidthRange[0]) / (this.lineWidthRange[1] - this.lineWidthRange[0]),
            sliderSize: 30
        }).El;
        sizeSliderEl.addEventListener('sliderChange', (e) => {
            const size = (this.lineWidthRange[1] - this.lineWidthRange[0]) * e.detail + this.lineWidthRange[0];
            this.sizeChange(size)
        })
        this.optionEl.querySelector('.sizeSliderBox').appendChild(sizeSliderEl);


        const colorSliderEl = new ColorSlider({}).El;
        colorSliderEl.addEventListener('colorSliderChange', (e) => {
            this.colorChange(e.detail);
        })


        this.optionEl.querySelector('.colorOption').appendChild(colorSliderEl);


        this.sizeChange(this.lineWidth);
        this.colorChange(this.color);
    }

    sizeChange(v) {
        this.lineWidth = v;
        this.tipEl.style.width = v + 'px';
        this.tipEl.style.height = v + 'px';
    }

    colorChange(color) {
        this.color = color;
        this.tipEl.style.backgroundColor = color;
    }


    drawStartFn(e) {
        this.startPoint = [e.canvasX, e.canvasY];
    }

    drawMoveFn(e) {
        if (this.endPoint !== null) {
            this.frontCanvasCtx.clearRect(0, 0, this.frontCanvasEl.width, this.frontCanvasEl.height);
        }
        this.endPoint = [e.canvasX, e.canvasY];

        const ctx = this.frontCanvasCtx;
        ctx.save();
        ctx.lineWidth = this.lineWidth * this.dpr;
        ctx.strokeStyle = this.color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(this.startPoint[0],this.startPoint[1]);
        ctx.lineTo(e.canvasX,e.canvasY);
        ctx.stroke();
        ctx.restore();
    }

    drawEndFn(e) {
        if(this.endPoint===null){
            return false;
        }
        const lineWidth=this.lineWidth*this.dpr;
        const color=this.color;
        const startPoint=[...this.startPoint];
        const endPoint=[...this.endPoint];

        this.startPoint=[];
        this.endPoint=null;

        const renderFn=(ctx)=>{
            ctx.save();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = color;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(startPoint[0],startPoint[1]);
            ctx.lineTo(endPoint[0],endPoint[1]);
            ctx.stroke();
            ctx.restore();
        }
        renderFn.needRender=true;
        return renderFn;
    }


}

module.exports = Brush;