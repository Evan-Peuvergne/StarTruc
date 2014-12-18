/* Constructor */
var Perso = function (id){
	this.id = id;
};


/* Prototype */
Perso.prototype = Object.create(Page.prototype);
Perso.prototype.class = "content-perso";
Perso.prototype.url = "perso.html";

Perso.prototype.data = null;

Perso.prototype.setup = function (html)
{
	var that = this;

	/* Get data */
	$.ajax({
		type: "POST",
		url: window.location.origin + window.location.pathname + "php/perso.php?action=get-one",
		data: {
			id: that.id
		},
		success: function (data)
		{
			/* Data */
			data = data[0];

			/* Fill template */
			html = fillDatas(data, html);

			$.ajax({
				type: "POST",
				url: window.location.origin + window.location.pathname + "php/perso.php?action=get-results",
				data: {
					id: that.id
				},
				success: function (data)
				{
					/* Fill stats section*/
					html = fillStats(data, html);

					/* Show content */
					$('.content').replaceWith(html);
				}
			});

		}
	});
}

Perso.prototype.transitions = {
	beginning: function ()
	{

	},
	ending: function (){
		$('.content').empty();
	}
}


/* Private methods */

// Fill perso

function fillDatas (data, html)
{
	/* Intro */

	$(html).find('.perso-intro h1').html(data.name);
	$(html).find('.perso-intro p').html(data.description);

	/* Identity */

	var identities = JSON.parse(data.identity);
	var code = "";
	for(var i=0; i<identities.length; i++)
	{
		var identity = identities[i];
		code += '<div class="perso-section-col">';
		if(identity.title){ code += '<h3>' + identity.title + '</h3>'; }
		if(identity.sections)
		{
			code += "<p>";
			for(var j=0; j<identity.sections.length; j++){
				var section = identity.sections[j];
				code += "<h4>" + section.title + "</h4><span>" + section.value + "<span>";
			}
			code += "</p>";
		}else{
			if(identity.value){ code += '<p>' + identity.value + '<p>'; }
			if(identity.image){ code += '<img src="mediasdatabase/images/' + identity.image + '"/>';}
		}
		code += "</div>";
	}
	$(html).find('.perso-identity .perso-section-content').html($(code));

	/* Videos */

	var videos = JSON.parse(data.videos);
	var code = "";
	for(var i=0; i<videos.length; i++)
	{
		var video = videos[i];
		code += '<div class="perso-video perso-section-col"><h3>' + video.title + '</h3><div class="perso-video-poster" style="background-image:url(mediasdatabase/images/posters/' + video.poster + ');"><div class="overflow"><a href="#" data-url="mediasdatabase/videos/persos/' + video.source + '" class="btn btn-white">Lire</a></div></div></div>';
	}
	$(html).find('.perso-videos .perso-section-content').html($(code));

	/* Stories */

	var stories = JSON.parse(data.stories);
	var code = "";
	for(var i=0; i<stories.length; i++)
	{
		var story = stories[i];
		code += '<li>' + story + '</li>';
	}
	$(html).find('.perso-stories .perso-section-content ul').html($(code));

	/* Punchline */

	$(html).find('.perso-cult .perso-section-content blockquote').html(data.punchline);	

	return html;
}

// Fill stats
function fillStats (data, html)
{
	console.log(data);
	// Stats
	$(html).find('.perso-skill-global .perso-skill-progress').attr('style', 'height:' + data.main + '%;');
	$(html).find('.perso-skill-fight .perso-skill-progress').attr('style', 'height:' + data.fight + '%;');
	$(html).find('.perso-skill-intellect .perso-skill-progress').attr('style', 'height:' + data.intellect + '%;');
	$(html).find('.perso-skill-strength .perso-skill-progress').attr('style', 'height:' + data.strength + '%;');
	$(html).find('.perso-skill-cool .perso-skill-progress').attr('style', 'height:' + data.charisma + '%;');

	$(html).find('.perso-skill-global .perso-skill-data span').html(parseInt(data.main) + ' %');
	$(html).find('.perso-skill-fight .perso-skill-data span').html(parseInt(data.fight) + ' %');
	$(html).find('.perso-skill-intellect .perso-skill-data span').html(parseInt(data.intellect) + ' %');
	$(html).find('.perso-skill-strength .perso-skill-data span').html(parseInt(data.strength) + ' %');
	$(html).find('.perso-skill-cool .perso-skill-data span').html(parseInt(data.charisma) + ' %');

	return html;
}