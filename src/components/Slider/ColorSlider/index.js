import colorList from './colorList.js';
import Slider from '@/components/Slider';
import s from './index.less';

class MainColorSlider extends Slider {
    constructor({ height = 40 }) {
        super()

        this.sliderBoxEl.classList.add(s.sliderBox);

        //当前颜色标识
        const tipEl = document.createElement('div');
        tipEl.className = s.tip;

        this.sliderEl.classList.add(s.slider);
        this.sliderEl.appendChild(tipEl);


        //定义canvas背景
        const canvasEl = document.createElement('canvas');
        canvasEl.width = colorList.length;
        canvasEl.height = 10;
        canvasEl.className = s.canvas;
        const canvasCtx = canvasEl.getContext('2d');

        const colorSliderBoxEl = document.createElement('div');
        colorSliderBoxEl.className = s.colorSliderBox;
        colorSliderBoxEl.classList.add(s.mainColorSliderBox);
        colorSliderBoxEl.style.height = height + 'px';

        colorSliderBoxEl.appendChild(canvasEl);
        colorSliderBoxEl.appendChild(this.sliderBoxEl);


        const ctx = canvasCtx;
        ctx.save();
        colorList.forEach(function (item, index) {
            ctx.beginPath();
            ctx.moveTo(index, 0);                //移动笔触
            ctx.lineTo(index, 10);                 //绘制线条路径
            ctx.strokeStyle = `rgb(${item[0]},${item[1]},${item[2]})`;
            ctx.closePath();
            ctx.stroke();
        })
        ctx.restore();

        //绑定事件
        colorSliderBoxEl.addEventListener('sliderChange', (e) => {
            e.stopPropagation();
            const color = colorList[Math.round(colorList.length * e.detail)];
            const rgb = `rgb(${color[0]},${color[1]},${color[2]})`
            tipEl.style.backgroundColor = rgb;

            const event = document.createEvent('CustomEvent');
            //发出自定义事件 传递rgb字符串
            event.initCustomEvent('mainColorSliderChange', true, false, color);
            colorSliderBoxEl.dispatchEvent(event);
        })



        this.El = colorSliderBoxEl;//暴露节点

    }
}

class SubColorSlider extends Slider {
    constructor({ height = 30 }) {
        super()

        this.showTimer=null;
        this.color = [0, 0, 0];
    

        this.sliderBoxEl.classList.add(s.sliderBox);

        //当前颜色标识
        const tipEl = document.createElement('div');
        tipEl.className = s.tip;

        this.sliderEl.classList.add(s.slider);
        this.sliderEl.appendChild(tipEl);
        this.sliderEl.style.left = '50%';


        //定义canvas背景
        const canvasEl = document.createElement('canvas');
        canvasEl.width = 100;
        canvasEl.height = 10;
        canvasEl.className = s.canvas;
        const canvasCtx = canvasEl.getContext('2d');


        const colorSliderBoxEl = document.createElement('div');
        colorSliderBoxEl.className = s.colorSliderBox;
        colorSliderBoxEl.classList.add(s.subColorSliderBox);

        colorSliderBoxEl.style.height = height + 'px';

        colorSliderBoxEl.appendChild(canvasEl);
        colorSliderBoxEl.appendChild(this.sliderBoxEl);




        //绑定事件
        colorSliderBoxEl.addEventListener('sliderChange', (e) => {
            e.stopPropagation();
            //计算color值
            let color=this.color;
            if (e.detail > 0.5) {
                const prop = (e.detail - 0.5) * 2;
                color = [
                    this.color[0] * (1 - prop) + 255 * prop,
                    this.color[1] * (1 - prop) + 255 * prop,
                    this.color[2] * (1 - prop) + 255 * prop,
                ]

            } else if (e.detail < 0.5) {
                const prop = 1 - (0.5 - e.detail) * 2;
                color = [this.color[0] * prop, this.color[1] * prop, this.color[2] * prop]
            } else if (e.detail === 0.5) {
                color = this.color;
            }
            this.colorChange(color);
            this.show();
            const rgb = `rgb(${color[0]},${color[1]},${color[2]})`;
            const event = document.createEvent('CustomEvent');
            //发出自定义事件 传递rgb字符串
            event.initCustomEvent('colorSliderChange', true, false, rgb);
            colorSliderBoxEl.dispatchEvent(event);
        })



        this.El = colorSliderBoxEl;//暴露节点
        this.tipEl = tipEl;//暴露tip颜色标识
        this.canvasCtx = canvasCtx;//暴露canvasCtx 以便重绘
        this.subCanvasRender(this.color);//初始化颜色


    }
    colorChange(color) {//
        const rgb = `rgb(${color[0]},${color[1]},${color[2]})`;
        this.tipEl.style.backgroundColor = rgb;
        
    }
    subCanvasRender(color) {
        this.color=color;
        this.colorChange(color);
        this.sliderEl.style.left = '50%';

        const ctx = this.canvasCtx;
        ctx.save();

        const lineargradient = ctx.createLinearGradient(0, 0, 100, 0);
        lineargradient.addColorStop(0, 'rgb(0,0,0)');
        lineargradient.addColorStop(0.5, `rgb(${color[0]},${color[1]},${color[2]})`)
        lineargradient.addColorStop(1, 'rgb(255,255,255)');

        ctx.fillStyle = lineargradient;
        ctx.fillRect(0, 0, 100, 10);
        ctx.restore();
    }
    show(){
        clearInterval(this.showTimer);
        this.El.classList.add(s.subColorSliderBoxActive);
        this.showTimer=setTimeout(()=>{
            this.El.classList.remove(s.subColorSliderBoxActive);
        },2000);
    }
}


class ColorSlider {
    constructor({height}) {
        const colorSliderContainer = document.createElement('div');
        colorSliderContainer.className = s.colorSliderContainer;
        const mainColorSlider = new MainColorSlider({height});
        const subColorSlider = new SubColorSlider({height});

        colorSliderContainer.appendChild(mainColorSlider.El);
        colorSliderContainer.appendChild(subColorSlider.El);


        colorSliderContainer.addEventListener('mainColorSliderChange', function (e) {
            e.stopPropagation();
            const color = e.detail
            const rgb = `rgb(${color[0]},${color[1]},${color[2]})`

            const event = document.createEvent('CustomEvent');
            //发出自定义事件 传递rgb字符串
            event.initCustomEvent('colorSliderChange', true, false, rgb);
            colorSliderContainer.dispatchEvent(event);


            subColorSlider.subCanvasRender(color);//mainColor变化后重绘subColor
            subColorSlider.show();

        })

        this.El = colorSliderContainer;
    }
}





module.exports = ColorSlider;