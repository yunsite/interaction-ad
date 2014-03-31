/* Te v1.10.0 - template by shanwenhe  contents QQ 562127378*/
;(function(){

//	// the template (our formatting expression)
//	var myTemplate = new Template('The TV show #{title} was created by #{author}.');
//	// our data to be formatted by the template
//	var show = {
//	  title: 'The Simpsons',
//	  author: 'Matt Groening',
//	  network: 'FOX'
//	};
//	// let's format our data
//	myTemplate.evaluate(show);
//	// -> "The TV show The Simpsons was created by Matt Groening."

	 'use strict';

	var Template = function(template, pattern){
			/**
			*  new Template(template[, pattern = Template.Pattern])
			**/
			this.template = template.toString();
			this.pattern  = pattern || /(^|.|\r|\n)(#\{(.*?)\})/;
			this.userId   = '000';
		}

	Template.prototype = {

		/**
		*  Template#evaluate(object) -> String
		*
		*  Applies the template to `object`'s data, producing a formatted string
		*  with symbols replaced by `object`'s corresponding properties.
		**/
		evaluate: function(object) {

			var me = this;
			return this.gsub(this.pattern, function(match) {
				if (object == null) return (match[1] + '');

				var before = match[1] || '';
				if (before == '\\') return match[2];

				var ctx = object, expr = match[3],
				pattern = /^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;

				match = pattern.exec(expr);
				if (match == null) return before;

				while (match != null) {
					var comp = me.startsWith(match[1],'[') ? match[2].replace(/\\\\]/g, ']') : match[1];
					ctx = ctx[comp];
					if (null == ctx || '' == match[3]) break;
					expr = expr.substring('[' == match[3] ? match[1].length : match[0].length);
					match = pattern.exec(expr);
				}
				// 删除HTML转编码.防止XSS 
				//ctx = me.htmlEncode(ctx);

				return before + me.interpret(ctx);
			});
		},

		/**
		* 判断字符是否以及 pattern 开始
		*/
		startsWith: function(regexp,pattern) {
			return regexp.indexOf(pattern) === 0;
		},

		gsub: function(pattern, replacement) {
			var result = '', source = this.template, match;
			replacement = replacement;

			while (source.length > 0) {
				if (match = source.match(pattern)) {
					result += source.slice(0, match.index);
					result += this.interpret(replacement(match));
					source  = source.slice(match.index + match[0].length);
				} else {
					result += source, source = '';
				}
			}
			return result;
		},

		/*
		 *将HTML转编码.防止XSS 出现。
		*/
		htmlEncode: function(text){
			return text.replace(/&/g, '&amp').replace(/</g, '&lt;').replace(/>/g, '&gt;');  
		},

		interpret:function(value){
			return value == null ? '' : String(value);
		}
	}
	window.Template = Template;
})();



(function(){
	// 使用严格模式
	'use strict';
	
	//循环设置属性
	function loopSetAttr(domEle,domEleAttr){
		for(var attr in domEleAttr){
			!!attr && domEle.setAttribute(attr , domEleAttr[attr] );
		}
	}
	//添加documentReady
	function documentReady(parent,loadingImgWrapAttr,loadingImgAttr){
		// 正在加载图片
		var loadingImgBase64 = 'data:images/gif;base64,R0lGODlhOgAKAKIFAERERIWFhWVlZdbW1qampv///wAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFFAAFACwAAAAAOgAKAAADazi6XEUwSheqvU7ozR34YMiMgyOdBHWtGed6YUw2Dxqpq9W6GxyDs4XJBsHlAjuewPcDBBVDojGX5DF/z1JNWjjqCspeoQl8Rm1TFji8HJOd5i2660Wuw1dZnFike6svbmRZZyhpGHdKeSEJACH5BAUUAAUALAAAAAA6AAoAAANrCLpcNTBKR6q9LujNnfhgyIyAI50Dda0Z53phTDYPGqmr1bobHIOzhckGweUIO17A9xMEFUOiMZfkMX/PUk1aOOoKyl6hCXxGbVMWOLwck53mLbrrRa7DV1mcWKR7qy9uZFlnKGkYd0p5IQkAIfkEBRQABQAsAAAAADoACgAAA2soulwFMEo3qr2O6M1d+GDIjIIjnQB1rRnnemFMNg8aqavVuhscg7OFyQbB5QY7HsH3CwQVQ6Ixl+Qxf89STVo46grKXqEJfEZtUxY4vByTneYtuutFrsNXWZxYpHurL25kWWcoaRh3SnkhCQAh+QQFFAAFACwAAAAAOgAKAAADaxi6XCUwSgeqvW7ozR35YMiMgSOdAnWtGed6YUw2Dxqpq9W6GxyDs4XJBsHlADvewPcjBBVDojGX5DF/z1JNWjjqCspeoQl8Rm1TFji8HJOd5i2660Wuw1dZnFike6svbmRZZyhpGHdKeSEJACH5BAUUAAUALAAAAAA6AAoAAANrSLpcFTBKJ6q9DujN3fhgyIyEI50Bda0Z53phTDYPGqmr1bobHIOzhckGweUEOx7A9xsEFUOiMZfkMX/PUk1aOOoKyl6hCXxGbVMWOLwck53mLbrrRa7DV1mcWKR7qy9uZFlnKGkYd0p5IQkAOw==';
		
		// 创建元素
		var loading    = document.createElement('div'),
			loadingImg = document.createElement('img'),
			loadingBr  = document.createElement('br'),
			loadingTxt = document.createTextNode('正在加载数据'),
			parent = parent && (parent.nodeType == 1 || parent.nodeType == 9)? parent:document.body;
		
		// 初始化属性数据
		var loadingImgWrapAttr = loadingImgWrapAttr || {'style':'background:#000;text-align:center;color:#fff;-webkit-transition: opacity 600ms linear ;opacity:0.8;width:100%;height:100%;position:absolute;left:0;top:0;display:-webkit-box;-webkit-box-pack:center;-webkit-box-align:center;z-index:9999;font:200 12px/1.5em \'微软雅黑\''},
			loadingImgAttr     = loadingImgAttr     || {'style':'opacity:0.8;','class':'loadingImg','src':loadingImgBase64};

		// loop设置元素属性

		// 设置元素的属性
		loopSetAttr(loading,loadingImgWrapAttr);

		// 设置图片的属性
		loopSetAttr(loadingImg,loadingImgAttr);

		// 将图片添加到div内
		loading.appendChild(loadingImg);
		loading.appendChild(loadingBr);
		loading.appendChild(loadingTxt);

		// 将元素添加到页面最下方
		parent.appendChild(loading);
		
		// 阻止一切行为
		function stopEverything(e){
			var e = e||window.event;
			e.preventDefault();
			e.stopPropagation()
		}
		// 阻止一切行为
		loading.addEventListener('click',stopEverything,false);
		loading.addEventListener('touchstart',stopEverything,false);
		loading.addEventListener('touchmove',stopEverything,false);
		loading.addEventListener('touchend',stopEverything,false);

		// loaded 加载完成
		this.done = function (){
			// 删除元素
			loading.style.opacity=0;
			setTimeout(function(){
				loading.parentNode && loading.parentNode.removeChild(loading);
				
			},600);

		}
	}
	window.loading = documentReady;

})();


(function(){


	function loadImg(imageSrc,callback){
		var image = document.createElement('img');
			image.setAttribute('src',imageSrc);
			image.addEventListener('load',function(){
				callback.loaded && callback.loaded(image);
			},false);
			image.addEventListener('error',function(){
				callback.error && callback.error(image);
			},false);
	}
	window.loadImg = loadImg;
})();









;(function(){


	var playBox,body=document.querySelector('body'),closeBox,player,videoArg;

	function delPlayerBox(){

			playBox.parentNode.removeChild(playBox);
			closeBox.parentNode.removeChild(closeBox);	
			body.removeAttribute('style');	
			document.querySelector('#body').style.display='block';
			player = null;
			delete player;
	
	}
	function playVideo(arg){
		if( !arg.id ){ alert('请添加videoId'); return false}
		// arg
		var arg=arg,
			videoArg = {
					'clientId'  :'872d663d12787d14',
					'videoId'   :arg.id,
					'closeId'   :arg.closeId   ||'close'+arg.id,
					'playBoxId' :arg.playBoxId ||  'playBoxId'+arg.id,
					'boxWarp'   :arg.wrap      || 'body',
					'autoplay'  :arg.autoplay  || true,
					'callback'  :arg.callback  || null
					};

		// 如果 节点内存在 播放框和关闭按钮就删除 
		( document.querySelector( '#'+ videoArg.closeId )  || document.querySelector( '#'+ videoArg.playBoxId ) )&&  delPlayerBox();



		window.scrollTo(0,1);

		(function(){
			playBox   = playBox  || document.createElement('div');
			playBox.setAttribute('id' , videoArg.playBoxId );
			playBox.setAttribute('style','width:100%;height:100%;position:absolute;top:0;left:0;z-index:1000;')


			closeBox  =  document.createElement('div');
			closeBox.setAttribute('id', videoArg.closeId );
			closeBox.setAttribute('style','display:block;width:35px;height:25px;opacity:0.8;position:absolute;top:0;right:0;z-index:1001;background:url(http://r4.ykimg.com/0510000052999E0B6714C031D205BC08) no-repeat 50% 50%;border: 10px solid transparent;border-bottom-width:15px;border-left-width:15px;background-size:cover');
			document.querySelector('#'+videoArg.boxWarp ).style.display='none';
			body.appendChild(closeBox);
			body.appendChild(playBox);

			closeBox.addEventListener('click',function(){
				this.setAttribute('style','display:none;');
				delPlayerBox();
			},false);
		}());
		body.setAttribute('style','height:100%;overflow:hidden;');
		player = new YKU.Player(  videoArg.playBoxId  ,{
			client_id    : videoArg.clientId,
			vid          : videoArg.videoId,
			autoplay     : videoArg.autoplay,
			show_related : false,
			events:{
				onPlayEnd: function(){ 
					delPlayerBox();
					videoArg.callback && videoArg.callback();
				}
			}

		});

		// return delPlayerBox;
	}

	window.playVideo = playVideo;

})();

;(function(){
	function itemAddEvent(confArray,domNode,callback){
		//confArray
		//[ //图片上的链接
		//	{
		//		event:{
		//			eventType:'click',
		//			callback:function(){
		//				alert('dddd');
		//			}
		//		}
		//	}
		//]

		// domNode
		// 节点列表
		domNode.forEach(function(item,index){

			console.log(confArray[index]['event']);
			console.log(item);

			confArray[index]['event'] && item.addEventListener( confArray[index]['event']['eventType'] || 'click',function(){
				confArray[index]['event']['callback'] && confArray[index]['event']['callback']();
			},false);
		})
	}
	window.itemAddEvent = itemAddEvent;	
})();



define(function(){

	//设置变量删除全局变量
	var Template = window.Template;
	 window.Template = null;

	//设置变量删除全局变量
	var loading = window.loading;
	 window.loading = null;

	//设置变量删除全局变量
	var loadImg = window.loadImg;
	 window.loadImg = null;

	//设置变量删除全局变量
	var playVideo = window.playVideo;
	window.playVideo = null;

	//设置变量删除全局变量
	var itemAddEvent = window.itemAddEvent;
	window.itemAddEvent = null;


	// 将nodeList 转化为array
	function toArray(obj){
			return Array.prototype.splice.call(obj,0,obj.length);
		}
	
	// 360度旋转
	function slider360 (node,callback){

			if(node.nodeType !== 1 &&  node.nodeType !== 9) {return ;}
			var node = node, flag=false,
				moveLength=0,
				touchStart=[0,0] ,//X,Y
				touchMove=[0,0],
				touchEnd=[0,0];

			node.addEventListener('touchstart',function(e){
					flag = true;
					touchStart =[e.touches['0']['pageX'],e.touches['0']['pageY']];
					callback.touchstart && callback.touchstart(node,touchEnd);
			},false);
			node.addEventListener('touchmove',function(e){
					if(flag){
						touchMove=[e.touches['0']['pageX'],e.touches['0']['pageY']],
						callback.touchmove && callback.touchmove(node,[touchMove[0]-touchStart[0],touchMove[1]-touchStart[1]]);	
						touchStart = touchMove ;
						

					}
			
			},false);
			node.addEventListener('touchend',function(e){
					flag = false;
					if(e.targetTouches.length < 1) { return;}
					touchEnd = e.touches && [ e.touches['0']['pageX'],e.touches['0']['pageY'] ];
					callback.touchend && callback.touchend(node,[touchEnd[0]-touchStart[0],touchEnd[1]-touchStart[1]]);
					
					
			},false);

		};







	// 返回define 的类
	return {itemAddEvent:itemAddEvent,toArray:toArray,playVideo:playVideo,template:Template,loading:loading,loadImg:loadImg,slider360:slider360,
		namespace:function(){
			function register(namespace){
			// 局部变量
				var nsArray = namespace.split("."),sFun = "",sNS = "",i = 0;
				for (; i < nsArray.length; i++) {
					// 链接字符串  如：class.attr.val
					i != 0 &&  (sNS += ".") ;
					sNS += nsArray[i];
					sFun += "if (typeof(" + sNS + ") == 'undefined') " + sNS + " = new Object();"
				}
				if (sFun != "") {
					
					// new Function 的方式运行计算某个字符串，并执行其中的的 JavaScript 代码
					( new Function(sFun) )();
					return eval(namespace);
				}
			};
			// 返回注册后的对象
			return register;
		}()
	
	};
})


