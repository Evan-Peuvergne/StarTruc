/* Constructor */
var Persos = function (){

};


/* Prototype */
Persos.prototype = Object.create(Page.prototype);
Persos.prototype.class = "content-persos";
Persos.prototype.url = "persos.html";

Persos.prototype.slider = {
	current: 0,
	count: null
};

Persos.prototype.setup = function (html)
{	
	var that = this;

	// Get characters
	$.ajax({
		type: "GET",
		url: window.location.origin + window.location.pathname + "php/perso.php?action=get-all-names",
		dataType: 'json',
		success: function (data)
		{
			// Create slides

				// Slides container size
				var width = $(document).width()*0.7;
				that.slider.count = data.length;
				$(html).find('.perso-slides-container').width(width*data.length);
				
				// Slides
				var code = "";
				for(var i=0; i<data.length; i++)
				{
					var photos = JSON.parse(data[i].photos);
					code += '<li class="persos-slide" style="width:' + width + 'px"><div class="perso-slide-image" style="background-image:url(mediasdatabase/images/persos/' + photos.full + ')"></div><div class="perso-slide-content"><div class="perso-slide-fade"></div><h3>' + data[i].name + '</h3><p>' + data[i].description + '</p><a href="#personnage/' + data[i].id + '" class="btn btn-black">Découvrir</a></div></li>';
				}
				$(html).find('.perso-slides-container').html($(code));

				// Event for controls
				$(html).find('.control-previous').click(function (e)
				{
					e.preventDefault();
					if(that.slider.current > 0){
						that.slider.current--;
						$(html).find('.perso-slides-container')[0].style.transform = 'translateX(' + ( - (that.slider.current*width)) + 'px)';
					}	
				});
				$(html).find('.control-next').click(function (e)
				{
					e.preventDefault();
					if(that.slider.current < that.slider.count - 1){
						that.slider.current++;
						$(html).find('.perso-slides-container')[0].style.transform = 'translateX(' + ( - (that.slider.current*width)) + 'px)';
					}
				});

			// Show html
			$('.content').replaceWith(html);
		}
	});
}

Persos.prototype.transitions = {
	beginning: function ()
	{

	},
	ending: function (){
		$('.content').empty();
	}
}