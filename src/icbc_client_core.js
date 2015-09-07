ICBCUtilTools = {
	sUserAgent : navigator.userAgent.toLowerCase(),
	isTestMode:function(){
		if(window['mode']=='test')
			return true;
		else
			return false;
	},
	isiPhone : function() {
		return (this.sUserAgent.match(/iphone os/i) == "iphone os");
	},
	isAndroid : function() {
		return (this.sUserAgent.match(/android/i) == "android");
	},
	isWindowsPhone : function(){
		return (this.sUserAgent.match(/msie/i) == "msie");
	},
	isICBCiPhoneClient : function() {
		return (this.sUserAgent.match(/icbciphonebs/i) == "icbciphonebs");
	},
	isICBCAndroidClient : function() {
		return (this.sUserAgent.match(/icbcandroidbs/i) == "icbcandroidbs");
	},
	isICBCWindowsPhoneClient : function() {
		return (this.sUserAgent.match(/icbcwindowsphonebs/i) == "icbcwindowsphonebs");
	},
	getAndroidVersion : function() {
		try {
			var version = this.sUserAgent.match(new RegExp('(?:android[\\s|/])(\\d\.\\d\.\\d)'))[1];
			version = (version == undefined ? "" : version);
			version = parseInt(version.replace(/\./g, ''));
			return version;
		} catch (e) {
			try{
				var version=this.sUserAgent.match(new RegExp('(?:android[\\s|/])(\\d\.\\d)'))[1]+"0";
				version = (version == undefined ? "" : version);
				version = parseInt(version.replace(/\./g, ''));
				return version;
			}catch(e){
				return 100;
			}
		}
	},
	getAndroidClientVersion : function() {
		try {
			if (this.isAndroid()) {
				var version = this.sUserAgent.match(new RegExp('\\d\.\\d\.\\d\.\\d'));
				version = (version == undefined ? "" : version);
				version = parseInt(version[0].replace(/\./g, ''));
				version = (version==""?"1000":version);
				return version;
			}
		} catch (e) {
			return "1000";
		}
	},
	getAndroidClientFullVersion : function() {
		try {
			if (this.isAndroid()) {
				var version = this.sUserAgent.match(new RegExp('fullversion:(\\d+)'));
				version = (version == undefined ? "0" : version);
				version = parseInt(version[1].replace(/\./g, ''));
				return version;
			}
		} catch (e) {
		}
	},
	getiPhoneClientFullVersion : function(userAgent) {
		try {
			if (this.isiPhone()) {
				var version = userAgent.match(new RegExp('fullversion:(\\d\.\\d\.\\d\.\\d\.\\d)'));
				if(version==undefined){
					version = userAgent.match(new RegExp('fullversion:(\\d\.\\d\.\\d\.\\d)'));
				}
				version = (version == undefined ? "0" : version);
				version = parseInt(version[1].replace(/\./g, ''));
				version = (version==""?"1000":version);
				return version;
			}
		} catch (e) {
			return "1000";
		}
	},	
	convertUTF8 : function(text) {
		var temp1 = jQuery("<div></div>").html(text);
		var temp2 = temp1.html();
		temp1.empty();
		return temp2;
	},
	checkFormInput : function (formSelect){
		var input=jQuery('form[name='+formSelect+']').find("textarea,input[type=text],input[type=number],input[type=tel],input[type=password]");
		input.each(function(){
			var placeholder=(jQuery(this).attr('placeholder')==undefined?"":jQuery(this).attr('placeholder'));
			var value=this.value;
			if(value==placeholder){
				this.value="";
			}
		});
	},
	sleep:function(numberMillis) {
	    var now = new Date();
	    var exitTime = now.getTime() + numberMillis;
	    while (true) {
	        now = new Date();
	        if (now.getTime() > exitTime)
	            return;
	    }
	}

};


//安全键盘
ICBCSafeKeyBoard={
	SafeKeyBoardHeight:290,
	AndroidVersion:ICBCUtilTools.getAndroidVersion(),
	WindowHeight:jQuery(window).height(),
	initSafeEdit:function(){
		var $allInput=jQuery('input[data-type=safeKeyBoard]');
		$allInput.each(function(index,element){
			var $current=jQuery(element);
			var dataName=$current.attr('data-name');
			var $currentCopy=$current.clone();
			$currentCopy.removeAttr('data-type').removeAttr('data-name');
			$currentCopy.attr('type','hidden');
			$currentCopy.attr('name',dataName);
			$currentCopy.attr('value','');
			//补充隐藏域
			$current.after($currentCopy);
			$current.after('<input type="hidden" name="'+dataName+'Rule" value=""/>');
			$current.after('<input type="hidden" name="'+dataName+'ChangeRule" value=""/>');
			if(ICBCUtilTools.isWindowsPhone()){
				$current.hide();
				$currentCopy.attr('type','password');
				return;
			}
			//失去焦点
			$current.blur();
			//设置只读
			$current.attr('readonly','readonly');
			//设置id
			$current.attr('id',index+"");
			//绑定点击事件
			$current.bind('click',function(){
				//置空值
				$current.val("");
				$currentCopy.val("");
				if(ICBCUtilTools.isiPhone()){
					var offsetTopTmp=$current.offset().top;
					var windowsHeight=jQuery(window).height();
					var bodyHeight=jQuery('body').height();
					var offsetTop=0;
					if(offsetTopTmp>windowsHeight){
						offsetTop=windowsHeight-(bodyHeight-offsetTopTmp);
					}else{
						offsetTop=offsetTopTmp;
					}
					//ICBCPageTools.iOSExcuteNativeMethod("Native://callSoftKeyBoard;"+index+";"+$current.attr('maxlength')+";"+offsetTop);
					ICBCPageTools.iOSExcuteNativeMethod("Native://callSoftKeyBoard;"+index+";"+$current.attr('maxlength')+";");
				}else if(ICBCUtilTools.isAndroid){
					//ICBCSafeKeyBoard.moveInputHeight($current);
					prompt("callsoftKeyBoard",index+";"+$current.attr('maxlength'));
				}
			});
		});
	},
	initAmountEdit:function(){
		var $allInput=jQuery('input[data-type=amountKeyBoard]');
		$allInput.each(function(index,element){
			var $current=jQuery(element);
			//区分版本
			if(ICBCUtilTools.isWindowsPhone()){
				//WP无法实现，不处理
				return;
			}else if(ICBCUtilTools.isICBCAndroidClient()){
				//Android 特殊处理
				if(ICBCSafeKeyBoard.AndroidVersion<410&&ICBCSafeKeyBoard.AndroidVersion>400){
					if(ICBCUtilTools.getAndroidClientVersion()<1015){
						//旧版本不兼容
						return;
					}
					ICBCSafeKeyBoard.modifyInputText($current,index);
				}else{
					if(ICBCUtilTools.getAndroidClientVersion()<1014){
						//旧版本不兼容
						return;
					}
					$current.bind('focus',function(){
						//告诉客户端设置为金额键盘
						ICBCUtilTools.sleep(100);
						if(ICBCUtilTools.getAndroidClientVersion()<1015){
							//旧版本
							prompt("callAmountKeyBoard",'');
						}else{
							prompt("callNewAmountKeyBoard",$current.attr('name'));
						}
					}).bind('blur',function(){
						if(ICBCSafeKeyBoard.AndroidVersion>=500){
							prompt("callCleanAmountKeyBoard",'');
						}
						//延迟100ms
						ICBCUtilTools.sleep(150);
					});
				}
			}else if(ICBCUtilTools.isICBCiPhoneClient()){
				//iPhone 特殊处理
				var version=ICBCUtilTools.getiPhoneClientFullVersion(window['user-agent']);
				if(version>1000&&version<10000){
					if(version<=1015){
						return;
					}
				}else if(version>10000){
					if(version<10160){
						return;
					}
				}else if(version==1000){
					return;
				}
				ICBCSafeKeyBoard.modifyInputText($current,index);
			}else{
				$current.removeAttr('data-type');
			}
		});
	},
	modifyInputText:function($current,index){
		//重写该输入域的name为临时name
		var dataName=$current.attr('name');
		var defaultValue=$current.val();
		defaultValue=(defaultValue==undefined?"":defaultValue);
		$current.attr('name','_temp_'+dataName);
		var $currentCopy=$current.clone();
		$current.removeAttr('onblur');
		$current.removeAttr('data-rule-required');
		$current.removeAttr('data-msg-required');
		$current.removeAttr('data-rule-number');
		$current.removeAttr('data-msg-number');
		$current.removeAttr('data-rule-minlength');
		$current.removeAttr('data-msg-minlength');
		$currentCopy.removeAttr('data-type');
		$currentCopy.attr('type','text');
		$currentCopy.css('display','none');
		$currentCopy.attr('name',dataName);
		$currentCopy.attr('value',defaultValue);
		//补充隐藏域
		$current.after($currentCopy);
		//设置只读
		$current.attr('readonly','readonly');
		//设置id
		var id="amountKeyBoard_"+index;
		$current.attr('id',id);
		//绑定点击事件
		$current.bind('click',function(){
			var defaultValue=$currentCopy.val();
			var maxlength=$current.attr('maxlength');
			maxlength=(maxlength==undefined?"100":maxlength);
			//置空值
			$current.val("");
			$currentCopy.val("");
			var offsetTopTmp=$current.offset().top;
			var offsetTop=offsetTopTmp-window.scrollY;
			var $scope=jQuery(document);
			if(ICBCUtilTools.isiPhone()){
				ICBCPageTools.iOSExcuteNativeMethod("Native://callAmountSoftKeyBoard;"+id+";"+maxlength+";"+offsetTop+";"+defaultValue);
				ICBCPageTools.iOSExcuteNativeMethod("Native://callAmountSoftKeyBoard;"+id+";"+maxlength+";");
				//$scope.find('header').removeClass('iphone_header_fixed');
				//$scope.find('#content').removeClass('iphone_content_fixed').css('top', '0px');
				ICBCInitTools.initFooter(false,$scope);
			}else if(ICBCUtilTools.isAndroid()){
				try{
				var param={};
				param.id=id;
				param.maxlength=maxlength;
				param.defaultValue=defaultValue;
				prompt("callCustomAmountKeyBoard",JSON.stringify(param));
				//ICBCSafeKeyBoard.moveInputHeight($current);
				}catch(e){
					alert(e);
				}
			}
		});	
	},
	setText:function(param){
		var $input=jQuery('#'+param.id);
		$input.val(param.displayStr);
		var dataName=$input.attr('data-name');
		jQuery('input[name='+dataName+']').val(param.password);
		jQuery('input[name='+dataName+'ChangeRule]').val(param.changeRule);
		jQuery('input[name='+dataName+'Rule]').val(param.rule);
	},
	setAmountSoftKeyBoardText:function(param){
		try{
			var $input=jQuery('#'+param.id);
			var dataName=$input.attr('name').replace('_temp_','');
			var maxlength=$input.attr('maxlength');
			maxlength=(maxlength==undefined?"100":maxlength);
			if(parseInt(param.displayStr.length)<=parseInt(maxlength)){
				$input.val(param.displayStr);
				jQuery('input[name='+dataName+']').val(param.displayStr).keyup();
			}
		}catch(e){
		}
	},
	callAmountSoftKeyBoardBlur:function(param){
		try{
			var $input=jQuery('#'+param.id);
			var dataName=$input.attr('name').replace('_temp_','');
			jQuery('input[name='+dataName+']').blur();
		}catch(e){
		}
	},	
	changeToSystemKeyBoard:function(id){
		var $input=jQuery('#'+id);
		$input.hide();
		var dataName=$input.attr('data-name');
		jQuery('input[name='+dataName+'Rule],input[name='+dataName+'ChangeRule]').val("");
		var $inputNormal=jQuery('input[name='+dataName+']');
		$inputNormal.attr('type','password').val('').focus();
		ICBCSafeKeyBoard.moveInputHeight($inputNormal);
		//失去焦点时切换到安全键盘
		$inputNormal.blur(function(){
			$input.val($inputNormal.val()+"");
			$input.show();
			$inputNormal.attr('type','hidden');
			if(ICBCUtilTools.isiPhone()){
				ICBCPageTools.iOSExcuteNativeMethod("Native://hideSystemKeyBoard");
			}else if(ICBCUtilTools.isAndroid){
				prompt("hideSystemKeyBoard","");
			}
		});
	},
	moveInputHeight:function($current){
		try{
			window.setHeaderFix();
		}catch(e){}
		setTimeout(function(){
			var windowsHeight=ICBCSafeKeyBoard.WindowHeight;
			var bodyHeight=jQuery('body').height();
			var offsetTopTmp=$current.offset().top;
			var offsetTop=offsetTopTmp-window.scrollY;
			if(windowsHeight-ICBCSafeKeyBoard.SafeKeyBoardHeight<offsetTop){
				//var moveHeight=offsetTop-(windowsHeight-ICBCSafeKeyBoard.SafeKeyBoardHeight)+50;
				//jQuery('#content').css('top',"-"+moveHeight+"px");
			}
		},300);
	}
};