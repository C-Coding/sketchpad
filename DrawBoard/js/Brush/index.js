import BrushColorCanvas from './BrushColorCanvas'


class Brush {
    constructor(drawBoardBox, drawBoard) {
        this.ele=drawBoardBox.ele.querySelector('.__tools>.__brushBtn');
    }
    init(drawBoardBox, drawBoard) {
        //初始化brushcolorCanvas
        let brushColorCanvas = new BrushColorCanvas(drawBoardBox, drawBoard);
        brushColorCanvas.init(drawBoardBox, drawBoard);

        //初始化画笔控制按钮
        this.ele.style.backgroundImage = `url(${require('../../img/brush.png')})`;
        this.ele.addEventListener('touchstart', () => {
            let tools=drawBoardBox.ele.querySelectorAll('.__tools>button');
            for (let i = 0; i < tools.length; i++) {
                tools[i].classList.remove('__buttonActive');
            };
            this.ele.classList.add('__buttonActive');

            let option=drawBoardBox.ele.querySelectorAll('.__option');
            for (let i = 0; i < option.length; i++) {
                option[i].classList.remove('__optionTransition');
            }
            drawBoardBox.ele.querySelector('.__brushOption').classList.toggle('__optionTransition');
            drawBoard.switchBrush();
        })


        
        //初始化当前画笔大小标识
        drawBoardBox.ele.querySelector('.__brushSize>.__currentStyle>span').style.width=drawBoard.lineWidth+'px';
        drawBoardBox.ele.querySelector('.__brushSize>.__currentStyle>span').style.height=drawBoard.lineWidth+'px';


        let brushSizeSlider = drawBoardBox.ele.querySelector('.__brushSize>.__Slider');
        //初始化画笔大小控制位置
        let proportion = (drawBoard.lineWidth - 1) / (drawBoard.lineWidthRange[1] - drawBoard.lineWidthRange[0]);

        brushSizeSlider.querySelector('span').style.left =proportion* (brushSizeSlider.offsetWidth - brushSizeSlider.querySelector('span').offsetWidth)+'px';
        //监听sliderChange事件
        brushSizeSlider.addEventListener('sliderChange', (e) => {
            let lineWidth = Math.round(e.detail * (drawBoard.lineWidthRange[1] - drawBoard.lineWidthRange[0])) + 1;
            drawBoard.changeLineWidth(lineWidth);
            drawBoardBox.ele.querySelector('.__brushSize>.__currentStyle>span').style.width = lineWidth + 'px';
            drawBoardBox.ele.querySelector('.__brushSize>.__currentStyle>span').style.height = lineWidth + 'px';
        })
    }


}
export default Brush;