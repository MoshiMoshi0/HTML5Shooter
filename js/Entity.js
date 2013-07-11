/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 10.07.13
 * Time: 13:35
 * To change this template use File | Settings | File Templates.
 */

var Entity = Class.create({
    initialize: function( world, bitmap ){
        this.stage = world.stage;
        this.world = world;
        this.alive = true;

        this.shape = new createjs.Bitmap( bitmap );
        this.shape.width = this.shape.image.width;
        this.shape.height = this.shape.image.height;

        this.shape.regX = parseInt( this.shape.width / 2 );
        this.shape.regY = parseInt( this.shape.height / 2 );

        this.stage.addChild( this.shape );
    },

    update: function( deltaTime ){},

    isAlive: function(){
        return this.alive;
    },

    setAlive: function( f ){
        this.alive = f;
    },

    destroy: function(){}
});