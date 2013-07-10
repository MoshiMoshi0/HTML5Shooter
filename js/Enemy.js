/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 09.07.13
 * Time: 12:24
 * To change this template use File | Settings | File Templates.
 */

var Enemy = Class.create( Entity, {
    initialize: function( $super, world, path, tween, bitmap ){
        $super( world, bitmap );

        this.tween = tween;
        this.path = path;
        this.hp = 1;

        this.x = 0;
        this.y = 0;
    },

    update: function( $super, deltaTime ){
        var point = this.path.getPointOnPath( this.tween.target.value );

        this.shape.x = this.x = point.x;
        this.shape.y = this.y = point.y;

        this.tween.tick( deltaTime );
    },

    isAlive: function( $super ){
        return $super() && this.hp > 0;
    },

    destroy: function( $super ){
        this.stage.removeChild( this.shape );
    }
});

var SmallEnemy = Class.create( Enemy, {
    initialize: function( $super, world, path, tween ){
        $super( world, path, tween, "images/6-1.png" );
    }
});

var BigEnemy = Class.create( Enemy, {
    initialize: function( $super, world, path, tween ){
        $super( world, path, tween, "images/0-0.png" );
        this.tickTime = 0;
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        this.tickTime++;
        if( this.tickTime % 10 == 0 ){
            var dx = this.world.player.x - this.x + Math.random();
            var dy = this.world.player.y - this.y + Math.random();
            var len = Math.sqrt( dx * dx + dy * dy );
            var vx = dx / len * 10;
            var vy = dy / len * 10;

            var bullet = new Bullet( this.world, this.x, this.y, vx, vy );
            this.world.addEntity( bullet );
        }
    }
});