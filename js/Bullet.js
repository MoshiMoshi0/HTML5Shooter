/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 10.07.13
 * Time: 13:31
 * To change this template use File | Settings | File Templates.
 */

var Bullet = Class.create( DamageableEntity, {
    initialize: function( $super, world, x, y, vx, vy, damage, bitmap ){
        $super( world, bitmap, 1 );

        this.shape.x = this.x = x;
        this.shape.y = this.y = y;

        this.shape.rotation = -Math.atan2( vx, vy ) * 180 / Math.PI - 90;

        this.categoryFlags = CollisionFlags.BULLET;
        this.maskFlags = CollisionFlags.ALL;

        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        this.x += this.vx;
        this.y += this.vy;

        this.shape.x = this.x;
        this.shape.y = this.y;
    },

    isAlive: function( $super ){
        return $super() && !(this.x < -20 || this.x >= this.stage.canvas.width + 20 || this.y < -20 || this.y >= this.stage.canvas.height + 20 );
    }
});

var EnemyBullet = Class.create( Bullet, {
    initialize: function( $super, world, x, y, vx, vy, damage ){
        $super( world, x, y, vx, vy, damage, "images/7-0.png" );

        this.categoryFlags |= CollisionFlags.ENEMYBULLET;
        this.maskFlags = CollisionFlags.PLAYER;
    }
});

var PlayerBullet = Class.create( Bullet, {
    initialize: function( $super, world, x, y, vx, vy, damage ){
        $super( world, x, y, vx, vy, damage, "images/7-8.png" );

        this.categoryFlags |= CollisionFlags.PLAYERBULLET;
        this.maskFlags = CollisionFlags.ENEMY;
    }
});