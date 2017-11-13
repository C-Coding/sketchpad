import { getElementLeft, getElementTop } from './common'

class Slider {
    constructor(drawBoardBox) {
        this.drawBoardBox = drawBoardBox;
        this.eles = drawBoardBox.ele.querySelectorAll(`.__Slider`);
    }
    init() {

        for (let i = 0; i < this.eles.length; i++) {
            let sliderBlock = this.eles[i].querySelector('span');


            let current = {};
            let touchstartFn = (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (this.drawBoardBox.isMobile) {
                    current = {
                        x: e.touches[0].pageX,
                        left: sliderBlock.offsetLeft
                    }
                } else {
                    current = {
                        x: e.pageX,
                        left: sliderBlock.offsetLeft
                    }
                }

            }


            let touchmoveFn = (e) => {
                e.stopPropagation();
                e.preventDefault();
                let left;
                if (this.drawBoardBox.isMobile) {
                    left = e.touches[0].pageX - current.x + current.left;
                } else {
                    left = e.pageX - current.x + current.left;
                }
                let max = this.eles[i].offsetWidth - sliderBlock.offsetWidth - 4;//减去boxshadow部分 
                if (left <= 0) {
                    left = 0;
                } else if (left >= max) {
                    left = max;
                }
                sliderBlock.style.left = `${left}px`;

                //自定义事件
                let num = left / max;
                let sliderChangeEvent = document.createEvent('CustomEvent');
                sliderChangeEvent.initCustomEvent('sliderChange', true, true, num);
                this.eles[i].dispatchEvent(sliderChangeEvent);
            }

            sliderBlock.addEventListener('touchstart', touchstartFn);
            sliderBlock.addEventListener('touchmove', touchmoveFn);

            sliderBlock.addEventListener('mousedown', (e) => {
                touchstartFn(e);
                window.addEventListener('mousemove', touchmoveFn);
            });
            window.addEventListener('mouseup', (e) => {
                window.removeEventListener('mousemove', touchmoveFn);
            });
            this.eles[i].appendChild(sliderBlock);

        }
    }
}

export default Slider;