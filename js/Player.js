/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 10.07.13
 * Time: 11:10
 * To change this template use File | Settings | File Templates.
 */

var KEY_STEP = 0.05;
var X_ACCEL_STEP = 0.75;
var Y_ACCEL_STEP = 0.75;

var MAX_X_ACCEL = 2;
var MAX_Y_ACCEL = 1;
var MAX_X_SPEED = 1.5;
var MAX_Y_SPEED = 1;

var ACCEL_MUL = 20;
var SPEED_MUL = 100;

var X_ACCEL_PF = 0.5;
var Y_ACCEL_PF = 0.5;
var X_SPEED_PF = 0.9;
var Y_SPEED_PF = 0.9;

var X_ACCEL_NF = 0.9;
var Y_ACCEL_NF = 0.9;
var X_SPEED_NF = 0.8;
var Y_SPEED_NF = 0.8;

var Player = Class.create( Entity, {
    initialize: function( $super, world ){
        $super( world, "images/1-0.png" );

        this.hp = 1;
        this.x = 400;
        this.y = 200;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;

        this.keyWPower = 0;
        this.keyAPower = 0;
        this.keySPower = 0;
        this.keyDPower = 0;

        this.stage = this.world.stage;
    },

    update: function( $super, deltaTime ){
        if( ut.isKeyPressed( ut.KEY_W ) ){ this.keyWPower += KEY_STEP;
        }else{ this.keyWPower = 0; }

        if( ut.isKeyPressed( ut.KEY_S ) ){ this.keySPower += KEY_STEP;
        }else{ this.keySPower = 0; }

        if( ut.isKeyPressed( ut.KEY_A ) ){ this.keyAPower += KEY_STEP;
        }else{ this.keyAPower = 0; }

        if( ut.isKeyPressed( ut.KEY_D ) ){ this.keyDPower += KEY_STEP;
        }else{ this.keyDPower = 0; }

        this.keyWPower = Math.clip( this.keyWPower, 0, 1 );
        this.keySPower = Math.clip( this.keySPower, 0, 1 );
        this.keyAPower = Math.clip( this.keyAPower, 0, 1 );
        this.keyDPower = Math.clip( this.keyDPower, 0, 1 );

        this.ax += this.keyDPower * X_ACCEL_STEP;
        this.ax -= this.keyAPower * X_ACCEL_STEP;
        this.ay -= this.keyWPower * Y_ACCEL_STEP;
        this.ay += this.keySPower * Y_ACCEL_STEP;

        this.ax = Math.clip( this.ax, -MAX_X_ACCEL, MAX_X_ACCEL );
        this.ay = Math.clip( this.ay, -MAX_Y_ACCEL, MAX_Y_ACCEL );

        this.vx += this.ax * deltaTime * ACCEL_MUL;
        this.vy += this.ay * deltaTime * ACCEL_MUL;

        this.ax = Math.clip( this.ax, -MAX_X_SPEED, MAX_X_SPEED );
        this.ay = Math.clip( this.ay, -MAX_Y_SPEED, MAX_Y_SPEED );

        this.x += this.vx * deltaTime * SPEED_MUL;
        this.y += this.vy * deltaTime * SPEED_MUL;

        if( !(ut.isKeyPressed( ut.KEY_A ) || ut.isKeyPressed( ut.KEY_D )) ){
            this.ax *= X_ACCEL_PF; this.vx *= X_SPEED_PF;
        }else{
            this.ax *= X_ACCEL_NF; this.vx *= X_SPEED_NF;
        }

        if( !(ut.isKeyPressed( ut.KEY_W ) || ut.isKeyPressed( ut.KEY_S )) ){
            this.ay *= Y_ACCEL_PF; this.vy *= Y_SPEED_PF;
        }else{
            this.ay *= Y_ACCEL_NF; this.vy *= Y_SPEED_NF;
        }

        this.shape.x = this.x;
        this.shape.y = this.y;

        var al = Math.sqrt( this.ax * this.ax + this.ay * this.ay );
        var vl = Math.sqrt( this.vx * this.vx + this.vy * this.vy );
    },

    isAlive: function( $super ){
        return this.hp > 0;
    },

    destroy: function( $super ){
        this.stage.removeChild( this.shape );
    }
});