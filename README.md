# sketchpad

> [https://c-coding.github.io/sketchpad/](https://c-coding.github.io/sketchpad/)

> [changelog](https://github.com/C-Coding/sketchpad/blob/master/CHANGELOG.md)

# 使用
npm
```js
npm i c-sketchpad --save

const Sketchpad=require('c-sketchpad');
```

直接引用
```html
<script src="/docs/sketchpad.js"></script>
```

初始化
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

## option配置
```js
el: '#demo',                    //dom节点 或 可被document.querySelector识别的字符串

toolBtnSize: 40,                //第一栏工具按钮尺寸 

height: 400,                    //绘图区域高度

toolList: ['Brush','Eraser'],   //需要的工具 默认有 Brush笔刷 Eraser橡皮 Line直线 Polygon多边形(包括圆形)

saveBtn: true                   //是否显示保存图片按钮

maxRecall: 20                   //撤回次数
```

# 接口

```js
const sketchpad = new Sketchpad({options});


sketchpad.recall();//撤回

sketchpad.save();//返回绘制图片的png base64格式

sketchpad.clean();//清空内容和所有的撤销记录

sketchpad.registerTool();//接收一个自定义工具的构造函数 

```

# 自定义工具

[自定义工具demo](https://c-coding.github.io/sketchpad/customTool.html)

使用sketchpad.registerTool()自定义工具

此函数接收一个构造函数，此处直接使用class函数示例
```js
class CustomTool {
    constructor({//构造函数接收4个参数 根据工具不同自行决定在哪一个canvas上绘制图形
        //前置canvas用于绘制交互层 参考line工具
        frontCanvasEl,//前置canvas层dom节点
        frontCanvasCtx,//前置canvas getContext('2d')渲染上下文
        
        //被确认的绘制元素将绘制在主canvas层 撤销功能基于此层
        mainCnavasEl,//主canvcas层com节点
        mainCanvasCtx //主canvas 渲染上下文
    }) {

        this.frontCanvasCtx = frontCanvasCtx;//赋值 供函数调用
        this.mainCanvasCtx = mainCanvasCtx;//


        //暴露工具按钮 将自动插入工具栏  必须
        this.btnEl = document.createElement('button');

        //暴露工具配置 选中此工具时自动显示出此工具配置 必须
        this.optionEl = document.createElement('div');
    }


    //统一了触摸和鼠标事件触发形式
    //drawStartFn 对应 touchstart mousedown事件
    //drawMoveFn 对应 touchmove mousemove且drawStartFn触发后才会响应
    //drawEndFn 对应 touchend mouseup且drawStartFn触发后才会响应
    drawStartFn(event) {
        const x=event.canvasX;//在event中封装了canvasX 作为点击坐标x轴
        const y=event.canvasY;//在event中封装了canvasY 作为点击坐标y轴
    }

    drawMoveFn(event) {
        const x=event.canvasX;//在event中封装了canvasX 作为点击坐标x轴
        const y=event.canvasY;//在event中封装了canvasY 作为点击坐标y轴
    }

    drawEndFn(event) {
        //返回一个函数提供给sketchpad的撤销功能记录器
        const render=(ctx)=>{//接收一个canvas渲染上下文
            ctx.save();
            ctx.moveTo(0,0);
            ctx.lineTo(30,30);
            ctx.stroke();
            ctx.restore();
        }
        render.needRender=true;//sketchpad接收到函数后是否立即在mainCanvas上绘制 如果工具的绘制在front层则使用true 默认false

        return render;
        
        //如无绘制操作则
        return false;
    }
    
    //仅在鼠标在canvas上移动时触发  相比drawMoveFn不同处为 drawMoveFn只在drawStartFn触发后触发 当drawStartFn触发后 先触发mousemoveFn 后触发 drawMoveFn
    //当检测到此函数时鼠标移入会不显示光标 请为此工具在frontCanvas层绘制交互
    mousemoveFn(e){
        const x=event.canvasX;//在event中封装了canvasX 作为点击坐标x轴
        const y=event.canvasY;//在event中封装了canvasY 作为点击坐标y轴
    }
}



const sketchpad = new Sketchpad({options});
sketchpad.registerTool(CustomTool);

```