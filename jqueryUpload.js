//上传文件
;(function($){
	if(!$)return;
	
	if( window.FormData && window.XMLHttpRequest && new window.XMLHttpRequest().upload && $("<input type=file>")[0].files ){
		/*********************************************/
		//新时代的文件异步上传
		
		/**
		 * @param url 上传文件url
		 * @param data 		[可选] 提交的数据
		 * @param callback 	[可选] 上传完成后的回调函数
		 * @param progress 	[可选] 进度
		 * @param type		[可选] 返回数据类型
		 */
		$.fn.uploadFile = function(url , data , cb , progress, type){
			if( $.type(data) == 'function' ){
				type = progress;
				progress = cb;
				cb = data;
				data = {};
			}
			if( $.type(progress) != 'function' ){
				var t = type;
				type = progress;
				progress = t;
			}
			if( $.type(progress) != 'function' ){
				progress = function(){};
			}
			
			type = type || 'json';

			var formData = new FormData();
			var xhr = new XMLHttpRequest();
			this.filter(":file").add(this.find(":file")).each(function(){
				formData.append(this.name,this.files[0]);
			});

			$.each(data,function(k,v){
				formData.append(k,v);
			});

			xhr.upload.addEventListener("progress",function(e){
				progress(e.loaded/e.total , e);
			},false);

			xhr.addEventListener("load",function(e){
				if( !cb )return;
				var data = xhr.response;
				if( type == 'json' ){
					try{data = $.parseJSON(data);}catch (e) {}
				}else if( type == 'xml' ){
					try{data = $.parseXML(data);}catch (e) {}
				}else if( type == 'html' ){
					try{data = $.parseHTML(data);}catch (e) {}
				}
				cb(data,e);
			},false);
			
			xhr.addEventListener("error",function(e){},false);			
			xhr.open("POST", url);  
	        xhr.send(formData);
	        return this;
		};
		
		return;
	}
	
	/*********************************************/
	//古代的伪异步上传
	var getId = function(){return "_"+(new Date().getTime())+(Math.random()+"").substring(2);};
	var _style = "position:absolute;top:-10000px;left:-10000pxpx;opacity:0;.filter:alpha(opacity=0)";
	var createIframe = function(id){
		return $frame = $("<iframe style='"+_style+"' id='"+id+"' name='"+id+"' src='javascript:;'></iframe>");
	};
	var createForm = function(id , $inputFile , data){
		var $form = $("<form method='POST' enctype='multipart/form-data' id='"+id+"' style='"+_style+";margin-right: 300px;' ><input type=submit /></form>");
	
		$inputFile.each(function(){
			var $this = $(this);
			 $this.before($this.data("clone"));
			 $form.append($this);
		});
		$.each(data||{},function(k,v){
			$form.append($("<input type=hidden >").attr({name:k,value:v}));
		});
		
		return $form;
	};
	
	/**
	 * @param url 上传文件url
	 * @param data 		[可选] 提交的数据
	 * @param callback 	[可选] 上传完成后的回调函数
	 * @param progress 	[可选] 伪进度
	 * @param type		[可选] 返回数据类型
	 */
	$.fn.uploadFile = function(url , data , callback , progress, type){
		if( $.type(data) == 'function' ){
			type = progress;
			progress = callback;
			callback = data;
			data = {};
		}
		if( $.type(progress) != 'function' ){
			var t = type;
			type = progress;
			progress = t;
		}
		if( $.type(progress) != 'function' ){
			progress = function(){};
		}
		
		callback = callback||function(){};
		type = type||'json';
		
		var $files = this.filter(":file").each(function(){
			var $this = $(this);
			var $clone = $this.clone().attr("disabled",true);
			$clone.data("this",$this);
			$this.data("clone",$clone);
		});
		
		var id = getId();
		var iframeId = "_iframe"+id;
		var formId = "_form"+id;
		var $iframe = createIframe(iframeId);
		var $form = createForm(formId, $files , data);
		var timeId = 0;
		$form.attr({action:url,target:iframeId});
		
		$("body").append($iframe);
		$("body").append($form);
		
		$iframe.on("load",function(e){
			var data = $(this).contents().find('body').html();
			
			if( type == 'json' )try{data =  $.parseJSON(data);}catch (e) {}
			if( type == 'xml' )try{data =  $.parseXML(data);}catch (e) {}
			
			$files.each(function(){
				var $this = $(this);
				$this.data("clone").before($this);
				$this.data("clone").remove();
			});
			
			setTimeout(function(){
				$iframe.remove();
				$form.remove();
			},300);
			
			clearInterval(timeId);
			progress(1);
			callback(data);
		});
		
		//伪进度
		var per = 0;
		timeId = setInterval(function(){
			per += Math.random()*0.05;
			per < 1 ? progress(per) : clearInterval(timeId);
		}, 90);
		
		$form.submit();		
	};
})(window.jQuery);
