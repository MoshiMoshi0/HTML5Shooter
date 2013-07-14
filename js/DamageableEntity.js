/**
 * Created with JetBrains WebStorm.
 * User: _CORE7
 * Date: 11.07.13
 * Time: 20:18
 * To change this template use File | Settings | File Templates.
 */

var CollisionFlags = {};
CollisionFlags.NONE = 0;
CollisionFlags.PLAYER = 1 << 0;
CollisionFlags.ENEMY = 1 << 1;
CollisionFlags.BULLET = 1 << 2;
CollisionFlags.PLAYERBULLET = 1 << 3;
CollisionFlags.ENEMYBULLET = 1 << 4;
CollisionFlags.ALL = 63;

var DamageableEntity = Class.create( Entity, {
    initialize: function( $super, world, bitmap, hp ){
        $super( world, bitmap );
        this.hp = hp;

        this.categoryFlags = CollisionFlags.ALL;
        this.maskFlags = CollisionFlags.ALL;
    },

    hit: function( damage ){
        this.hp -= damage;
    },

    isAlive: function( $super ){
        return $super() && this.hp > 0;
    }
});