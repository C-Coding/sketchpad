import './css/cssLean.css'
import './css/index.less'
import DrawBoardBox from './js/DrawBoardBox'
import DrawBoard from './js/DrawBoard'
import Brush from './js/Brush'
import Eraser from './js/Eraser'

import Slider from './js/common/Slider'

let DrawBoardInit = function (id) {
	//模块加载部分依赖顺序
	//总容器模块
	let drawBoardBox = new DrawBoardBox(id);
	drawBoardBox.init();

	//canvas画板模块
	let drawBoard = new DrawBoard(drawBoardBox);
	drawBoard.init(drawBoardBox);

	//笔刷模块
	let brush = new Brush(drawBoardBox, drawBoard);
	brush.init(drawBoardBox, drawBoard);

	//橡皮擦模块
	let eraser = new Eraser(drawBoardBox, drawBoard);
	eraser.init(drawBoardBox, drawBoard);

	//slider模块
	let slider=new Slider(drawBoardBox);
	slider.init();


	window.addEventListener('resize',(e)=>{
		drawBoardBox.resize();//box宽高重置
		drawBoard.resize();//画板背景重置 画板宽高重置并重绘
		brush.resize();//颜色板重绘 slider位置重绘
		eraser.resize();//slider位置重绘
	})
}
window.DrawBoardInit = DrawBoardInit;

export default DrawBoardInit;