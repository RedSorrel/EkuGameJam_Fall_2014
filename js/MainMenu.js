
MainMenu = function (game) {

	this.playButton = null;

};

MainMenu.prototype = {

	preload:function ()
	{
		this.load.image('titlepage', 'assets/titlepage.png');
	},
	create: function () 
	{

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		
	},

	update: function ()
	 {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) 
	{
		this.state.start('Game');

	}

};
