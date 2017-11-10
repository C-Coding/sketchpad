import { deflateRaw } from 'zlib';


class Eraser {
    constructor(drawBoardBox, drawBoard) {
        this.ele = drawBoardBox.ele.querySelector('.__tools>.__eraserBtn');
    }
    init(drawBoardBox, drawBoard) {

        this.ele.style.backgroundImage = `url(${require('../../img/eraser.png')})`;
        this.ele.addEventListener('touchstart', () => {
            let tools = drawBoardBox.ele.querySelectorAll('.__tools>button');
            for (let i = 0; i < tools.length; i++) {
                tools[i].classList.remove('__buttonActive');
            };
            this.ele.classList.add('__buttonActive');
            let option = drawBoardBox.ele.querySelectorAll('.__option');
            for (let i = 0; i < option.length; i++) {
                option[i].classList.remove('__optionTransition');
            }
            drawBoardBox.ele.querySelector('.__eraserOption').classList.toggle('__optionTransition');
            drawBoard.switchEraser();
        });



        

        //初始化当前橡皮擦大小标识
        drawBoardBox.ele.querySelector('.__eraserOption>.__eraserSize>.__currentSize>span').style.width = drawBoard.eraserRadius + 'px';
        drawBoardBox.ele.querySelector('.__eraserOption>.__eraserSize>.__currentSize>span').style.height = drawBoard.eraserRadius + 'px';

        let eraserSizeSlider = drawBoardBox.ele.querySelector('.__eraserSize>.__Slider');
        
        //初始化画笔大小控制位置
        let proportion = (drawBoard.eraserRadius - 1) / (drawBoard.eraserRadiusRange[1] - drawBoard.eraserRadiusRange[0]);

        eraserSizeSlider.querySelector('span').style.left = proportion * (eraserSizeSlider.offsetWidth - eraserSizeSlider.querySelector('span').offsetWidth) + 'px';
        //监听sliderChange事件
        eraserSizeSlider.addEventListener('sliderChange', (e) => {
            let eraserRadius = Math.round(e.detail * (drawBoard.eraserRadiusRange[1] - drawBoard.eraserRadiusRange[0])) + 1;
            drawBoard.changeEraserRadius(eraserRadius);
            drawBoardBox.ele.querySelector('.__eraserSize>.__currentSize>span').style.width = eraserRadius + 'px';
            drawBoardBox.ele.querySelector('.__eraserSize>.__currentSize>span').style.height = eraserRadius + 'px';
        })
    }
}

export default Eraser;