import Slider from '@/components/Slider';
import s from './index.less';




class SizeSlider extends Slider {
    constructor({ ratio, sliderSize }) {//接收ratio决定滑块默认位置 size决定滑块默认大小
        super(ratio);



        this.sliderEl.classList.add(s.slider);
        this.sliderEl.style.width = sliderSize + 'px';
        this.sliderEl.style.height = sliderSize + 'px';


        this.sliderBoxEl.classList.add(s.sliderBox);

        this.sizeSliderBoxEl = document.createElement('div');
        this.sizeSliderBoxEl.className = s.sizeSliderBox;
        this.sizeSliderBoxEl.style.height = sliderSize + 'px';
        this.sizeSliderBoxEl.style.marginLeft = sliderSize / 2 + 'px';
        this.sizeSliderBoxEl.style.marginRight = sliderSize / 2 + 'px';



        this.sizeSliderBoxEl.appendChild(this.sliderBoxEl);



    }

}


module.exports = SizeSlider;