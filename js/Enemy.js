/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 09.07.13
 * Time: 12:24
 * To change this template use File | Settings | File Templates.
 */

var Enemy = Class.create( DamageableEntity, {
    initialize: function( $super, world, path, tween, bitmap, hp ){
        $super( world, bitmap, hp );

        this.tween = tween;
        this.path = path;

        var point = this.path.getPointOnPath( this.tween.target.value );
        this.shape.x = this.x = point.x - this.shape.width / 2;
        this.shape.y = this.y = point.y - this.shape.height / 2;
    },

    update: function( $super, deltaTime ){
        var point = this.path.getPointOnPath( this.tween.target.value );

        this.shape.x = this.x = point.x - this.shape.width / 2;
        this.shape.y = this.y = point.y - this.shape.height / 2;

        this.tween.tick( deltaTime );
        this.shape.rotation = -Math.atan2( this.world.player.x - this.x, this.world.player.y - this.y ) * 180 / Math.PI - 90;
    },

    destroy: function( $super ){
        this.stage.removeChild( this.shape );
    }
});

var SmallEnemy = Class.create( Enemy, {
    initialize: function( $super, world, path, tween ){
        $super( world, path, tween, "images/6-1.png", 1 );
    }
});

var BigEnemy = Class.create( Enemy, {
    initialize: function( $super, world, path, tween ){
        $super( world, path, tween, "images/0-0.png", 4 );
        this.tickTime = 0;
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        this.tickTime++;
        if( this.tickTime % 10 == 0 ){
            var nx = this.world.player.x - this.x + Math.random();
            var ny = this.world.player.y - this.y + Math.random();
            var len = Math.sqrt( nx*nx + ny*ny );
            nx /= len; ny /= len;

            var bullet = new EnemyBullet( this.world, this.x + nx * this.shape.width / 2, this.y + ny * this.shape.height / 2, nx * 5, ny * 5 );
            this.world.addEntity( bullet );
        }
    }
});