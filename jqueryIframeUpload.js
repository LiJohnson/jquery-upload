//上传文件
;(function($){
	if(!$)return;
	var getId = function(){return "_"+(new Date().getTime())+(Math.random()+"").substring(2);};
	var _style = false&&$.debug?"position:absolute;right:0px;bottom:0px;":"position:absolute;top:-10000px;left:-10000pxpx;opacity:0;.filter:alpha(opacity=0)";
	var createIframe = function(id){
		return _iframe = $("<iframe style='"+_style+"' id='"+id+"' name='"+id+"' src='javascript:;'></iframe>");
	};
	var createForm = function(id , inputFile){
		var _form = $("<form method='POST' enctype='multipart/form-data' id='"+id+"' style='"+_style+";margin-right: 300px;' ><input type=submit /></form>");
		var _tmpInputs = [];
		inputFile.each(function(){
			if(this.type && this.type.toUpperCase() =="FILE" )
				var _this = $(this);
				var _tmp = _this.clone();
				_tmp.attr("disabled",true);
				_tmpInputs.push(_tmp);				
				_this.before(_tmp);
				_form.append(_this);
		});
		_form.tmpInput = _tmpInputs;
		return _form;
	};
	
	/**
	 * @param url 上传文件url
	 * @param callback 	[可选] 上传完成后的回调函数
	 * @param type		[可选] 返回数据类型
	 */
	$.fn.uploadFile = function(url , callback , type ){
		callback = callback||function(){};
		type = type||'json';
		
		var _id = getId();
		var _iframeId = "_iframe"+_id;
		var _formId = "_form"+_id;
		var _iframe = createIframe(_iframeId);
		var _form = createForm(_formId,this);
		
		_form.attr("action",url);
		_form.attr("target",_iframeId); 
		
		$("body").append(_iframe);
		$("body").append(_form);
		_iframe.on("load",function(e){
			var data ={};
			var _body = (_iframe[0].contentWindow&& _iframe[0].contentWindow.document.body )||(_iframe[0].contentDocument&&_iframe[0].contentDocument.body)||{};
			
			data = _body.textContent||_body.innerHTML;
			//data.Xml = _body.XMLDocument;
			if( type == 'json' )try{data =  $.parseJSON(data);}catch (e) {}
			if( type == 'xml' )try{data =  $.parseJSON(data);}catch (e) {}
						
			$.each(_form.tmpInput,function(i,_input){
				_input.before( _form.find("input[name='"+_input.attr("name")+"']") );
				_input.remove();
			});
			
			setTimeout(function(){
				_iframe.remove();
				_form.remove();
			},300);

			callback(data);
		});
		_form.submit();
		
	};
})(window.jQuery);
