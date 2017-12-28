//set width and height variables for game
var width = 1280;
var height = 920;
//create game object and initialize the canvas
var game = new Phaser.Game(width, height, Phaser.AUTO, null, {preload: preload, create: create, update: update});

//initialize some variables
var player;
var meteor;
var cursors;
var speed = 1000;
var playerAcceleration = 10;
var score = 0;
var scoreText;
var level = 1;

function preload() {
	//set background color of canvas
	game.stage.backgroundColor = '#FFFFFF';

	//load assets
	game.load.image('player', 'asset/blue-square.png');
	game.load.image('meteor', 'asset/meteor.png');
}

function create() {
	//start arcade physics engine
	game.physics.startSystem(Phaser.Physics.ARCADE);

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
	//set the anchors of their sprites to the center
	for (var i in meteor.children) {
		meteor.children[i].anchor.set(0.5);
	}
	//enable physics for the meteor
	game.physics.enable(meteor, Phaser.Physics.ARCADE);

	for (var i in meteor.children) {
        meteor.children[i].body.velocity.setTo (speed * Math.random (), speed * Math.random ());
        meteor.children[i].body.collideWorldBounds = true;
        meteor.children[i].body.bounce.setTo(1,1);
	}
    
	//place score text on the screen
	scoreText = game.add.text(5, 3, score);
}

function update() {
    
    game.physics.arcade.collide(player, meteor);
    game.physics.arcade.collide(meteor);
    

	//move the player up and down based on keyboard arrows
	if (cursors.up.isDown) {
		player.body.velocity.y -= playerAcceleration;
	}
	else if (cursors.down.isDown) {
		player.body.velocity.y += playerAcceleration;
	}


	//move the player right and left based on keyboard arrows
	if (cursors.left.isDown) {
		player.body.velocity.x -= playerAcceleration;
	}
	else if (cursors.right.isDown) {
		player.body.velocity.x += playerAcceleration;
	}

    var totalVelocity = 0;
    for (var i in meteor.children) {
        totalVelocity += Math.abs(meteor.children[i].body.velocity.x) + Math.abs(meteor.children[i].body.velocity.y);
	}
    totalVelocity += Math.abs (player.body.velocity.x) + Math.abs(player.body.velocity.y);
    if (totalVelocity > 250) {  
        scoreText.text = "Try to get speed below 250. Now it is " + Math.round(totalVelocity);
    } else {
        scoreText.text = "YOU WIN! Speed is " + Math.round(totalVelocity);        
    }
}

//eatmeteor function
function eatfood(player, food) {
	//remove the piece of food
	food.kill();
	//update the score
	score = 100;
	scoreText.text = score;
}





