/* Constructor */
var Battle = function (){

};


/* Prototype */
Battle.prototype = Object.create(Page.prototype);
Battle.prototype.class = "content-battle";
Battle.prototype.url = "battle.html";

Battle.prototype.persos = new Array(0);

Battle.prototype.setup = function (html)
{
	var that = this;

	// Ajax call for loading characters
	$.ajax({
		type: "GET",
		url: window.location.origin + window.location.pathname + "php/perso.php?action=get-all-names",
		success: function (data)
		{
			// Fill content
			var code = "";
			for(var i=0; i<data.length; i++)
			{
				var photos = JSON.parse(data[i].photos);
				code += '<li data-id="' + data[i].id + '" data-photo="' + photos.full + '"><a href="#">' + data[i].name + '</a></li>';
			}
			$(html).find('.dropdown-persos ul').html($(code));
			
			// Set events

				// Dropdowns
				$(html).find('.dropdown-persos li').click(function (e)
				{
					e.preventDefault();

					// Manage character
						// Get perso and save it
						var index = parseInt($(this).parent().parent().attr('data-perso'));
						that.persos[index-1] = {
							id: $(this).attr('data-id'),
							image: $(this).attr('data-photo'),
							winner: false
						};
						// Change profil picture
						var url = $(this).attr('data-photo');
						$(html).find('.battle-header-perso:nth-child(' + index + ') img').attr('src', 'mediasdatabase/images/persos/' + url);

					// Close dropdown
					$(this).parent().parent().removeClass('active');

					// Button state
					if(that.persos.length >= 2){
						$(html).find('.btn-launch-battle').removeClass('btn-disabled');
					}
				});

				// Launch battle
				$(html).find('.btn-launch-battle').click(function (e)
				{
					e.preventDefault();
					$(html).find('.battle-full-container').addClass('step2');
				});

				// Valid results
				$(html).find('.btn-validate-results').click(function (e)
				{
					e.preventDefault();

					// Get results of battle
					var results = {
						fight: $(html).find('.battle-slider-fight').attr('data-result').split('/'),
						intellect: $(html).find('.battle-slider-intellect').attr('data-result').split('/'),
						strength: $(html).find('.battle-slider-strength').attr('data-result').split('/'),
						charisma: $(html).find('.battle-slider-charisma').attr('data-result').split('/')
					};
					results.global = new Array();
					for(var i=0; i<2; i++){
						results.fight[i] = parseInt(results.fight[i]);
						results.intellect[i] = parseInt(results.intellect[i]);
						results.strength[i] = parseInt(results.strength[i]);
						results.charisma[i] = parseInt(results.charisma[i]);
						results.global[i] = (results.fight[i] + results.intellect[i] + results.strength[i] + results.charisma[i])/4;
					}

					// Get winner
					if(results.global[0] > results.global[1]){
						that.persos[0].winner = true;
						$(html).find('.battle-result-p1').addClass('battle-result-victory').find('h3').html('Victoire').parent().find('span').html(results.global[0] + " pts");
						$(html).find('.battle-result-p2').addClass('battle-result-defeat').find('h3').html('Défaite').parent().find('span').html(results.global[1] + " pts");
					}else{
						that.persos[1].winner = true; 
						$(html).find('.battle-result-p1').addClass('battle-result-defeat').find('h3').html('Défaite').parent().find('span').html(results.global[0] + " pts");
						$(html).find('.battle-result-p2').addClass('battle-result-victory').find('h3').html('Victoire').parent().find('span').html(results.global[1] + " pts");
					}

					// Set images
					$('.battle-result-p1 .battle-result-background').css({
						"background-image" : "url(mediasdatabase/images/persos/" + that.persos[0].image + ")"
					});
					$('.battle-result-p2 .battle-result-background').css({
						"background-image" : "url(mediasdatabase/images/persos/" + that.persos[1].image + ")"
					});
					
					// Go to next step
					$(html).find('.battle-full-container').addClass('step3');

					// Post results
					$.ajax({
						type: "POST",
						url: window.location.origin + window.location.pathname + "php/perso.php?action=set-battle-result", 
						data: {
							id1: that.persos[0].id,
							id2: that.persos[1].id,
							results: results
						},
						dataType: "json",
						success: function (data)
						{
							$(html).find('.battle-result-controls .btn-disabled').removeClass('btn-disabled');
						}
					});
				});

			// Show html
			$('.content').replaceWith(html);

			// Set heights
			$('.battle-full-container').css({ height: ($(window).height() - $('nav').height())*3});
			$('.battle-full-section, .content').css({ height: $(window).height() - $('nav').height() - 10});
			$('.content').css({ height: $(window).height() - $('nav').height() - 10});
		}
	});
}

Battle.prototype.transitions = {
	beginning: function ()
	{

	},
	ending: function (){
		$('.content').empty();
	}
}