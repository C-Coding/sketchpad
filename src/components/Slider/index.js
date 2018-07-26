
import s from './index.less';

class Slider {
    constructor(ratio = 0) {//接收一个0-1的值  将决定滑块默认位置
        //滑块
        this.sliderEl = document.createElement('div');
        this.sliderEl.className = s.slider
        //滑块导轨
        this.sliderBoxEl = document.createElement('div');
        this.sliderBoxEl.className = s.sliderBox;

        this.sliderBoxEl.appendChild(this.sliderEl);

        this.sliderChangeEvent = document.createEvent('CustomEvent');//自定义事件 用于向外暴露滑块当前值 暴露事件名为 SizeSliderChange

        this.prevPointX = null;//记录点击时的坐标x
        this.prevOffsetLeft = null;//基佬点击时滑块的初始位置

        if (ratio > 0 && ratio <= 1) {
            this.sliderEl.style.left = ratio * 100 + '%';
        }

        const sliderMoveFn = this.sliderMove.bind(this);//需要removeEvent 保留函数指针

        this.sliderEl.addEventListener('touchstart', (e) => {
            e.preventDefault();//防止触发mouse事件
            this.sliderStart(e);
            document.body.addEventListener('touchmove', sliderMoveFn)
            document.body.addEventListener('touchend', function touchendFn() {
                document.body.removeEventListener('touchmove', sliderMoveFn)
                document.body.removeEventListener('touchend', touchendFn);
            })
        })


        this.sliderEl.addEventListener('mousedown', (e) => {
            this.sliderStart(e);
            document.body.addEventListener('mousemove', sliderMoveFn)
            document.body.addEventListener('mouseup', function mouseupFn() {
                document.body.removeEventListener('mousemove', sliderMoveFn);
                document.body.removeEventListener('mouseup', mouseupFn);
            })
        })

    }

    sliderStart(e) {
        let x;
        if (e.type === 'touchstart') {
            x = e.touches[0].pageX;
        } else {
            x = e.pageX;
        }
        this.prevPointX = x;
        this.prevOffsetLeft = this.sliderEl.offsetLeft;
    }

    sliderMove(e) {
        let x;
        if (e.type === 'touchmove') {
            x = e.touches[0].pageX;
        } else {
            x = e.pageX;
        }

        const X = x - this.prevPointX + this.prevOffsetLeft

        if (X > 0 && X < this.sliderBoxEl.clientWidth) {
            const perc = X / this.sliderBoxEl.clientWidth
            this.sliderEl.style.left = perc * 100 + '%';
            //发出自定义事件 传递滑块当前位置的小数
            this.sliderChangeEvent.initCustomEvent('sliderChange', true, false, perc);
            this.sliderBoxEl.dispatchEvent(this.sliderChangeEvent);
        }

    }
}

module.exports = Slider;