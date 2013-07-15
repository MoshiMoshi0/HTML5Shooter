/**
 * Created with JetBrains WebStorm.
 * User: _UX31A
 * Date: 15.07.13
 * Time: 14:16
 * To change this template use File | Settings | File Templates.
 */

var _flagsCount = -1;
var CollisionFlags = {
    NONE: 0,

    ENTITY: 1 << ++_flagsCount,
    PLAYER: 1 << ++_flagsCount,
    ENEMY: 1 << ++_flagsCount,

    BULLET: 1 << ++_flagsCount,
    PLAYERBULLET: 1 << ++_flagsCount,
    ENEMYBULLET: 1 << ++_flagsCount,

    ITEM: 1 << ++_flagsCount,
    ALL: (1 << ++_flagsCount) - 1
};

var CollidableEntity = Class.create( Entity, {
    initialize: function( $super, world, bitmap ){
        $super( world, bitmap );

        this.categoryFlags = CollisionFlags.ALL;
        this.maskFlags = CollisionFlags.ALL;
    },

    onHit: function( e ){}
});