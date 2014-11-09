
GameReFactor = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

   this.game = game;
   this.player = null;
   this.borders = null;         //stage cage
   this.cursors = null;         //gonna get key input
   this.mob = null;             //mob thinger
   this.PLAYER_SLIDE = 10;
   this.PLAYER_VELOCITY_X = 250;
   this.PLAYER_VELOCITY_Y = -350;
   this.PLAYER_GRAVITY_Y = 2000;
   this.PLAYER_MAX_VELOCITY_Y = 350;
   this.jumpCount = 100;
    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

GameReFactor.prototype = {

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
        
        this.setupBackground();
        this.setupStage();
        this.setupPlayer();
        this.setupEnemies();
        this.setupBullets();
        //this.setupExplosions();

        this.cursors = this.game.input.keyboard.createCursorKeys();

    },


    update: function () 
    {
       this.checkCollisions();
       this.moveMob();
       this.processPlayerInput();
       //this.processDelayedEffects();
    },


    fire: function() 
    {

        if(!this.player.alive || this.nextShotAt > this.game.time.now)
            return;
        

        if(this.bulletPool.countDead() === 0)
            return;

        this.nextShotAt = this.game.time.now + this.shotDelay; //make the bullets fire not as quickly

        //Find the first dead bullet in the pool
        var bullet = this.bulletPool.getFirstExists(false);

        //Reset (revive) the sprite and place it in a new location
        bullet.reset(this.player.x, this.player.y - 20);


        //if the player is moving while shooting:
        //Probably change this once i get left and right animation/sprites for the player
        if(this.cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A))            //if left arrow is down
            bullet.body.velocity.x = -500;                                                            //shoot left
        
        else if(this.cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D))      //if right arrow is down
            bullet.body.velocity.x = 500;                                                             //shoot right
        else
            bullet.body.velocity.y = -500;
    
        

    },

    mobHit: function(mob, bullet)       //will be called from overlap, overlap does sprite vs group, not gropu vs sprite
    {
       bullet.kill();

    },

    playerHit: function(player, enemy)
    {
       // player.kill();

    },

    render: function()
    {
       // this.game.debug.body(this.player);
       // this.game.debug.body(this.mob);
       // this.game.debug.body(this.bullets);
    },

    //create() related functions

    setupBackground: function() 
    {
        this.game.add.sprite(0, 0, 'sky');
    },

    setupStage: function()
    {
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

    setupPlayer: function ()
    {
         //create the player obj
        this.player = game.add.sprite(game.world.width/2 -300, game.world.height - 150, 'player');
        this.game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = this.PLAYER_GRAVITY_Y;
        this.player.body.maxVelocity.y = this.PLAYER_MAX_VELOCITY_Y;
        this.player.body.collideWorldBounds = true;
        this.player.anchor.setTo(0.5, 0.5);

    },

    setupEnemies: function ()
    {
        //MOB*****************************************************************
        this.mob = game.add.sprite(game.world.width-(96*2), game.world.height-(96*2), 'mob');
        this.game.physics.arcade.enable(this.mob);
        this.mob.body.gravity.y = 1000;
        this.mob.body.maxVelocity.x = 100;
        this.mob.body.maxVelocity.y = 500;
        this.mob.body.collideWorldBounds = true;
        this.mob.anchor.setTo(0.5, 0.5);


        //hit animation sprites
    },

    setupBullets: function()
    {
        //add empy sprite group into our game
        this.bulletPool = this.game.add.group();

        //Enable physics to the whole sprite group
        this.bulletPool.enableBody = true;
        this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;

        //Add 100 'bullet' sprites in the group
        //By default this uses the first frame of the sprite sheet and 
        //sets the initial state as non-existing (i.e. killed/dead)
        this.bulletPool.createMultiple(100, 'bullets');

        //set anchors for all sprites
        this.bulletPool.setAll('anchor.x', 0.5);
        this.bulletPool.setAll('anchor.y', 0.5);

        //Automatically kill the bullet sprites when they go out of bounds
        this.bulletPool.setAll('outOfBoundsKill', true);
        this.bulletPool.setAll('checkWorldBounds', true);

        this.nextShotAt = 0;
        this.shotDelay = 500;

    },

    //update()-related functions
    checkCollisions: function() 
    {
        this.game.physics.arcade.overlap(this.bulletPool, this.mob, this.mobHit, null, this);
        this.game.physics.arcade.overlap(this.player, this.mob, this.playerHit, null, this);   
        this.game.physics.arcade.collide(this.player, this.borders);
        this.game.physics.arcade.collide(this.mob, this.borders);
    },

    moveMob: function() 
    {
       //this.mob.body.velocity.x -= 10;
      // this.mob.body.bounce.x = 1;
      //this.mob.body.velocity.x -= 10;
      //Follows Player
      if((this.mob.body.x - this.player.body.x > 0))
        this.mob.body.velocity.x -= 10;
      else if((this.mob.body.x - this.player.body.x <0))
        this.mob.body.velocity.x += 10;

        //if the player scales the wall, make the mob jump
        
       
            if(this.jumpCount === 500)
            {
                this.mob.body.velocity.y -= 350;
                
            }
            this.jumpCount--;

            if(this.jumpCount ===0)
                this.jumpCount = 500;



       
           // enemy.play('fly');

    },

    processPlayerInput: function()
    {
        //Get player movement
        
        if(this.cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A))            //if left arrow is down
            this.player.body.velocity.x = -this.PLAYER_VELOCITY_X; //move left
        
        else if(this.cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D))      //if right arrow is down
            this.player.body.velocity.x = this.PLAYER_VELOCITY_X;  //move right
    
        else                                                        //if no key is down
        {
            if(this.player.body.velocity.x >0)                      //dont move
                this.player.body.velocity.x -= this.PLAYER_SLIDE;   //if we have some velocity, slide to a stop 
            else if(this.player.body.velocity.x < 0)
                this.player.body.velocity.x += this.PLAYER_SLIDE;
            else
                this.player.body.velocity.x = 0;
        }
        
 
        //  Allow the player to jump if they are touching the ground.
        //  ADDed something like wall jump but not correct walljump, sorta fun tho
        if ((this.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) && (this.player.body.touching.down || this.player.body.touching.left || this.player.body.touching.right))
            this.player.body.velocity.y = -this.PLAYER_VELOCITY_Y;

        //PLAYER BULLETS
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            this.fire();
 
        //  Allow the player to jump if they are touching the ground.
        //  ADDed something like wall jump but not correct walljump, sorta fun tho
        if ((this.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) && (this.player.body.touching.down || this.player.body.touching.left || this.player.body.touching.right))
            this.player.body.velocity.y = this.PLAYER_VELOCITY_Y;

        //PLAYER BULLETS
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            this.fire();
    }





};
