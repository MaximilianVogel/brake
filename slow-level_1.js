    //set width and height variables for game
var width = 1000;
var height = 1000;
//create game object and initialize the canvas
var game = new Phaser.Game(width, height, Phaser.AUTO, null, {preload: preload, create: create, update: update});

//initialize some variables
var player;
var meteor;
var block;
var cursors;
var speed = 1000;
var playerAcceleration = 7;
var score = 0;
var scoreText;
var level = 1;
var over = false;
var win = false;

function preload() {
	//set background color of canvas
	game.stage.backgroundColor = '#FFFFFF';

	//load assets
	game.load.image('player', 'asset/character.png');
	game.load.image('meteor', 'asset/blue-square.png');
	game.load.image('block', 'asset/block.png');
    game.load.image('block2', 'asset/block2.png');
    game.load.image('background', 'asset/empty.png');
}

function create() {
	//start arcade physics engine
	game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.image(0, 0, 'background');

	//initialize keyboard arrows for the game controls
	cursors = game.input.keyboard.createCursorKeys();

	//add player sprite
	player = game.add.sprite(width*0.1, height*0.1, 'player');

	//set anchor point to center of the sprite
	player.anchor.set(0.5);
	//enable physics for the player body
	game.physics.enable(player, Phaser.Physics.ARCADE);
	//make the player collide with the bounds of the world
	player.body.collideWorldBounds = true;
    player.body.bounce.setTo(1,1);

	//create a group called meteor and add 4 meteor pieces to the game
	meteor = game.add.group();
	meteor.create(width*0.5, height*0.5, 'meteor');
	meteor.create(width*0.8, height*0.2, 'meteor');
	meteor.create(width*0.2, height*0.8, 'meteor');
	meteor.create(width*0.8, height*0.8, 'meteor');
    //meteor.create(width*0.5, height*0.8, 'meteor');

    game.physics.enable(meteor, Phaser.Physics.ARCADE);

    for (var i in meteor.children) {
		meteor.children[i].anchor.set(0.5);
        meteor.children[i].body.velocity.setTo (speed * Math.random (), speed * Math.random ());
        meteor.children[i].body.collideWorldBounds = true;
        meteor.children[i].body.bounce.setTo(1,1);
	}

    
    block = game.add.group();
    //block2 = game.add.group();
    
    for (var i = 0; i < 20; i++) { 
	    block.create(i*(60), 0, 'block');         // blockreihe oben
	    block.create(i*(60), height-20, 'block');// blockreihe unten
    }
    
    for (var i = 0; i < 20; i++) { 
	    block.create(0, i*(60), 'block2');         // blockreihe links
	    block.create(width - 20, i*(60), 'block2');    // blockreihe rechts
        
    }
    game.physics.enable(block, Phaser.Physics.ARCADE);  
    block.setAll('body.immovable', true);
    //block2.setAll('body.immovable', true);
        
	//place score text on the screen
	scoreText = game.add.text(5, 3, score);
}

function update() {
    
    game.physics.arcade.collide(player, meteor);
    game.physics.arcade.collide(meteor);
    game.physics.arcade.collide(meteor, block,  blockHit);
    game.physics.arcade.collide(player, block,  blockHit);
    //game.physics.arcade.collide(meteor, block2,  blockHit);
    //game.physics.arcade.collide(player, block2,  blockHit);

	//move the player up and down based on keyboard arrows
	if (cursors.up.isDown) {
		player.body.velocity.y -= playerAcceleration;
        player.angle = 0;
        //alert('hi')
	}
	else if (cursors.down.isDown) {
		player.body.velocity.y += playerAcceleration;
        player.angle = 180;
	}


	//move the player right and left based on keyboard arrows
	if (cursors.left.isDown) {
		player.body.velocity.x -= playerAcceleration;
        player.angle = 270;
	}
	else if (cursors.right.isDown) {
		player.body.velocity.x += playerAcceleration;
        player.angle = 90;
	}

    var totalVelocity = 0;
    for (var i in meteor.children) {
        totalVelocity += Math.abs(meteor.children[i].body.velocity.x) + Math.abs(meteor.children[i].body.velocity.y);
	}
    totalVelocity += Math.abs (player.body.velocity.x) + Math.abs(player.body.velocity.y);
    
    if (totalVelocity < 250) {
        win = true;
        meteor.setAll('body.collideWorldBounds', false);
    }

    
    if (! over && ! win) {  
        scoreText.text = "Try to get speed below 250. Now it is " + Math.round(totalVelocity);
    } else if (over) {
        scoreText.text = "Game over!";    
    } else {
        scoreText.text = "YOU WIN! Speed is " + Math.round(totalVelocity);                
    }
    
    
}

function blockHit (destroyingObject, singleBlock) {
	//remove the block
	singleBlock.kill();
    if (block.countLiving() == 0) {
        over = true;
        player.kill ();
        meteor.setAll('body.collideWorldBounds', false);
    }
    
}




