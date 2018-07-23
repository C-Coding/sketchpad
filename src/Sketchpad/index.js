import { getElementLeft, getElementTop } from '@/utils';
import { canvasResize } from '@/utils/canvas.js';
import s from './index.less';
import html from './index.html';


class Sketchpad {
    constructor({ el, height = 400, toolBtnSize = 50, saveBtn = true, toolList = ['Brush'], maxRecall = 5 }) {
        //定义tool按钮大小
        this.toolBtnSize = toolBtnSize;
        //设备像素px比
        this.dpr = window.devicePixelRatio;
        //最大撤回次数
        this.maxRecall = maxRecall;

        this.saveBtn = saveBtn;



        if (typeof el === 'string') {
            try {
                this.containerEl = document.querySelector(el);
            } catch (error) {
                throw new Error('传入el错误')
            }
        } else {
            if (el.childNodes) {
                this.containerEl = el;
            } else {
                throw new Error('传入的不是dom节点');
            }
        }
        this.containerEl.className = s.container;
        this.containerEl.innerHTML = html;//写入html



        //工具按钮div容器 用于放置各组件按钮
        this.btnContainerEl = this.containerEl.querySelector('.btnContainer');
        //工具选项div容器 用于放置各组件对应的选项组合 
        this.optionContainerEl = this.containerEl.querySelector('.optionContainer');

        //前置canvas 用于绘制交互层 对所有工具暴露 默认是display none状态
        this.frontCanvasEl = this.containerEl.querySelector('.frontCanvas');
        this.frontCanvasEl.height = height * this.dpr;//高清适配
        this.frontCanvasCtx = this.frontCanvasEl.getContext('2d');
        //主体canvas 用于绘制图形 撤销功能在这一层 对所有工具暴露
        this.mainCanvasEl = this.containerEl.querySelector('.mainCanvas');
        this.mainCanvasEl.height = height * this.dpr;
        this.mainCanvasCtx = this.mainCanvasEl.getContext('2d');

        //canvas容器
        this.canvasContainerEl = this.containerEl.querySelector('.canvasContainer');
        this.canvasContainerEl.style.height = height + 'px';


        //回退canvas层 用于保存maxRecall次数限制之前的绘制层  是撤回功能的主要实现
        this.recallCanvasEl = document.createElement('canvas');
        this.recallCanvasEl.height = height * this.dpr;
        this.recallCanvasCtx = this.recallCanvasEl.getContext('2d');


        //绘制事件队列    工具绘制函数序列 最大长度受maxRecall限制
        this.renderList = [];

        //当前的工具组件实例    canvas触发事件时会调用实例中的指定函数
        this.currentTool = null;

        //执行初始化函数 注册toolList中的工具
        this.init(toolList);
    }

    init(toolList) {
        if (!toolList || !toolList.length) {
            throw new Error('传入tools错误');
        }

        toolList.forEach((toolName) => {//逐个注册组件
            try {
                this.registerTool(require(`@/Tools/${toolName}/index.js`));
            } catch (error) {
                console.log(error);
                throw new Error(`注册组件${toolName}出错`);
            }
        })

        //执行事件绑定init
        this.eventListenerInit();
        //主动触发resize初始化canvas尺寸
        this.resize();
        //监听窗口resize
        window.addEventListener('resize', this.resize.bind(this));
        //初始化完毕 显示完整container
        // this.containerEl.style.display = 'block';
    }

    registerTool(Tool) {//注册tool组件 传入一个组件的构造函数
        const tool = new Tool({
            frontCanvasCtx: this.frontCanvasCtx,//向组件构造函数暴露frontCanvasCtx
            mainCanvasCtx: this.mainCanvasCtx
        });

        tool.btnEl.style.width = this.toolBtnSize + 'px';//根据配置参数设置按钮尺寸
        tool.btnEl.style.height = this.toolBtnSize + 'px';

        tool.btnEl.addEventListener('click', () => {
            this.toolChange(tool);
        })//监听组件的工具按钮点击事件 触发toolChange


        this.btnContainerEl.append(tool.btnEl);//将组件的工具按钮节点插入工具按钮容器
        this.optionContainerEl.append(tool.optionEl);//将工具配置选项节点插入工具选项div容器

        if (this.currentTool === null) {//如果当前生效tool为空则使用第一个注册的tool 避免构建后无默认选中的tool
            this.toolChange(tool);
        }
    }

    eventListenerInit() {
        const canvasContainerElPosition = {//touchstart mousedown时缓存容器坐标 避免重复计算
            pageX: null,
            pageY: null
        }

        const startFn = (e) => {
            //阻止默认事件  用于防止touch事件之后触发mouse事件
            e.preventDefault();
            //缓存容器坐标
            canvasContainerElPosition.pageX = getElementLeft(this.canvasContainerEl);
            canvasContainerElPosition.pageY = getElementTop(this.canvasContainerEl);

            let pageX;
            let pageY;
            if (e.type === 'touchstart') {
                pageX = e.touches[0].pageX;
                pageY = e.touches[0].pageY;
            } else {
                pageX = e.pageX;
                pageY = e.pageY;
            }
            //封装事件触发的容器中坐标
            e.canvasX = (pageX - canvasContainerElPosition.pageX) * this.dpr;
            e.canvasY = (pageY - canvasContainerElPosition.pageY) * this.dpr;

            this.currentTool.drawStartFn && this.currentTool.drawStartFn.call(this.currentTool, e);
        }
        const moveFn = (e) => {
            let pageX;
            let pageY;
            if (e.type === 'touchmove') {
                pageX = e.touches[0].pageX;
                pageY = e.touches[0].pageY;
            } else {
                pageX = e.pageX;
                pageY = e.pageY;
            }
            //封装事件触发的容器中坐标
            e.canvasX = (pageX - canvasContainerElPosition.pageX) * this.dpr;
            e.canvasY = (pageY - canvasContainerElPosition.pageY) * this.dpr;

            this.currentTool.drawMoveFn && this.currentTool.drawMoveFn.call(this.currentTool, e)
        }
        const endFn = (e) => {
            //清空缓存
            canvasContainerElPosition.pageX = null;
            canvasContainerElPosition.pageY = null;

            if (this.currentTool.drawEndFn) {
                //返回一个ctx渲染函数 
                const renderFn = this.currentTool.drawEndFn.call(this.currentTool, e);
                //执行render函数

                this.render(renderFn);

            }
        }


        //监听canvas事件 并触发相应函数 由于frontCanvas z-index在mainCanvas之上  所以tool.frontCanvasShow=true时 mainCanvas事件将无法触发

        this.frontCanvasEl.addEventListener('touchstart', startFn);
        this.frontCanvasEl.addEventListener('touchmove', moveFn);
        this.frontCanvasEl.addEventListener('touchend', endFn);

        //统一鼠标事件触发等同于触摸事件
        this.frontCanvasEl.addEventListener('mousedown', (e) => {
            startFn(e)
            document.body.addEventListener('mousemove', moveFn);
            document.body.addEventListener('mouseup', function mouseupFn(e) {
                endFn(e);
                document.body.removeEventListener('mousemove', moveFn);
                document.body.removeEventListener('mouseup', mouseupFn);
            })
        });


        this.mainCanvasEl.addEventListener('touchstart', startFn);
        this.mainCanvasEl.addEventListener('touchmove', moveFn);
        this.mainCanvasEl.addEventListener('touchend', endFn);

        //统一鼠标事件触发等同于触摸事件
        this.mainCanvasEl.addEventListener('mousedown', (e) => {
            startFn(e)
            document.body.addEventListener('mousemove', moveFn);
            document.body.addEventListener('mouseup', function mouseupFn(e) {
                endFn(e);
                document.body.removeEventListener('mousemove', moveFn);
                document.body.removeEventListener('mouseup', mouseupFn);
            })
        });








        //为撤回按钮绑定事件
        this.containerEl.querySelector('.recall').addEventListener('click', () => {
            this.recall();
        })
        if (this.saveBtn) {
            const saveBtnEl = this.containerEl.querySelector('.save');
            saveBtnEl.style.display = 'inline-block';
            saveBtnEl.addEventListener('click', this.save.bind(this, 'btn'));
        }
    }

    toolChange(tool) {//变更当前的tool 传入的是一个tool实例
        if (this.currentTool) {
            this.currentTool.optionEl.classList.remove('active');
            this.currentTool.btnEl.classList.remove('active');
        }
        // tool.btnEl.classList.add(s.active);
        tool.btnEl.classList.add('active');
        tool.optionEl.classList.add('active');
        // this.currentTool.btnEl.classList.remove(s.active);

        this.frontCanvasEl.style.display = tool.frontCanvasShow ? 'block' : 'none';

        this.currentTool = tool
    }

    resize() {//resize所有的canvas
        this.frontCanvasEl.width = this.canvasContainerEl.clientWidth * this.dpr;
        //canvas尺寸重置的封装函数 实现了修改canvas大小补清空内容
        canvasResize(this.mainCanvasEl, this.mainCanvasCtx, this.canvasContainerEl.clientWidth * this.dpr);
        canvasResize(this.recallCanvasEl, this.recallCanvasCtx, this.canvasContainerEl.clientWidth * this.dpr);
    }

    render(renderFn) {//接收一个ctx渲染函数
        if (renderFn.needRender) {
            renderFn(this.mainCanvasCtx);//对mainCanvas进行绘制
        }

        if (this.renderList.length === this.maxRecall) {//达到撤回上限
            this.renderList[0](this.recallCanvasCtx);//将renderList中最早的绘制函数对recallCanvas进行绘制
            this.renderList.splice(0, 1);//删除最早的渲染函数
        }
        this.renderList.push(renderFn);//将最新的绘制函数写入数组
        this.frontCanvasCtx.clearRect(0, 0, this.frontCanvasEl.width, this.frontCanvasEl.height);//清空frontCanvas

    }

    recall() {
        //删除最新的渲染函数
        this.renderList.splice(this.renderList.length - 1, 1);
        //新建临时canvas防止需要的recall过多导致的页面抖动
        const tmpCanvasEl = document.createElement('canvas');
        tmpCanvasEl.width = this.mainCanvasEl.width;
        tmpCanvasEl.height = this.mainCanvasEl.height;

        const tmpCanvasCtx = tmpCanvasEl.getContext('2d');
        tmpCanvasCtx.drawImage(this.recallCanvasEl, 0, 0);//复制recallCanvas渲染

        this.renderList.forEach(function (fn) {//执行剩余的绘制函数
            fn(tmpCanvasCtx);
        })

        //清空mainCanvas且重新绘制mainCanvas
        this.mainCanvasCtx.clearRect(0, 0, this.mainCanvasEl.width, this.mainCanvasEl.height);
        this.mainCanvasCtx.drawImage(tmpCanvasEl, 0, 0);
    }



    save(type) {

        if (type === 'btn') {//保存按钮触发
            const saveCanvas = document.createElement("canvas");
            saveCanvas.width = this.mainCanvasEl.width;
            saveCanvas.height = this.mainCanvasEl.height;
            const ctx = saveCanvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, saveCanvas.width, saveCanvas.height);
            ctx.drawImage(this.mainCanvasEl, 0, 0);

            try {
                //ie兼容
                const blob = saveCanvas.msToBlob();
                window.navigator.msSaveBlob(blob, "picture.png");
            } catch (error) {
                const a = document.createElement('a');
                a.href = saveCanvas.toDataURL('image/png');
                a.target = '__blank';
                a.download = "picture.png";
                var event = document.createEvent("MouseEvents");
                event.initMouseEvent(
                    "click",
                    true,
                    true,
                    document.defaultView,
                    0,
                    0,
                    0,
                    0,
                    0,
                    false,
                    false,
                    false,
                    false,
                    0,
                    null
                );
                a.dispatchEvent(event);
            }
        }else{
            return this.mainCanvasCtx.toDataURL('image/png');
        }


    }

    clean() {
        this.frontCanvasCtx.clearRect(0, 0, this.frontCanvasEl.width, this.frontCanvasEl.height);
        this.mainCanvasCtx.clearRect(0, 0, this.mainCanvasEl.width, this.mainCanvasEl.height);
        this.renderList=[];
    }

    destroy() { }
}


module.exports = Sketchpad;