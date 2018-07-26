# Sketchpad

demo[https://c-coding.github.io/Sketchpad/](https://c-coding.github.io/Sketchpad/)

[changelog](https://github.com/C-Coding/Sketchpad/blob/master/CHANGELOG.md)

# 使用
```
    <div id="demo">
    </div>

    <script>
        window.onload = function () {
            const sketchpad = new Sketchpad({
                el: '#demo',
                toolBtnSize: 40,
                height: 400,
                toolList: ['Brush','Line','Polygon','Eraser'],
                saveBtn: true,
                maxRecall: 20
            });
        }
    </script>
    <script src="/Sketchpad.js"></script>//引入js
```
## option配置
```
el: '#demo',                    //dom节点 或 可被document.querySelector识别的字符串

toolBtnSize: 40,                //第一栏工具按钮尺寸 

height: 400,                    //绘图区域高度

toolList: ['Brush','Line','Polygon','Eraser'],   //需要的工具 默认有 Brush笔刷  Eraser橡皮 Line直线 Polygon多边形(包括圆形)

saveBtn: true                   //是否显示保存图片按钮

maxRecall: 20                    //撤回次数
```

# 接口

```
const sketchpad = new Sketchpad({options});


sketchpad.recall();//撤回

sketchpad.save();//返回绘制图片的png base64格式

sketchpad.clean();//清空内容和所有的撤销记录

sketchpad.registerTool();//接收一个自定义工具的构造函数 

```

# 自定义工具
[自定义工具demo](https://c-coding.github.io/Sketchpad/customTool.html)

```
使用sketchpad.registerTool()自定义工具

此函数接收一个构造函数//此处直接使用class函数示例


class CustomTool {
    constructor({//构造函数接收4个参数
        frontCanvasEl,//前置canvas层dom节点
        frontCanvasCtx,//前置canvas getContext('2d')渲染上下文
        //前置canvas用于绘制交互层 参考line工具

        mainCnavasEl,//主canvcas层com节点
        mainCanvasCtx //主canvas 宣榕上下文
        //被确认的绘制元素将绘制在主canvas层 撤销功能基于此层
    }) {
        this.frontCanvasShow=true;
        //是否开启前置canvas层   默认关闭 开启后 事件触发将作用于front层，默认作用于mainCanvas

        this.frontCanvasCtx = frontCanvasCtx;//赋值 供函数调用
        this.mainCanvasCtx = mainCanvasCtx;//


        //暴露工具按钮 将自动插入工具栏  必须
        this.btnEl = document.createElement('button');

        //暴露工具配置 选中此工具时自动显示出此工具配置 必须
        this.optionEl = document.createElement('div');
    }


    //统一了触摸和鼠标事件触发形式
    //drawStartFn 对应 touchstart mousedown事件
    //drawMoveFn 对应 touchmove mousemove drawStartFn触发后才会响应
    //drawEndFn 对应 touchend mouseup drawStartFn触发后才会响应
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
        render.needRender=true;//sketchpad接收到函数后是否立即在mainCanvas上绘制 默认false

        return render;
        //如无绘制操作则
        return false;
    }
}



const sketchpad = new Sketchpad({options});
sketchpad.registerTool(CustomTool);

```