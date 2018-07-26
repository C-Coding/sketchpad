import SizeSlider from '@/components/Slider/SizeSlider';
import s from './index.less';
import html from './index.html';




class NumSlider extends SizeSlider {
    constructor({ range }) {//接收一个数组 表示数值范围
        if (!range) {
            throw new Error('numSlider需要range');
        }
        super({});

        this.numSliderBoxEl = document.createElement('div');
        this.numSliderBoxEl.className = s.numSliderBox;
        this.numSliderBoxEl.innerHTML = html;

        this.numSliderBoxEl.querySelector('.sizeSliderBox').appendChild(this.sizeSliderBoxEl);


        this.num = range[0];//当前数值
        this.range = range;

        this.numSliderChangeEvent = document.createEvent('CustomEvent');


        this.numSliderBoxEl.addEventListener('sliderChange', (e) => {
            e.stopPropagation();
            let v = (range[1] - range[0]) * e.detail + range[0];
            v = Number(v.toFixed(0));
            if (this.num !== v) {
                this.num = v;
                this.numSliderChangeEvent.initCustomEvent('numSliderChange', true, false, this.num);
                this.El.dispatchEvent(this.numSliderChangeEvent);
            }
        })


        this.subtractBtnEl = this.numSliderBoxEl.querySelector('.subtract');
        this.subtractBtnEl.addEventListener('click', () => {
            if (this.num > range[0]) {
                this.numChange(this.num - 1);
            }
        })

        this.addBtnEl = this.numSliderBoxEl.querySelector('.add');
        this.addBtnEl.addEventListener('click', () => {
            if (this.num < range[1]) {
                this.numChange(this.num + 1);
            }
        })

        this.El = this.numSliderBoxEl;
    }

    numChange(v) {
        this.num = v;
        this.sliderEl.style.left = (v - this.range[0]) * 100 / (this.range[1] - this.range[0]) + '%';
        this.numSliderChangeEvent.initCustomEvent('numSliderChange', true, false, this.num);
        this.El.dispatchEvent(this.numSliderChangeEvent);
    }

}


module.exports = NumSlider;