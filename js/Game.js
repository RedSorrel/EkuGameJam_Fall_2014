
Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

   this.game = game;
   this.player = null;
   this.borders = null;         //stage cage

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

Game.prototype = {

    preload: function()
    {
         this.game.load.image('sky', 'assets/sky.png');
         this.game.load.image('borders','assets/border.png');
         this.game.load.image('border_Side', 'assets/border_Side.png');
    },

    create: function () 
    {

        //create the backdrop, a beautiful sky
        this.game.add.sprite(0, 0, 'sky');

        //Let's create the stage, a bottom, top, leftside and rightside
        this.borders = game.add.group();

        var bottom = this.borders.create(0, this.game.world.height-42, 'borders');

        this.game.physics.arcade.enable(bottom);                //IMPORTANT NEED THIS OR IMMOBVABLE WILL CAUSE THE GAME TO BREAK

        bottom.scale.setTo(2,1);        //scale it to fid the width of the game

        //stop from falling away when you jump on it
        bottom.body.immovable = true;

        var top = this.borders.create(0,0, 'borders');
        this.game.physics.arcade.enable(top);
        top.scale.setTo(2,1);
        top.body.immovable = true;

        var leftSide = this.borders.create(0,0, 'border_Side');
        this.game.physics.arcade.enable(leftSide);
        leftSide.scale.setTo(1,2);
        leftSide.body.immovable = true;

        var rightSide = this.borders.create(this.game.world.width-40,0, 'border_Side');
        this.game.physics.arcade.enable(rightSide);
        rightSide.scale.setTo(2,2);
        rightSide.body.immovable = true;



    },

    update: function () 
    {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    }

};
