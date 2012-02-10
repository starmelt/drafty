window.onload = (function() {
    var WIDTH = 640, HEIGHT = 480, TILE_SIZE = 16, SPEED = TILE_SIZE/4, JUMP_H = SPEED;
    Crafty.init(WIDTH, HEIGHT);
    
    var level01 = {
        "width":38,
        "height":12,
        "layers":[{
            "data":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            "height":12,
            "width":38
        }]
    };
        
    var tileMap = {
        1: "Solid",
        2: "Player",
        3: "Goal"
    };
    
    Crafty.scene("Game", function() {
        Crafty.c("Tile", {
            init: function() {
                this.addComponent("2D, Canvas, Color");
                this.w = TILE_SIZE;
                this.h = TILE_SIZE;
            }
        });
        
        Crafty.c("Solid", {
            init: function() {
                this.addComponent("Tile");
                this.color("111111");
            }
        });
        
        Crafty.c("Goal", {
            init: function() {
                this.addComponent("Tile");
                this.color("dddddd");
            }
        });
        
        Crafty.c("Player", {
            init: function() {
                this.addComponent("Tile, Twoway, Collision, Gravity");
                this.color("00ff00");
                this.twoway(SPEED, JUMP_H);
                this.gravity("Solid");
                this.bind("Moved", function(m) {
                    var collision = this.hit("Solid");
                    if (collision) {
                        console.log(m);
                        console.log(this);
                        console.log(collision);
                        this.x = m.x;
                        //this.y = m.y;
                    }
                });
            }
        });
        var level = level01.layers[0];
        for (var x = 0; x<level.width; x++) {
            for (var y = 0; y < level.height; y += 1) {
                var index = y * level.width + x;
                var current = level.data[index];
                if (current!==0) Crafty.e(tileMap[current]).attr({x: TILE_SIZE * x, y: TILE_SIZE * y});
            }
        }
    });

    Crafty.scene("Game");

});