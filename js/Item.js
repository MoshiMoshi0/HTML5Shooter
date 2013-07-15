/**
 * Created with JetBrains WebStorm.
 * User: _UX31A
 * Date: 15.07.13
 * Time: 14:11
 * To change this template use File | Settings | File Templates.
 */

var Item = Class.create( CollidableEntity, {
    initialize: function( $super, world, player, x, y, bitmap ){
        $super( world, bitmap );
        this.world = world;
        this.player = player;

        this.shape.x = this.x = x;
        this.shape.y = this.y = y;
        this.stage = this.world.stage;
        this.categoryFlags = CollisionFlags.ITEM;
        this.maskFlags = CollisionFlags.PLAYER;
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        this.shape.y = this.y += 2;
    },

    isAlive: function( $super ){
        return $super() && this.y < this.stage.height + 20;
    }
});

var SpeedUpgrade = Class.create( Item, {
    onHit: function( e ){
        e.stats.bulletSpeed+=10;
        this.setAlive( false );
    }
});