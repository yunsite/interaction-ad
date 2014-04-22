/* Te v1.10.0 - template by shanwenhe  contents QQ 562127378*/
Array.prototype.forEach =  Array.prototype.forEach || function(f){
	var leng = this.length;
	for(var i =0;i<leng;i++){
		f(this[i],i,this);
	}	
}

Array.prototype.map =  Array.prototype.map || function(f){
	var leng = this.length,r=[];
	for(var i =0;i<leng;i++){
		r.push(f(this[i],i,this));
	}
	return r;
}

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
			closeBox.setAttribute('style','display:block;width:35px;height:25px;opacity:0.8;position:absolute;top:5px;right:10px;z-index:1001;background:url(http://r4.ykimg.com/0510000052999E0B6714C031D205BC08) no-repeat 50% 50%;padding:0 0 15px 15px;background-size:30px 28px;');
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
	function itemAddEvent(arg){
		// arg ={node :'node',type:'click',callback:function(){} }
		// domNode
		// 节点列表

		(arg.node.nodeType ==1  || arg.node.nodeType ==9) && arg.node.addEventListener( arg.type || 'click',function(){
			arg.callback && arg.callback(arg.node);
			},false);
	}
	window.itemAddEvent = itemAddEvent;	
})();



(function(){
 // loading状态 W 画布大小
 function loading(arg) {
	this.modle(arg);
	this.controller();
 }
 loading.prototype={
	modle:function(arg){
	// 区块分割个数
	this.blockSize = arg.blockNum;
	this.autoSize = arg.improve;
	this.name = arg.name || "loading";
	//创建一张方形的loading图
	var blockSize = Math.abs(arg.height/2);
	this.section = document.getCSSCanvasContext("2d", this.name ,arg.height,arg.height);
	//画布的高度
	this.blockH=blockSize;
	// 组件的宽度
	this.sectionW=blockSize*6/64;
	// 组件的高度
	this.sectionH= blockSize*17/64;
	this.time=arg.time||60;
		  },
	view:function(alpha){
			 //创建一个组件
			 this.section.beginPath();
			 this.section.fillStyle = 'rgba(0,0,0,'+alpha+')';
					 this.section.arc(0,this.blockH-this.sectionH-this.sectionW/2-this.autoSize,this.sectionW/2,0,Math.PI,true);
					 this.section.arc(0,this.blockH-this.sectionW/2-this.autoSize,this.sectionW/2,Math.PI,0,true);
					 this.section.closePath();
					 this.section.fill();
					 },
	controller:function(){
	var THISV = this,radius=2;
	this.section.translate(this.blockH,this.blockH);
	(function animation(radius){
	 THISV.section.rotate(Math.PI*2/THISV.blockSize); //在当前位置的基础上开始移动
	 for(var i=1;THISV.blockSize>=i;i++){
	 THISV.section.rotate((Math.PI*2)/THISV.blockSize);
	 THISV.view(i/THISV.blockSize);
	 }
	 setTimeout(function(){
		 THISV.section.clearRect(-THISV.blockH,-THISV.blockH,THISV.blockH*2,THISV.blockH*2);
		 radius = radius>=THISV.blockSize?1:radius+1; 
		 THISV.section.save();//保存一下当前的位置
		 animation(radius);
		 },THISV.time)
	 })(radius);
		   }
 }
//V new  loading({name:'loading',height:80,blockNum:12,improve:17,time:100});
	new loading({name:'d3eye',height:80,blockNum:12,improve:17,time:100});

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
	function FN3dEye(m){
		var item             = m.itemEle,
			imagePath        = m.imagePath,
			imageLeng        = imagePath.length,
			loadingClassName = m.loadingClassName || 'loading',
			callback         = m.callback || null,
			background       = m.background || null,
			blockImg         = m.blockImg || null,
			loading,
			offset=0,
			range=1,
			flag = false;
			// 创建loading状态
			;(function loadingStatus(){
				loading = document.createElement('div');
				loading.setAttribute('style','background:rgba(200,200,200,0.2) -webkit-canvas(d3eye) no-repeat 50% 50% ;height:100%;width:100%;z-index:5;position:absolute;left:0;top:0;');
				loading.setAttribute('class',loadingClassName);

				item.appendChild(loading);
			})();
	
		     function setBg(pos) {
	            if (offset - pos > 25) {
	                offset = pos;
	                range = --range < 0 ? imageLeng-1 : range;
					if(background){
							item.style.backgroundImage = 'url('+imagePath[range]+')';
					}
					var showItem = item.querySelector('img:nth-last-child('+(range+1)+')');
					if(blockImg){
							item.querySelector('img.show').className = '';
							showItem.className = 'show';
					}
					callback && callback(showItem,range);
	            } else if (offset - pos < -25) {
	                offset = pos;
	                range = ++range > imageLeng-1 ? 0 : range;
	
					if(background){
							item.style.backgroundImage = 'url('+imagePath[range]+')';
					}
					var showItem = item.querySelector('img:nth-last-child('+(range+1)+')');
					if(blockImg){
							item.querySelector('img.show').className = '';
							showItem.className = 'show';
					}
					callback && callback(showItem,range);
	            }
	        }
	
			// 添加事件操作
	        function addEvent() {
				item.addEventListener('touchstart',function(){ flag = true;  },false);
				document.addEventListener('touchend',function(){ flag = false; },false);
				item.addEventListener('touchmove',function(e){ 
	                e.preventDefault();
	               var touchPos = e.touches[0] || e.originalEvent.changedTouches[0];
	                if (flag == true){
	                    setBg(touchPos.pageX - this.offsetLeft);
	                }else{
	                    offset = touchPos.pageX - this.offsetLeft
					}
				},false);
	        }
			;(function pushImage(images,i){
				var ThisFun = arguments.callee;
				var img = document.createElement('img');
					img.setAttribute('src',images[i]);
					img.addEventListener('load',function(){
						item.appendChild(this);
						if(imageLeng-1 == i){
							if(background){
								item.style.backgroundImage = 'url('+images[i]+')';
							}
							if(blockImg){this.className      = 'show';}
							item.style.overflow = 'hidden';
						
						}
						if(i-- > 0){
							ThisFun(images,i);
						}else{
							//图片加载完成后添加事件操作
							addEvent();
							setTimeout(function(){
								console.log(loading.style.opacity)
								var opacity,opacityTimer =	setInterval(function(){
										opacity = (loading.style.opacity||1 )-0.02;
										if(opacity < 0){
											loading.parentNode.removeChild(loading);
												clearInterval(opacityTimer);
												console.log(opacityTimer)	
											}
										loading.style.opacity = opacity;
									},40)
							},500);
						}
					},false);
			})(imagePath,imageLeng-1);
	}







	// 返回define 的类
	return {itemAddEvent:itemAddEvent,toArray:toArray,playVideo:playVideo,template:Template,loading:loading,loadImg:loadImg,slider3d:FN3dEye,
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
		}(),
	
	// 获得 top left width height
	getAttribute:function(Arguments){
			// Arguments { className ,top ,left ,width ,height ,z-index }
			var Attribute = {
					className:Arguments.className||'autoName',
					style: (Arguments.left     ?'left:'     +Arguments.left     +'px;':'') +
						   (Arguments.top      ?'top:'      +Arguments.top      +'px;':'') +
						   (Arguments.width    ?'width:'    +Arguments.width    +'px;':'') +
						   (Arguments.height   ?'height:'   +Arguments.height   +'px;':'') +
						   'position:'+  (Arguments.position ? Arguments.position+';' :'absolute;') +
						   (Arguments['z-index'] ?'z-index:' +Arguments['z-index'] :'')
				
				}
			return Attribute; 
		},
		getScript:function( src, callback ){
		  if(typeof(arguments[0]) != 'string'){ return; }
		  var callback = Object.prototype.toString.call({}).slice(8,-1) === 'Object' ? callback : {load:function(){},error:function(){}};
		  var head = document.querySelector('head');
		  var script = document.createElement('script');
		  script.type = 'text/javascript'; 
		  script.charset = 'utf-8'; 
		  script.src = src;
		  head.appendChild(script);

			script.addEventListener('load',function(){
					callback.load();
					this.parentNode.removeChild(this);
				},false);
			script.addEventListener('error',function(){
					callback.error();
				},false);

	  }
		
	};
})


