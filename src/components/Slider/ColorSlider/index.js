import colorList from './colorList.js';
import Slider from '@/components/Slider';
import s from './index.less';

class ColorSlider extends Slider {
    constructor({height=40}) {
        super()

        this.sliderBoxEl.classList.add(s.sliderBox);

        //当前颜色标识
        this.tipEl = document.createElement('div');
        this.tipEl.className = s.tip;

        this.sliderEl.classList.add(s.slider);
        this.sliderEl.appendChild(this.tipEl);


        //定义canvas背景
        this.canvasEl = document.createElement('canvas');
        this.canvasEl.width = colorList.length;
        this.canvasEl.height = 10;
        this.canvasEl.className = s.canvas;
        this.canvasCtx = this.canvasEl.getContext('2d');

        this.colorSliderBoxEl = document.createElement('div');
        this.colorSliderBoxEl.className = s.colorSliderBox;
        this.colorSliderBoxEl.style.height=height+'px';

        this.colorSliderBoxEl.appendChild(this.canvasEl);
        this.colorSliderBoxEl.appendChild(this.sliderBoxEl);


        const ctx = this.canvasCtx;
        ctx.save();
        colorList.forEach(function (item, index) {
            ctx.restore();
            ctx.beginPath();
            ctx.moveTo(index, 0);                //移动笔触
            ctx.lineTo(index, 10);                 //绘制线条路径
            ctx.strokeStyle = `rgb(${item[0]},${item[1]},${item[2]})`;
            ctx.closePath();
            ctx.stroke();
        })

        //绑定事件
        this.colorSliderBoxEl.addEventListener('sliderChange', (e) => {
            e.stopPropagation();
            const color = colorList[Math.round(colorList.length * e.detail)];
            const rgb = `rgb(${color[0]},${color[1]},${color[2]})`
            this.tipEl.style.backgroundColor = rgb;

            const event = document.createEvent('CustomEvent');
            //发出自定义事件 传递rgb字符串
            event.initCustomEvent('colorSliderChange', true, false, rgb);
            this.colorSliderBoxEl.dispatchEvent(event);
        })



        this.El=this.colorSliderBoxEl;

    }
}

module.exports = ColorSlider;