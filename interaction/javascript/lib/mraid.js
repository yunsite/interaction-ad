define(function(){
	
	
	function mraidReady(mraidConfig){
	
		// 参数配置
		// maridConfig = {
		//                time:1000,
		//                ready:function(){}
		//            }
		// maridConfig = function(){}
	
		if(mraidConfig.ready || Object.prototype.toString.call(mraidConfig) !== "[object Function]"){
			alert('plase add ready function');
			return false;
		}
	
		var conf = {
			time  : mraidConfig.time || 1000,
			ready : (mraidConfig && mraidConfig.ready) || mraidConfig || null
		}
	
	
		var MRAID_TIME_OUT = 1000;    
		// detect the mraid instance
		var readyTimeout;
		function launchMraid() {
			var state = mraid.getState();
			if (state === 'default') {
				conf.ready && conf.ready(mraid);
			} else {
				mraid.addEventListener('ready', function(){
						conf.ready && conf.ready(mraid);
						});
			}        
		}
	
		if (typeof (mraid) === 'undefined') {
			readyTimeout = setTimeout(function(){        
					clearTimeout(readyTimeout);
					if (typeof (mraid) === 'undefined') {
					alert( 'mraid not found yet after '+MRAID_TIME_OUT+'ms' );
						// TODO
						// there is no mraid, please do not introduce mraid/ormma feature for your ad.                
					} else {
					launchMraid( );
					}            
					}, MRAID_TIME_OUT);
		} else {
			launchMraid( );
		}
	}
	
	return {mraidReady:mraidReady}
	
	

})
