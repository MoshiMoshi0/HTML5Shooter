/**
 * Created with JetBrains WebStorm.
 * User: _UX31A
 * Date: 15.07.13
 * Time: 14:11
 * To change this template use File | Settings | File Templates.
 */

var Item = Class.create( CollidableEntity, {
    initialize: function( $super, world, x, y, bitmap ){
        $super( world, bitmap );
        this.world = world;
        this.player = world.player;

        this.shape.x = this.x = x;
        this.shape.y = this.y = y;
        this.stage = this.world.stage;

        this.obb.init( x, y, this.shape.rotation, 16, 16 );
        this.aabb.init( x, y, 16, 16 );
        this.categoryFlags = CollisionFlags.ITEM;
        this.maskFlags = CollisionFlags.PLAYER;
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        var scale = Math.sin( this.tickTime * 0.1 ) * 0.2 + 1;
        this.shape.y = this.y += 2;
        this.shape.scaleX = this.shape.scaleY = scale;
        this.shape.rotation = 15 * Math.cos( this.tickTime * 0.05 );
    },

    isAlive: function( $super ){
        return $super() && this.y < this.stage.height + 20;
    },

    onHit: function( e ){
        this.setAlive( false );
    }
});

Item.getRandom = function(){
    return _items[ Math.round( Math.random() * (_items.length - 1) ) ];
};

var BulletSpeedUpgrade = Class.create( Item, {
    initialize: function( $super, world, x, y ){ $super( world, x, y, "images/5-7.png" ); },
    onHit: function( $super, e ){ e.stats.upgradeBulletSpeed(); $super(); }
});

var BulletCountUpgrade = Class.create( Item, {
    initialize: function( $super, world, x, y ){ $super( world, x, y, "images/0-3.png" ); },
    onHit: function( $super, e ){ e.stats.upgradeBulletCount(); $super();  }
});

var BulletFirerateUpgrade = Class.create( Item, {
    initialize: function( $super, world, x, y ){ $super( world, x, y, "images/5-3.png" ); },
    onHit: function( $super, e ){ e.stats.upgradeBulletFirerate(); $super(); }
});

var BulletSpreadUpgrade = Class.create( Item, {
    initialize: function( $super, world, x, y ){ $super( world, x, y, "images/4-2.png" ); },
    onHit: function( $super, e ){ e.stats.upgradeBulletSpread(); $super();  }
});

var HealthUgrade = Class.create( Item, {
    initialize: function( $super, world, x, y ){ $super( world, x, y, "images/4-7.png" ); },
    onHit: function( $super, e ){ e.stats.upgradeHp(); e.hp = e.stats.maxHp; $super(); }
});

var ScoreItem = Class.create( Item, {
    initialize: function( $super, world, x, y ){ $super( world, x, y, "images/7-3.png" ); },
    onHit: function( $super, e ){ e.stats.score += 2500; $super(); }
});

var _items = [ BulletSpeedUpgrade, BulletCountUpgrade, BulletFirerateUpgrade, HealthUgrade, BulletSpreadUpgrade, ScoreItem,ScoreItem,ScoreItem ];