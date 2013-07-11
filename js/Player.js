/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 10.07.13
 * Time: 11:10
 * To change this template use File | Settings | File Templates.
 */

var KEY_STEP = 0.15;
var X_ACCEL_STEP = 0.75;
var Y_ACCEL_STEP = 0.75;

var MAX_X_ACCEL = 2;
var MAX_Y_ACCEL = 1;
var MAX_X_SPEED = 1.5;
var MAX_Y_SPEED = 1;

var ACCEL_MUL = 20;
var SPEED_MUL = 200;

var FRICTION_P = 0.98;
var FRICTION_R = 0.92;

var Player = Class.create( DamageableEntity, {
    initialize: function( $super, world ){
        $super( world, "images/1-0.png", 10 );

        this.stage = this.world.stage;
        this.x = this.stage.width / 2;
        this.y = this.stage.height - 50;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;

        this.keyWPower = 0;
        this.keyAPower = 0;
        this.keySPower = 0;
        this.keyDPower = 0;
        this.shootTime = 0;

        this.shape.rotation = -90;

        this.stage.canvas.addEventListener( "mousedown", function( e ){
            var rect = canvas.getBoundingClientRect();
            var vx = (e.x - rect.left - this.x) / 10;
            var vy = (e.y - rect.top - this.y) / 10;

        }, false );
    },

    updateKeyboard: function (deltaTime) {
        if (ut.isKeyPressed(ut.KEY_W)) {
            this.keyWPower += KEY_STEP;
        } else {
            this.keyWPower = 0;
        }

        if (ut.isKeyPressed(ut.KEY_S)) {
            this.keySPower += KEY_STEP;
        } else {
            this.keySPower = 0;
        }

        if (ut.isKeyPressed(ut.KEY_A)) {
            this.keyAPower += KEY_STEP;
        } else {
            this.keyAPower = 0;
        }

        if (ut.isKeyPressed(ut.KEY_D)) {
            this.keyDPower += KEY_STEP;
        } else {
            this.keyDPower = 0;
        }

        this.keyWPower = Math.clip(this.keyWPower, 0, 1);
        this.keySPower = Math.clip(this.keySPower, 0, 1);
        this.keyAPower = Math.clip(this.keyAPower, 0, 1);
        this.keyDPower = Math.clip(this.keyDPower, 0, 1);

        this.ax += this.keyDPower * X_ACCEL_STEP;
        this.ax -= this.keyAPower * X_ACCEL_STEP;
        this.ay -= this.keyWPower * Y_ACCEL_STEP;
        this.ay += this.keySPower * Y_ACCEL_STEP;

        this.ax = Math.clip(this.ax, -MAX_X_ACCEL, MAX_X_ACCEL);
        this.ay = Math.clip(this.ay, -MAX_Y_ACCEL, MAX_Y_ACCEL);

        this.vx += this.ax * deltaTime * ACCEL_MUL;
        this.vy += this.ay * deltaTime * ACCEL_MUL;
        this.vx = Math.clip(this.vx, -MAX_X_SPEED, MAX_X_SPEED);
        this.vy = Math.clip(this.vy, -MAX_Y_SPEED, MAX_Y_SPEED);

        this.x += this.vx * deltaTime * SPEED_MUL;
        this.y += this.vy * deltaTime * SPEED_MUL;

        if (!(ut.isKeyPressed(ut.KEY_A) || ut.isKeyPressed(ut.KEY_D))) {
            this.ax *= FRICTION_R;
            this.vx *= FRICTION_R;
        } else {
            this.ax *= FRICTION_P;
            this.vx *= FRICTION_P;
        }

        if (!(ut.isKeyPressed(ut.KEY_W) || ut.isKeyPressed(ut.KEY_S))) {
            this.ay *= FRICTION_R;
            this.vy *= FRICTION_R;
        } else {
            this.ay *= FRICTION_P;
            this.vy *= FRICTION_P;
        }
    },

    updateMouse: function ( deltaTime ) {
        this.shootTime += deltaTime;
        this.shape.rotation = -Math.atan2(this.stage.mouseX - this.x, this.stage.mouseY - this.y) * 180 / Math.PI + 90;

        if( this.stage.mouseDown && this.shootTime >= 0.2 ){
            var nx = this.stage.mouseX - this.x;
            var ny = this.stage.mouseY - this.y;
            var len = Math.sqrt( nx*nx + ny*ny );
            nx /= len; ny /= len;

            var bullet = new PlayerBullet(this.world, this.x + nx * this.shape.width / 2, this.y + ny * this.shape.height / 2, nx * 5, ny * 5, 1);
            this.world.addEntity(bullet);
            this.shootTime = 0;
        }
    },

    update: function( $super, deltaTime ){
        this.updateMouse( deltaTime );
        this.updateKeyboard(deltaTime);

        if( this.x < this.shape.width / 2 ){
            this.x = this.shape.width / 2;
        }
        if( this.x >= this.stage.width - this.shape.width / 2 ){
            this.x = this.stage.width - this.shape.width / 2;
        }

        if( this.y < this.shape.height / 2 ){
            this.y = this.shape.height / 2;
        }
        if( this.y >= this.stage.height - this.shape.height / 2 ){
            this.y = this.stage.height - this.shape.height / 2;
        }

        this.shape.x = this.x;
        this.shape.y = this.y;
        this.ax = this.ay = 0;
    },

    destroy: function( $super ){
        this.stage.removeChild( this.shape );
    }
});