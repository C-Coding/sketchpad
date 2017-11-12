class Eraser {
    constructor(drawBoardBox, drawBoard) {
        this.drawBoardBox=drawBoardBox;
        this.drawBoard=drawBoard;

        this.ele = this.drawBoardBox.ele.querySelector('.__tools>.__eraserBtn');
        this.eraserSizeSlider = this.drawBoardBox.ele.querySelector('.__eraserSize>.__Slider');
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

        

        //初始化画笔大小控制位置
        let proportion = (drawBoard.eraserRadius - 1) / (drawBoard.eraserRadiusRange[1] - drawBoard.eraserRadiusRange[0]);

        this.eraserSizeSlider.querySelector('span').style.left = proportion * (this.eraserSizeSlider.offsetWidth - this.eraserSizeSlider.querySelector('span').offsetWidth) + 'px';
        //监听sliderChange事件
        this.eraserSizeSlider.addEventListener('sliderChange', (e) => {
            let eraserRadius = Math.round(e.detail * (drawBoard.eraserRadiusRange[1] - drawBoard.eraserRadiusRange[0])) + 1;
            drawBoard.changeEraserRadius(eraserRadius);
            drawBoardBox.ele.querySelector('.__eraserSize>.__currentSize>span').style.width = eraserRadius + 'px';
            drawBoardBox.ele.querySelector('.__eraserSize>.__currentSize>span').style.height = eraserRadius + 'px';
        })



        drawBoard.ele.addEventListener('touchstart', (e) => {
            switch (drawBoard.tool) {
                case 'eraser':
                    let x = (e.touches[0].pageX - drawBoard.left()) * window.devicePixelRatio;
                    let y = (e.touches[0].pageY - drawBoard.top()) * window.devicePixelRatio;
                    drawBoard.clearArc(x, y, drawBoard.eraserRadius);
                    drawBoard.touchPrevious = [x, y];
                    break;
            }
        })


        drawBoard.ele.addEventListener('touchmove', (e) => {
            switch (drawBoard.tool) {
                case 'eraser':
                    let x = (e.touches[0].pageX - drawBoard.left()) * window.devicePixelRatio;
                    let y = (e.touches[0].pageY - drawBoard.top()) * window.devicePixelRatio;
                    let xMove = x - drawBoard.touchPrevious[0];
                    let yMove = y - drawBoard.touchPrevious[1];
                    let pathLength = Math.ceil(Math.sqrt(Math.pow(xMove, 2) + Math.pow(yMove, 2)));
                    if (pathLength > 1) {
                        let xUnitLength = xMove / pathLength;
                        let yUnitLength = yMove / pathLength;
                        for (let i = 0; i < pathLength; i++) {
                            drawBoard.clearArc(Math.round(xUnitLength * i + drawBoard.touchPrevious[0]), Math.round(yUnitLength * i + drawBoard.touchPrevious[1]), drawBoard.eraserRadius);
                        }
                    } else {
                        drawBoard.clearArc(x, y, drawBoard.eraserRadius);
                    }
                    drawBoard.touchPrevious = [x, y];
                    break;
            }
        })
    }
    resize(){
        let proportion = (this.drawBoard.eraserRadius - 1) / (this.drawBoard.eraserRadiusRange[1] - this.drawBoard.eraserRadiusRange[0]);
        this.eraserSizeSlider.querySelector('span').style.left = proportion * (this.eraserSizeSlider.offsetWidth - this.eraserSizeSlider.querySelector('span').offsetWidth) + 'px';
    }
}

export default Eraser;