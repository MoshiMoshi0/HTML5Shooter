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

var OBB = Class.create({
    x: 0, y: 0,
    ex: 0, ey: 0,
    w: 0, h: 0,
    n0x: 0, n0y: 0, n1x: 0, n1y: 0,
    v0x: 0, v0y: 0, v1x: 0, v1y: 0,
    v2x: 0, v2y: 0, v3x: 0, v3y: 0,

    initialize: function(){},
    init: function( x, y, angle, ex, ey ){
        this.ex = ex; this.ey = ey;
        this.w = 2*ex; this.h = 2*ey;
        this.set( x, y, angle );
    },

    set: function( x, y, angle ){
        this.x = x; this.y = y;

        //if( this.angle == angle ) return;
        this.angle = angle % 360;
        var r0 = this.angle * Math.PI / 180;
        this.n0x = Math.cos( r0 ); this.n0y = Math.sin( r0 );
        this.n1x = -this.n0y; this.n1y = this.n0x;

        this.v0x = x - this.n0x * this.ex - this.n1x * this.ey;
        this.v1x = x + this.n0x * this.ex - this.n1x * this.ey;
        this.v2x = x + this.n0x * this.ex + this.n1x * this.ey;
        this.v3x = x - this.n0x * this.ex + this.n1x * this.ey;

        this.v0y = y - this.n0y * this.ex - this.n1y * this.ey;
        this.v1y = y + this.n0y * this.ex - this.n1y * this.ey;
        this.v2y = y + this.n0y * this.ex + this.n1y * this.ey;
        this.v3y = y - this.n0y * this.ex + this.n1y * this.ey;
    }
});

var AABB = Class.create({
    x: 0, y: 0,
    w: 0, h: 0,
    ex: 0, ey: 0,
    v0x: 0, v0y: 0, v1x: 0, v1y: 0,
    v2x: 0, v2y: 0, v3x: 0, v3y: 0,

    initialize: function(){},
    init: function( x, y, ex, ey ){
        this.set( x, y, ex, ey );
    },

    set: function( x, y, ex, ey ){
        this.x = x; this.y = y;
        this.ex = ex; this.ey = ey;
        this.w = 2*ex; this.h = 2*ey;

        this.v0x = x - this.ex;
        this.v1x = x + this.ex;
        this.v2x = x + this.ex;
        this.v3x = x - this.ex;

        this.v0y = y - this.ey;
        this.v1y = y - this.ey;
        this.v2y = y + this.ey;
        this.v3y = y + this.ey;
    }
});

var CollidableEntity = Class.create( Entity, {
    initialize: function( $super, world, bitmap ){
        $super( world, bitmap );

        this.categoryFlags = CollisionFlags.ALL;
        this.maskFlags = CollisionFlags.ALL;

        this.obb = new OBB();
        this.aabb = new AABB();

        //this.obbs = {};
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        var ox = this.vx * deltaTime * 2;
        var oy = this.vy * deltaTime * 2;

        var ow = Math.abs( ox ) / 2;
        var oh = Math.abs( oy ) / 2;

        this.obb.set( this.x, this.y, this.shape.rotation );
        this.aabb.set( this.x + ox, this.y + oy, this.shape.width / 2 + ow, this.shape.height / 2 + oh );

        /*this.stage.removeChild( this.obbs );
        this.obbs = new createjs.Shape()
        this.obbs.graphics.beginStroke("#000000").moveTo( this.aabb.v0x, this.aabb.v0y).lineTo( this.aabb.v1x, this.aabb.v1y).lineTo(this.aabb.v2x, this.aabb.v2y).lineTo(this.aabb.v3x, this.aabb.v3y).lineTo(this.aabb.v0x, this.aabb.v0y);
        this.stage.addChild( this.obbs );*/
    },

    onHit: function( e ){},

    destroy: function( $super ){
        $super();
        //this.stage.removeChild( this.obbs );
    }
});