/**
 * Created with JetBrains WebStorm.
 * User: _CORE7
 * Date: 11.07.13
 * Time: 16:58
 * To change this template use File | Settings | File Templates.
 */

var Parallax = Class.create({
    initialize: function( world, images, depths){
        this.world = world;
        this.depths = depths;
        this.shapes = [];

        this.stage = world.stage;
        this.cx = this.stage.width / 2;
        this.cy = this.stage.height / 2;
        for( var i = 0; i < images.length; i++){
            this.shapes.push( new createjs.Bitmap( images[i] ) );
        }
    },

    update: function( deltaTime ){
        this.cx += (this.world.player.x - this.stage.width / 2) / 400;
        this.cy -= 1 / 2;

        var ox = 0;
        var oy = 0;

        for( var i = 0; i < this.shapes.length; i++ ){
            var shape = this.shapes[i];

            var dx = shape.image.width;
            var dy = shape.image.height;

            var startX = -Math.mod( this.cx / this.depths[i], dx);
            var startY = -Math.mod( this.cy / this.depths[i], dy);

            var xx = startX;
            var yy = startY;

            var doneX = false;
            var doneY = false;


            while( !doneX && !doneY ){
                do {
                    do{
                        this.stage.context.drawImage( shape.image, ox + xx, oy + yy );

                        yy += dy;
                        doneY = yy >= this.stage.height;
                    }while( !doneY );

                    xx += dx;
                    yy = startY;
                    doneY = doneX = xx >= this.stage.width;
                }while( !doneX );
            }
        }
    }
});