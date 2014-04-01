
// 定义zepto的路径及基本的URL
require.config({
	baseUrl:'./javascript/lib/',
	paths:{
		'template.loading'      :'./template',
		'jquery'                :'./jquery-1.7.min',
		'backbone'              :'./backbone-min',
		'underscore'            :'./underscore-min',
		'iscroll'               :'./iscroll',
		'jsapi'                 :'http://player.youku.com/jsapi',

		'threesixty'            :'./360/threesixty'
	}
});

define('createStyle',function(){
	var style = document.createElement("style");
		style.setAttribute("type", "text/css");
		style.setAttribute("id", "createStyle");

	return function(css){
		var cssText = document.createTextNode(css);
			style.appendChild(cssText);
			!document.querySelector('#createStyle') && document.querySelector('head').appendChild(style);
	};
});


require(['template.loading','iscroll','createStyle'],function(temp,iScroll,createStyle){
	

	// 事件模拟
	function simulationEvent(listener,callback){
		// {ele:添加事件元素 ,type:事件类型}
			var evt = document.createEvent('Event'); 
			evt.initEvent( listener.type || 'click' ,true,true); 
			listener.ele.dispatchEvent(evt); 
			callback && callback(listener.ele);
	}




	var startloading = new temp.loading(document.body);
	//console.log(temp);

	
	function InteractionAD(){
		this.temp={
		// 头图大图
		anchors:'<a class=\'#{className}\' href=\'#{href}\' style=\'#{style}\'></a>',
		// 全视频
		video:'<div class=\'#{className}\' style=\'#{style}\' id=\'video-#{videoId}\'><a href=\'javascript:void(0)\' data-videoid=\'#{videoId}\'><img class=\'playVideo\' src=\'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\' /><img class=\'video\' src=\'#{thumbnail}\' /></a><b>#{title}</b></div>',
		// 相册
		album:'<div class=\'#{className}\' #{style}><a href=\'javascript:void(0)\'><img src=\'#{thumbnail}\' /></a></div>',
		// 图片滚动
		scroll:'<div></div>',// 由于数据格式比较简单 特殊情况没有模板
		// 产品介绍
		productProfile:'<div class=\'productItem\'><img src=#{imgsrc} /><b>#{title}</b></div>',
		// 汽车拼点介绍
		pointProfile: '<a href=\'javascript:void(0)\' style=\'opacity:0;#{style}\' ></a>',
		// 视频图片混排
		videosAndImg:[
				'<div class=\'videoItem\' id=\'video-#{videoId}\'><a id=\'#{videoId}\' href=\'javascript:void(0)\'>'+
				'<img class=\'playVideo\' src=\'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\' />'+
				'<img src=\'#{thumbnail}\' /></a><b>#{title}</b></div>',
				'<div class=\'imageItem\' style=\'width:#{width}\'><img src=\'#{src}\' /><b>#{title}</b></div>'
			],
		// 页面自定义
		custom:''
		}
	}

	InteractionAD.prototype={
		constructor:InteractionAD,
		// 头图大图
		anchors:function(content){
			return this.createPage({
					temp:this.temp.anchors,
					style:content
				},function(temp,style){
					var pushArg={
							title:content.content.title||'优酷互动广告',
							href:content.content.href||'javascript:void(0)',
							style:style,
							className:content.content.className||'item-anchors'
						}
					return temp.evaluate(pushArg);
				});


		},
		anchorsEvent:function(parentNode,arg){
			var anchor = parentNode.querySelector('a');
			temp.itemAddEvent({node:anchor,type:'click',callback:arg.callback});
		},
		// 全视频
		video:function(content){
			return this.createPage({
					style:content,
					temp:this.temp.video
				},function(temp,style){
					var content2 = content.content;
					var pushArg={
						style:style,
						videoId:content2.videoId,
						thumbnail:content2.thumb,
						title:content2.title,
						className:content2.className||'item-video'
					}
					return temp.evaluate(pushArg);

				});
		},
		videoEvent:function(parentNode,arg){
			
			var playVideo = parentNode.querySelector('.playVideo');

			// 调用config 中的event.eventType 触发event.callback
			// temp.itemAddEvent(arg.content.videos,playvideo); // confAnchors,anchors

			require(['http://player.youku.com/jsapi'], function (doc) {
				temp.itemAddEvent({node:playVideo,type:'click',callback:function(thisNode){
					var videoId = thisNode.parentNode.getAttribute('data-videoid');
					temp.playVideo({id:videoId});
					arg.callback && arg.callback(thisNode);
				}});
			});

		
		},
		// 相册
		album:function(content){

			return this.createPage({
					style:content,
					temp: this.temp.album
				},function(temp,style){
					var content2 = content.content;
					var wraphtml='<dl><dt style=\''+style +'\' ></dt><dd>';
					for(i=0,vl=content2.length;i<vl;i++){
						var height = content2[i]['height'] ?'height:' +content2[i]['height']+'px;':'';	
						var width  = content2[i]['width']  ?'width:'  +content2[i]['width']+'px;':'';	
						var postop = content2[i]['top']    ?'top:'    +content2[i]['top']+'px;':'';	
						var left   = content2[i]['left']   ?'left:'   +content2[i]['left']+'px;':'';	
						var z_index= content2[i]['z-index']?'z-index:'+content2[i]['z-index']+'px;':'';	
						content2[i]['style'] =' style=\'position:absolute;'+ height+width+postop+left+z_index+ '\'';
						wraphtml += temp.evaluate(content2[i]);
					}
					return wraphtml+'</dd></dl>';
				});
		
		},
		album_Event:function(ele,arg){
			arg.content.innerStyle && createStyle(arg.content.innerStyle);
			
			var getImages = ele.querySelectorAll('dd > .item'),
				itemDt = ele.querySelector('dt');
				images = temp.toArray(getImages);

				images.forEach(function(image,index){
					image.addEventListener('click',function(){
						var showType = arg.content.images[index]['showType'];
							
							ele.querySelector('dd .active') && 
									(ele.querySelector('dd .active').className = ele.querySelector('.active').className.replace('active',''));
							
							image.className = 'active';

						var dtItmes = temp.toArray(ele.querySelectorAll('dt .item'));
							dtItmes.forEach(function(ITEM){ITEM.style.display = ITEM.getAttribute('id') == 'item'+index ? 'block':'none';})
						if( ele.querySelector('#item'+index) ){ return; }

						var imagesNodes = document.createDocumentFragment();
							dtInnerItem = document.createElement('div');
							dtInnerItem.setAttribute('class','item');
							dtInnerItem.setAttribute('id','item'+index);
							imagesNodes.appendChild(dtInnerItem);

								
						var	imageItem = arg.content.images[index]['image'],
							numberImages=0,
							imageslength = imageItem.length;

							// 循环添加图片
							;(function(imageItem,callback){
								var thisCallee = arguments.callee;
								temp.loadImg( imageItem[ numberImages ] ,{
									loaded:function(img){
											img.setAttribute('style','position:absolute;left:0;top:0;display:none;')
											dtInnerItem.appendChild(img);
											if( numberImages++  !== imageslength-1 ){ 
												thisCallee(imageItem,callback);
											}else{
												callback && callback();	
											}	
									},
									error:function(){  }
								})
							})(imageItem,function(){
									
									itemDt.appendChild(imagesNodes) &&
									(itemDt.querySelector('div[id=item'+index+'] img').className = 'active');
								});


							if( showType == '360'){
							// 360 展示图片
								var albumimages = temp.toArray(dtInnerItem.querySelectorAll('img'));
									temp.slider360(dtInnerItem,{
										touchstart:function(arg,Coordinate){
										},
										touchmove:function(arg,Coordinate){
											
											if( Math.abs( Coordinate[0]) % 1 === 0 ){

												var active = arg.querySelector('.active')
												active.className = active.className.replace('active','');

												if( Coordinate[0] > 0 ){
													if( active.nextSibling ){
														active.nextSibling.className = 'active';
													}else{
														arg.querySelector('img:first-child').className = 'active';
													}

												}else{

													if( active.previousSibling ){
														active.previousSibling.className = 'active';
													}else{
														arg.querySelector('img:last-child').className = 'active';
													}
												}										
											}

										
										},
										touchend:function(arg,Coordinate){
											
										}
									});
							}

							if( showType == 'scroll'){
							
							
							}
							
					},false);
				});
				simulationEvent({ele:ele.querySelector('dd > .item')})


		},

		// 图片滚动
		scroll:function(wrap){
			return this.createPage({
					className:'scrollInner',
					background:wrap.content.background,
					temp: this.temp.scroll
				},function(temp){
					var i=0,item=wrap.content.images,vl=item.length,wraphtml='<div id=\'scrollItems\' style=\'width:'+(vl*100)+'%\'>';
					for(;i<vl;){
						wraphtml += '<div class=\'scrollItem\' style=\'width:'+(100/vl).toFixed(5)+'%\' ><a href=\'javascript:void(0)\'><img src=\''+item[i++]+'\' /></a></div>';
						//wraphtml += temp.evaluate(item[i++]) + (i===1 ? '</dt><dd>':'');
					}
					return wraphtml+'</div>';
				});		
		
		
		},
		scrollEvent:function(ele){

			var myScroll = new iScroll(ele.querySelector('.scrollInner'), {
				snap: 'div',
				momentum: false,
				hScrollbar: false,
				vScrollbar: false,
				onScrollEnd: function () {}
			 });

			 setTimeout(function(){
				 myScroll.refresh();
				},0)


		},
		// 产品介绍
		productProfile:function(wrap){
			
			return this.createPage({
					className:'pPInner',
					background:wrap.content.background,
					temp: this.temp.productProfile
				},function(temp){
					var wraphtml='<div class=\'productItems\'>',i=0,item=wrap.content.product,vl;
					for(vl=item.length;i<vl;){
						wraphtml += temp.evaluate(item[i++]);
					}
					return wraphtml+'</div>';
				});			
		},
		productProfileEvent:function(ele,arg){
			var ITEM = ele.querySelectorAll('img'),il=ITEM.length,
				items = temp.toArray(ITEM,il);
				// foreach给子节点绑定事件
				items.forEach(function(image,index){
					
					image.addEventListener('click',function(){
							

						if(ele.querySelector('.boxActive' + index)){  return false;};
						var showProduct = ele.querySelector('.showProduct'),
							thiscallee = arguments.callee;
						if(showProduct){
							showProduct.style.height = '0px';
							setTimeout(function(){
								showProduct.parentNode.removeChild(showProduct) && thiscallee();
							},420);
							return;
						}
						
						var innerDiv =  document.createElement('div');
							innerDiv.setAttribute('class','showProduct boxActive' + index);
							innerDiv.setAttribute('style','-webkit-transition:height 400ms ease;') 
						ele.querySelector('.productItems').appendChild(innerDiv).innerHTML = '<div class=\'box\'>'+arg.content.product[index]['info']+'</div>';

							innerDiv.style.height = 'auto';
						var innerHeight = innerDiv.offsetHeight;
							innerDiv.style.height = '0px';
							setTimeout(function(){
								innerDiv.style.height = innerHeight+'px';
							},1)

					},false)


				});

		},
		// 汽车拼点介绍
		pointProfile:function(wrap){
		
			return this.createPage({
					className:'pointPInner',
					background:wrap.content.background,
					temp:this.temp.pointProfile
				},function(temp){
					var wraphtml='<div style=\'position:relative;height:1px;width:1px;\'>',i=0,item=wrap.content.point,vl;
					for(vl=item.length;i<vl;){
						wraphtml += temp.evaluate(item[i++]);
					}
					return wraphtml+'</div>';
				});	
		},
		pointProfileEvent:function(ele,arg){

		var createImageWarp = function (){
		
			var warp = document.createElement('div');
			    ele.querySelector('.pointPInner div').appendChild(warp);
				warp.setAttribute('style','height:0;position:absolute;z-index:2;overflow:hidden;border:20px solid #fff;opacity:0;');
				warp.setAttribute('class','showImageWarp');
			var opacityLay = document.createElement('div');
				opacityLay.className = 'opacityLay';
				opacityLay.setAttribute('style','background:rgba(0,0,0,0.3);display:none;position:absolute;z-index:1;height:'+window.innerHeight+'px;width:'+window.innerWidth+'px;margin-top:-'+(window.innerHeight/2)+'px;margin-left:-'+(window.innerWidth/2)+'px;');
				opacityLay.style['-webkit-transition'] = 'all 200ms ease-out';
			    ele.querySelector('.pointPInner div').appendChild(opacityLay);
			var close = document.createElement('span');
				close.setAttribute('style','display:block;position:absolute;');
				close.setAttribute('class','hideImageWarp');
				close.addEventListener('click',function(){
					opacityLay.style.background = 'rgba(0,0,0,0)';
					warp.style['opacity'] = 0;
					setTimeout(function(){
						opacityLay.style.display = 'none';
						warp.style.display = 'none';
					},200)
				},false);
				warp.appendChild(close);	
				return function(item,Attribute){
					
					item &&  (item.nodeType == 1 || item.nodeType == 9 )&& warp.appendChild(item);
					warp.style.display = 'block';
					opacityLay.style.display = 'block';
					opacityLay.style.background = 'rgba(0,0,0,0.4)';
					warp.style.height='auto';
					var width  =  Attribute && Attribute.width || warp.offsetWidth,
						height =  Attribute && Attribute.height ||warp.offsetHeight;
					warp.style.height = warp.style.width = 	warp.style['marginTop']   = warp.style['marginLeft']  = '0px';

					setTimeout(function(){
					warp.style['opacity'] =  '1';
					warp.style['width']   =  width;
					warp.style['height']  =  height;
					warp.style['marginTop']   =  parseInt(height)/-2 +'px';
					warp.style['marginLeft']  =  parseInt(width)/-2 +'px';
					warp.style['-webkit-transition'] = 'all 200ms ease-out';
					
					},100);
				}

		}();
		createStyle(arg.content.innerStyle);

			var ANCHOR  = ele.querySelectorAll('a'),il=ANCHOR.length,
				items = temp.toArray(ANCHOR,il),
				// 存储元素的宽高
				width=[],height=[];
				// foreach给子节点绑定事件
				items.forEach(function(anchor,index){
					anchor.style['-webkit-transform-origin'] = 'center center';
					height.push(anchor.style['height']) && (anchor.style['height'] = '0px');
					width.push(anchor.style['width']) && (anchor.style['width'] = '0px');
					anchor.addEventListener('click',function(anchorItem,i){
						// ..
						// showImageWarp('imagesItem'+index);
						var pointItem = arg.content.point[index];

						var imagesItem = temp.toArray(ele.querySelectorAll('div[id^=imagesItem]'));
							imagesItem.forEach(function(imagesItemEle,itemIndex){
								imagesItemEle.style.display = imagesItemEle.id.replace('imagesItem','') ==index ?'block':'none';
							
							})
						
						if( ele.querySelector('#imagesItem'+index) ){createImageWarp(null,{width:pointItem['__width'],height:pointItem['__height']});return ;}


						
						var image = document.createElement('div');
						image.setAttribute('id','imagesItem'+index);
						switch(pointItem['showType']){
							case 'changeColor': 



							var PIImage = pointItem['image'],
								PIImageLen = PIImage.length,
								changeColorImages = document.createDocumentFragment();
								changeColorUL = document.createElement('ul');
								changeColorUL.setAttribute('class','changeColorBar');
								changeColorImages.appendChild(changeColorUL);
							(function(insertItem){
									var ThisCallee = arguments.callee;
									temp.loadImg(PIImage[insertItem],{loaded:function(img){
										var liBar =  document.createElement('li')
										changeColorUL.appendChild(liBar);

										liBar.addEventListener('click',function(){
											var parentNode = this.parentNode.parentNode,
												oldNode = parentNode.querySelector('img[class=active]')	;
												 oldNode && (oldNode.className =oldNode.className.replace('active',''));
												img.className = 'active';
										},false);




										changeColorImages.appendChild(img);
										img.style.display= 'none';
										if(insertItem <  PIImageLen-1){
											ThisCallee( ++insertItem );
										}else{
											pointItem['__height'] = img.height;
											pointItem['__width']  = img.width;
											image.appendChild(changeColorImages) && createImageWarp(image,{height:img.height,width:img.width});
											simulationEvent({ele:ele.querySelector('.changeColorBar li:nth-of-type(1)')});
										}
									}})	
							
							
							})(0);



							break;
							case 'rotation': 
							var PIImage = pointItem['image'],
								PIImageLen = PIImage.length,
								changeColorImages = document.createDocumentFragment();
							(function(insertItem){
									var ThisCallee = arguments.callee;
									temp.loadImg(PIImage[insertItem],{loaded:function(img){
										insertItem === 0 && img.setAttribute('class','active');
										changeColorImages.appendChild(img);
										
										if(insertItem <  PIImageLen-1){
											ThisCallee( ++insertItem );
										}else{
											pointItem['__height'] = img.height;
											pointItem['__width']  = img.width;
											image.appendChild(changeColorImages) && createImageWarp(image,{height:img.height,width:img.width});

												var albumimages = temp.toArray(ele.querySelectorAll('div[id^=imagesItem'+index+'] img'));
													temp.slider360(ele.querySelector('div[id^=imagesItem'+index+']'),{
														touchstart:function(arg,Coordinate){
														},
														touchmove:function(arg,Coordinate){
															
															if( Math.abs( Coordinate[0]) % 1 === 0 ){
				
																var active = arg.querySelector('.active')
																active.className = active.className.replace('active','');
				
																if( Coordinate[0] > 0 ){
																	if( active.nextSibling ){
																		active.nextSibling.className = 'active';
																	}else{
																		arg.querySelector('img:first-child').className = 'active';
																	}
				
																}else{
				
																	if( active.previousSibling ){
																		active.previousSibling.className = 'active';
																	}else{
																		arg.querySelector('img:last-child').className = 'active';
																	}
																}										
															}
				
														
														},
														touchend:function(arg,Coordinate){
															
														}
													});
										}

									
									}})	
							
							
							})(0);
								
							break;
							case 'img': 
								temp.loadImg(pointItem['image'],{loaded:function(img){
									pointItem['__height'] = img.height;
									pointItem['__width']  = img.width;
									image.appendChild(img) && createImageWarp(image,{height:img.height,width:img.width});	
								}})	
							break;
							case 'href': 
								pointItem.callback && pointItem.callback();
								window.location.href = pointItem['href'];
							break;
							default:
								alert('no showType');						
						}

						return false;

					},false);

				});

				// 添加动画效果
				var i = 0, setOpacity =	setInterval(function(){
					
					items[i].style['opacity'] =  '1';
					items[i].style['width']   =  width[i];
					items[i].style['height']  =  height[i];
					items[i].style['marginTop']   =  parseInt(height[i])/-2 +'px';
					items[i].style['marginLeft']  =  parseInt(width[i])/-2 +'px';
					items[i].style['-webkit-transition'] = 'all 200ms ease-out';

					i++ && i == il && clearInterval(setOpacity);
				
				},200);






		},



		// 视频图片混排
		videosAndImg:function(wrap){
			
			var videosHtml =  this.createPage({
					className:'videosToPInner',
					background:false || null,
					temp: this.temp.videosAndImg[0]
				},function(temp){
					var wraphtml='',i=0,item=wrap.content.videos,vl;
					for(vl=item.length;i<vl;){
						wraphtml += temp.evaluate(item[i++]);
					}
					return wraphtml;
				});	

			var imagesHtml =  this.createPage({
					className:'imagesToPInner',
					background:false || null,
					temp: this.temp.videosAndImg[1]
				},function(temp){
					var i=0,item=wrap.content.images,vl=item.length,
						wraphtml='<a class=\'prev\' href=\'javascript:void(0)\'></a><a class=\'next\' href=\'javascript:void(0)\'></a>'+
						'<div id=\'scrollImg\'><div class=\'scrollContent\' style=\'width:'+(vl*100)+'%\'>';
					for(;i<vl;){
						item[i]['width']= (100/vl).toFixed(5)+'%';
						wraphtml += temp.evaluate(item[i++]);
					}
					return wraphtml+'</div></div>';
				});	
			
			return '<div class=\'videosAndImgInner\' style=\'height:100%;background:url('+wrap.content.background+') no-repeat 50% 50%;\'><div class=\'videosAndImgItems\'>'+ videosHtml + imagesHtml+'</div></div>';

		},
		videosAndImgEvent:function(ele,arg){
			require(['http://player.youku.com/jsapi'], function (doc) {
				var videos = temp.toArray(ele.querySelectorAll('.playVideo'));
				videos.forEach(function(video,index){
					video.parentNode.addEventListener('click',function(){
						var videoId = this.getAttribute('id');
						temp.playVideo({id:videoId});
					},false);
				});
			});

			var prevBar = ele.querySelector('.prev'),
				nextBar = ele.querySelector('.next');



			var videosAndImg_myScroll = new iScroll('scrollImg', {
				snap: 'div',
				momentum: false,
				hScrollbar: false,
				vScrollbar: false,
				onBeforeScrollStart: function (e) {
					if(e.srcElement.parentNode.className.indexOf("imageItem") > -1 ){
						e.stopPropagation();
					}
					e.preventDefault();
				},
				onScrollEnd: function () {
					if( this.pagesX.length-2 < this.currPageX ){ nextBar.style.opacity = '0.4';}else{nextBar.style.opacity = '1';}
					if( 1 > this.currPageX ){ prevBar.style.opacity = '0.4';}else{prevBar.style.opacity = '1';}
					//document.querySelector('#indicator > li.active').className = '';
					//document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
				}
			 });

			 setTimeout(function(){
				 videosAndImg_myScroll.refresh();
				 prevBar.style.opacity = '0.4';
				 prevBar.addEventListener('click',function(){ videosAndImg_myScroll.scrollToPage('prev', 0) },false);
				 nextBar.addEventListener('click',function(){ videosAndImg_myScroll.scrollToPage('next', 0) },false);
				},0)



		},
		// 页面自定义
		custom:function(wrap){
			// 
			return this.createPage({
					className:'customInner',
					background:wrap.content.background,
					temp: '<div class=\'productItem\'>#{innerHTML}</div>'//this.temp.scroll
				},function(temp){
					var wraphtml='',item=wrap.content;
					
						wraphtml += temp.evaluate(item);
					
					return wraphtml;
				});			
		},
		customEvent:function(ele,arg){
			arg.content.innerStyle && createStyle(arg.content.innerStyle);
			arg.content.callback   && arg.content.callback(ele)
		},
		createPage:function( ARGUMENTS ,callback){
			var _style = ARGUMENTS.style,
				top    = _style.top        ?'top:'     +_style.top        +'px;':'',
				left   = _style.left       ?'left:'    +_style.left       +'px;':'',
				height = _style.height     ?'height:'  +_style.height     +'px;':'',
				width  = _style.width      ?'width:'   +_style.width      +'px;':'';
				z_index= _style['z-index'] ?'z-index:' +_style['z-index']       :'';
				console.log(_style)
			var temp_oneImg = new temp.template( ARGUMENTS.temp ),
				wraphtml_start   = '';//'<div class=\''+ ARGUMENTS.className +'\' style=\'height:100%;'+ (ARGUMENTS.background ?'background:url('+ ARGUMENTS.background +') no-repeat 50% 50%;' :'')+' \' >';
				wraphtml_content = callback && callback(temp_oneImg,'position:absolute;'+top+left+height+width+z_index);
				wraphtml_end     = ''; //'</div>';
				temp_oneImg = null;
			return wraphtml_start + wraphtml_content + wraphtml_end;

		}
	}
	


	//createElements('mapWarp',{'map':{'style':'background:red;','class':'map','data-base':'base'}} )
	function createElements(){
		
		var i=0,il, arg = temp.toArray(arguments);

		for(i,il=arg.length;i<il;i++){
			// 如果windo.Elements 已经存在arg[i]属性则跳过
			
			if(!arg[i]){ continue	};
			if( (typeof arg[i] == 'string') || (arg[i] instanceof String) ){
				Elements[arg[i]] = document.createElement('div');
				if(il == 1){ return Elements[arg[i]];};
			}else{
				var argI = arg[i],m ,key;
				for(var m in argI){
					if(m == 'tag'){continue;}

					var Temporary  =  temp.namespace( 'Elements.'+m );
						Temporary['node'] = document.createElement(argI['tag']||'div');
					for(var key in argI[m]){
						//if(key.toLowerCase() != 'style' || key.toLowerCase() != 'class' || /^data-/.test(key.toLowerCase()) ){continue keyName	};
						Temporary['node'].setAttribute(key,argI[m][key]);
					}
					if( il == 1){ return Temporary['node']; }
				}
				 
			}
		}
	};




	function createBody(oFragment,mainType){
		// 创建body的节点
		//|----#body
		//	    |-----#pages
		//	    |-----#navigater

		var navigaterStyle = mainType=='menu'? 'width:100%;bottom:0;':'';
		var bodyStyle =  mainType=='menu'? '':'';

		createElements(
			{'body'          :{'class':'body',     'id':'body'}},
			{'body.pages'    :{'class':'pages',    'id':'pages',     'style':'top:0;left:0;'+bodyStyle}},
			{'body.navigater':{'class':'navigater','id':'navigater', 'style':navigaterStyle}});
		oFragment.appendChild(Elements.body.node);
		// page
		Elements.body.node.appendChild(Elements.body.pages.node);
		// navigater
		Elements.body.node.appendChild(Elements.body.navigater.node);
		return {
			navigater : Elements.body.navigater.node,
			pages     : Elements.body.pages.node
			}
			
	}

	function navigaterClick(temp_ADS_arg,callback){
				temp_ADS_arg.currentAnchor.addEventListener('click',function(){
					var pagesDiv = temp.toArray(document.querySelectorAll('#pages > div')),
						_this=this;
					// 当前状态处于active时 return;
					if(_this.className.indexOf('active') !== -1){ return ;}
					pagesDiv.forEach(function(ele,index){
						var currentNavA = Elements['body']['navigater']['anchor_' + ele.id ]['node'];
						if(_this.getAttribute('data-content') ==   ele.id ){
							// 回调
							callback && callback(ele,temp_ADS_arg);
							ele.style.display = 'block';
							currentNavA.className = 'active';
						}else{
							ele.style.display = Config.mainType === 'menu'?'none':'';
							currentNavA.className = currentNavA.className.replace('active','');
						}
					});
				},false);
	}

	function renderAd(arg,wrap,callback){
		var pages = arg && arg.pages || null,
			mainType = arg.mainType|| null,
			wrap = (wrap && wrap.nodeName && (wrap.nodeType == 1 || wrap.nodeType == 9))? wrap: document.querySelector('body') || document.getElementsByTagName('body')[0];
		if( !pages ) return;
		

		// 模板对象
		var temp_ADS = new InteractionAD(),
			// 文档节点
			oFragment = document.createDocumentFragment(),
			// { pages:'' , navigater:''}
			createContent = createBody(oFragment,mainType);

			// 存放导航节点名及顺序
			Elements['body']['navigater']['list'] =Array();

		for(var i=0,ip=pages.length;i<ip;i++){
			var typeId= 'pages_'+i  ,pagesItem = {};
		
				pagesItem[ 'body.pages.' + typeId ] = {'class':typeId,'id':typeId ,'style':'display:block;float:left;'};


		//	if(!temp_ADS[type]){continue;};
			createContent.pages.appendChild(createElements( pagesItem ));//temp_ADS[type](pages[i]);


			var anchor ={ 'tag':'a'};
				anchor[ 'body.navigater.anchor_'+typeId ] = { 'id':'anchor_' + typeId ,'data-content':typeId };

				// 创建 导航标签
				currentNav = createElements( anchor );
				Elements['body']['navigater']['list'].push('anchor_'+typeId );

				// 导航添加事件
				navigaterClick({
						currentAnchor:currentNav,
						temp:temp_ADS,
						page:pages[i]['page'],
						pageId:typeId
					} ,function(ele,ADS){
						

						if( Elements['body']['pages'][ ADS.pageId ] && Elements['body']['pages'][ ADS.pageId ]['content'] ){ return ;}
							//var startloading = new temp.loading(ele)
							
							var pageNode = document.createDocumentFragment();
							// 得到page 的页面数据 string HTML
							ADS['page']['contents'].forEach(function(ITEMTEMP,ADSIndex){
								var pageInnerNode = document.createElement('div');
									pageInnerNode.setAttribute('data-fn','bind');
									pageInnerNode.setAttribute('class','set___'+ITEMTEMP.type);

									pageNode.appendChild(pageInnerNode).innerHTML =  ADS.temp[ ITEMTEMP.type ].call( ADS.temp ,ITEMTEMP);
									// 给子节点绑定事件
									ADS.temp[ ITEMTEMP.type+'Event' ] && ADS.temp[ ITEMTEMP.type+'Event' ].call( ADS.temp ,pageInnerNode,ITEMTEMP);
								
							
							});
							
							var pageWrap = {'tag':'div'};
								pageWrap[ 'body.pages.'+ ADS.pageId +'.content' ] = {
											'id':'id'+ADS.page.className,
											'class':ADS.page.className,
											'style':'background:url('+ADS.page.background+') no-repeat 50% 50%;background-size:contain;'
											}
							var pageWrapNode = createElements(pageWrap)	;
								pageWrapNode.appendChild(pageNode);
							ele.appendChild(pageWrapNode);	


					});


			var navTXT =  mainType =='menu'?pages[i]['pageName']:'';
			createContent.navigater.appendChild(currentNav).innerHTML = navTXT;

		}
		//var pages = Array.prototype.splice.call(arguments,0,arguments.length);
		Config.navigaterStyle && createStyle(Config.navigaterStyle);
		wrap.appendChild(oFragment);
		callback && callback(Elements.body.pages,pages);

	};



	renderAd(window.Config,document.querySelector('body'),function(pagesNode,arg){
		//加载背景图片
		var i = 0; 
		//加载背景图片
		arg.forEach(function(item,index){
			var thisCallee = arguments.callee
			temp.loadImg(item.page.background,{
					loaded:function(image){
						//console.log("complete : "+ image.complete +"\nreadyState : "+image.readyState) 
						image.complete && index == 0 &&  setTimeout(function(){ startloading.done(); },200);
					},
					error:function(image){
						//item.content.background = 'http://static.youku.com/index/img/header/yklogo.png';
						setTimeout(function(){
							i++ && i < 4 && thisCallee(item,index);
						},800)
					}

				});
		});
		



		var navigater = Elements.body.navigater;
		// 派发点击事件 
		simulationEvent({ele:navigater[ navigater.list['1'] ]['node'] });




		function createMyScroll(dir){
				var dir = dir === 'scroll-X'?'currPageX':'currPageY';

				var myScroll = new iScroll(Elements.body.node, {
					snap:true,
					momentum:false,
					hScrollbar: false,
					vScrollbar: false,
					onBeforeScrollStart: function (e) { 
					var target = e.target; 
					while (target.nodeType != 1) target = target.parentNode; 
					if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') 
						e.preventDefault(); 
					}, 
					onScrollMove:function(){
								navigater.list[ parseInt(this[dir])+1  ] && simulationEvent({ele:navigater[ navigater.list[ parseInt(this[dir])+1 ] ]['node'] });
					},
					onScrollEnd: function () {
								navigater.list[ parseInt(this[dir])  ] && simulationEvent({ele:navigater[ navigater.list[ parseInt(this[dir])] ]['node'] });
					
					}
				 });
				 setTimeout(function(){ myScroll.refresh();},0);

		}

		;Config.mainType === 'scroll-X'   && (function(){
			pagesNode.node.style.width = (arg.length *100) + '%';
			arg.forEach(function(value,index){
				pagesNode[ value['type']+index ]['node'].style.width = (100/arg.length).toFixed(6)+'%';
			});
			createMyScroll('scroll-X');

		})();
		;Config.mainType === 'scroll-Y'   && (function(){
			pagesNode.node.style.height = (arg.length *100) + '%';
			arg.forEach(function(value,index){
				pagesNode[ value['type']+index ]['node'].style.height = (100/arg.length).toFixed(6)+'%';
			});
			createMyScroll('scroll-Y');

		})();

		;Config.mainType === 'point'   &&  (Elements.body.navigater.node.style.display = 'none');
			

		
	});
	


})


