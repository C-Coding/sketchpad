(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(15);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Slider2 = __webpack_require__(5);

var _Slider3 = _interopRequireDefault(_Slider2);

var _index = __webpack_require__(21);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SizeSlider = function (_Slider) {
        _inherits(SizeSlider, _Slider);

        function SizeSlider(_ref) {
                var _ref$ratio = _ref.ratio,
                    ratio = _ref$ratio === undefined ? 0 : _ref$ratio,
                    _ref$sliderSize = _ref.sliderSize,
                    sliderSize = _ref$sliderSize === undefined ? 30 : _ref$sliderSize;

                _classCallCheck(this, SizeSlider);

                var _this = _possibleConstructorReturn(this, (SizeSlider.__proto__ || Object.getPrototypeOf(SizeSlider)).call(this, ratio)); //接收ratio决定滑块默认位置 size决定滑块默认大小


                _this.sliderEl.classList.add(_index2.default.slider);
                _this.sliderEl.style.width = sliderSize + 'px';
                _this.sliderEl.style.height = sliderSize + 'px';

                _this.sliderBoxEl.classList.add(_index2.default.sliderBox);

                _this.sizeSliderBoxEl = document.createElement('div');
                _this.sizeSliderBoxEl.className = _index2.default.sizeSliderBox;
                _this.sizeSliderBoxEl.style.height = sliderSize + 'px';
                _this.sizeSliderBoxEl.style.marginLeft = sliderSize / 2 + 'px';
                _this.sizeSliderBoxEl.style.marginRight = sliderSize / 2 + 'px';

                _this.sizeSliderBoxEl.appendChild(_this.sliderBoxEl);

                _this.El = _this.sizeSliderBoxEl;
                return _this;
        }

        return SizeSlider;
}(_Slider3.default);

module.exports = SizeSlider;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _colorList = __webpack_require__(23);

var _colorList2 = _interopRequireDefault(_colorList);

var _Slider3 = __webpack_require__(5);

var _Slider4 = _interopRequireDefault(_Slider3);

var _index = __webpack_require__(24);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MainColorSlider = function (_Slider) {
        _inherits(MainColorSlider, _Slider);

        function MainColorSlider(_ref) {
                var _ref$height = _ref.height,
                    height = _ref$height === undefined ? 40 : _ref$height;

                _classCallCheck(this, MainColorSlider);

                var _this = _possibleConstructorReturn(this, (MainColorSlider.__proto__ || Object.getPrototypeOf(MainColorSlider)).call(this));

                _this.sliderBoxEl.classList.add(_index2.default.sliderBox);

                //当前颜色标识
                var tipEl = document.createElement('div');
                tipEl.className = _index2.default.tip;

                _this.sliderEl.classList.add(_index2.default.slider);
                _this.sliderEl.appendChild(tipEl);

                //定义canvas背景
                var canvasEl = document.createElement('canvas');
                canvasEl.width = _colorList2.default.length;
                canvasEl.height = 10;
                canvasEl.className = _index2.default.canvas;
                var canvasCtx = canvasEl.getContext('2d');

                var colorSliderBoxEl = document.createElement('div');
                colorSliderBoxEl.className = _index2.default.colorSliderBox;
                colorSliderBoxEl.classList.add(_index2.default.mainColorSliderBox);
                colorSliderBoxEl.style.height = height + 'px';

                colorSliderBoxEl.appendChild(canvasEl);
                colorSliderBoxEl.appendChild(_this.sliderBoxEl);

                var ctx = canvasCtx;
                ctx.save();
                _colorList2.default.forEach(function (item, index) {
                        ctx.beginPath();
                        ctx.moveTo(index, 0); //移动笔触
                        ctx.lineTo(index, 10); //绘制线条路径
                        ctx.strokeStyle = 'rgb(' + item[0] + ',' + item[1] + ',' + item[2] + ')';
                        ctx.closePath();
                        ctx.stroke();
                });
                ctx.restore();

                //绑定事件
                colorSliderBoxEl.addEventListener('sliderChange', function (e) {
                        e.stopPropagation();
                        var color = _colorList2.default[Math.round(_colorList2.default.length * e.detail)];
                        var rgb = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
                        tipEl.style.backgroundColor = rgb;

                        var event = document.createEvent('CustomEvent');
                        //发出自定义事件 传递rgb字符串
                        event.initCustomEvent('mainColorSliderChange', true, false, color);
                        colorSliderBoxEl.dispatchEvent(event);
                });

                _this.El = colorSliderBoxEl; //暴露节点

                return _this;
        }

        return MainColorSlider;
}(_Slider4.default);

var SubColorSlider = function (_Slider2) {
        _inherits(SubColorSlider, _Slider2);

        function SubColorSlider(_ref2) {
                var _ref2$height = _ref2.height,
                    height = _ref2$height === undefined ? 30 : _ref2$height;

                _classCallCheck(this, SubColorSlider);

                var _this2 = _possibleConstructorReturn(this, (SubColorSlider.__proto__ || Object.getPrototypeOf(SubColorSlider)).call(this));

                _this2.showTimer = null;
                _this2.color = [0, 0, 0];

                _this2.sliderBoxEl.classList.add(_index2.default.sliderBox);

                //当前颜色标识
                var tipEl = document.createElement('div');
                tipEl.className = _index2.default.tip;

                _this2.sliderEl.classList.add(_index2.default.slider);
                _this2.sliderEl.appendChild(tipEl);
                _this2.sliderEl.style.left = '50%';

                //定义canvas背景
                var canvasEl = document.createElement('canvas');
                canvasEl.width = 100;
                canvasEl.height = 10;
                canvasEl.className = _index2.default.canvas;
                var canvasCtx = canvasEl.getContext('2d');

                var colorSliderBoxEl = document.createElement('div');
                colorSliderBoxEl.className = _index2.default.colorSliderBox;
                colorSliderBoxEl.classList.add(_index2.default.subColorSliderBox);

                colorSliderBoxEl.style.height = height + 'px';

                colorSliderBoxEl.appendChild(canvasEl);
                colorSliderBoxEl.appendChild(_this2.sliderBoxEl);

                //绑定事件
                colorSliderBoxEl.addEventListener('sliderChange', function (e) {
                        e.stopPropagation();
                        //计算color值
                        var color = _this2.color;
                        if (e.detail > 0.5) {
                                var prop = (e.detail - 0.5) * 2;
                                color = [_this2.color[0] * (1 - prop) + 255 * prop, _this2.color[1] * (1 - prop) + 255 * prop, _this2.color[2] * (1 - prop) + 255 * prop];
                        } else if (e.detail < 0.5) {
                                var _prop = 1 - (0.5 - e.detail) * 2;
                                color = [_this2.color[0] * _prop, _this2.color[1] * _prop, _this2.color[2] * _prop];
                        } else if (e.detail === 0.5) {
                                color = _this2.color;
                        }
                        color = color.map(function (item) {
                                return Math.round(item);
                        });
                        _this2.colorChange(color);
                        _this2.show();
                        var rgb = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
                        var event = document.createEvent('CustomEvent');
                        //发出自定义事件 传递rgb字符串
                        event.initCustomEvent('colorSliderChange', true, false, rgb);
                        colorSliderBoxEl.dispatchEvent(event);
                });

                _this2.El = colorSliderBoxEl; //暴露节点
                _this2.tipEl = tipEl; //暴露tip颜色标识
                _this2.canvasCtx = canvasCtx; //暴露canvasCtx 以便重绘
                _this2.subCanvasRender(_this2.color); //初始化颜色


                return _this2;
        }

        _createClass(SubColorSlider, [{
                key: 'colorChange',
                value: function colorChange(color) {
                        //
                        var rgb = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
                        this.tipEl.style.backgroundColor = rgb;
                }
        }, {
                key: 'subCanvasRender',
                value: function subCanvasRender(color) {
                        this.color = color;
                        this.colorChange(color);
                        this.sliderEl.style.left = '50%';

                        var ctx = this.canvasCtx;
                        ctx.save();

                        var lineargradient = ctx.createLinearGradient(0, 0, 100, 0);
                        lineargradient.addColorStop(0, 'rgb(0,0,0)');
                        lineargradient.addColorStop(0.5, 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')');
                        lineargradient.addColorStop(1, 'rgb(255,255,255)');

                        ctx.fillStyle = lineargradient;
                        ctx.fillRect(0, 0, 100, 10);
                        ctx.restore();
                }
        }, {
                key: 'show',
                value: function show() {
                        var _this3 = this;

                        clearInterval(this.showTimer);
                        this.El.classList.add(_index2.default.subColorSliderBoxActive);
                        this.showTimer = setTimeout(function () {
                                _this3.El.classList.remove(_index2.default.subColorSliderBoxActive);
                        }, 2000);
                }
        }]);

        return SubColorSlider;
}(_Slider4.default);

var ColorSlider = function ColorSlider(_ref3) {
        var height = _ref3.height;

        _classCallCheck(this, ColorSlider);

        var colorSliderContainer = document.createElement('div');
        colorSliderContainer.className = _index2.default.colorSliderContainer;
        var mainColorSlider = new MainColorSlider({ height: height });
        var subColorSlider = new SubColorSlider({ height: height });

        colorSliderContainer.appendChild(mainColorSlider.El);
        colorSliderContainer.appendChild(subColorSlider.El);

        colorSliderContainer.addEventListener('mainColorSliderChange', function (e) {
                e.stopPropagation();
                var color = e.detail;
                var rgb = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';

                var event = document.createEvent('CustomEvent');
                //发出自定义事件 传递rgb字符串
                event.initCustomEvent('colorSliderChange', true, false, rgb);
                colorSliderContainer.dispatchEvent(event);

                subColorSlider.subCanvasRender(color); //mainColor变化后重绘subColor
                subColorSlider.show();
        });

        this.El = colorSliderContainer;
};

module.exports = ColorSlider;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _index = __webpack_require__(19);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Slider = function () {
    function Slider() {
        var _this = this;

        var ratio = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        _classCallCheck(this, Slider);

        //接收一个0-1的值  将决定滑块默认位置
        //滑块
        this.sliderEl = document.createElement('div');
        this.sliderEl.className = _index2.default.slider;
        //滑块导轨
        this.sliderBoxEl = document.createElement('div');
        this.sliderBoxEl.className = _index2.default.sliderBox;

        this.sliderBoxEl.appendChild(this.sliderEl);

        this.prevPointX = null; //记录点击时的坐标x
        this.prevOffsetLeft = null; //基佬点击时滑块的初始位置

        if (ratio > 0 && ratio <= 1) {
            this.sliderEl.style.left = ratio * 100 + '%';
        }

        var sliderMoveFn = this.sliderMove.bind(this); //需要removeEvent 保留函数指针

        this.sliderEl.addEventListener('touchstart', this.sliderStart.bind(this));
        this.sliderEl.addEventListener('touchmove', sliderMoveFn);

        this.sliderEl.addEventListener('mousedown', function (e) {
            _this.sliderStart(e);
            document.body.addEventListener('mousemove', sliderMoveFn);
            document.body.addEventListener('mouseup', function mouseupFn() {
                document.body.removeEventListener('mousemove', sliderMoveFn);
                document.body.removeEventListener('mouseup', mouseupFn);
            });
        });
    }

    _createClass(Slider, [{
        key: 'sliderStart',
        value: function sliderStart(e) {
            e.preventDefault();
            var x = void 0;
            if (e.type === 'touchstart') {
                x = e.touches[0].pageX;
            } else {
                x = e.pageX;
            }
            this.prevPointX = x;
            this.prevOffsetLeft = this.sliderEl.offsetLeft;
        }
    }, {
        key: 'sliderMove',
        value: function sliderMove(e) {
            var x = void 0;
            if (e.type === 'touchmove') {
                x = e.touches[0].pageX;
            } else {
                x = e.pageX;
            }

            var X = x - this.prevPointX + this.prevOffsetLeft;

            if (X > 0 && X < this.sliderBoxEl.clientWidth) {
                var perc = X / this.sliderBoxEl.clientWidth;
                this.sliderEl.style.left = perc * 100 + '%';

                var sliderChangeEvent = document.createEvent('CustomEvent');
                //发出自定义事件 传递滑块当前位置的小数
                sliderChangeEvent.initCustomEvent('sliderChange', true, false, perc);
                this.sliderBoxEl.dispatchEvent(sliderChangeEvent);
            }
        }
    }]);

    return Slider;
}();

module.exports = Slider;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Sketchpad = __webpack_require__(7);

var _Sketchpad2 = _interopRequireDefault(_Sketchpad);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.Sketchpad = _Sketchpad2.default;

module.exports = _Sketchpad2.default;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(8);

var _Canvas = __webpack_require__(9);

var _index = __webpack_require__(10);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(16);

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sketchpad = function () {
    function Sketchpad(_ref) {
        var el = _ref.el,
            _ref$height = _ref.height,
            height = _ref$height === undefined ? 400 : _ref$height,
            _ref$toolBtnSize = _ref.toolBtnSize,
            toolBtnSize = _ref$toolBtnSize === undefined ? 50 : _ref$toolBtnSize,
            _ref$saveBtn = _ref.saveBtn,
            saveBtn = _ref$saveBtn === undefined ? true : _ref$saveBtn,
            _ref$toolList = _ref.toolList,
            toolList = _ref$toolList === undefined ? ['Brush'] : _ref$toolList,
            _ref$maxRecall = _ref.maxRecall,
            maxRecall = _ref$maxRecall === undefined ? 5 : _ref$maxRecall;

        _classCallCheck(this, Sketchpad);

        //定义tool按钮大小
        this.toolBtnSize = toolBtnSize;
        //设备像素px比
        this.dpr = window.devicePixelRatio;
        //最大撤回次数
        this.maxRecall = maxRecall;
        //是否显示保存按钮
        this.saveBtn = saveBtn;

        if (typeof el === 'string') {
            try {
                this.containerEl = document.querySelector(el);
            } catch (error) {
                throw new Error('传入el错误');
            }
        } else {
            if (el.childNodes) {
                this.containerEl = el;
            } else {
                throw new Error('传入的不是dom节点');
            }
        }
        this.containerEl.className = _index2.default.container;
        this.containerEl.innerHTML = _index4.default; //写入html


        //工具按钮div容器 用于放置各组件按钮
        this.btnContainerEl = this.containerEl.querySelector('.btnContainer');
        //工具选项div容器 用于放置各组件对应的选项组合 
        this.optionContainerEl = this.containerEl.querySelector('.optionContainer');

        //前置canvas 用于绘制交互层 对所有工具暴露 默认是display none状态
        this.frontCanvasEl = this.containerEl.querySelector('.frontCanvas');
        this.frontCanvasEl.height = height * this.dpr; //高清适配
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

        //resize延迟调用 防止频繁触发resize
        this.resizeTimer = null;

        //执行初始化函数 注册toolList中的工具
        this.init(toolList);
    }
    //初始化


    _createClass(Sketchpad, [{
        key: 'init',
        value: function init(toolList) {
            var _this = this;

            if (!toolList || !toolList.length) {
                throw new Error('传入tools错误');
            }

            toolList.forEach(function (toolName) {
                //逐个注册组件
                try {
                    _this.registerTool(__webpack_require__(17)("./" + toolName + '/index.js'));
                } catch (error) {
                    console.log(error);
                    throw new Error('\u6CE8\u518C\u7EC4\u4EF6' + toolName + '\u51FA\u9519');
                }
            });

            //执行事件绑定init
            this.eventListenerInit();
            //初始化canvas尺寸
            this.frontCanvasEl.width = this.canvasContainerEl.clientWidth * this.dpr;
            this.frontCanvasEl.style.width = this.canvasContainerEl.clientWidth + 'px';

            this.mainCanvasEl.width = this.canvasContainerEl.clientWidth * this.dpr;
            this.mainCanvasEl.style.width = this.canvasContainerEl.clientWidth + 'px';
            //监听窗口resize
            window.addEventListener('resize', this.resize.bind(this));
            //初始化完毕 显示完整container
            // this.containerEl.style.display = 'block';
        }
        //注册工具

    }, {
        key: 'toolRegister',
        value: function toolRegister(Tool) {
            var _this2 = this;

            //注册tool组件 传入一个组件的构造函数
            var tool = new Tool({
                frontCanvasEl: this.frontCanvasEl,
                frontCanvasCtx: this.frontCanvasCtx, //向组件构造函数暴露frontCanvasCtx
                mainCanvasEl: this.mainCanvasEl,
                mainCanvasCtx: this.mainCanvasCtx
            });

            tool.btnEl.style.width = this.toolBtnSize + 'px'; //根据配置参数设置按钮尺寸
            tool.btnEl.style.height = this.toolBtnSize + 'px';

            tool.btnEl.addEventListener('click', function () {
                _this2.toolChange(tool);
            }); //监听组件的工具按钮点击事件 触发toolChange


            this.btnContainerEl.appendChild(tool.btnEl); //将组件的工具按钮节点插入工具按钮容器
            this.optionContainerEl.appendChild(tool.optionEl); //将工具配置选项节点插入工具选项div容器

            if (this.currentTool === null) {
                //如果当前生效tool为空则使用第一个注册的tool 避免构建后无默认选中的tool
                this.toolChange(tool);
            }
        }
    }, {
        key: 'registerTool',
        value: function registerTool(Tool) {
            this.toolRegister(Tool);
        }
        //事件监听初始化 初始化的一部分

    }, {
        key: 'eventListenerInit',
        value: function eventListenerInit() {
            var _this3 = this;

            var canvasContainerElPosition = { //touchstart mousedown时缓存容器坐标 避免重复计算
                pageX: null,
                pageY: null
            };

            var startFn = function startFn(e) {
                //阻止默认事件  用于防止touch事件之后触发mouse事件
                e.preventDefault();
                //缓存容器坐标
                canvasContainerElPosition.pageX = (0, _utils.getElementLeft)(_this3.canvasContainerEl);
                canvasContainerElPosition.pageY = (0, _utils.getElementTop)(_this3.canvasContainerEl);

                var pageX = void 0;
                var pageY = void 0;
                if (e.type === 'touchstart') {
                    pageX = e.touches[0].pageX;
                    pageY = e.touches[0].pageY;
                } else {
                    pageX = e.pageX;
                    pageY = e.pageY;
                }
                //封装事件触发的容器中坐标
                e.canvasX = (pageX - canvasContainerElPosition.pageX) * _this3.dpr;
                e.canvasY = (pageY - canvasContainerElPosition.pageY) * _this3.dpr;

                _this3.currentTool.drawStartFn && _this3.currentTool.drawStartFn.call(_this3.currentTool, e);
            };
            var moveFn = function moveFn(e) {
                var pageX = void 0;
                var pageY = void 0;
                if (e.type === 'touchmove') {
                    pageX = e.touches[0].pageX;
                    pageY = e.touches[0].pageY;
                } else {
                    pageX = e.pageX;
                    pageY = e.pageY;
                }
                //封装事件触发的容器中坐标
                e.canvasX = (pageX - canvasContainerElPosition.pageX) * _this3.dpr;
                e.canvasY = (pageY - canvasContainerElPosition.pageY) * _this3.dpr;

                _this3.currentTool.drawMoveFn && _this3.currentTool.drawMoveFn.call(_this3.currentTool, e);
            };
            var endFn = function endFn(e) {
                //清空缓存
                canvasContainerElPosition.pageX = null;
                canvasContainerElPosition.pageY = null;

                if (_this3.currentTool.drawEndFn) {
                    //返回一个ctx渲染函数 
                    var renderFn = _this3.currentTool.drawEndFn.call(_this3.currentTool, e);

                    if (renderFn) {
                        //返回了渲染函数
                        _this3.render(renderFn);
                    }
                }
            };

            //监听canvas事件 并触发相应函数 由于frontCanvas z-index在mainCanvas之上  所以tool.frontCanvasShow=true时 mainCanvas事件将无法触发

            this.frontCanvasEl.addEventListener('touchstart', startFn);
            this.frontCanvasEl.addEventListener('touchmove', moveFn);
            this.frontCanvasEl.addEventListener('touchend', endFn);

            //统一鼠标事件触发等同于触摸事件
            this.frontCanvasEl.addEventListener('mousedown', function (e) {
                startFn(e);
                document.body.addEventListener('mousemove', moveFn);
                document.body.addEventListener('mouseup', function mouseupFn(e) {
                    endFn(e);
                    document.body.removeEventListener('mousemove', moveFn);
                    document.body.removeEventListener('mouseup', mouseupFn);
                });
            });

            //触发mousemove事件后调用工具的  mousemoveFn
            this.frontCanvasEl.addEventListener('mousemove', function (e) {
                e.canvasX = (e.pageX - (0, _utils.getElementLeft)(_this3.canvasContainerEl)) * _this3.dpr;
                e.canvasY = (e.pageY - (0, _utils.getElementTop)(_this3.canvasContainerEl)) * _this3.dpr;
                _this3.currentTool.mousemoveFn && _this3.currentTool.mousemoveFn.call(_this3.currentTool, e);
            });

            //为撤回按钮绑定事件
            this.containerEl.querySelector('.recall').addEventListener('click', function () {
                _this3.recall();
            });
            if (this.saveBtn) {
                var saveBtnEl = this.containerEl.querySelector('.save');
                saveBtnEl.style.display = 'inline-block';
                saveBtnEl.addEventListener('click', this.save.bind(this, 'btn'));
            }
        }
        //变更当前的tool 传入的是一个tool实例

    }, {
        key: 'toolChange',
        value: function toolChange(tool) {
            //切换工具时清空frontcanvas
            this.frontCanvasCtx.clearRect(0, 0, this.frontCanvasEl.width, this.frontCanvasEl.height);
            //判断当前tool 移除响应样式
            if (this.currentTool) {
                this.currentTool.optionEl.classList.remove('active');
                this.currentTool.btnEl.classList.remove('active');
            }
            //为将切换的工具提供active样式
            tool.btnEl.classList.add('active');
            tool.optionEl.classList.add('active');

            //切换工具
            this.currentTool = tool;
            //是否存在mousemove函数 有测隐藏鼠标光标
            if (this.currentTool.mousemoveFn) {
                this.canvasContainerEl.classList.add('noMouse');
            } else {
                this.canvasContainerEl.classList.remove('noMouse');
            }
        }
        //resize所有的canvas

    }, {
        key: 'resize',
        value: function resize() {
            var _this4 = this;

            clearInterval(this.resizeTimer);
            this.resizeTimer = setTimeout(function () {
                _this4.frontCanvasEl.width = _this4.canvasContainerEl.clientWidth * _this4.dpr;
                _this4.frontCanvasEl.style.width = _this4.canvasContainerEl.clientWidth + 'px';
                _this4.mainCanvasEl.style.width = _this4.canvasContainerEl.clientWidth + 'px';
                //canvas尺寸重置的封装函数 实现了修改canvas大小补清空内容
                (0, _Canvas.canvasResize)(_this4.mainCanvasEl, _this4.mainCanvasCtx, _this4.canvasContainerEl.clientWidth * _this4.dpr);
                (0, _Canvas.canvasResize)(_this4.recallCanvasEl, _this4.recallCanvasCtx, _this4.canvasContainerEl.clientWidth * _this4.dpr);
            }, 200);
        }
        //接收一个ctx渲染函数

    }, {
        key: 'render',
        value: function render(renderFn) {
            if (renderFn.needRender) {
                renderFn(this.mainCanvasCtx); //对mainCanvas进行绘制
            }

            if (this.renderList.length === this.maxRecall) {
                //达到撤回上限
                this.renderList[0](this.recallCanvasCtx); //将renderList中最早的绘制函数对recallCanvas进行绘制
                this.renderList.splice(0, 1); //删除最早的渲染函数
            }
            this.renderList.push(renderFn); //将最新的绘制函数写入数组
            this.frontCanvasCtx.clearRect(0, 0, this.frontCanvasEl.width, this.frontCanvasEl.height); //清空frontCanvas

            //处理recallbtn状态
            this.recallBtnStatus();
        }

        //处理撤销按钮显示状态

    }, {
        key: 'recallBtnStatus',
        value: function recallBtnStatus() {
            //判断recall按钮透明度指示
            if (this.renderList.length === 0) {
                this.containerEl.querySelector('.recall').classList.add('noRecall');
            } else {
                this.containerEl.querySelector('.recall').classList.remove('noRecall');
            }
        }
        //执行撤销

    }, {
        key: 'recall',
        value: function recall() {
            //删除最新的渲染函数
            this.renderList.splice(this.renderList.length - 1, 1);
            //新建临时canvas防止需要的recall过多导致的页面抖动
            var tmpCanvasEl = document.createElement('canvas');
            tmpCanvasEl.width = this.mainCanvasEl.width;
            tmpCanvasEl.height = this.mainCanvasEl.height;

            var tmpCanvasCtx = tmpCanvasEl.getContext('2d');
            tmpCanvasCtx.drawImage(this.recallCanvasEl, 0, 0); //复制recallCanvas渲染

            this.renderList.forEach(function (fn) {
                //执行剩余的绘制函数
                fn(tmpCanvasCtx);
            });

            //清空mainCanvas且重新绘制mainCanvas
            this.mainCanvasCtx.clearRect(0, 0, this.mainCanvasEl.width, this.mainCanvasEl.height);
            this.mainCanvasCtx.drawImage(tmpCanvasEl, 0, 0);

            //处理recallbtn状态
            this.recallBtnStatus();
        }

        //执行保存

    }, {
        key: 'save',
        value: function save(type) {
            if (type === 'btn') {
                //保存按钮触发 触发浏览器图片下载或tab页
                var saveCanvas = document.createElement("canvas");
                saveCanvas.width = this.mainCanvasEl.width;
                saveCanvas.height = this.mainCanvasEl.height;
                var ctx = saveCanvas.getContext("2d");
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, saveCanvas.width, saveCanvas.height);
                ctx.drawImage(this.mainCanvasEl, 0, 0);

                try {
                    //ie兼容
                    var blob = saveCanvas.msToBlob();
                    window.navigator.msSaveBlob(blob, "picture.png");
                } catch (error) {
                    var a = document.createElement('a');
                    a.href = saveCanvas.toDataURL('image/png');
                    a.target = '__blank';
                    a.download = "picture.png";
                    var event = document.createEvent("MouseEvents");
                    event.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                    a.dispatchEvent(event);
                }
            } else {
                //返回base64
                return this.mainCanvasEl.toDataURL('image/png');
            }
        }
        //清空画布同时清空所有撤销记录

    }, {
        key: 'clean',
        value: function clean() {
            this.frontCanvasCtx.clearRect(0, 0, this.frontCanvasEl.width, this.frontCanvasEl.height);
            this.mainCanvasCtx.clearRect(0, 0, this.mainCanvasEl.width, this.mainCanvasEl.height);
            this.renderList = [];
            this.recallBtnStatus();
        }
    }, {
        key: 'destroy',
        value: function destroy() {}
    }]);

    return Sketchpad;
}();

module.exports = Sketchpad;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function getElementLeft(element) {
    //计算距离文档左偏移
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
}
function getElementTop(element) {
    //计算距离文档上偏移
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}

module.exports = {
    getElementLeft: getElementLeft,
    getElementTop: getElementTop
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function canvasResize(canvasEl, canvasCtx, width, height) {
    var copyEl = document.createElement('canvas');
    copyEl.width = canvasEl.width;
    copyEl.height = canvasEl.height;
    copyEl.getContext('2d').drawImage(canvasEl, 0, 0);

    if (width !== undefined) {
        canvasEl.width = width;
    }
    if (height !== undefined) {
        canvasEl.height = height;
    }
    canvasCtx.drawImage(copyEl, 0, 0);
}
module.exports = {
    canvasResize: canvasResize
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/less-loader/dist/cjs.js!./index.less", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--2-1!../../node_modules/less-loader/dist/cjs.js!./index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(4);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".containerbUR-5 .btnContainer {\n  padding: 10px 5px;\n  display: flex;\n}\n.containerbUR-5 .btnContainer > * {\n  border-radius: 4px;\n  background-color: white;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: 90% 90%;\n  border: 1px solid #d6d6d6;\n  box-sizing: border-box;\n}\n.containerbUR-5 .btnContainer > * + * {\n  margin-left: 5px;\n}\n.containerbUR-5 .btnContainer .active {\n  border: 1px solid black;\n}\n.containerbUR-5 .optionContainer {\n  box-sizing: border-box;\n  padding: 10px 20px;\n}\n.containerbUR-5 .optionContainer > div {\n  display: none;\n}\n.containerbUR-5 .optionContainer .active {\n  display: block;\n}\n.containerbUR-5 .functionContainer {\n  text-align: right;\n  line-height: 1px;\n}\n.containerbUR-5 .functionContainer > div {\n  width: 30px;\n  height: 30px;\n  background-size: 20px 20px;\n  background-position: center ;\n  background-repeat: no-repeat;\n  cursor: pointer;\n}\n.containerbUR-5 .functionContainer .save {\n  display: none;\n  background-image: url(" + escape(__webpack_require__(12)) + ");\n}\n.containerbUR-5 .functionContainer .recall {\n  display: inline-block;\n  background-image: url(" + escape(__webpack_require__(13)) + ");\n  opacity: 1;\n}\n.containerbUR-5 .functionContainer .noRecall {\n  opacity: 0.2;\n}\n.containerbUR-5 .noMouse {\n  cursor: none;\n}\n.containerbUR-5 .canvasContainer {\n  overflow: hidden;\n  position: relative;\n  background-color: #d8d8d8;\n  background-image: url(" + escape(__webpack_require__(14)) + ");\n  box-shadow: 1px 1px 6px 0 #858585;\n}\n.containerbUR-5 .canvasContainer .frontCanvas {\n  height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 2;\n}\n.containerbUR-5 .canvasContainer .mainCanvas {\n  height: 100%;\n  z-index: 1;\n}\n", ""]);

// exports
exports.locals = {
	"container": "containerbUR-5"
};

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyMTY3NDQxMDE2IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjM3MjYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMzIgMzJsMCA4MjIuODUxYzAgNzUuNDMxIDYxLjcxNiAxMzcuMTQ3IDEzNy4xNDIgMTM3LjE0N2w4MjIuODU2IDAgMC05NTkuOTk4LTk1OS45OTggMHpNNzg2LjI4MiA5MjMuNDI5bC0yNzQuMjgzIDAgMC0xMzcuMTQ3LTEzNy4xNDIgMCAwIDEzNy4xNDctMTM3LjE0MiAwIDAtMjc0LjI4NCA1NDguNTY4IDAgMCAyNzQuMjg0ek04NTQuODUxIDQ0My40MjZjMCAzNC4yODktMzQuMjg0IDY4LjU3My02OC41NjkgNjguNTczbC01NDguNTY4IDBjLTM0LjI4OSAwLTY4LjU3My0zNC4yODQtNjguNTczLTY4LjU3M2wwLTM0Mi44NTIgNjg1LjcwOSAwIDAgMzQyLjg1MnoiIHAtaWQ9IjM3MjciIGZpbGw9IiMyYzJjMmMiPjwvcGF0aD48L3N2Zz4="

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyMTY3MzM5NDYzIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0NjIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNTA3LjQyNjEzMyAxNTYuNDY3MmMtNC4yNDk2LTAuMTE5NDY3LTguNDEzODY3IDAuMTE5NDY3LTEyLjY0NjQgMC4xMzY1MzNWNTYuNjYxMzMzYzAtMjcuMzkyLTMwLjY1MTczMy00My42MjI0LTUzLjMxNjI2Ni0yOC4yNDUzMzNMODIuNzU2MjY3IDI3Mi4wMjU2YTM0LjEzMzMzMyAzNC4xMzMzMzMgMCAwIDAgMCA1Ni40NzM2bDM1OC43NDEzMzMgMjQzLjU5MjUzM2MyMi42NjQ1MzMgMTUuMzk0MTMzIDUzLjMxNjI2Ny0wLjgzNjI2NyA1My4zMTYyNjctMjguMjQ1MzMzdi0xMDEuMDY4OGMxNzIuODM0MTMzLTIuMDk5MiAzMTYuNTY5NiAxMTguNTQ1MDY3IDMyMy41MTU3MzMgMjc0LjU1MTQ2NyA1LjMyNDggMTE5LjY3MTQ2Ny03MS40MjQgMjI1Ljc1Nzg2Ny0xODUuMjA3NDY3IDI3NC43NTYyNjYtMi4wNjUwNjcgMC44ODc0NjctNC4yMzI1MzMgMi42MjgyNjctNC4wNDQ4IDYuMTc4MTM0IDAuMTUzNiAyLjkwMTMzMyAzLjEwNjEzMyAzLjc1NDY2NyA1LjczNDQgMi45Njk2QzgxNi45MzAxMzMgOTQ3LjY3Nzg2NyA5NTEuMDA1ODY3IDc5MC4zMDYxMzMgOTU2LjA3NDY2NyA2MDAuOTE3MzMzYzYuMzY1ODY3LTIzOC42NjAyNjctMTk0LjQ5MTczMy00MzcuNjQwNTMzLTQ0OC42NDg1MzQtNDQ0LjQ1MDEzM3oiIGZpbGw9IiMyYzJjMmMiIHAtaWQ9IjE0NjMiPjwvcGF0aD48L3N2Zz4="

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMzMiIHdpZHRoPSIzMyI+DQogIDxsaW5lIHgxPSIxNi41IiB4Mj0iMTYuNSIgeTE9IjAiIHkyPSIzMyIgc3Ryb2tlPSJyZ2IoMjQwLDI0MCwyNDApIiBzdHJva2Utd2lkdGg9IjEiLz4NCiAgPGxpbmUgeDE9IjAiIHgyPSIzMyIgeTE9IjE2LjUiIHkyPSIxNi41IiBzdHJva2U9InJnYigyNDAsMjQwLDI0MCkiIHN0cm9rZS13aWR0aD0iMC41Ii8+DQogIDxsaW5lIHgxPSIzMyIgeDI9IjMzIiB5MT0iMCIgeTI9IjMzIiBzdHJva2U9InJnYigyNDAsMjQwLDI0MCkiIHN0cm9rZS13aWR0aD0iMC41Ii8+DQogIDxsaW5lIHgxPSIwIiB4Mj0iMzMiIHkxPSIzMyIgeTI9IjMzIiBzdHJva2U9InJnYigyNDAsMjQwLDI0MCkiIHN0cm9rZS13aWR0aD0iMC41Ii8+DQo8L3N2Zz4NCg=="

/***/ }),
/* 15 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "<div class=\"btnContainer\"></div>\r\n<div class=\"optionContainer\"></div>\r\n<div class=\"functionContainer\">\r\n    <div class=\"recall noRecall\"></div>\r\n    <div class=\"save\"></div>\r\n</div>\r\n<div class=\"canvasContainer\">\r\n    <canvas class=\"frontCanvas\"></canvas>\r\n    <canvas class=\"mainCanvas\"></canvas>\r\n</div>";

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./Brush/index.js": 18,
	"./Eraser/index.js": 30,
	"./Line/index.js": 35,
	"./Polygon/index.js": 40
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 17;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SizeSlider = __webpack_require__(2);

var _SizeSlider2 = _interopRequireDefault(_SizeSlider);

var _ColorSlider = __webpack_require__(3);

var _ColorSlider2 = _interopRequireDefault(_ColorSlider);

var _index = __webpack_require__(26);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(28);

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Brush = function () {
    function Brush(_ref) {
        var _this = this;

        var frontCanvasEl = _ref.frontCanvasEl,
            frontCanvasCtx = _ref.frontCanvasCtx,
            mainCanvasCtx = _ref.mainCanvasCtx;

        _classCallCheck(this, Brush);

        //接收Sketchpad传递的mainCanvasCtx
        this.frontCanvasEl = frontCanvasEl;
        this.frontCanvasCtx = frontCanvasCtx;
        this.mainCanvasCtx = mainCanvasCtx;

        this.dpr = window.devicePixelRatio;

        //定义笔刷属性
        this.lineWidth = 10; //画笔默认线宽  tip直径
        this.lineWidthRange = [2, 40];
        this.color = 'black'; //默认颜色

        this.linePathList = []; //画笔路径坐标数组


        //暴露btn
        this.btnEl = document.createElement('button');
        this.btnEl.style.backgroundImage = 'url(' + __webpack_require__(29) + ')';

        //暴露option
        this.optionEl = document.createElement('div');
        this.optionEl.className = _index2.default.option;
        this.optionEl.innerHTML = _index4.default;

        //定义size标识
        this.tipEl = this.optionEl.querySelector('.tip');

        var sizeSliderEl = new _SizeSlider2.default({
            ratio: (this.lineWidth - this.lineWidthRange[0]) / (this.lineWidthRange[1] - this.lineWidthRange[0]),
            sliderSize: 30
        }).El;
        sizeSliderEl.addEventListener('sliderChange', function (e) {
            var size = (_this.lineWidthRange[1] - _this.lineWidthRange[0]) * e.detail + _this.lineWidthRange[0];
            _this.sizeChange(size);
        });
        this.optionEl.querySelector('.sizeSliderBox').appendChild(sizeSliderEl);

        var colorSliderEl = new _ColorSlider2.default({}).El;
        colorSliderEl.addEventListener('colorSliderChange', function (e) {
            _this.colorChange(e.detail);
        });

        this.optionEl.querySelector('.colorOption').appendChild(colorSliderEl);

        this.sizeChange(this.lineWidth);
        this.colorChange(this.color);
    }

    _createClass(Brush, [{
        key: 'sizeChange',
        value: function sizeChange(v) {
            this.lineWidth = v;
            this.tipEl.style.width = v + 'px';
            this.tipEl.style.height = v + 'px';
        }
    }, {
        key: 'colorChange',
        value: function colorChange(color) {
            this.color = color;
            this.tipEl.style.backgroundColor = color;
        }
    }, {
        key: 'drawStartFn',
        value: function drawStartFn(e) {
            this.linePathList.push([e.canvasX, e.canvasY]);
            this.render();
        }
    }, {
        key: 'drawMoveFn',
        value: function drawMoveFn(e) {
            this.linePathList.push([e.canvasX, e.canvasY]);
            this.render();
        }
    }, {
        key: 'drawEndFn',
        value: function drawEndFn(e) {
            var linePathList = [].concat(_toConsumableArray(this.linePathList));
            this.linePathList = [];

            var color = this.color;
            var lineWidth = this.lineWidth * this.dpr;
            return function (ctx) {
                ctx.save();
                if (linePathList.length === 1) {
                    var point = linePathList[0];
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(point[0], point[1], lineWidth / 2, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.strokeStyle = color;
                    ctx.lineWidth = lineWidth;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.beginPath();
                    ctx.moveTo(linePathList[0][0], linePathList[0][1]);
                    for (var i = 1; i < linePathList.length; i++) {
                        ctx.lineTo(linePathList[i][0], linePathList[i][1]);
                    };
                    ctx.stroke();
                }
                ctx.restore();
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var ctx = this.mainCanvasCtx;
            ctx.save();
            if (this.linePathList.length === 1) {
                var point = this.linePathList[0];
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(point[0], point[1], this.lineWidth / 2 * this.dpr, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            } else {
                var startPoint = this.linePathList[this.linePathList.length - 2];
                var endPoint = this.linePathList[this.linePathList.length - 1];
                ctx.lineWidth = this.lineWidth * this.dpr;
                ctx.strokeStyle = this.color;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(startPoint[0], startPoint[1]);
                ctx.lineTo(endPoint[0], endPoint[1]);
                ctx.stroke();
            }
            ctx.restore();
        }
    }, {
        key: 'mousemoveFn',
        value: function mousemoveFn(e) {
            var ctx = this.frontCanvasCtx;
            ctx.clearRect(0, 0, this.frontCanvasEl.width, this.frontCanvasEl.height);
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;

            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 2;
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

            ctx.arc(e.canvasX, e.canvasY, this.lineWidth / 2 * this.dpr, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    }]);

    return Brush;
}();

module.exports = Brush;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--2-1!../../../node_modules/less-loader/dist/cjs.js!./index.less", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--2-1!../../../node_modules/less-loader/dist/cjs.js!./index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".sliderBox2mNo_ {\n  position: relative;\n}\n.sliderBox2mNo_ .slider376Ts {\n  cursor: pointer;\n  position: absolute;\n  top: 50%;\n  left: 0;\n  transform: translateY(-50%) translateX(-50%);\n}\n", ""]);

// exports
exports.locals = {
	"sliderBox": "sliderBox2mNo_",
	"slider": "slider376Ts"
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js??ref--2-1!../../../../node_modules/less-loader/dist/cjs.js!./index.less", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js??ref--2-1!../../../../node_modules/less-loader/dist/cjs.js!./index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".sizeSliderBox3vc2e {\n  position: relative;\n}\n.sizeSliderBox3vc2e .sliderBox13OYx {\n  position: absolute;\n  width: 100%;\n  top: 50%;\n  height: 2px;\n  background-color: #ebebeb;\n}\n.sizeSliderBox3vc2e .sliderBox13OYx .slidersYT2w {\n  border-radius: 50%;\n  background-color: white;\n  box-shadow: 1px 1px 4px 1px #a3a3a3;\n}\n", ""]);

// exports
exports.locals = {
	"sizeSliderBox": "sizeSliderBox3vc2e",
	"sliderBox": "sliderBox13OYx",
	"slider": "slidersYT2w"
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arr = [];

for (var i = 0; i < 255; i++) {
    arr.push([i, 0, 0]);
}
for (var _i = 0; _i < 255; _i++) {
    arr.push([255, _i, 0]);
}
for (var _i2 = 0; _i2 < 255; _i2++) {
    arr.push([255 - _i2, 255, 0]);
}
for (var _i3 = 0; _i3 < 255; _i3++) {
    arr.push([0, 255, _i3]);
}
for (var _i4 = 0; _i4 < 255; _i4++) {
    arr.push([0, 255 - _i4, 255]);
}
for (var _i5 = 0; _i5 < 255; _i5++) {
    arr.push([_i5, 0, 255]);
}
for (var _i6 = 0; _i6 < 256; _i6++) {
    arr.push([255, _i6, 255]);
}

module.exports = arr;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js??ref--2-1!../../../../node_modules/less-loader/dist/cjs.js!./index.less", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js??ref--2-1!../../../../node_modules/less-loader/dist/cjs.js!./index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".colorSliderContainer1XjyG {\n  position: relative;\n}\n.colorSliderContainer1XjyG .colorSliderBox-wJJm {\n  position: relative;\n}\n.colorSliderContainer1XjyG .colorSliderBox-wJJm .canvas3x7Tq {\n  width: 100%;\n  height: 100%;\n  border-radius: 10px;\n  box-sizing: border-box;\n  padding: 0 8px;\n}\n.colorSliderContainer1XjyG .colorSliderBox-wJJm .sliderBox3Uuh6 {\n  position: absolute;\n  top: 0;\n  left: 8px;\n  right: 8px;\n  height: 100%;\n}\n.colorSliderContainer1XjyG .colorSliderBox-wJJm .sliderBox3Uuh6 .slider2fJcr {\n  width: 16px;\n  height: 100%;\n  background-color: white;\n  box-sizing: border-box;\n  border-radius: 4px;\n  border: 1px solid #cecece;\n  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.3);\n}\n.colorSliderContainer1XjyG .colorSliderBox-wJJm .sliderBox3Uuh6 .slider2fJcr .tip2jGKE {\n  position: absolute;\n  width: 2px;\n  height: 50%;\n  top: 50%;\n  left: 50%;\n  transform: translateX(-50%) translateY(-50%);\n  background-color: black;\n}\n.colorSliderContainer1XjyG .subColorSliderBox3nhSp {\n  visibility: hidden;\n  position: absolute;\n  top: 104%;\n  left: 50%;\n  width: 60%;\n  transform: translateX(-50%);\n  opacity: 0;\n  transition: all .5s ease;\n}\n.colorSliderContainer1XjyG .subColorSliderBoxActive2QH-1 {\n  opacity: 1;\n  visibility: visible;\n}\n", ""]);

// exports
exports.locals = {
	"colorSliderContainer": "colorSliderContainer1XjyG",
	"colorSliderBox": "colorSliderBox-wJJm",
	"canvas": "canvas3x7Tq",
	"sliderBox": "sliderBox3Uuh6",
	"slider": "slider2fJcr",
	"tip": "tip2jGKE",
	"subColorSliderBox": "subColorSliderBox3nhSp",
	"subColorSliderBoxActive": "subColorSliderBoxActive2QH-1"
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--2-1!../../../node_modules/less-loader/dist/cjs.js!./index.less", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--2-1!../../../node_modules/less-loader/dist/cjs.js!./index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".option3QzV9 .sizeOption {\n  display: flex;\n  align-items: center;\n  height: 40px;\n}\n.option3QzV9 .sizeOption .tipBox {\n  flex: 0 0 40px;\n  position: relative;\n}\n.option3QzV9 .sizeOption .tipBox .tip {\n  position: absolute;\n  border-radius: 50%;\n  top: 50%;\n  left: 50%;\n  transform: translateX(-50%) translateY(-50%);\n}\n.option3QzV9 .sizeOption .sizeSliderBox {\n  flex: 1 1;\n}\n.option3QzV9 .colorOption {\n  margin-top: 10px;\n}\n", ""]);

// exports
exports.locals = {
	"option": "option3QzV9"
};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = "<div class=\"sizeOption\">\r\n    <div class=\"tipBox\">\r\n        <div class=\"tip\"></div>\r\n    </div>\r\n    <div class=\"sizeSliderBox\"></div>\r\n</div>\r\n<div class=\"colorOption\">\r\n    \r\n</div>";

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyNDQwNTIwMTgxIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE2NjciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMzU4LjY4MSA1ODYuMzg2cy05MC45NjggNDkuNC05NC40ODggMTI2LjgyN2MtMy41MTkgNzcuNDI4LTc3LjQyNyAxMzMuNzQtMTAyLjA2MyAxNDAuNzc4czM2MC4xNTcgMjIuOTcxIDMzMi4wMDItMTQyLjQ0NGwtMTM1LjQ1LTEyNS4xNnpNNTI3Ljc4IDYzOC45NDZjMTQuMDE2IDEzLjYwMSAxNy41NjUgMzIuNjc1IDcuOTI5IDQyLjYwNi05LjYzNSA5LjkzLTI4LjgxIDYuOTU0LTQyLjgyMy02LjY0N2wtOTIuNzY3LTg4LjUxOGMtMTQuMDE1LTEzLjYtMTcuNTY1LTMyLjY3NS03LjkyOS00Mi42MDUgOS42MzYtOS45MyAyOC44MS02Ljk1NSA0Mi44MjQgNi42NDZsOTIuNzY2IDg4LjUxOHpNODQ5LjUxNCAxNzMuODYzYy0yNS4xNDQtMTcuMDU1LTQ3Ljc0MS0xLjc2My01Ny40NzcgMy44MDUtMjkuMDk3IDE5LjQ4NS0yMzcuMjQzIDIyMS43Ny0zMjcuNjkgMzE1LjE5NC0xMS4xMDUgMTQuOC0xOC41OSAyNi4yOTQgMzQuNjYzIDc5LjU0NiA0NC45NSA0NC45NSA2NS44OTYgNDIuMDEyIDg4LjY2IDIyLjYwMyAzNy45MDYtMzcuOTA2IDE5OS4yOTktMjYyLjkyNiAyNTguOTItMzQ4LjcxMyA5Ljc5Mi0xNC4wOTIgMjkuODUxLTU0LjE3IDIuOTI0LTcyLjQzNXoiIGZpbGw9IiMzMzMzMzMiIHAtaWQ9IjE2NjgiPjwvcGF0aD48L3N2Zz4="

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SizeSlider = __webpack_require__(2);

var _SizeSlider2 = _interopRequireDefault(_SizeSlider);

var _index = __webpack_require__(31);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(33);

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Eraser = function () {
    function Eraser(_ref) {
        var _this = this;

        var frontCanvasEl = _ref.frontCanvasEl,
            frontCanvasCtx = _ref.frontCanvasCtx,
            mainCanvasCtx = _ref.mainCanvasCtx;

        _classCallCheck(this, Eraser);

        this.frontCanvasEl = frontCanvasEl;
        this.frontCanvasCtx = frontCanvasCtx;
        this.mainCanvasCtx = mainCanvasCtx;
        this.dpr = window.devicePixelRatio;
        //橡皮默认直径
        this.lineWidth = 10;
        this.lineWidthRange = [5, 40];

        this.linePathList = []; //记录擦除路径


        this.btnEl = document.createElement('button');
        this.btnEl.style.backgroundImage = 'url(\'' + __webpack_require__(34) + '\')';

        this.optionEl = document.createElement('div');
        this.optionEl.innerHTML = _index4.default;
        this.optionEl.className = _index2.default.option;

        this.tipEl = this.optionEl.querySelector('.tip');
        this.sizeChange(this.lineWidth);

        var sizeSliderEl = new _SizeSlider2.default({
            ratio: (this.lineWidth - this.lineWidthRange[0]) / (this.lineWidthRange[1] - this.lineWidthRange[0])
        }).El;
        sizeSliderEl.addEventListener('sliderChange', function (e) {
            _this.sizeChange((_this.lineWidthRange[1] - _this.lineWidthRange[0]) * e.detail + _this.lineWidthRange[0]);
        });

        this.optionEl.querySelector('.sizeSliderBox').appendChild(sizeSliderEl);
    }

    _createClass(Eraser, [{
        key: 'sizeChange',
        value: function sizeChange(v) {
            this.lineWidth = v;
            this.tipEl.style.width = v + 'px';
            this.tipEl.style.height = v + 'px';
        }
    }, {
        key: 'drawStartFn',
        value: function drawStartFn(e) {
            this.linePathList.push([e.canvasX, e.canvasY]);
            this.render();
        }
    }, {
        key: 'drawMoveFn',
        value: function drawMoveFn(e) {
            this.linePathList.push([e.canvasX, e.canvasY]);
            this.render();
        }
    }, {
        key: 'drawEndFn',
        value: function drawEndFn(e) {
            var linePathList = [].concat(_toConsumableArray(this.linePathList));
            this.linePathList = [];

            var color = this.color;
            var lineWidth = this.lineWidth * this.dpr;
            return function (ctx) {
                ctx.save();
                ctx.globalCompositeOperation = 'destination-out';
                if (linePathList.length === 1) {
                    var point = linePathList[0];
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(point[0], point[1], lineWidth / 2, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    ctx.strokeStyle = color;
                    ctx.lineWidth = lineWidth;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.beginPath();
                    ctx.moveTo(linePathList[0][0], linePathList[0][1]);
                    for (var i = 1; i < linePathList.length; i++) {
                        ctx.lineTo(linePathList[i][0], linePathList[i][1]);
                    };
                    ctx.stroke();
                }
                ctx.restore();
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var ctx = this.mainCanvasCtx;
            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';
            if (this.linePathList.length === 1) {
                var point = this.linePathList[0];
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(point[0], point[1], this.lineWidth / 2 * this.dpr, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
            } else {
                var startPoint = this.linePathList[this.linePathList.length - 2];
                var endPoint = this.linePathList[this.linePathList.length - 1];
                ctx.lineWidth = this.lineWidth * this.dpr;
                ctx.strokeStyle = this.color;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(startPoint[0], startPoint[1]);
                ctx.lineTo(endPoint[0], endPoint[1]);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();
        }

        //渲染橡皮擦交互标识

    }, {
        key: 'mousemoveFn',
        value: function mousemoveFn(e) {
            var ctx = this.frontCanvasCtx;
            ctx.clearRect(0, 0, this.frontCanvasEl.width, this.frontCanvasEl.height);
            ctx.save();
            ctx.beginPath();
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 2;
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

            ctx.strokeStyle = 'gray';
            ctx.lineWidth = 1;
            ctx.arc(e.canvasX, e.canvasY, this.lineWidth / 2 * this.dpr, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    }]);

    return Eraser;
}();

module.exports = Eraser;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(32);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--2-1!../../../node_modules/less-loader/dist/cjs.js!./index.less", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--2-1!../../../node_modules/less-loader/dist/cjs.js!./index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".option2zfEx .sizeOption {\n  display: flex;\n  align-items: center;\n  height: 40px;\n}\n.option2zfEx .sizeOption .tipBox {\n  flex: 0 0 40px;\n  position: relative;\n}\n.option2zfEx .sizeOption .tipBox .tip {\n  box-sizing: border-box;\n  position: absolute;\n  border-radius: 50%;\n  border: 1px solid black;\n  top: 50%;\n  left: 50%;\n  transform: translateX(-50%) translateY(-50%);\n}\n.option2zfEx .sizeOption .sizeSliderBox {\n  flex: 1 1;\n}\n", ""]);

// exports
exports.locals = {
	"option": "option2zfEx"
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = "<div class=\"sizeOption\">\r\n    <div class=\"tipBox\">\r\n        <div class=\"tip\"></div>\r\n    </div>\r\n    <div class=\"sizeSliderBox\"></div>\r\n</div>";

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyNDQwNTkxODk5IiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxNDYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTE3LjcgOTI0LjRINDQ0LjhjLTEzLjggMC0yNS0xMS4yLTI1LTI1czExLjItMjUgMjUtMjVoNDcyLjljMTMuOCAwIDI1IDExLjIgMjUgMjVzLTExLjIgMjUtMjUgMjV6IiBmaWxsPSIjOTk5OTk5IiBwLWlkPSIyMTQ3Ij48L3BhdGg+PHBhdGggZD0iTTQ0NC4xIDg5OC43TDEyMy44IDU3OC40bDQ0OS41LTQ0OS41IDMyMSAzMjEuMS00NDguOCA0NDguN2MtMC40IDAuNC0xIDAuNC0xLjQgMHoiIGZpbGw9IiNGRkZGRkYiIHAtaWQ9IjIxNDgiPjwvcGF0aD48cGF0aCBkPSJNNDQ0LjggOTI0Yy02LjkgMC0xMy41LTIuNy0xOC40LTcuNmwtMzM4LTMzOEw1NzMuMiA5My41IDkyOS43IDQ1MCA0NjMuMiA5MTYuNGMtNC45IDQuOS0xMS40IDcuNi0xOC40IDcuNnpNMTU5LjEgNTc4LjRsMjg1IDI4NWMwLjQgMC40IDEgMC40IDEuNCAwTDg1OSA0NTAgNTczLjIgMTY0LjIgMTU5LjEgNTc4LjR6IiBmaWxsPSIjNjY2NjY2IiBwLWlkPSIyMTQ5Ij48L3BhdGg+PHBhdGggZD0iTTI0MS44MzMgNDU2LjM3bDM1LjM1NS0zNS4zNTUgMzIwLjUyOCAzMjAuNTI4LTM1LjM1NSAzNS4zNTV6IiBmaWxsPSIjNjY2NjY2IiBwLWlkPSIyMTUwIj48L3BhdGg+PC9zdmc+"

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SizeSlider = __webpack_require__(2);

var _SizeSlider2 = _interopRequireDefault(_SizeSlider);

var _ColorSlider = __webpack_require__(3);

var _ColorSlider2 = _interopRequireDefault(_ColorSlider);

var _index = __webpack_require__(36);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(38);

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Brush = function () {
    function Brush(_ref) {
        var _this = this;

        var frontCanvasEl = _ref.frontCanvasEl,
            frontCanvasCtx = _ref.frontCanvasCtx;

        _classCallCheck(this, Brush);

        //接收Sketchpad传递的mainCanvasCtx
        this.frontCanvasEl = frontCanvasEl;
        this.frontCanvasCtx = frontCanvasCtx;

        this.dpr = window.devicePixelRatio;

        //定义笔刷属性
        this.lineWidth = 10; //画笔默认线宽  tip直径
        this.lineWidthRange = [2, 40];
        this.color = 'black'; //默认颜色

        this.startPoint = [];
        this.endPoint = null;

        //暴露btn
        this.btnEl = document.createElement('button');
        this.btnEl.style.backgroundImage = 'url(' + __webpack_require__(39) + ')';

        //暴露option
        this.optionEl = document.createElement('div');
        this.optionEl.className = _index2.default.option;
        this.optionEl.innerHTML = _index4.default;

        //定义size标识
        this.tipEl = this.optionEl.querySelector('.tip');

        var sizeSliderEl = new _SizeSlider2.default({
            ratio: (this.lineWidth - this.lineWidthRange[0]) / (this.lineWidthRange[1] - this.lineWidthRange[0]),
            sliderSize: 30
        }).El;
        sizeSliderEl.addEventListener('sliderChange', function (e) {
            var size = (_this.lineWidthRange[1] - _this.lineWidthRange[0]) * e.detail + _this.lineWidthRange[0];
            _this.sizeChange(size);
        });
        this.optionEl.querySelector('.sizeSliderBox').appendChild(sizeSliderEl);

        var colorSliderEl = new _ColorSlider2.default({}).El;
        colorSliderEl.addEventListener('colorSliderChange', function (e) {
            _this.colorChange(e.detail);
        });

        this.optionEl.querySelector('.colorOption').appendChild(colorSliderEl);

        this.sizeChange(this.lineWidth);
        this.colorChange(this.color);
    }

    _createClass(Brush, [{
        key: 'sizeChange',
        value: function sizeChange(v) {
            this.lineWidth = v;
            this.tipEl.style.width = v + 'px';
            this.tipEl.style.height = v + 'px';
        }
    }, {
        key: 'colorChange',
        value: function colorChange(color) {
            this.color = color;
            this.tipEl.style.backgroundColor = color;
        }
    }, {
        key: 'drawStartFn',
        value: function drawStartFn(e) {
            this.startPoint = [e.canvasX, e.canvasY];
        }
    }, {
        key: 'drawMoveFn',
        value: function drawMoveFn(e) {
            if (this.endPoint !== null) {
                this.frontCanvasCtx.clearRect(0, 0, this.frontCanvasEl.width, this.frontCanvasEl.height);
            }
            this.endPoint = [e.canvasX, e.canvasY];

            var ctx = this.frontCanvasCtx;
            ctx.save();
            ctx.lineWidth = this.lineWidth * this.dpr;
            ctx.strokeStyle = this.color;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(this.startPoint[0], this.startPoint[1]);
            ctx.lineTo(e.canvasX, e.canvasY);
            ctx.stroke();
            ctx.restore();
        }
    }, {
        key: 'drawEndFn',
        value: function drawEndFn(e) {
            if (this.endPoint === null) {
                return false;
            }
            var lineWidth = this.lineWidth * this.dpr;
            var color = this.color;
            var startPoint = [].concat(_toConsumableArray(this.startPoint));
            var endPoint = [].concat(_toConsumableArray(this.endPoint));

            this.startPoint = [];
            this.endPoint = null;

            var renderFn = function renderFn(ctx) {
                ctx.save();
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = color;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.beginPath();
                ctx.moveTo(startPoint[0], startPoint[1]);
                ctx.lineTo(endPoint[0], endPoint[1]);
                ctx.stroke();
                ctx.restore();
            };
            renderFn.needRender = true;
            return renderFn;
        }
    }, {
        key: 'mousemoveFn',
        value: function mousemoveFn(e) {
            var ctx = this.frontCanvasCtx;
            ctx.clearRect(0, 0, this.frontCanvasEl.width, this.frontCanvasEl.height);
            ctx.save();

            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 2;
            ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;
            ctx.arc(e.canvasX, e.canvasY, this.lineWidth / 2 * this.dpr, 0, 2 * Math.PI, true);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    }]);

    return Brush;
}();

module.exports = Brush;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(37);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--2-1!../../../node_modules/less-loader/dist/cjs.js!./index.less", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--2-1!../../../node_modules/less-loader/dist/cjs.js!./index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".option3jTNw .sizeOption {\n  display: flex;\n  align-items: center;\n  height: 40px;\n}\n.option3jTNw .sizeOption .tipBox {\n  flex: 0 0 40px;\n  position: relative;\n}\n.option3jTNw .sizeOption .tipBox .tip {\n  position: absolute;\n  border-radius: 50%;\n  top: 50%;\n  left: 50%;\n  transform: translateX(-50%) translateY(-50%);\n}\n.option3jTNw .sizeOption .sizeSliderBox {\n  flex: 1 1;\n}\n.option3jTNw .colorOption {\n  margin-top: 10px;\n}\n", ""]);

// exports
exports.locals = {
	"option": "option3jTNw"
};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = "<div class=\"sizeOption\">\r\n    <div class=\"tipBox\">\r\n        <div class=\"tip\"></div>\r\n    </div>\r\n    <div class=\"sizeSliderBox\"></div>\r\n</div>\r\n<div class=\"colorOption\">\r\n    \r\n</div>";

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyNDQwNjE3MDUxIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjUgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI0OTciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwLjE5NTMxMjUiIGhlaWdodD0iMjAwIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik05MzAuMjYzIDYxLjk4MWwzMS43NTYgMzEuNzU2LTg2OC4yNzIgODY4LjI3Mi0zMS43NTYtMzEuNzU2IDg2OC4yNzItODY4LjI3MnoiIHAtaWQ9IjI0OTgiPjwvcGF0aD48L3N2Zz4="

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _NumSlider = __webpack_require__(41);

var _NumSlider2 = _interopRequireDefault(_NumSlider);

var _SizeSlider = __webpack_require__(2);

var _SizeSlider2 = _interopRequireDefault(_SizeSlider);

var _ColorSlider = __webpack_require__(3);

var _ColorSlider2 = _interopRequireDefault(_ColorSlider);

var _index = __webpack_require__(47);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(49);

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Polygon = function () {
    function Polygon(_ref) {
        var frontCanvasEl = _ref.frontCanvasEl,
            frontCanvasCtx = _ref.frontCanvasCtx;

        _classCallCheck(this, Polygon);

        //接收Sketchpad传递的mainCanvasCtx
        this.frontCanvasEl = frontCanvasEl;
        this.frontCanvasCtx = frontCanvasCtx;

        this.dpr = window.devicePixelRatio;

        //定义笔刷属性
        this.lineWidth = 10; //画笔默认线宽  tip直径
        this.lineWidthRange = [2, 40];
        this.fill = false; //是否填充
        this.color = 'black'; //默认颜色

        this.side = 3; //默认三角形
        this.sideRange = [3, 10];

        this.centerPoint = []; //中心
        this.apexPoint = null;

        //暴露btn
        this.btnEl = document.createElement('button');
        this.btnEl.style.backgroundImage = 'url(' + __webpack_require__(50) + ')';

        //暴露option
        this.optionEl = document.createElement('div');
        this.optionEl.className = _index2.default.option;
        this.optionEl.innerHTML = _index4.default;

        //定义标识
        this.sizeTipEl = this.optionEl.querySelector('.sizeOption .tip');
        this.sideTipEl = this.optionEl.querySelector('.sideOption .tipCanvas');
        this.sideTipCtx = this.sideTipEl.getContext('2d');

        this.init();
    }

    _createClass(Polygon, [{
        key: 'init',
        value: function init() {
            var _this = this;

            //整数滑块
            var numSliderEl = new _NumSlider2.default({ range: this.sideRange }).El;
            numSliderEl.addEventListener('numSliderChange', function (e) {
                _this.sideChange(e.detail);
            });
            //尺寸滑块
            var sizeSliderEl = new _SizeSlider2.default({
                ratio: (this.lineWidth - this.lineWidthRange[0]) / (this.lineWidthRange[1] - this.lineWidthRange[0]),
                sliderSize: 30
            }).El;
            sizeSliderEl.addEventListener('sliderChange', function (e) {
                var size = (_this.lineWidthRange[1] - _this.lineWidthRange[0]) * e.detail + _this.lineWidthRange[0];
                _this.sizeChange(size);
            });
            //颜色滑块
            var colorSliderEl = new _ColorSlider2.default({}).El;
            colorSliderEl.addEventListener('colorSliderChange', function (e) {
                _this.colorChange(e.detail);
            });

            this.optionEl.querySelector('.sideOption .numSliderBox').appendChild(numSliderEl);
            this.optionEl.querySelector('.sizeOption .sizeSliderBox').appendChild(sizeSliderEl);
            this.optionEl.querySelector('.colorOption').appendChild(colorSliderEl);

            this.sideTipEl.addEventListener('click', function () {
                _this.fillChange();
            });

            this.sideChange(3); //初始化多边形
            this.sizeChange(this.lineWidth); //初始化尺寸
            this.colorChange(this.color); //初始化
        }
    }, {
        key: 'sideChange',
        value: function sideChange(side) {
            this.side = side;
            this.sideTipCtx.clearRect(0, 0, this.sideTipEl.width, this.sideTipEl.height);
            this.render(this.sideTipCtx, [40, 40], [40, 15], side, this.fill, 2, this.color);
        }
    }, {
        key: 'fillChange',
        value: function fillChange() {
            this.fill = !this.fill;
            this.sideTipCtx.clearRect(0, 0, this.sideTipEl.width, this.sideTipEl.height);
            this.sideChange(this.side);
            if (this.fill) {
                this.optionEl.querySelector('.sizeOption').style.display = 'none';
            } else {
                this.optionEl.querySelector('.sizeOption').style.display = 'flex';
            }
        }
    }, {
        key: 'sizeChange',
        value: function sizeChange(v) {
            this.lineWidth = v;
            this.sizeTipEl.style.width = v + 'px';
            this.sizeTipEl.style.height = v + 'px';
        }
    }, {
        key: 'colorChange',
        value: function colorChange(color) {
            this.color = color;
            this.sizeTipEl.style.backgroundColor = color;
            this.sideChange(this.side);
        }
    }, {
        key: 'drawStartFn',
        value: function drawStartFn(e) {
            this.centerPoint = [e.canvasX, e.canvasY];
        }
    }, {
        key: 'drawMoveFn',
        value: function drawMoveFn(e) {
            if (this.apexPoint !== null) {
                this.frontCanvasCtx.clearRect(0, 0, this.frontCanvasEl.width, this.frontCanvasEl.height);
            }
            this.apexPoint = [e.canvasX, e.canvasY];

            this.render(this.frontCanvasCtx, this.centerPoint, this.apexPoint, this.side, this.fill, this.lineWidth, this.color);
        }
    }, {
        key: 'drawEndFn',
        value: function drawEndFn(e) {
            var _this2 = this;

            if (this.apexPoint === null) {
                return false;
            }
            var centerPoint = [].concat(_toConsumableArray(this.centerPoint));
            var apexPoint = [].concat(_toConsumableArray(this.apexPoint));
            var side = this.side;
            var fill = this.fill;
            var lineWidth = this.lineWidth;
            var color = this.color;

            this.centerPoint = [];
            this.apexPoint = null;
            var render = function render(ctx) {
                _this2.render(ctx, centerPoint, apexPoint, side, fill, lineWidth, color);
            };

            render.needRender = true;
            return render;
        }
    }, {
        key: 'render',
        value: function render(ctx, centerPoint, apexPoint, side, fill, lineWidth, color) {
            var x0 = centerPoint[0];
            var y0 = centerPoint[1];
            var x1 = apexPoint[0];
            var y1 = apexPoint[1];

            var x = x1 - x0;
            var y = y1 - y0;
            var length = Math.sqrt(x * x + y * y);

            if (side === this.sideRange[1]) {
                //直接画圆
                ctx.save();
                ctx.beginPath();
                ctx.arc(centerPoint[0], centerPoint[1], length, 0, Math.PI * 2, true);
                ctx.closePath();
                if (fill) {
                    ctx.fillStyle = color;
                    ctx.fill();
                } else {
                    ctx.strokeStyle = color;
                    ctx.lineWidth = lineWidth;
                    ctx.stroke();
                }
                ctx.restore();
            } else {
                var radian = void 0;
                if (x === 0) {
                    radian = y >= 0 ? Math.PI / 2 : -Math.PI / 2;
                } else {
                    radian = Math.atan(y / x);

                    if (radian >= 0) {
                        if (y < 0) {
                            radian = Math.PI + radian;
                        }
                    } else {
                        if (y >= 0) {
                            radian = -(Math.PI - radian);
                        }
                    }
                }

                ctx.save();
                ctx.translate(x0, y0);
                ctx.rotate(radian);

                ctx.beginPath();
                ctx.moveTo(length, 0);

                for (var i = 0; i < side; i++) {
                    ctx.rotate(2 * Math.PI / side);
                    ctx.lineTo(length, 0);
                }
                ctx.closePath();

                if (fill) {
                    ctx.fillStyle = color;
                    ctx.fill();
                } else {
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = color;
                    ctx.stroke();
                }
                ctx.restore();
            }
        }
    }]);

    return Polygon;
}();

module.exports = Polygon;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SizeSlider2 = __webpack_require__(2);

var _SizeSlider3 = _interopRequireDefault(_SizeSlider2);

var _index = __webpack_require__(42);

var _index2 = _interopRequireDefault(_index);

var _index3 = __webpack_require__(46);

var _index4 = _interopRequireDefault(_index3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NumSlider = function (_SizeSlider) {
    _inherits(NumSlider, _SizeSlider);

    function NumSlider(_ref) {
        var range = _ref.range;

        _classCallCheck(this, NumSlider);

        //接收一个数组 表示数值范围
        if (!range) {
            throw new Error('numSlider需要range');
        }

        var _this = _possibleConstructorReturn(this, (NumSlider.__proto__ || Object.getPrototypeOf(NumSlider)).call(this, {}));

        _this.numSliderBoxEl = document.createElement('div');
        _this.numSliderBoxEl.className = _index2.default.numSliderBox;
        _this.numSliderBoxEl.innerHTML = _index4.default;

        _this.numSliderBoxEl.querySelector('.sizeSliderBox').appendChild(_this.sizeSliderBoxEl);

        _this.num = range[0]; //当前数值
        _this.range = range;

        _this.numSliderBoxEl.addEventListener('sliderChange', function (e) {
            e.stopPropagation();
            var v = (range[1] - range[0]) * e.detail + range[0];
            v = Number(v.toFixed(0));
            if (_this.num !== v) {
                _this.num = v;
                var numSliderChangeEvent = document.createEvent('CustomEvent');
                numSliderChangeEvent.initCustomEvent('numSliderChange', true, false, _this.num);
                _this.El.dispatchEvent(numSliderChangeEvent);
            }
        });

        _this.subtractBtnEl = _this.numSliderBoxEl.querySelector('.subtract');
        _this.subtractBtnEl.addEventListener('click', function () {
            if (_this.num > range[0]) {
                _this.numChange(_this.num - 1);
            }
        });

        _this.addBtnEl = _this.numSliderBoxEl.querySelector('.add');
        _this.addBtnEl.addEventListener('click', function () {
            if (_this.num < range[1]) {
                _this.numChange(_this.num + 1);
            }
        });

        _this.El = _this.numSliderBoxEl;
        return _this;
    }

    _createClass(NumSlider, [{
        key: 'numChange',
        value: function numChange(v) {
            this.num = v;
            this.sliderEl.style.left = (v - this.range[0]) * 100 / (this.range[1] - this.range[0]) + '%';

            var numSliderChangeEvent = document.createEvent('CustomEvent');
            numSliderChangeEvent.initCustomEvent('numSliderChange', true, false, this.num);
            this.El.dispatchEvent(numSliderChangeEvent);
        }
    }]);

    return NumSlider;
}(_SizeSlider3.default);

module.exports = NumSlider;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(43);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js??ref--2-1!../../../../node_modules/less-loader/dist/cjs.js!./index.less", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js??ref--2-1!../../../../node_modules/less-loader/dist/cjs.js!./index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(4);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".numSliderBox3Uhwk {\n  width: 100%;\n  display: flex;\n  align-items: center;\n}\n.numSliderBox3Uhwk .sizeSliderBox {\n  flex: 1 1;\n  margin: 0 10px;\n}\n.numSliderBox3Uhwk > button {\n  flex: 0 0 30px;\n  padding: 0;\n  margin: 0;\n  width: 30px;\n  height: 30px;\n  color: #747474;\n  border: none;\n  background-color: white;\n  border-radius: 50%;\n  background-position: center;\n  background-size: 80% 80%;\n  background-repeat: no-repeat;\n}\n.numSliderBox3Uhwk .subtract {\n  background-image: url(" + escape(__webpack_require__(44)) + ");\n}\n.numSliderBox3Uhwk .add {\n  background-image: url(" + escape(__webpack_require__(45)) + ");\n}\n", ""]);

// exports
exports.locals = {
	"numSliderBox": "numSliderBox3Uhwk"
};

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyNTk4MzU3NDMzIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijk0OCIgZGF0YS1zcG0tYW5jaG9yLWlkPSJhMzEzeC43NzgxMDY5LjAuaTAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTM3LjEyODk2IDg5My41MTE2OGMtMi43ODUyOCA1NS4xOTg3Mi03MC42NjExMiA0My4zMzA1Ni0xMDguNDAwNjQgNDMuMzMwNTZIMTgxLjEyYy0zNS43NDc4NCAwLTgzLjYyNDk2IDQuMzM2NjQtODMuNjI0OTYtNDYuOTc2di0xMjguNzAxNDQtNDc2LjA5ODU2LTEzOC4xMTcxMmMwLTQ5LjEzNjY0IDQwLjIwNzM2LTQ5Ljc1NjE2IDc2LjUzMzc2LTQ5Ljc1NjE2SDgxOS4zNzQwOGMzNC4zNjAzMiAwIDkyLjA2Nzg0LTEwLjk0MTQ0IDExMi45MzE4NCAyMy4zOTg0IDYuODE0NzIgMTEuMjE3OTIgNC44MjMwNCAyOC4wNzgwOCA0LjgyMzA0IDQwLjgzNzEyVjg5My41MTE2OGMwIDMzLjAxMzc2IDUxLjIgMzMuMDEzNzYgNTEuMiAwVjE1OS42MzY0OGMwLTE1Ljg5MjQ4IDAuMDI1Ni0zMC43MDQ2NC00LjAxNDA4LTQ2LjQwNzY4LTEwLjUzNjk2LTQwLjk3NTM2LTUyLjA2NTI4LTY3LjIzMDcyLTkyLjczMzQ0LTY3LjIzMDcySDE0OS41MTkzNmMtNjEuMDUwODggMC0xMDMuMjE5MiA0Mi4xNjgzMi0xMDMuMjE5MiAxMDMuMjE5MnY3NDIuMDc3NDRjMCA0My44NTI4IDI2Ljg4NTEyIDc3Ljk3MjQ4IDY3LjIzMDcyIDkyLjczMzQ0IDE0LjM0NjI0IDUuMjUzMTIgMzEuMjQ3MzYgNC4wMTQwOCA0Ni40MDc2OCA0LjAxNDA4SDg5My43OTg0YzUzLjMwOTQ0IDAgOTEuOTM5ODQtNDMuMjQ4NjQgOTQuNTMwNTYtOTQuNTMwNTYgMS42NjQtMzMuMDE4ODgtNDkuNTQxMTItMzIuODU1MDQtNTEuMiAweiIgcC1pZD0iOTQ5IiBmaWxsPSIjNzA3MDcwIj48L3BhdGg+PHBhdGggZD0iTTIzMC41OTQ1NiA1NDIuNjEyNDhoNTczLjQzNDg4YzMzLjAxMzc2IDAgMzMuMDEzNzYtNTEuMiAwLTUxLjJIMjMwLjU5NDU2Yy0zMy4wMTg4OCAwLTMzLjAxODg4IDUxLjIgMCA1MS4yeiIgcC1pZD0iOTUwIiBmaWxsPSIjNzA3MDcwIj48L3BhdGg+PC9zdmc+"

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyNTk4MzczMjEzIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0MTQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTYzLjk0MjQgNTIwLjE4MTc2Yy0xLjc5NzEyIDIzOC4zMjA2NC0xOTIuNDc2MTYgNDM2LjI4MDMyLTQzMS4wNDI1NiA0NDUuMjMwMDgtMjM3Ljc4ODE2IDguOTI0MTYtNDQzLjA2OTQ0LTE4MC42MTgyNC00NTkuMDE4MjQtNDE2LjU0MjcyQzU3Ljg1NiAzMTEuODM4NzIgMjM5Ljg5MjQ4IDk5LjYzNTIgNDc1LjU5MTY4IDc2LjU5MDA4YzIzNi4wNTI0OC0yMy4wNzU4NCA0NTQuODI0OTYgMTUxLjQyNCA0ODQuOTM1NjggMzg2LjYxMTIgMi40MTY2NCAxOC44ODI1NiAzLjI2MTQ0IDM3LjkyODk2IDMuNDE1MDQgNTYuOTgwNDggMC4yNDA2NCAzMi45OTg0IDUxLjQ1MDg4IDMzLjAxODg4IDUxLjIgMC0xLjc2MTI4LTIzNC4xNjMyLTE2OC4yMTc2LTQzOS44Mjg0OC0zOTguMzIwNjQtNDg2LjkxMkMzODYuOTQ5MTItMTMuNzYyNTYgMTQ5LjM0NTI4IDExMy43NjEyOCA1OS43NTU1MiAzMjkuOTY4NjQtMzEuMDM3NDQgNTQ5LjA5NDQgNDkuODI3ODQgODAyLjkxODQgMjQ0Ljk3MTUyIDkzNC43NTg0YzE5NS43ODM2OCAxMzIuMjcwMDggNDY1LjQwOCA5OC4xNzA4OCA2MjkuNDA2NzItNjguMTYyNTYgOTAuNTM2OTYtOTEuODM3NDQgMTM5Ljc5NjQ4LTIxOC4wODEyOCAxNDAuNzU5MDQtMzQ2LjQxNDA4IDAuMjQwNjQtMzMuMDY0OTYtNTAuOTU5MzYtMzMuMDQ0NDgtNTEuMTk0ODggMHoiIHAtaWQ9IjE0MTUiIGZpbGw9IiM3MDcwNzAiPjwvcGF0aD48cGF0aCBkPSJNMjM5LjQyMTQ0IDU0NS43NjEyOGg1NTguMTA1NmMzMy4wMTM3NiAwIDMzLjAxMzc2LTUxLjIzNTg0IDAtNTEuMjM1ODRIMjM5LjQyMTQ0Yy0zMy4wMTg4OCAwLTMzLjAxODg4IDUxLjIzNTg0IDAgNTEuMjM1ODR6IiBwLWlkPSIxNDE2IiBmaWxsPSIjNzA3MDcwIj48L3BhdGg+PHBhdGggZD0iTTU0NC4xMDI0IDc5OS4yMDEyOFYyNDEuMDkwNTZjMC0zMy4wMTg4OC01MS4yMzA3Mi0zMy4wMTg4OC01MS4yMzA3MiAwdjU1OC4xMTA3MmMtMC4wMDUxMiAzMy4wMTM3NiA1MS4yMzA3MiAzMy4wMTM3NiA1MS4yMzA3MiAweiIgcC1pZD0iMTQxNyIgZmlsbD0iIzcwNzA3MCI+PC9wYXRoPjwvc3ZnPg=="

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "<button class=\"subtract\"></button>\r\n<div class=\"sizeSliderBox\"></div>\r\n<button class=\"add\"></button>";

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(48);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js??ref--2-1!../../../node_modules/less-loader/dist/cjs.js!./index.less", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js??ref--2-1!../../../node_modules/less-loader/dist/cjs.js!./index.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".option2cWsJ .sideOption {\n  display: flex;\n  align-items: center;\n}\n.option2cWsJ .sideOption .tipCanvas {\n  flex: 0 0 40px;\n  width: 40px;\n  height: 40px;\n  box-shadow: 1px 1px 3px 0 #8a8989;\n  border-radius: 3px;\n}\n.option2cWsJ .sideOption .tipCanvas:active {\n  box-shadow: none;\n}\n.option2cWsJ .sideOption .numSliderBox {\n  flex: 1 1;\n  margin-left: 10px;\n}\n.option2cWsJ .sizeOption {\n  margin-top: 10px;\n  display: flex;\n  align-items: center;\n  height: 40px;\n}\n.option2cWsJ .sizeOption .tipBox {\n  flex: 0 0 40px;\n  position: relative;\n}\n.option2cWsJ .sizeOption .tipBox .tip {\n  position: absolute;\n  border-radius: 50%;\n  top: 50%;\n  left: 50%;\n  transform: translateX(-50%) translateY(-50%);\n}\n.option2cWsJ .sizeOption .sizeSliderBox {\n  flex: 1 1;\n}\n.option2cWsJ .colorOption {\n  margin-top: 10px;\n}\n", ""]);

// exports
exports.locals = {
	"option": "option2cWsJ"
};

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = "<div class=\"sideOption\">\r\n    <canvas width=\"80\" height=\"80\" class=\"tipCanvas\"></canvas>\r\n    <div class=\"numSliderBox\"></div>\r\n</div>\r\n\r\n<div class=\"sizeOption\">\r\n    <div class=\"tipBox\">\r\n        <div class=\"tip\"></div>\r\n    </div>\r\n    <div class=\"sizeSliderBox\"></div>\r\n</div>\r\n<div class=\"colorOption\">\r\n\r\n</div>";

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTMyNTA3ODk3MTIyIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE3NTQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTU5Ljg4NjI4NSA0MzAuMjM2ODExYzAtNDUuMjEyNzM4LTM2LjY1MTc1OC04MS44NjQ0OTYtODEuODY0NDk2LTgxLjg2NDQ5NWE4MS43MzE0NjYgODEuNzMxNDY2IDAgMCAwLTI1LjcyNTkxOCA0LjE0ODQ4M0w1OTMuNTU5MDM5IDE2Ni4yODUyMTFjMC4xODYyNDItMi4yNTIyOTcgMC4zMDQ5NDUtNC41MjMwMTMgMC4zMDQ5NDUtNi44MjM0MDYgMC00NS4yMTI3MzgtMzYuNjUxNzU4LTgxLjg2MzQ3My04MS44NjM0NzItODEuODYzNDczLTQ1LjIxMzc2MSAwLTgxLjg2NTUxOSAzNi42NTA3MzUtODEuODY1NTIgODEuODYzNDczIDAgMS43NDE2NjcgMC4wNzI2NTUgMy40NjQ5MTUgMC4xODAxMDIgNS4xNzg5NTNMMTc2LjAwODE1NCAzNTQuMDgyMzY0YTgxLjYwMjUyOSA4MS42MDI1MjkgMCAwIDAtMzAuMDMxOTktNS43MTEwNzJjLTQ1LjIxMzc2MSAwLTgxLjg2NDQ5NiAzNi42NTI3ODEtODEuODY0NDk2IDgxLjg2NDQ5NiAwIDM3LjkzNDk4NCAyNS44MDU3MzYgNjkuODMxNDM4IDYwLjgxODE1OCA3OS4xMTk5ODlsOTYuNjI3NzM0IDI5MS41NDgxMjJjLTE4LjUyNTkzNSAxNS4wMDc4MDktMzAuMzc4ODkxIDM3LjkzMDg5MS0zMC4zNzg4OTEgNjMuNjMyMjQ5IDAgNDUuMjEyNzM4IDM2LjY1MDczNSA4MS44NjQ0OTYgODEuODY0NDk2IDgxLjg2NDQ5NiAyOS4wMDc2NjEgMCA1NC40NzE2MTItMTUuMTAwOTMgNjkuMDEyNzkzLTM3Ljg1NjE4OWwzMzMuMjczNDMzLTIuNzI4MTM0YzE0LjIwNTUzNyAyNC4yNzA3NzYgNDAuNTMyMTM1IDQwLjU4NDMyNCA3MC42ODQ4NzUgNDAuNTg0MzIzIDQ1LjIxMjczOCAwIDgxLjg2NDQ5Ni0zNi42NTE3NTggODEuODY0NDk2LTgxLjg2NDQ5NiAwLTIyLjA1NjM0Mi04LjczODAxMi00Mi4wNTk5MzEtMjIuOTIxMDM1LTU2Ljc3OTE2N2w5My40NDYyNzUtMjk4LjIxNTk4NmMzNS4zNTIxNTktOS4wNTkzMyA2MS40ODIyODMtNDEuMTI5NzQ2IDYxLjQ4MjI4My03OS4zMDQxODR6IG0tNzgyLjI1MDA1IDc1LjUxMTgxMWMyOS40ODk2MzgtMTIuMzc5OTU4IDUwLjIwNDQyNS00MS41MjQ3NDIgNTAuMjA0NDI1LTc1LjUxMTgxMSAwLTE1LjQ1MDktNC4yODU2MDYtMjkuODk4OTYxLTExLjcyNTA0Mi00Mi4yMjk4bDIzNC4zNTQ1MTUtMTc0LjU3OTEwN2MxNS4wMDM3MTUgMTcuMDkyMjgzIDM2Ljk5ODY1OSAyNy44OTczNzQgNjEuNTMwMzc5IDI3Ljg5NzM3MyAyNC4wOTY4MTQgMCA0NS43NTgxNi0xMC40MTUyMSA2MC43MzgzMzktMjYuOTg1NjA3bDIzNy4wNzAzNyAxNzAuNjM5Mzc4Yy04LjYxOTMwOCAxMi45NjUyOS0xMy42NTE5MjggMjguNTIxNTktMTMuNjUxOTI4IDQ1LjI1Njc0IDAgMzMuODU2MDg2IDIwLjU1NDEyOCA2Mi45MDg3NzIgNDkuODYyNjQxIDc1LjM2OTU3MmwtODcuMTM3NTkyIDI3OC4wODE0MTJhODIuNTUwMTExIDgyLjU1MDExMSAwIDAgMC0xMi44NjYwMjktMS4wMTQwOTZjLTQxLjg5MzEzMiAwLTc2LjQxNDM2NyAzMS40NzU4NzUtODEuMjU5NzIyIDcyLjA2MzI2OWwtMzEwLjE4NTU5OCAyLjUzODgyM2MtMy42Nzc3NjItNDEuODA3MTc1LTM4Ljc2MjgzOS03NC42MDIwOTItODEuNTI1NzgyLTc0LjYwMjA5Mi0xLjIwNjQ3OCAwLTIuNDAyNzIzIDAuMDM4ODg2LTMuNTk2OTIxIDAuMDkxMDc0bC05MS44MTIwNTUtMjc3LjAxNTEyOHoiIHAtaWQ9IjE3NTUiPjwvcGF0aD48L3N2Zz4="

/***/ })
/******/ ]);
});