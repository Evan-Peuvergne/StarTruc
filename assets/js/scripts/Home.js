/* Constructor */
var Home = function (){

};


/* Prototype */
Home.prototype = Object.create(Page.prototype);
Home.prototype.class = "content-home";
Home.prototype.url = "home.html";

Home.prototype.setup = function (html)
{
	// Set events
	var that = this;
	$(html).find('#btn-start-experience').click(function (e){
		that.transitions.ending();
	});

	// Show html
	$('.content').replaceWith(html);
}

Home.prototype.transitions = {
	beginning: function ()
	{

	},
	ending: function (){
		$('.content').empty();
	}
}