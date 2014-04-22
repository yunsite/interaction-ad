
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

		'threesixty'            :'./360/threesixty',
		'autoNavi'              :'http://webapi.amap.com/maps?v=1.2&key=c0e37bb8a23b337c1b86bd2099e9ccee'
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

	
	function InteractionAD(){
		this.temp={
		// 头图大图
		anchors:'<a class=\'#{className}\' href=\'#{href}\' style=\'#{style}\'></a>',
		// 全视频
		video:'<div class=\'#{className}\' style=\'#{style}\' id=\'video-#{videoId}\'><a href=\'javascript:void(0)\' data-videoid=\'#{videoId}\'><img class=\'playVideo\' src=\'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\' /><img class=\'video\' src=\'#{thumbnail}\' /></a><b>#{title}</b></div>',
		// 相册
		album:[
				'<dl><dt style=\'#{style}\'></dt><dd>#{html}</dd></dl>',
				'<div class=\'#{className}\' style=\'#{style}\' ><a href=\'javascript:void(0)\'><img src=\'#{thumbnail}\' /></a></div>'
			  ],
		// 图片
		image:'<img style=\'#{style}\' src=\'#{imgSrc}\' title=\'#{title}\' />',
		// 滚动
		scroll:'<li style=\'#{style}\'><img src=\'#{imgSrc}\' title=\'#{title}\' /><b>#{lenTitle}</b></li>',
		// 产品介绍
		imageAndTitle:'<div class=\'#{className}\' style=\'#{style}\'><img src=#{imgSrc} /><b>#{title}</b></div>',
		// 汽车拼点介绍
		background: '<div class=\'#{className}\' style=\'#{style}\' ></div>',
		// 页面自定义
		custom:''
		}
	}

	InteractionAD.prototype={
		constructor:InteractionAD,
		towLay:function(parentNode,Arguments){
			// Arguments = {arg:arg,insertPageId:insertPageId,pageitem:pageitem}	
			var getImages  = parentNode.querySelectorAll('dd > div'),
				itemDt     = parentNode.querySelector('dt'),
				images     = temp.toArray(getImages),
				that       = this;
				album_item = Arguments.pageitem || '_album_item_';

				images.forEach(function(image,index){
					image.addEventListener('click',function(){
						var pageId = Arguments.insertPageId || parentNode.parentNode.parentNode.id ;

						var albumContent = Arguments.arg.content[index],
							showType     = albumContent['type'];
							albumContent.left   = albumContent.top =  '0';
							albumContent.height = parseInt(itemDt.style.height);
							albumContent.width  = parseInt(itemDt.style.width);

							parentNode.querySelector('dd .active') && 
									(parentNode.querySelector('dd .active').className = parentNode.querySelector('.active').className.replace('active',''));
							
							image.className += ' active';

						var dtItmes = temp.toArray(parentNode.querySelectorAll('dt div[class*='+album_item+']'));
							dtItmes.forEach(function(ITEM){ITEM.style.display = ITEM.className == pageId+album_item+index ? 'block':'none';})

						Arguments.callback && Arguments.callback({parentNode:parentNode,index:index,len:images.length});
						if( parentNode.querySelector('.'+pageId+album_item+index) ){ return; }

						var imagesNodes = document.createDocumentFragment();
							dtInnerItem = document.createElement('div');
							imagesNodes.appendChild(dtInnerItem);
							dtInnerItem.setAttribute('class',pageId+album_item+index);
							itemDt.appendChild(dtInnerItem);

						if( showType && that[showType] ){
							dtInnerItem.innerHTML  = that[showType](albumContent);
							that[showType+'Event'] && that[showType+'Event'](dtInnerItem,albumContent);
							
							
							}
							
					},false);
				});

			//	itemDt.addEventListener('touchmove',function(e){
			//			e.stopPropagation();
			//		},false);

		
		},
		// 添加图片
		image:function(content){
			return this.createPage({
					temp:this.temp.imageAndTitle,
					style:content
				},function(temp,style){
					var pusharg={
							title:content.content.title || '优酷互动广告',
							href:content.content.href   || 'javascript:void(0)',
							imgSrc:content.content.src  || 'javascript:void(0)',
							style:style,
							className:content.content.className || 'item-anchors'
						}
					return temp.evaluate(pusharg);
				});
				
		
		},
		imageEvent:function(parentNode,arg){
			arg.callback && arg.callback(parentNode,arg,this)	
		},
		background:function(content){
			return this.createPage({
					temp:this.temp.background,
					style:content
				},function(temp,style){
					var pusharg={
							style:style,
							className:content.content.className ||'item-background',
						}
					return temp.evaluate(pusharg);
				});
				
		
		},
			
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
			temp.getScript('http://player.youku.com/jsapi',
				{
					load:function(){
						temp.itemAddEvent({node:playVideo,type:'click',callback:function(thisNode){
							var videoId = thisNode.parentNode.getAttribute('data-videoid');
							temp.playVideo({id:videoId});
							arg.callback && arg.callback(thisNode);
						}});
					},
					error:function(){
						alert('播放器加载失败');
					}
				
				})

		
		},
		// 相册
		album:function(content){
			var that = this;
			return this.createPage({
					style:content,
					temp: this.temp.album[0]
				},function(temp,style){
					
					var	innerContent = content.content;
					var contentLen = innerContent.length,pointHTML =[]; 	
					for(var i=0;i<contentLen;i++){	
						pointHTML.push(that.createPage.call(that,{
								temp:that.temp.album[1],
								style:innerContent[i]
							},function(temp,style){
								return temp.evaluate({className:innerContent[i]['className']||'albumItem',style:style,thumbnail:innerContent[i]['thumbnail']});
							}));	
					}
					return temp.evaluate({style:style,html:pointHTML.join('')});
				});
		
		},
		albumEvent:function(parentNode,arg,insertPageId,pageitem){

			// Arguments = {arg:arg,insertPageId:insertPageId,pageitem:pageitem}	
			this.towLay.apply(this,[parentNode,{arg:arg,insertPageId:insertPageId,pageitem:'_album_item_'}]);
			simulationEvent({ele:parentNode.querySelector('dd > div.albumItem ')});
			arg.callback   && arg.callback(parentNode);


		},
		slider3d:function(content){
			return this.createPage({
					temp: this.temp.image,
					style: content
				},function(temp,style){
					return '<div class=\'eye3d\' style=\''+style+'\'></div>';
				});		
		
		},
		slider3dEvent:function(parentNode,arg){
			temp.slider3d({
				itemEle:parentNode.querySelector('.eye3d'),
				imagePath:arg.content.images,
				callback:function(image,range){
					arg.callback && arg.callback(image,range);
				},
				background:false,
				blockImg :true,
			})
		},

		// 图片滚动
		scroll:function(content){
			return this.createPage({
					temp: this.temp.scroll,
					style: content
				},function(temp,style){

					var images   = content.content.images,
						imagesLen= images.length,
						i=0;
					var wraphtml = '<div class=\'scrollCon\' style=\'overflow:hidden;'+style+'\'><div style=\'width:'+(content.width*imagesLen)+'px;\'><ul class=\'scrollImg\' style=\'width:'+(content.width*imagesLen)+'px;\'>';

					
					for(;i<imagesLen;i++){
						wraphtml += temp.evaluate({imgSrc:images[i]['img'],title:images[i]['title'],lenTitle:images[i]['lenTitle']||images[i]['title'],style:'position:relative;display:block;float:left;width:'+content.width+'px;'});
					}
					return wraphtml+'</ul></div></div>';
				});		
		
		
		},
		scrollEvent:function(parentNode,arg){
			var myScroll = new iScroll(parentNode.querySelector('.scrollCon'), {
				snap: true,
				momentum: false,
				hScrollbar: false,
				vScrollbar: false,
				onBeforeScrollStart: function (e) {                 
						if(e.srcElement.parentNode.className.indexOf("scrollImg") > -1 || e.srcElement.parentNode.parentNode.className.indexOf("scrollImg") > -1 ){                  
								e.stopPropagation();
						}                                                                                  
						e.preventDefault();                                                                
				},

				onScrollEnd: function () {}
			 });

		//	console.log(myScroll)
			 setTimeout(function(){myScroll.refresh();},20);


		//	arg.callback   && arg.callback(parentNode);
		},
		changeColor:function(content){
			return this.createPage({
					temp: this.temp.image,
					style: content
				},function(temp,style){
					
					var images   = content.content.images,
						imagesLen= images.length,
						i=0;
					var wraphtml = '',handler='';

					for(;i<imagesLen;i++){
						handler += '<li class=\'changeHandler'+i+'\' data-item=\'item'+i+'\'></li>'; 
						wraphtml += temp.evaluate({imgSrc:images[i]['img'],title:images[i]['title'],style:style});
					}

					return '<div class=\'changeColor\' style=\''+style+'\'>'+ wraphtml +'</div><ul class=\'changer\' >'+handler+'</ul>';
				});		
			// this.album(content)
		},
		changeColorEvent:function(parentNode,arg){
			var li = temp.toArray(parentNode.querySelectorAll('ul li')),
				images = temp.toArray(parentNode.querySelectorAll('.changeColor>img'));
				li.forEach(function(handler,index){
					handler.addEventListener('click',function(e){
						var showColor = parentNode.querySelector('img.show');
							showColor && (showColor.className = showColor.className.replace('show',''));
							images[index].className = 'show';
						},false);
					});

			simulationEvent({ele:li[0]});
			arg.callback   && arg.callback(parentNode);
				
		},
		productImg:function(content){
				return this.point.call(this,content);
		},
		productImgEvent:function(parentNode,arg,insertPageId){
			
			this.towLay.apply(this,[parentNode,{
				arg:arg,
				insertPageId:insertPageId,
				pageitem:'_product_item_',
				callback:function(Arguments){
					
					var pointDt  = Arguments.parentNode.querySelector('dt');
						pointDt.style.display = 'block';


					if( Elements.body.pages.point &&
						Elements.body.pages.point.close && 
						Elements.body.pages.point.left  && 
						Elements.body.pages.point.right &&
						Elements.body.pages.point.shadow
						){
						
						Elements.body.pages.point.shadow.node.style.display = 'block';
						
							return ;
						}
					var dtHeight = parseInt(pointDt.style.height),
						dtWidth  = parseInt(pointDt.style.width),
						dtTop    = parseInt(pointDt.style.top),
						dtLeft   = parseInt(pointDt.style.left),
						winHeight= window.innerHeight,
						winWidth = window.innerWidth;
						
						pointDt.style['transition'] = 'all 200ms ease-out';	
							
                    var styleCloseBox = temp.getAttribute(arg.closeBox),
                        styleLeftBar  = temp.getAttribute(arg.leftBar),
                        styleShadow   = temp.getAttribute(arg.shadow),
                        styleRightBar = temp.getAttribute(arg.rightBar);

					var pointBox = document.createDocumentFragment(),
						closeBox = createElements({'body.pages.point.close' :{'class':styleCloseBox.className  ,'id':'id'+styleCloseBox.className ,'style':styleCloseBox.style}}),
						boxLeft  = createElements({'body.pages.point.left'  :{'class':styleLeftBar.className   ,'id':'id'+styleLeftBar.className  ,'style':styleLeftBar.style}}),
						boxRight = createElements({'body.pages.point.right' :{'class':styleRightBar.className  ,'id':'id'+styleRightBar.className ,'style':styleRightBar.style}}),
						boxShadow= createElements({'body.pages.point.shadow':{'class':styleShadow.className    ,'id':'id'+styleShadow.className   ,'style':styleShadow.style}});

						pointBox.appendChild(closeBox);
						pointBox.appendChild(boxLeft);
						pointBox.appendChild(boxRight);
						parentNode.appendChild(boxShadow);

						pointDt.appendChild(pointBox);
						closeBox.addEventListener('click',function(){ 
							pointDt.style.display = 'none';
							Elements.body.pages.point.shadow.node.style.display = 'none';
							
							},false);
						boxLeft.addEventListener('click',function(){ 
									
							var thisNodeEle = parentNode.querySelector('dd > div.active ').nextSibling,
								NodeEle     = thisNodeEle?thisNodeEle:parentNode.querySelector('dd > div:first-child');

							simulationEvent({ele:NodeEle});
							
							},false);
						boxRight.addEventListener('click',function(){ 
							var thisNodeEle = parentNode.querySelector('dd > div.active ').previousSibling,
								NodeEle     = thisNodeEle?thisNodeEle:parentNode.querySelector('dd > div:last-child');

							simulationEvent({ele:NodeEle});
							
							},false);
				
				}
				}]);
				arg.callback   && arg.callback(parentNode);
			},
		point:function(content){
			var that = this;
			return this.createPage({
					temp:this.temp.album[0],
					style:content
				},function(temp,style){


					var	innerContent = content.content;
					var contentLen = innerContent.length,pointHTML =[]; 	
					for(var i=0;i<contentLen;i++){	
						pointHTML.push(that.createPage.call(that,{
								temp:that.temp.album[1],
								style:innerContent[i]
							},function(temp,style){
								return temp.evaluate({className:innerContent[i]['className']||'pointItem',style:style,thumbnail:innerContent[i]['pointImg']});
							}));	
					}
					return temp.evaluate({style:style+';display:none;',html:pointHTML.join('')});



				});	
			
		},
		pointEvent:function(parentNode,arg,insertPageId){
			// Arguments = {arg:arg,insertPageId:insertPageId,pageitem:pageitem}	
			this.towLay.apply(this,[parentNode,{
				arg:arg,
				insertPageId:insertPageId,
				pageitem:'_point_item_',
				callback:function(Arguments){
					
//					Arguments.parentNode,Arguments.index,Arguments.len;
					var pointDt  = Arguments.parentNode.querySelector('dt');
						pointDt.style.display = 'block';


					if( Elements.body.pages.point &&
						Elements.body.pages.point.close && 
						Elements.body.pages.point.left  && 
						Elements.body.pages.point.right &&
						Elements.body.pages.point.shadow
						){
						
						Elements.body.pages.point.shadow.node.style.display = 'block';
						
							return ;
						}
					var dtHeight = parseInt(pointDt.style.height),
						dtWidth  = parseInt(pointDt.style.width),
						dtTop    = parseInt(pointDt.style.top),
						dtLeft   = parseInt(pointDt.style.left),
						winHeight= window.innerHeight,
						winWidth = window.innerWidth;
						
						pointDt.style['transition'] = 'all 200ms ease-out';	
							
                    var styleCloseBox = temp.getAttribute(arg.closeBox),
                        styleLeftBar  = temp.getAttribute(arg.leftBar),
                        styleShadow   = temp.getAttribute(arg.shadow),
                        styleRightBar = temp.getAttribute(arg.rightBar);
					var pointBox = document.createDocumentFragment(),
						closeBox = createElements({'body.pages.point.close' :{'class':styleCloseBox.className  ,'id':'id'+styleCloseBox.className ,'style':styleCloseBox.style}}),
						boxLeft  = createElements({'body.pages.point.left'  :{'class':styleLeftBar.className   ,'id':'id'+styleLeftBar.className  ,'style':styleLeftBar.style}}),
						boxRight = createElements({'body.pages.point.right' :{'class':styleRightBar.className  ,'id':'id'+styleRightBar.className ,'style':styleRightBar.style}}),
						boxShadow= createElements({'body.pages.point.shadow':{'class':styleShadow.className    ,'id':'id'+styleShadow.className   ,'style':styleShadow.style}});

						pointBox.appendChild(closeBox);
						pointBox.appendChild(boxLeft);
						pointBox.appendChild(boxRight);
						parentNode.appendChild(boxShadow);

						pointDt.appendChild(pointBox);
						closeBox.addEventListener('click',function(){ 
							pointDt.style.display = 'none';
							Elements.body.pages.point.shadow.node.style.display = 'none';
							
							},false);
						boxLeft.addEventListener('click',function(){ 
									
							var thisNodeEle = parentNode.querySelector('dd > div.active ').nextSibling,
								NodeEle     = thisNodeEle?thisNodeEle:parentNode.querySelector('dd > div:first-child');

							simulationEvent({ele:NodeEle});
							
							},false);
						boxRight.addEventListener('click',function(){ 
							var thisNodeEle = parentNode.querySelector('dd > div.active ').previousSibling,
								NodeEle     = thisNodeEle?thisNodeEle:parentNode.querySelector('dd > div:last-child');

							simulationEvent({ele:NodeEle});
							
							},false);
				}
				}]);
			arg.callback   && arg.callback(parentNode);
		
		},
		// 页面自定义
		custom:function(content){
			// 
			return this.createPage({
					temp: '<div class=\'productItem\' style=\'#{style}\'>#{innerHTML}</div>',//this.temp.scroll
					style:content
				},function(temp,style){
					return temp.evaluate({style:style,innerHTML:content.content.innerHTML});				
			});			
		},
		customEvent:function(ele,arg){
			arg.content.callback   && arg.content.callback(ele)
		},
		// 地图模块
		bdMap:function(content){
			var that=this,
				TEMP=temp,
				autoTemp = [
							'<div id=\'mapContent'+parseInt(Math.random()*10000)+'\' class=\'mapContent\' style=\'#{style}\'></div><div class=\'mapPoints\' style=\'#{listStyle}\'><div style=\'#{scrollCon}\'><ul style=\'height:100%;width:100%\'>#{list}</ul></div></div>',
							'<li style=\'#{style}\'><div class=\'mapPointLeft\'><h5>#{title}</h5><p>#{location}<br/>#{tel1}</p></div><div class=\'mapPointRight\'>#{href} #{tel}</div></li>'
							];

			return this.createPage({
					temp:autoTemp[0],
					style:content
				},function(temp,style){

					var	points    =  content.content.points,
						pointLen  =  points.length,
						listItem  =  [],
						mapPoints =  TEMP.getAttribute(content.content);

					var liwidth = 525;
					for(var i=0;i<pointLen;i++){	
						listItem.push(that.createPage.call(that,{
								temp:autoTemp[1],
								style:points[i]
							},function(temp,style){
								var POINT = points[i];
								POINT.href.innerStyle && createStyle(POINT.href.innerStyle);
								tel = POINT.tel.map(function(value){ return '<a href=\'tel:'+value+'\'>'+value+'</a>';});

								return temp.evaluate({
									style:'width:'+liwidth+'px;margin-right:3px;',
									title:POINT['title']||POINT['location']||'请添加title属性',
									location:POINT['location']||'请添加location属性',
									tel1:POINT.tel[0],
									href:'<a class=\''+POINT['href']['className']+'\' href=\''+POINT['href']['href']+'\'>'+POINT['href']['title']+'</a>',
									tel:tel.join('')});
							}));	
					}
					return temp.evaluate({style:style,listStyle:mapPoints.style+';overflow:hidden;',list:listItem.join(''),scrollCon:'height:100%;width:'+ (pointLen*(liwidth+3)) +'px;'});
				});	
			},
		bdMapEvent:function(parentNode,arg){
			window.BMap;	
			var myScroll = new iScroll(parentNode.querySelector('.mapPoints'),{ vScroll:true,hScrollbar:true, vScrollbar: false });
				setTimeout(function(){ myScroll.refresh();},0);
			var points     = arg.content.points,
				mapContent = parentNode.querySelector('div[id^=mapContent]').id;




			function createBDmap(){
				var mapObj = new BMap.Map(mapContent),myLoaction;	
				function markMyLocation(point){  // 创建图标对象     
					var myIcon = new BMap.Icon("http://r4.ykimg.com/0510000052D75BA36714C031CF06546D.png",   
							new BMap.Size(23, 26), {      
							anchor: new BMap.Size(7, 25),        
							});   

						var marker = new BMap.Marker(point, {icon: myIcon});  
						marker.addEventListener("click", function(){ });
						mapObj.addOverlay(marker);      
					}

				function addAllMarkes(){
						var	myGeo = new BMap.Geocoder();
						points.forEach(function(value){
								myGeo.getPoint(value['location'], function(point){
									point && mapObj.addOverlay(new BMap.Marker(point)) 
									value['point'] = point;
								},value['city']);
							});
							myGeo = null;
					}

				if(navigator.geolocation){
					navigator.geolocation.getCurrentPosition(function(position){
							//添加我的坐标点
							var coords = position.coords,
							myPoi=new BMap.Point(coords.longitude, coords.latitude);
							markMyLocation(myPoi);

							mapObj.centerAndZoom(myPoi,15);                    
							mapObj.addControl(new BMap.ZoomControl());      
							addAllMarkes();
						},function(){
							addAllMarkes();
						});
				}

				;(function(){
					
					var showPoints= temp.toArray(parentNode.querySelectorAll('.mapPoints li .mapPointLeft'));
						showPoints.forEach(function(liNode,index){
								liNode.addEventListener('click',function(){
										mapObj.panTo(new BMap.Point(points[index]['point']['lng'],points[index]['point']['lat']))
									
									},false);
							
							})
						

					})();

			}



			window.BMap_loadScriptTime = (new Date).getTime();
			temp.getScript('http://api.map.baidu.com/getscript?type=quick&file=api&ak=Rh7IIY1FumRGQaWsfUVumZz9&t=20140109092002',
				{
					load:function(){
						temp.getScript('http://api.map.baidu.com/getscript?type=quick&file=feature&ak=Rh7IIY1FumRGQaWsfUVumZz9&t=20140109092002',
							{
								load:function(){
									createBDmap();
								},
								error:function(){
									alert('地图加载失败');
								}
							});
					},
					error:function(){
							alert('地图加载失败');
						}
				});







			window.addEventListener('load',function(){
			console.log('loading')	
			var mapObj = new AMap.map('mapContent',{
				    center:new AMap.LngLat(116.397428,39.90923), //地图中心点
					    level:13  //地图显示的比例尺级别
						    })
				
				
				},200)
			
			
			},
		createPage:function( ARGUMENTS ,callback){
			var _style = ARGUMENTS.style,
				parseStyle  = temp.getAttribute(_style);
				_style.innerStyle && createStyle(_style.innerStyle);

			var temp_oneImg = new temp.template( ARGUMENTS.temp ),
				wraphtml_content = callback && callback(temp_oneImg,parseStyle.style);
				temp_oneImg = null;
			return  wraphtml_content;

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

		var navigaterStyle = mainType=='menu'? 'width:100%;':'';
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


							// 给pages添加innerstyle 样式表 	
							ADS['page']['innerStyle'] && createStyle(ADS['page']['innerStyle']);
							
							
							
							var pageNode = document.createDocumentFragment();
							// 得到page 的页面数据 string HTML
							ADS['page']['contents'].forEach(function(ITEMTEMP,ADSIndex){
								var pageInnerNode = document.createElement('div');
									pageInnerNode.setAttribute('data-fn','bind');
									pageInnerNode.setAttribute('class','set___'+ITEMTEMP.type);
									pageNode.appendChild(pageInnerNode).innerHTML =  ITEMTEMP.type && ADS.temp[ ITEMTEMP.type ] && ADS.temp[ ITEMTEMP.type ].call( ADS.temp ,ITEMTEMP) || '没有这个类型';
									// 给子节点绑定事件
									ADS.temp[ ITEMTEMP.type+'Event' ] && ADS.temp[ ITEMTEMP.type+'Event' ].call( ADS.temp ,pageInnerNode,ITEMTEMP,ADS.pageId);
								
							
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

	//实现 styleSheets 修改样式
	function getSheetsAttribute(arg){
		// arg={sheetsId:'createStyle',class}
		// document.styleSheets[1].ownerNode.id
		//selectorText

		var styleSheets,mark=false,sheetRule;
		if(document.styleSheets.length>0){
			styleSheets = temp.toArray(document.styleSheets);
			styleSheets.forEach(function(item){
					if(item.ownerNode.id === arg.sheetsId){
					var rules= temp.toArray(item.cssRules);
					rules.forEach(function(rule,i){
						if(rule.selectorText.replace(/\"/g,'') == arg.selector.replace(/\"/g,'')){
						mark = true;
						sheetRule = {StyleSheet:item,index:i};
						}
						})
					}
					});
		}
		if(!mark && !arg.done){
			var styleAttr =[];
			style = document.createElement("style");
			style.setAttribute("type", "text/css");
			style.setAttribute("id", "setScale");
			for(var m in arg.style){  styleAttr.push(m +':'+arg.style[m]); } ;
			style.appendChild(document.createTextNode( arg.selector+'{'+ styleAttr.join(';')+'}'  ));
			if(!document.querySelector('#setScale') && 	document.querySelector('head').appendChild(style)){
				arg.done = true;
				return arguments.callee(arg);
			}
		}else{
			return sheetRule;
		}
	}


	renderAd(window.Config,document.querySelector('body'),function(pagesNode,arg){
		//加载背景图片
		var i = 0; 
		//加载背景图片
		arg.forEach(function(item,index){
			var thisCallee = arguments.callee
			temp.loadImg(item.page.background,{
					loaded:function(image){
						image.complete && index == 0 &&  setTimeout(function(){
							var backgroundImageHeight = image.height,
							backgroundImageWidth  = image.width,
							winHeight,winWidth,scaleHeight,scaleWidth,settransform;

							function setScale(){
							winHeight   = window.innerHeight;
							winWidth    = window.innerWidth;

							scaleHeight = winHeight/backgroundImageHeight;
							scaleWidth  = winWidth/backgroundImageWidth;
							if(settransform){
								settransform.StyleSheet.deleteRule(settransform.index);
								settransform.StyleSheet.insertRule('div[data-fn=bind]{-webkit-transform:scale('+ (scaleWidth>scaleHeight?scaleHeight:scaleWidth) +')}',settransform.index-1<0?0:settransform.index-1);
							}else{
								settransform = getSheetsAttribute({sheetsId:'setScale',selector:'div[data-fn="bind"]',style:{'-webkit-transform':'scale('+ (scaleWidth>scaleHeight?scaleHeight:scaleWidth) +')'}});
							}

							};
							setScale();
							window.addEventListener('resize',function(){ setScale() },false);


						startloading.done();
						},200);
					},
					error:function(image){
						setTimeout(function(){
							i++ && i < 4 && thisCallee(item,index);
						},800)
					}

				});
		});
		



		var navigater = Elements.body.navigater;
		// 派发点击事件 
		simulationEvent({ele:navigater[ navigater.list['0'] ]['node'] });




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
				pagesNode[ 'pages_'+index ]['node'].style.width = (100/arg.length).toFixed(6)+'%';
			});
			createMyScroll('scroll-X');

		})();
		;Config.mainType === 'scroll-Y'   && (function(){
			pagesNode.node.style.height = (arg.length *100) + '%';
			arg.forEach(function(value,index){
				pagesNode[ 'pages_'+index ]['node'].style.height = (100/arg.length).toFixed(6)+'%';
			});
			createMyScroll('scroll-Y');

		})();

		;Config.mainType === 'point'   &&  (Elements.body.navigater.node.style.display = 'none');
		
	});

})


