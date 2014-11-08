
Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

   this.game = game;
   this.player = null;
   this.borders = null;         //stage cage
   this.cursors = null;         //gonna get key input
   this.mob = null;             //mob thinger
   this.bullets = null;

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

Game.prototype = {

    preload: function()
    {
         this.game.load.image('sky', 'assets/sky.png');
         this.game.load.image('borders','assets/border.png');
         this.game.load.image('border_Side', 'assets/border_Side.png');
         this.game.load.spritesheet('player', 'assets/player.png', 48, 48);
         this.game.load.spritesheet('mob', 'assets/mob.png', 94,94);
         this.game.load.image('bullets', 'assets/bullet.png');
    },

    

    create: function () 
    {
        //lets get keyboard input
        this.cursors = this.game.input.keyboard.createCursorKeys();

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

        //PLAYER***************************************************************
        //create the player obj
        this.player = game.add.sprite(48, game.world.height - 150, 'player');
        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 1000;
        this.player.body.maxVelocity.y = 500;
        this.player.body.collideWorldBounds = true;

        //PLAYER BULLETS/PROJECTILES
        this.bullets = game.add.group();
        this.bullets = [];
        

        //MOB*****************************************************************
        this.mob = game.add.sprite(game.world.width-(96*2), game.world.height-(96*2), 'mob');
        this.game.physics.arcade.enable(this.mob);
        this.mob.body.gravity.y = 1000;
        this.mob.body.collideWorldBounds = true;


    },


    update: function () 
    {
       
        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
        //make sure the player will collide with the bounding box
        this.game.physics.arcade.collide(this.player, this.borders);

        //make sure mob will collide with bounding box..maybe if overlap take health from
        this.game.physics.arcade.collide(this.mob, this.borders);

        //and that player and mob can collide
        this.game.physics.arcade.collide(this.player, this.mob);

        //Get player movement
        var pV = 10;                            //velocity of the player, create some slide when we let off the keys
        if(this.cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A))            //if left arrow is down
            this.player.body.velocity.x = -250; //move left
        
        else if(this.cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D))      //if right arrow is down
            this.player.body.velocity.x = 250;  //move right
    
        else                                    //if no key is down
        {
            if(this.player.body.velocity.x >0)
                this.player.body.velocity.x -= pV;    //dont move
            else if(this.player.body.velocity.x < 0)
                this.player.body.velocity.x += pV;
            else
                this.player.body.velocity.x = 0;
        }
        
 
        //  Allow the player to jump if they are touching the ground.
        //  ADDed something like wall jump but not correct walljump, sorta fun tho
        if ((this.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) && (this.player.body.touching.down || this.player.body.touching.left || this.player.body.touching.right))
            this.player.body.velocity.y = -350;

        //PLAYER BULLETS
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            this.fire();

    },

    fire: function() 
    {
        var bullet = this.game.add.sprite(this.player.x, this.player.y -20, 'bullet');
        bullet.anchor.setTo(0.5, 0.5);
        this.game.physics.arcade.enable(bullet);
        bullet.body.velocity.x = 500;
        this.bullets.push(this.bullets);
    }


};
