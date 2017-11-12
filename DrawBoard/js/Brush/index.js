import BrushColorCanvas from './BrushColorCanvas'


class Brush {
    constructor(drawBoardBox, drawBoard) {
        this.drawBoardBox=drawBoardBox;
        this.drawBoard=drawBoard;
        this.ele = this.drawBoardBox.ele.querySelector('.__tools>.__brushBtn');
        this.brushColorCanvas = new BrushColorCanvas(drawBoardBox, drawBoard);

        this.brushSizeSlider=this.drawBoardBox.ele.querySelector('.__brushSize>.__Slider');
    }
    init(drawBoardBox, drawBoard) {
        //初始化brushcolorCanvas
        this.brushColorCanvas.init(drawBoardBox, drawBoard);

        //初始化画笔切换按钮
        this.ele.style.backgroundImage = `url(${require('../../img/brush.png')})`;
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
            drawBoardBox.ele.querySelector('.__brushOption').classList.toggle('__optionTransition');
            drawBoard.switchBrush();
        })



        //初始化当前画笔大小标识
        drawBoardBox.ele.querySelector('.__brushSize>.__currentStyle>span').style.width = drawBoard.lineWidth + 'px';
        drawBoardBox.ele.querySelector('.__brushSize>.__currentStyle>span').style.height = drawBoard.lineWidth + 'px';



        //初始化画笔大小控制位置
        let proportion = (drawBoard.lineWidth - 1) / (drawBoard.lineWidthRange[1] - drawBoard.lineWidthRange[0]);

        this.brushSizeSlider.querySelector('span').style.left = proportion * (this.brushSizeSlider.offsetWidth - this.brushSizeSlider.querySelector('span').offsetWidth) + 'px';
        //监听sliderChange事件
        this.brushSizeSlider.addEventListener('sliderChange', (e) => {
            let lineWidth = Math.round(e.detail * (drawBoard.lineWidthRange[1] - drawBoard.lineWidthRange[0])) + 1;
            drawBoard.changeLineWidth(lineWidth);
            drawBoardBox.ele.querySelector('.__brushSize>.__currentStyle>span').style.width = lineWidth + 'px';
            drawBoardBox.ele.querySelector('.__brushSize>.__currentStyle>span').style.height = lineWidth + 'px';
        })



        drawBoard.ele.addEventListener('touchstart', (e) => {
            switch (drawBoard.tool) {
                case 'brush':
                    let x = (e.touches[0].pageX - drawBoard.left()) * window.devicePixelRatio;
                    let y = (e.touches[0].pageY - drawBoard.top()) * window.devicePixelRatio;
                    drawBoard.lineArr.push([[x, y]])
                    break;
            }
        })

        drawBoard.ele.addEventListener('touchmove', (e) => {
            switch (drawBoard.tool) {
                case 'brush':
                    let x = (e.touches[0].pageX - drawBoard.left()) * window.devicePixelRatio;
                    let y = (e.touches[0].pageY - drawBoard.top()) * window.devicePixelRatio;
                    drawBoard.lineArr[drawBoard.lineArr.length - 1].push([
                        x, y
                    ])
                    drawBoard.line(drawBoard.lineArr[drawBoard.lineArr.length - 1]);
                    break;
            }
        })
    }
    resize() {
        this.brushColorCanvas.resize();
        let proportion = (this.drawBoard.lineWidth - 1) / (this.drawBoard.lineWidthRange[1] - this.drawBoard.lineWidthRange[0]);

        this.brushSizeSlider.querySelector('span').style.left = proportion * (this.brushSizeSlider.offsetWidth - this.brushSizeSlider.querySelector('span').offsetWidth) + 'px';
    }


}
export default Brush;