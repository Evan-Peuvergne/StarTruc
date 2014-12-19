/* Ready to start ! */

$(document).ready(function ()
{

	var app = new App();
	app.init();

	window.onhashchange = function (){ app.routing(); }

	app.routing();
	$('a.nav-menu-icon').click(function (e){
        e.preventDefault();
        if($(this).parent().hasClass('active')){
            $(this).parent().removeClass('active');
        }else{
            $(this).parent().addClass('active');   
        }
    });

});


var app;

/* APP */


function App (){


	/* Properties */

		/* DOM */

		this.content = document;


		/* State */

		this.page = null;
		this.loading = false;


	/* Methods */

		/* Initialisation */

		this.init = function ()
		{
			
		};


		this.routing = function ()
		{
			var route = window.location.hash.substr(1, window.location.hash.length).split('/')[0];
			switch(route)
			{
				case "personnages":
					console.log('affichage des personnages');
				break;
				case "personnage":
					// Get perso id
					var id = window.location.hash.substr(1, window.location.hash.length).split('/')[1];
					if(!id){
						alert('vous allez rencontrer une erreur');
					}else{
						this.page = new Perso(id);
						this.page.load();	
					}
				break;
				case "battle":
					this.page = new Battle();
					this.page.load();
				break;
				default:
					this.page = new Home();
					this.page.load(true);
				break;
			}
		}



		

}


