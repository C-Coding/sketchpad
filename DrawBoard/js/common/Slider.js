import { getElementLeft, getElementTop } from './common'

class Slider {
    constructor(drawBoardBox) {
        this.eles = drawBoardBox.ele.querySelectorAll(`.__Slider`);
    }
    init() {

        for (let i = 0; i < this.eles.length; i++) {
            let sliderBlock = this.eles[i].querySelector('span');

            let current={};
            sliderBlock.addEventListener('touchstart',(e)=>{
                e.stopPropagation();
                e.preventDefault();
                current={
                    x:e.touches[0].pageX,
                    left:sliderBlock.offsetLeft
                }
            })


            sliderBlock.addEventListener('touchmove', (e) => {
                e.stopPropagation();
                e.preventDefault();
                let left=e.touches[0].pageX-current.x+current.left;
                let max=this.eles[i].offsetWidth-sliderBlock.offsetWidth-4;//减去boxshadow部分 
                if(left<=0){
                    left=0;
                }else if(left>=max){
                    left=max;
                }
                sliderBlock.style.left=`${left}px`;

                //自定义事件
                let num=left/max;
                let sliderChangeEvent=document.createEvent('CustomEvent');
                sliderChangeEvent.initCustomEvent('sliderChange',true,true,num);
                this.eles[i].dispatchEvent(sliderChangeEvent);
            });
            this.eles[i].appendChild(sliderBlock);

        }
    }
}

export default Slider;