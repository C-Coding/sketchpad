class DrawBoardBox {
    constructor(id) {
        this.ele = document.querySelector(id);
        this.w = this.ele.offsetWidth;
        this.h = this.ele.offsetHeight;
        this.isMobile = false;
    }
    init() {
        //移动端判断 决定事件触发方式
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            this.isMobile=true;
        }


        this.ele.className = '__drawBoardBox'
        let content =
            `
        <div class="__tools">
            <button class="__brushBtn __buttonActive"></button>
            <button class="__eraserBtn"></button>

            <span class="__saveImg"></span>
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
    resize() {
        this.w = this.ele.offsetWidth;
        this.h = this.ele.offsetHeight;
    }
}

export default DrawBoardBox;