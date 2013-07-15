/**
 * Created with JetBrains WebStorm.
 * User: _CORE7
 * Date: 11.07.13
 * Time: 20:18
 * To change this template use File | Settings | File Templates.
 */

var DamageableEntity = Class.create( CollidableEntity, {
    initialize: function( $super, world, bitmap, hp ){
        $super( world, bitmap );
        this.hp = hp;
    },

    hit: function( damage ){
        this.hp -= damage;
    },

    isAlive: function( $super ){
        return $super() && this.hp > 0;
    }
});