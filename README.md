# sketchpad

> [DEMO](https://c-coding.github.io/sketchpad/)

> [changelog](https://github.com/C-Coding/sketchpad/blob/master/CHANGELOG.md)

> [中文文档](https://github.com/C-Coding/sketchpad/blob/master/README_CN.md)


# Use
npm
```js
npm i c-sketchpad --save

const Sketchpad=require('c-sketchpad');
```

src
```html
<script src="/docs/sketchpad.min.js"></script>
```

init
```js
const sketchpad = new Sketchpad({
            el: '#demo',
            toolBtnSize: 40,
            height: 400,
            toolList: ['Brush','Line','Polygon','Eraser'],
            saveBtn: true,
            maxRecall: 20
        });
```

## Option
```js
el: '#demo',                    //dom node or string that can be recognized by document.querySelector

toolBtnSize: 40                 //tool button size

height: 400                     //Canvas drawing area height

toolList: ['Brush','Eraser']    //tool array： Brush Eraser Line Polygon

saveBtn: true                   //display the save picture button

maxRecall: 20                   //number of recall

saveBg: 'rgba(0,0,0,0)'         //The default is transparent
```

# Api

```js
const sketchpad = new Sketchpad({options});


sketchpad.recall();             //active recall

sketchpad.save();               //return the base64 format for drawing the image

sketchpad.clean();              //empty drawn content and all recording

sketchpad.toolRegister();       //receive a custom tool constructor

```

# Custom tool

[Custom tool demo](https://c-coding.github.io/sketchpad/customTool.html)


```js
class CustomTool {
    constructor({//The constructor receives 4 parameters. It depends on the tool to decide which canvas to draw on.
        //Pre-canvas for drawing interactive layers Reference Line tool
        frontCanvasEl,//Pre-canvas layer dom node
        frontCanvasCtx,//Pre-canvas getContext('2d') rendering context
        
        //The confirmed drawing element will be drawn in the main canvas layer. The undo function is based on this layer.
        mainCnavasEl,//Main canvcas layer dom node
        mainCanvasCtx //Main canvas rendering context
    }) {

        this.frontCanvasCtx = frontCanvasCtx;
        this.mainCanvasCtx = mainCanvasCtx;


        //tool button node (Required)
        this.btnEl = document.createElement('button');

        //option content node (Required)
        this.optionEl = document.createElement('div');
    }


    //Unified touch and mouse event triggering
    //drawStartFn to touchstart mousedown event
    //drawMoveFn to touchmove mousemove  tip: only respond when drawStartFn triggered
    //drawEndFn to touchend mouseup  tip: only respond when drawStartFn triggered
    //since canvas is HD compatible according to different device DPR, please use canvasX and canvasY as click coordinates.
    drawStartFn(event) {
        const x=event.canvasX;//Encapsulate canvasX as the click coordinate x-axis in the event
        const y=event.canvasY;//Encapsulate canvasY as the click coordinate y axis in the event
    }

    drawMoveFn(event) {
        const x=event.canvasX;//Encapsulate canvasX as the click coordinate x-axis in the event
        const y=event.canvasY;//Encapsulate canvasY as the click coordinate y axis in the event
    }

    drawEndFn(event) {
        //Returns a function that provides the undo function logger to the sketchpad
        const render=(ctx)=>{//Provide a canvas rendering context parameter
            ctx.save();
            ctx.moveTo(0,0);
            ctx.lineTo(30,30);
            ctx.stroke();
            ctx.restore();
        }
        render.needRender=true;//Whether the sketchpad draws on the mainCanvas immediately after receiving the function （）

        return render;
        
        //Return false if there is no drawing operation
        return false;
    }
    
    //Trigger only when the mouse moves over the canvas. Compared to drawMoveFn, drawMoveFn only fires after drawStartFn trigger. When drawStartFn triggers, triggers mouseMoveFn and triggers drawMoveFn.
    //When the mouse function is detected, the mouse will not display the cursor when it is detected. Please draw the interaction in the frontCanvas layer for this tool.
    mousemoveFn(e){
        const x=event.canvasX;//Encapsulate canvasX as the click coordinate x-axis in the event
        const y=event.canvasY;//Encapsulate canvasY as the click coordinate y axis in the event
    }
}



const sketchpad = new Sketchpad({options});


sketchpad.toolRegister(CustomTool);//use registerTool function
```