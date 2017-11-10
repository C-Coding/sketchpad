class DrawBoardBox {
    constructor(id) {
        this.ele = document.querySelector(id);
        this.w = this.ele.offsetWidth;
        this.h = this.ele.offsetHeight;
    }
    init() {
        this.ele.className = '__drawBoardBox'
        let content =
            `
        <div class="__tools">
            <button class="__brushBtn __buttonActive"></button>
            <button class="__eraserBtn"></button>
        </div>
        <div class="__toolsOption">
            <div class="__brushOption __option __optionTransition">
                <div class="__brushSize">
                    <div class="__currentStyle">
                        <span></span>
                    </div>
                    <div class="__Slider">
                        <span></span>
                    </div>
                </div>
                <div class="__brushColor">
                    <canvas class="__palette"></canvas>
                </div>
            </div>
            <div class="__eraserOption __option">
                <div class="__eraserSize">
                    <div class="__currentSize">
                        <span></span>
                    </div>
                    <div class="__Slider">
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="__boardBox">
            <canvas class="__backgroundBoard"></canvas>
            <canvas class="__drawBoard"></canvas>
        </div>
            `
            ;

        this.ele.innerHTML = content;
    }
}

export default DrawBoardBox;