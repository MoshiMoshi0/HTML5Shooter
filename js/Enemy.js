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

        this.categoryFlags = CollisionFlags.ENEMY;
        this.maskFlags = CollisionFlags.PLAYER | CollisionFlags.PLAYERBULLET;

        this.tweenSpeed = 1;
        var point = this.path.getPointOnPath( this.tween.target.value );
        this.shape.x = this.x = point.x;
        this.shape.y = this.y = point.y;
    },

    isAlive: function( $super ){
        return $super() && this.y <= this.stage.height + 20;
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        var point = this.path.getPointOnPath( this.tween.target.value );

        this.shape.x = this.x = point.x;
        this.shape.y = this.y = point.y;

        this.tween.tick( deltaTime * this.tweenSpeed * 1000 );
        this.shape.rotation = -Math.atan2( this.world.player.x - this.x, this.world.player.y - this.y ) * 180 / Math.PI - 90;
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
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        if( this.tickTime % 14 == 0 ){
            var nx = this.world.player.x - this.x + Math.random();
            var ny = this.world.player.y - this.y + Math.random();
            var len = Math.sqrt( nx*nx + ny*ny );
            nx /= len; ny /= len;

            var bullet = new EnemyBullet( this.world, this.x + nx * this.shape.width / 2, this.y + ny * this.shape.height / 2, nx * 3, ny * 3, 3 );
            this.world.addEntity( bullet );
        }
    }
});

var SpecialEnemy = Class.create( Enemy, {
    initialize: function( $super, world, path, tween ){
        $super( world, path, tween, "images/0-2.png", 10 );
        this.tweenSpeed = 0.8;
        this.rot = 0;
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        if( this.tickTime % 6 == 0 ){
            var nx = Math.cos( this.rot * Math.PI / 180 );
            var ny = Math.sin( this.rot * Math.PI / 180 );
            this.rot += 10;

            var bullet = new EnemyBullet( this.world, this.x + nx * this.shape.width / 2, this.y + ny * this.shape.height / 2, nx * 2, ny * 2, 1 );
            this.world.addEntity( bullet );
        }
    }
});