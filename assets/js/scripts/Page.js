var Page = function Page(){};

Page.prototype = {
	url : "erreur.html",
	class: "",
	html: null,
	load : function (fullpage)
	{
		$('.content').addClass(this.class);
		if(fullpage){ $('body').addClass('fullpage'); }else{ $('body').removeClass('fullpage'); }
		var url = window.location.origin + window.location.pathname + "assets/pages/" + this.url;
		var that = this;
		$('<div class="content ' + that.class + '"></div>').load(url, function (){
			that.html = this;
			that.setup(this);
		});
	},
	setup: function (html)
	{
		
	},
	transitions: {
		beginning: function (){},
		ending: function (url){}
	}
}