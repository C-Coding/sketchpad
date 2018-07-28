import NumSlider from '@/components/Slider/NumSlider';
import SizeSlider from '@/components/Slider/SizeSlider'
import ColorSlider from '@/components/Slider/ColorSlider';


import s from './index.less';
import html from './index.html';

class Polygon {
    constructor({ frontCanvasEl, frontCanvasCtx }) {//接收Sketchpad传递的mainCanvasCtx
        this.frontCanvasEl = frontCanvasEl;
        this.frontCanvasCtx = frontCanvasCtx;

        this.dpr = window.devicePixelRatio;

        //定义笔刷属性
        this.lineWidth = 10;//画笔默认线宽  tip直径
        this.lineWidthRange = [2, 40];
        this.fill = false;//是否填充
        this.color = 'black';//默认颜色

        this.side = 3;//默认三角形
        this.sideRange = [3, 10];

        this.centerPoint = [];//中心
        this.apexPoint = null;




        //暴露btn
        this.btnEl = document.createElement('button');
        this.btnEl.style.backgroundImage = `url(${require('./polygon.svg')})`;

        //暴露option
        this.optionEl = document.createElement('div');
        this.optionEl.className = s.option;
        this.optionEl.innerHTML = html;

        //定义标识
        this.sizeTipEl = this.optionEl.querySelector('.sizeOption .tip');
        this.sideTipEl = this.optionEl.querySelector('.sideOption .tipCanvas');
        this.sideTipCtx = this.sideTipEl.getContext('2d');

        this.init();
    }


    init() {
        //整数滑块
        const numSliderEl = new NumSlider({ range: this.sideRange }).El;
        numSliderEl.addEventListener('numSliderChange', (e) => {
            this.sideChange(e.detail);
        })
        //尺寸滑块
        const sizeSliderEl = new SizeSlider({
            ratio: (this.lineWidth - this.lineWidthRange[0]) / (this.lineWidthRange[1] - this.lineWidthRange[0]),
            sliderSize: 30
        }).El;
        sizeSliderEl.addEventListener('sliderChange', (e) => {
            const size = (this.lineWidthRange[1] - this.lineWidthRange[0]) * e.detail + this.lineWidthRange[0];
            this.sizeChange(size)
        })
        //颜色滑块
        const colorSliderEl = new ColorSlider({}).El;
        colorSliderEl.addEventListener('colorSliderChange', (e) => {
            this.colorChange(e.detail);
        })


        this.optionEl.querySelector('.sideOption .numSliderBox').appendChild(numSliderEl);
        this.optionEl.querySelector('.sizeOption .sizeSliderBox').appendChild(sizeSliderEl);
        this.optionEl.querySelector('.colorOption').appendChild(colorSliderEl);


        this.sideTipEl.addEventListener('click', () => {
            this.fillChange();
        })



        this.sideChange(3);//初始化多边形
        this.sizeChange(this.lineWidth);//初始化尺寸
        this.colorChange(this.color);//初始化
    }

    sideChange(side) {
        this.side = side;
        this.sideTipCtx.clearRect(0, 0, this.sideTipEl.width, this.sideTipEl.height);
        this.render(this.sideTipCtx, [40,40], [40,15], side, this.fill, 2, this.color);
    }

    fillChange() {
        this.fill = !this.fill;
        this.sideTipCtx.clearRect(0, 0, this.sideTipEl.width, this.sideTipEl.height);
        this.sideChange(this.side);
        if(this.fill){
            this.optionEl.querySelector('.sizeOption').style.display='none';
        }else{
            this.optionEl.querySelector('.sizeOption').style.display='flex';
        }
    }

    sizeChange(v) {
        this.lineWidth = v;
        this.sizeTipEl.style.width = v + 'px';
        this.sizeTipEl.style.height = v + 'px';
    }

    colorChange(color) {
        this.color = color;
        this.sizeTipEl.style.backgroundColor = color;
        this.sideChange(this.side);
    }


    drawStartFn(e) {
        this.centerPoint = [e.canvasX, e.canvasY];
    }

    drawMoveFn(e) {
        if (this.apexPoint !== null) {
            this.frontCanvasCtx.clearRect(0, 0, this.frontCanvasEl.width, this.frontCanvasEl.height);
        }
        this.apexPoint = [e.canvasX, e.canvasY];

        this.render(this.frontCanvasCtx, this.centerPoint, this.apexPoint, this.side, this.fill, this.lineWidth, this.color);

    }

    drawEndFn(e) {
        if (this.apexPoint === null) {
            return false;
        }
        const centerPoint = [...this.centerPoint];
        const apexPoint = [...this.apexPoint];
        const side = this.side;
        const fill = this.fill;
        const lineWidth = this.lineWidth;
        const color = this.color;

        this.centerPoint = [];
        this.apexPoint = null;
        const render = (ctx) => {
            this.render(ctx, centerPoint, apexPoint, side, fill, lineWidth, color);
        }

        render.needRender = true;
        return render;
    }


    render(ctx, centerPoint, apexPoint, side, fill, lineWidth, color) {
        const x0 = centerPoint[0];
        const y0 = centerPoint[1];
        const x1 = apexPoint[0];
        const y1 = apexPoint[1];

        const x = x1 - x0;
        const y = y1 - y0;
        const length = Math.sqrt(x * x + y * y);





        if (side === this.sideRange[1]) {//直接画圆
            ctx.save()
            ctx.beginPath();
            ctx.arc(centerPoint[0], centerPoint[1], length, 0, Math.PI * 2, true);
            ctx.closePath();
            if (fill) {
                ctx.fillStyle = color;
                ctx.fill();
            } else {
                ctx.strokeStyle = color;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
            }
            ctx.restore();
        } else {
            let radian;
            if (x === 0) {
                radian = y >= 0 ? Math.PI / 2 : -Math.PI / 2;
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

            ctx.save();
            ctx.translate(x0, y0);
            ctx.rotate(radian);

            ctx.beginPath();
            ctx.moveTo(length, 0);

            for (let i = 0; i < side; i++) {
                ctx.rotate(2 * Math.PI / side);
                ctx.lineTo(length, 0);
            }
            ctx.closePath();

            if (fill) {
                ctx.fillStyle = color;
                ctx.fill()
            } else {
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = color;
                ctx.stroke();
            }
            ctx.restore();
        }




    }
}

module.exports = Polygon;