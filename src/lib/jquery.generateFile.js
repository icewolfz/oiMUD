(function($){
	
	// Creating a jQuery plugin:
	
	$.generateFile = function(options){
		
		options = options || {};
		
		if(!options.script || !options.filename || !options.content){
			throw new Error("Please enter all the required config options!");
		}
		
		// Creating a 1 by 1 px invisible iframe:
		$("#exportsettingsframe").remove();
		var iframe = $('<iframe>',{
			width:1,
			height:1,
			frameborder:0,
			id: "exportsettingsframe",
			css:{
				display:'none'
			}
		}).appendTo('body');

		var formHTML = '<form id="exportform" action="'+options.script+'" method="post">'+
			'<input id="filename" type="hidden" name="filename" />'+
			'<input id="content" type="hidden" name="content" />'+
			'</form>';
		
		// Giving IE a chance to build the DOM in
		// the iframe with a short timeout:
		
		setTimeout(function(){		
			var ifr = document.getElementById( "exportsettingsframe" );
			var ifrDoc = ifr.contentDocument || ifr.contentWindow.document;
			var iframe = $("#exportsettingsframe");
			// The body element of the iframe document:

			var body = (iframe.prop('contentDocument') !== undefined) ?
							iframe.prop('contentDocument').body :
							iframe.prop('document').body;	// IE
			
			body = $(body);
			
			// Adding the form to the body:
			body.html(formHTML);

			var theForm = ifrDoc.getElementById( "exportform" );
			ifrDoc.getElementById("filename").value = options.filename;
			ifrDoc.getElementById("content").value = options.content;
			theForm.submit();
			/*
			
			var form = body.find('form');
			
			form.attr('action',options.script);
			form.find('input[name=filename]').val(options.filename);
			form.find('input[name=content]').val(options.content);
			
			// Submitting the form to download.php. This will
			// cause the file download dialog box to appear.
			form.clearQueue();
			form = form[0];
			form.submit();
			*/
		},50);
	};
	
})(jQuery);