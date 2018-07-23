# Sketchpad
canvas画板

# 2.0
重构代码

全新的工具引入方式 更好的组件化

同时兼容触摸事件 鼠标事件

支持自定义绘制工具

更好的性能

支持全局撤销功能

# 使用
```
<body>
    <div id="demo">
    </div>
    <script>
        window.onload = function () {
            const sketchpad = new Sketchpad({
                el: '#demo',
                toolBtnSize: 40,
                height: 400,
                toolList: ['Brush','Eraser'],
                saveBtn: true,
                maxRecall: 5
            });
        }
    </script>
    <script src="/Sketchpad.js"></script>//引入js
</body>
```
## option配置


```
el: '#demo',                //dom节点 或 可被document.querySelector识别的字符串

toolBtnSize: 40,            //第一栏工具按钮尺寸 

height: 400,                //绘图区域高度

toolList: ['Brush','Eraser'],//需要的工具 默认 Brush Eraser

saveBtn: true                   //是否显示保存图片按钮

maxRecall: 5                //撤回次数    次数过多将引发橡皮工具在ios上的性能问题
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

```

```