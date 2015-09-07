/**
 * 工行基础工具类
 */
function ICBCUtil() {
}
/**
* 检测当前的操作系统是否为Windows
*/
ICBCUtil.isWin = function() {

	var ua = navigator.userAgent;
	if (ua.indexOf('Window')>-1) {
		return true;
	}
	return false;
};
/**
 * 检测当前操作系统是否为Mac
 */
ICBCUtil.isMac = function() {
	var ua = navigator.userAgent;
	if (ua.indexOf('Mac')>-1) {
		return true;
	}
	return false;
};
/**
 * 检测当前操作系统是否为e-life ios
 */
ICBCUtil.isElifeIos = function() {
	var ua = navigator.userAgent;
	if (ua.indexOf('elife_moblie_ios')>-1) {
		return true;
	}
	return false;
};
/**
 * 检测当前操作系统是否为e-life android
 */
ICBCUtil.isElifeAndroid = function() {
	var ua = navigator.userAgent;
	if (ua.indexOf('elife_moblie_android')>-1) {
		return true;
	}
	return false;
};
/**
 * 检测当前浏览器是否为iPhone(Safari)
 */
ICBCUtil.isIPhone = function() {
	var ua = navigator.userAgent;
	if (ua.indexOf('ICBCiPhoneBS')>-1||ua.indexOf('iPhone')>-1) {
		return true;
	}
	return false;
};
ICBCUtil.isRELIphone = function () {
	var ua = navigator.userAgent;
	if (ua.indexOf('ICBCiPhoneBS')>-1) {
		return true;
	}
	return false;
};
// 客户端安卓因为支付问题设置了融e联的标识，再次区分
ICBCUtil.isRELAndroid = function () {
	var ua = navigator.userAgent;
	if (ua.indexOf('ICBCAndroidBS')>-1 && !ua.indexOf('elife_moblie_android') > -1) {
		return true;
	}
	return false;
};
/**
 * 检测当前浏览器是否为IE(WindowsPhone)
 */
ICBCUtil.isWindowsPhone = function() {
	var ua = navigator.userAgent;
	if (ua.indexOf('ICBCWindowsPhoneBS')>-1||ua.indexOf('MSIE')>-1) {
		return true;
	}
	return false;
};
/**
 * 检测当前浏览器是否为Android(Chrome)
 */
ICBCUtil.isAndroid = function() {
	var ua = navigator.userAgent;
	if (ua.indexOf('ICBCAndroidBS')>-1||ua.indexOf('Android')>-1) {
		return true;
	}
	return false;
};
/**
 *返回客户端 
 */
ICBCUtil.returnBack=function(){

	if(ICBCUtil.isIPhone()){
		 this.iOSExcuteNativeMethod('Native://saveConfig=1&key=goBack');
		return false;
	}else if(ICBCUtil.isAndroid()){
		if(ICBCUtil.isSupportAndroidNewInterface()){
			prompt('returnBack');
		}else{
			Native.returnBack();
		}
		return false;
	}else if(ICBCUtil.isWindowsPhone()){
		var result = "{'type':'nativerequest','requestObject':'{\"type\":\"back\"}'}";
		window.external.notify(result);
		return false;
	}
};


/**
 * 是否支持Android新接口
 */
ICBCUtil.isSupportAndroidNewInterface=function(){
	try{
		if(ICBCUtil.isAndroid()){
			var ua = navigator.userAgent;
			if (ua.indexOf('PromptFlag') > -1) {
				return true;
			}
			return false;
		}
	}catch(e){}
	return false;
};

/**
 *  获取客户端版本号
 */
ICBCUtil.getFullVersion=function(){
	var ua = navigator.userAgent;
	ua = ua.split("fullversion");
	ua = ua[1];
	try {
			// 取版本号
			var version = ua.match(new RegExp('\\d\.\\d\.\\d'));
			if (version != undefined) {
				var versionInt = parseInt(version[0].replace(/\./g, ''));
				return versionInt;
			}
	} catch (e) {
	}
	return null;
};

/**
 * 提交订单
 */
ICBCUtil.submitOrder=function(params){
	var interfaceName=params.interfaceName;
	var interfaceVersion=params.interfaceVersion;
	var tranData=params.tranData;
	var merSignMsg=params.merSignMsg;
	var merCert=params.merCert;
	if(ICBCUtil.isAndroid()){
		//调用Native接口提交订单
		try{
			if(ICBCUtil.isSupportAndroidNewInterface()){
				var temp={};
				temp.interfaceName=interfaceName;
				temp.interfaceVersion=interfaceVersion;
				temp.tranData=tranData;
				temp.merSignMsg=merSignMsg;
				temp.merCert=merCert;
				temp.clientType="22";
				prompt('submitOrder',JSON.stringify(params));
			}else{
				PortalRequestService.submitOrder(interfaceName,interfaceVersion,tranData,merSignMsg,merCert,'22');
			}
		}catch(e){}
	}else if(ICBCUtil.isIPhone()){
		try{
			var param="Native://";
			param=ICBCUtil.appendParam(param,"startType","B2C");
			param=ICBCUtil.appendParam(param,"interfaceName",interfaceName);
			param=ICBCUtil.appendParam(param,"interfaceVersion",interfaceVersion);
			param=ICBCUtil.appendParam(param,"tranData",tranData);
			param=ICBCUtil.appendParam(param,"merSignMsg",merSignMsg);
			param=ICBCUtil.appendParam(param,"merCert",merCert);
			param=ICBCUtil.appendParam(param,"clientType","21");
			ICBCUtil.iOSExcuteNativeMethod(param);
			return false;
		}catch(e){}
	}
};


ICBCUtil.appendParam=function(param,name,value){
	return param+=name+"="+value+"&";
};

ICBCUtil.iOSExcuteNativeMethod=function(param){

	var iFrame;
	iFrame=document.createElement("iframe");
	iFrame.setAttribute("src", param);
	iFrame.setAttribute("style", "display:none");
	iFrame.setAttribute("height", "0px");
	iFrame.setAttribute("width", "0px");
	iFrame.setAttribute("frameborder", "0");
	document.body.appendChild(iFrame);
	iFrame.parentNode.removeChild(iFrame);
	iFrame=null;
};
/**
 * 客户端存储数据
 */
ICBCUtil.nativeSaveConfig=function(param){
	try {
		var func = param.func;
		if(func=="privateBankFingancing"){
			if (param.prodId == undefined 
					|| param.funcNo == undefined
					|| param.url == undefined
					||param.prodName == undefined) {
				return;
			}
			param.prodId=encodeURI(param.prodId);
			param.funcNo=encodeURI(param.funcNo);
			param.prodName=encodeURI(param.prodName);
			param.url=encodeURI(param.url);
			if (ICBCUtil.isIPhone()) {
				
				  this.iOSExcuteNativeMethod('Native://InjectToApp=1&inject=financeproduct&ID='+param.prodId+'&FuncNo='+param.funcNo+'&productShName='+param.prodName);
			 } 
			 else if (ICBCUtil.isAndroid()) {
				if(ICBCUtil.isSupportAndroidNewInterface()){
				    prompt('callNativeMethod',"{obj:Native,func:buyProduct,args:['"+param.url+"']}");
				    }else{
					Native.buyProduct(param.url);
				}	
			  }
		}
		else if(func=="licai"){
			 if (param.title == undefined
				 ||param.description == undefined
				 ||param.imageurl == undefined
				 ||param.url == undefined
				 ||param.func == undefined
				 ||param.PRODUCTTERM == undefined
				 ||param.INTENDYIELD == undefined
				 ||param.LOWESTBUYLEVEL == undefined
				 ||param.CURRNAME == undefined) {
					  return;
			 }	
			 param.title=encodeURI(param.title);
			 param.description=encodeURI(param.description);
			 param.imageurl=encodeURI(param.imageurl);
			 param.url=encodeURI(param.url);
			 param.func=encodeURI(param.func);			 
			 param.ProductTerm=encodeURI(param.PRODUCTTERM);
			 param.Intendyield=encodeURI(param.INTENDYIELD);
			 param.LowestBuyLevel=encodeURI(param.LOWESTBUYLEVEL);
			 param.CurrName=encodeURI(param.CURRNAME);
			 if (ICBCUtil.isIPhone()) {
				  this.iOSExcuteNativeMethod('Native://saveConfig=1&func='+param.func+'&title='+param.title+'&description='+param.description+'&imageurl='+param.imageurl+'&ProductTerm='+param.ProductTerm+'&Intendyield='+param.Intendyield+'&LowestBuyLevel='+param.LowestBuyLevel+'&CurrName='+param.CurrName+'&url='+param.url);
			 } 
			 else if (ICBCUtil.isAndroid()) {
				if(ICBCUtil.isSupportAndroidNewInterface()){
				    prompt('callNativeMethod',"{obj:Native,func:saveConfigForFinance,args:['"+param.title+"','"+param.description+"','"+param.imageurl+"','"+param.url+"','"+param.func+"','"+param.ProductTerm+"','"+param.Intendyield+"','"+param.LowestBuyLevel+"','"+param.CurrName+"']}");
				    }else{
					Native.saveConfigForFinance(param.title,param.description,param.imageurl,param.url,param.func,param.ProductTerm,param.Intendyield,param.LowestBuyLevel,param.CurrName);
				}	
			  }

		}
		else if(func=="jijin"){
			 if (param.title == undefined||param.description == undefined||param.imageurl == undefined||param.url == undefined||param.func == undefined||param.fundType == undefined||param.zdrgVal == undefined) {
					  return;
			 }	
			 param.title=encodeURI(param.title);
			 param.description=encodeURI(param.description);
			 param.imageurl=encodeURI(param.imageurl);
			 param.url=encodeURI(param.url);
			 param.func=encodeURI(param.func);
			 param.fundType=encodeURI(param.fundType);
			 param.zdrgVal=encodeURI(param.zdrgVal);
			 var version = ICBCUtil.getFullVersion();
			 if (ICBCUtil.isIPhone()) {
					if (version >= 104) {
				        this.iOSExcuteNativeMethod('Native://saveConfig=1&func='+param.func+'&title='+param.title+'&description='+param.description+'&imageurl='+param.imageurl+'&fundType='+param.fundType+'&zdrgVal='+param.zdrgVal+'&url='+param.url);
					}else{
						this.iOSExcuteNativeMethod('Native://saveConfig=1&func='+param.func+'&title='+param.title+'&description='+param.description+'&imageurl='+param.imageurl+'&url='+param.url);
					}
			 } 
			 else if (ICBCUtil.isAndroid()) {
				 if(ICBCUtil.isSupportAndroidNewInterface()){
					 if (ICBCUtil.getIMChannel()=="C") {
					     if (version >= 105) {
					    	 prompt('callNativeMethod',"{obj:Native,func:saveConfig,args:['"+param.title+"','"+param.description+"','"+param.imageurl+"','"+param.url+"','"+param.func+"','"+param.fundType+"','"+param.zdrgVal+"']}");
					     }else{
					    	 prompt('callNativeMethod',"{obj:Native,func:saveConfig,args:['"+param.title+"','"+param.description+"','"+param.imageurl+"','"+param.url+"','"+param.func+"']}");
					     }
					 }else{
					     if (version >= 104) {
					    	 prompt('callNativeMethod',"{obj:Native,func:saveConfig,args:['"+param.title+"','"+param.description+"','"+param.imageurl+"','"+param.url+"','"+param.func+"','"+param.fundType+"','"+param.zdrgVal+"']}");
					     }else{
					    	 prompt('callNativeMethod',"{obj:Native,func:saveConfig,args:['"+param.title+"','"+param.description+"','"+param.imageurl+"','"+param.url+"','"+param.func+"']}");
					     }
					 }					     
				 }else{
					 Native.saveConfig(param.title,param.description,param.imageurl,param.url,param.func);
				 }	
			  }

		}
		else if(func=="addCustomer" || func=="addManager"){
			if (param.func == undefined||param.mobileNo == undefined||param.status == undefined) {
				  return;
		 }	
		 param.func=encodeURI(param.func);
		 param.mobileNo=encodeURI(param.mobileNo);
		 param.status=encodeURI(param.status);

		 if (ICBCUtil.isIPhone()) {
			 this.iOSExcuteNativeMethod('Native://saveConfig=1&func='+param.func+'&mobileNo='+param.mobileNo+'&status='+param.status);
			 } 
		 else if (ICBCUtil.isAndroid()) {
			 if(ICBCUtil.isSupportAndroidNewInterface()){
		         prompt('callNativeMethod',"{obj:Native,func:saveConfig,args:['"+param.func+"','"+param.mobileNo+"','"+param.status+"']}");
			 }else{
				 Native.saveConfig(param.func,param.mobileNo,param.status);
			 }	
		  }	       
		}
		else if(func=="menu"){
			if (param.func == undefined||param.funcno == undefined) {
				  return;
		 }
		 param.func=encodeURI(param.func);
		 param.funcno=encodeURI(param.funcno);
		 if (ICBCUtil.isIPhone()) {
			 this.iOSExcuteNativeMethod('Native://saveConfig=1&func='+param.func+'&funcno='+param.funcno);
			 } 
		 else if (ICBCUtil.isAndroid()) {
				if(ICBCUtil.isSupportAndroidNewInterface()){
				    prompt('callNativeMethod',"{obj:Native,func:saveConfig,args:['"+param.func+"','"+param.funcno+"']}");
				}else{
					Native.saveConfig(param.func,param.funcno);
				}			
		    }	       
		}
		else if(func=="Ticket"){
			if (param.func == undefined
				||param.URL == undefined
				||param.FuncCode == undefined
				||param.funcno == undefined
				||param.HomePageKW == undefined
				||param.PhoneLoginKW == undefined
				||param.ErrorPageKW == undefined
				||param.CookieKW == undefined) {
				  return;
		 }
		 param.func=encodeURI(param.func);
		 param.URL=encodeURI(param.URL);
		 param.FuncCode=encodeURI(param.FuncCode);
		 param.funcno=encodeURI(param.funcno);
		 param.HomePageKW=encodeURI(param.HomePageKW);
		 param.PhoneLoginKW=encodeURI(param.PhoneLoginKW);
		 param.ErrorPageKW=encodeURI(param.ErrorPageKW);
		 param.CookieKW=encodeURI(param.CookieKW);
		 if (ICBCUtil.isIPhone()) {
			 this.iOSExcuteNativeMethod('Native://saveConfig=1&func='+param.func+'&FuncCode='+param.FuncCode+'&funcno='+param.funcno+'&HomePageKW='+param.HomePageKW+'&PhoneLoginKW='+param.PhoneLoginKW+'&ErrorPageKW='+param.ErrorPageKW+'&CookieKW='+param.CookieKW+'&URL='+param.URL);
		 } 
		 else if (ICBCUtil.isAndroid()) {
			if(ICBCUtil.isSupportAndroidNewInterface()){
				prompt('callNativeMethod',"{obj:Native,func:saveConfigForEMall,args:['"+param.func+"','"+param.URL+"','"+param.FuncCode+"','"+param.funcno+"','"+param.HomePageKW+"','"+param.PhoneLoginKW+"','"+param.ErrorPageKW+"','"+param.CookieKW+"']}");
			}else{
				Native.saveConfigForEMall(param.func,param.URL,param.FuncCode,param.funcno,param.HomePageKW,param.PhoneLoginKW,param.ErrorPageKW,param.CookieKW);
			}	
		  }	       
		}
		else if(func=="funccomm"){
			if (param.func == undefined||param.title == undefined||param.FuncNo == undefined||param.FuncDesc == undefined||param.imageurl == undefined) {
				  return;
		 }
		 param.func=encodeURI(param.func);
		 param.title=encodeURI(param.title);
		 param.FuncNo=encodeURI(param.FuncNo);
		 param.FuncDesc=encodeURI(param.FuncDesc);
		 param.imageurl=encodeURI(param.imageurl);
		 if (ICBCUtil.isIPhone()) {
			 this.iOSExcuteNativeMethod('Native://saveConfig=1&func='+param.func+'&title='+param.title+'&FuncDesc='+param.FuncDesc+'&imageurl='+param.imageurl+'&FuncNo='+param.FuncNo);
			 } 
		 else if (ICBCUtil.isAndroid()) {
			 if(ICBCUtil.isSupportAndroidNewInterface()){
			     prompt('callNativeMethod',"{obj:Native,func:saveConfig,args:['"+param.title+"','"+param.FuncDesc+"','"+param.imageurl+"','"+param.FuncNo+"','"+param.func+"']}");
			 }else{
				 Native.saveConfig(param.title,param.FuncDesc,param.imageurl,param.FuncNo,param.func);
			 }	

		  }	       
		}else if(func=="downloadeap"){
			//新增分支，在影像平台下载文件
			if (param.func == undefined||param.downloadUrl == undefined||param.fileExt == undefined||param.fileName == undefined||param.isOpen == undefined) {
				return;
			}
			param.func=encodeURI(param.func);
			param.downloadUrl=encodeURI(param.downloadUrl);
			param.fileExt=encodeURI(param.fileExt);
			param.fileName=encodeURI(param.fileName);
			param.isOpen=encodeURI(param.isOpen);
			if (ICBCUtil.isIPhone()) {
				this.iOSExcuteNativeMethod('Native://saveConfig=1&func='+param.func+'&fileExt='+param.fileExt+'&fileName='+param.fileName+'&isOpen='+param.isOpen+'&downloadUrl='+param.downloadUrl);
			} 
			else if (ICBCUtil.isAndroid()) {
				//Native.saveConfig(param.downloadUrl,param.fileExt,param.fileName,param.isOpen,param.func);
			}	       
		}else if(func=="wakeUp"){
		//新增分支，给客户端传FUNCNO，唤起应用
		if (param.func == undefined||param.funcno == undefined) {
			return;
		}
		param.func=encodeURI(param.func);
		param.funcno=encodeURI(param.funcno);
		if (ICBCUtil.isIPhone()) {
			this.iOSExcuteNativeMethod('Native://saveConfig=1&func='+param.func+'&funcno='+param.funcno);
		} 
		else if (ICBCUtil.isAndroid()) {
			if(ICBCUtil.isSupportAndroidNewInterface()){
			    prompt('callNativeMethod',"{obj:Native,func:saveConfig,args:['"+param.func+"','"+param.funcno+"']}");
			}else{
				Native.saveConfig(param.func,param.funcno);
			}	
		}	       
	}else if(func=="knowledge"){
		//知识库接口-客户经理
		if (param.func == undefined||param.answer == undefined) {
			return;
		}
		param.func=encodeURI(param.func);
		param.answer=encodeURI(param.answer);
		if (ICBCUtil.isIPhone()) {
			this.iOSExcuteNativeMethod('Native://saveConfig=1&func='+param.func+'&answer='+param.answer);
		} 
		else if (ICBCUtil.isAndroid()) {
			    prompt('callNativeMethod',"{obj:Native,func:saveConfig,args:['"+param.func+"','"+param.answer+"']}");
		}	       
	}else if(func=="forwardIMApp"){
		if (param.func == undefined||param.funcno == undefined) {
			return;
		}
		param.func=encodeURI(param.func);
		param.funcno=encodeURI(param.funcno);
		if (ICBCUtil.isIPhone()) {
			this.iOSExcuteNativeMethod('Native://saveConfig=1&func='+param.func+'&funcno='+param.funcno);
		} 
		else if (ICBCUtil.isAndroid()) {
			if(ICBCUtil.isSupportAndroidNewInterface()){
			    prompt('callNativeMethod',"{obj:Native,func:saveConfig,args:['"+param.func+"','"+param.funcno+"']}");
			}else{
				Native.saveConfig(param.func,param.funcno);
			}	
		}	    
	}else if(func=="openICBCMessageChat"){
		if (param.func == undefined||param.funcno == undefined) {
			return;
		}
		param.func=encodeURI(param.func);
		param.funcno=encodeURI(param.funcno);
		if (ICBCUtil.isIPhone()) {
			this.iOSExcuteNativeMethod('Native://saveConfig=1&func='+param.func+'&funcno='+param.funcno);
		} 
		else if (ICBCUtil.isAndroid()) {
			if(ICBCUtil.isSupportAndroidNewInterface()){
			    prompt('callNativeMethod',"{obj:Native,func:saveConfig,args:['"+param.func+"','"+param.funcno+"']}");
			}else{
				Native.saveConfig(param.func,param.funcno);
			}	
		}	    
	}
	} catch (e) {
	 console.log("Error: " + e);
	}
};
/**
 * 客户端取回数据1
 */
ICBCUtil.nativeGetConfigCallBack=undefined,
ICBCUtil.nativeGetConfig=function(param){
	ICBCUtil.nativeGetConfigCallBack=param.callBack;
	var iframeSrc = 'Native://getConfig=1&key=' + param.key + '&dataString=' + param.dataString + '&callBack=' + ICBCUtil.nativeGetConfigCallBack;

    ICBCUtil.iOSExcuteNativeMethod(iframeSrc);
	  
	// try {
	//  if (param.key == undefined||param.callBack == undefined) {
	//   return;
	//  }
	//  ICBCUtil.nativeGetConfigCallBack=param.callBack;
	//  if (ICBCUtil.isIPhone()) {
	//   ICBCUtil.iOSExcuteNativeMethod('Native://getConfig=1&key='+param.key+'&callBack=ICBCUtil.nativeGetConfigCallBack');
	//  } else if (ICBCUtil.isAndroid()) {
	//   var value=Native.getConfig(param.key); 
	//   ICBCUtil.nativeGetConfigCallBack(value);
	//   }
	// } catch (e) {
	//  console.log("Error: " + e);
	// }
};
/**
 * 判断Im客户端类型 2014.8.29 by MimSer-zhangshuang
 */
ICBCUtil.getIMChannel = function() {
	var ua = navigator.userAgent;
	if (ICBCUtil.isElifeIos() || ICBCUtil.isElifeAndroid()) {
		return '314';
	}
	if (ua.indexOf('view_from_m')>-1) {
		return "M";
	}
	if (ua.indexOf('view_from_c')>-1) {
		return "312";
	}
	return 'AA';
	return false;
};
/**
 * 服务器-客户端通用公共接口 2014 11月正常版启用 by kfzx-zhangshuang
 */
ICBCUtil.DataConfigServiceServerCallBack=undefined,
ICBCUtil.DataConfigServiceServer = function(param){
	try {
		 if (param.key == undefined||param.DataString == undefined||param.callBack == undefined||param.ReturnFlag == undefined) {
		     return;
		 }
		 param.key=encodeURI(param.key);
		 param.DataString=encodeURI(param.DataString);
		 if("1"==param.ReturnFlag){
			 ICBCUtil.DataConfigServiceServerCallBack=param.callBack;
			 if (ICBCUtil.isIPhone()) {
			     ICBCUtil.iOSExcuteNativeMethod('Native://DataConfigServiceServer=1&key='+param.key+'&DataString='+param.DataString+'&callBack=ICBCUtil.DataConfigServiceServerCallBack');
			 }else if (ICBCUtil.isAndroid()) {
//			     var value=prompt('callNativeMethod',"{obj:Native,func:DataConfigServiceServer,args:['"+param.key+"','"+param.DataString+"]}");
//			     ICBCUtil.DataConfigServiceServerCallBack(value);
				 prompt('callNativeMethod',"{obj:Native,func:DataConfigServiceServer,args:['"+param.key+"','"+param.DataString+"','ICBCUtil.DataConfigServiceServerCallBack']}");
			 }
		 }else{
			 if (ICBCUtil.isIPhone()) {
			     ICBCUtil.iOSExcuteNativeMethod('Native://DataConfigServiceServer=1&key='+param.key+'&DataString='+param.DataString);
			 } else if (ICBCUtil.isAndroid()) {
			     prompt('callNativeMethod',"{obj:Native,func:DataConfigServiceServer,args:['"+param.key+"','"+param.DataString+"']}"); 
			 } 
		 }
		} catch (e) {
		 console.log("Error: " + e);
		}
};
/**
 * 获取IMUserId
 */
ICBCUtil.getIMUserIDCallBack=undefined,
ICBCUtil.getIMUserID=function(param){
	if (param.callBack==undefined||typeof param.callBack != 'function') {
		return;
	}
	ICBCUtil.getIMUserIDCallBack=param.callBack;
	if (ICBCUtil.isIPhone()) {
		this.iOSExcuteNativeMethod('Native://getConfig=1&key=getIMUserID&callBack=ICBCUtil.getIMUserIDCallBack');
	}else if (ICBCUtil.isAndroid()) {
		try{
			var jsonDataString=prompt('callNativeMethod',"{obj:Native,func:getIMUserID}");
			var jsonData=eval('('+jsonDataString+')');
			ICBCUtil.getIMUserIDCallBack(jsonData);
		}catch(e){
			console.log(e);
		}
	}
};