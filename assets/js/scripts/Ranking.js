/* Constructor */
var Ranking = function (){

};


/* Prototype */
Ranking.prototype = Object.create(Page.prototype);
Ranking.prototype.class = "content-ranking";
Ranking.prototype.url = "ranking.html";

Ranking.prototype.filters = {
	sides: "*",
	skill: "global"
};

Ranking.prototype.setup = function (html)
{
	var that = this;
	this.html = html;

	// Radio behavior
	$(html).find('.radio-group .btn').click(function (e)
	{
		// Prevent event defaut behavior
		e.preventDefault();

		// Set styles
		$(this).parent().find('.btn-selected').removeClass('btn-selected');
		$(this).addClass('btn-selected');

		// Set filters
		if($(this).parent().hasClass('radio-group-sides')){
			that.filters.sides = $(this).attr('data-filter');
		}else{
			that.filters.skill = $(this).attr('data-filter');
		}
		that.reload();
	});

	// Fetch data
	$.ajax({
		type: "POST",
		url: window.location.origin + window.location.pathname + "php/perso.php?action=get-ranking",
		data: {
			side: that.filters.sides,
			skill: that.filters.skill
		},
		dataType: "json",
		success: function (data)
		{
			for(var i=0; i<data.length; i++)
			{
				var photos = JSON.parse(data[i].photos);
				var elem = $('<li class="perso-ranking" data-rank="' + (i+1) + '"><div class="perso-ranking-datas"><span class="perso-ranking-number">' + (i+1) + '</span><img src="mediasdatabase/images/persos/' + photos.full + '" alt="" class="perso-ranking-picture"><span class="perso-ranking-name">' + data[i].name + '</span></div><div class="perso-ranking-progress"><span style="width:' + ((data[i].global/data[0].global)*100) + '%">' + data[i].global + '</span></div></li>');
				$(html).find('.ranking-ranks').append(elem);
			}

			// Show html
			$('.content').replaceWith(html);
		}
	});
}

Ranking.prototype.reload = function ()
{
	var that = this;

	console.log(this.filters);
	// Fetch data
	$.ajax({
		type: "POST",
		url: window.location.origin + window.location.pathname + "php/perso.php?action=get-ranking",
		data: {
			side: that.filters.sides,
			skill: that.filters.skill
		},
		dataType: "json",
		success: function (data)
		{
			// Empty ranking content
			$('.content').find('.ranking-ranks').empty();

			for(var i=0; i<data.length; i++)
			{
				var photos = JSON.parse(data[i].photos);
				var elem = $('<li class="perso-ranking" data-rank="' + (i+1) + '"><div class="perso-ranking-datas"><span class="perso-ranking-number">' + (i+1) + '</span><img src="mediasdatabase/images/persos/' + photos.full + '" alt="" class="perso-ranking-picture"><span class="perso-ranking-name">' + data[i].name + '</span></div><div class="perso-ranking-progress"><span style="width:' + ((data[i][that.filters.skill]/data[0][that.filters.skill])*100) + '%">' + data[i].global + '</span></div></li>');
				$('.content').find('.ranking-ranks').append(elem);
			}
		}
	});
};

Ranking.prototype.transitions = {
	beginning: function ()
	{

	},
	ending: function (){
		$('.content').empty();
	}
}