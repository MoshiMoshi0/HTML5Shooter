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

var ACCEL_MUL = 80;
var SPEED_MUL = 300;

var DAMPING = 0.40;

var Player = Class.create( DamageableEntity, {
    initialize: function( $super, world ){
        $super( world, "images/1-0.png", 10000 );

        this.stage = this.world.stage;
        this.x = this.stage.width / 2;
        this.y = this.stage.height - 50;

        this.categoryFlags = CollisionFlags.PLAYER;
        this.maskFlags = CollisionFlags.ENEMY | CollisionFlags.ENEMYBULLET | CollisionFlags.ITEM;

        this.vx = this.vy = this.ax = this.ay = 0;
        this.keyWPower = this.keyAPower = this.keySPower = this.keyDPower = this.shootTime = 0;
        this.stats = {
            bulletCount: 2,
            bulletSpread: 2,
            bulletSpeed: 5
        };
    },

    updateKeyboard: function (deltaTime) {
        this.keyWPower = Math.clip( (this.keyWPower + KEY_STEP) * ut.isKeyPressed( ut.KEY_W ), 0, 1);
        this.keyAPower = Math.clip( (this.keyAPower + KEY_STEP) * ut.isKeyPressed( ut.KEY_A ), 0, 1);
        this.keySPower = Math.clip( (this.keySPower + KEY_STEP) * ut.isKeyPressed( ut.KEY_S ), 0, 1);
        this.keyDPower = Math.clip( (this.keyDPower + KEY_STEP) * ut.isKeyPressed( ut.KEY_D ), 0, 1);

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

        this.shape.x = this.x += this.vx * deltaTime * SPEED_MUL;
        this.shape.y = this.y += this.vy * deltaTime * SPEED_MUL;

        if (!(ut.isKeyPressed(ut.KEY_A) || ut.isKeyPressed(ut.KEY_D))) this.vx *= DAMPING;
        if (!(ut.isKeyPressed(ut.KEY_W) || ut.isKeyPressed(ut.KEY_S))) this.vy *= DAMPING;

        if( ut.isKeyPressed( ut.KEY_T ) ) this.stats.bulletCount++;
        if( ut.isKeyPressed( ut.KEY_G ) ) this.stats.bulletCount--;

        if( ut.isKeyPressed( ut.KEY_Y ) ) this.stats.bulletSpread += 0.1;
        if( ut.isKeyPressed( ut.KEY_H ) ) this.stats.bulletSpread -= 0.1;

        if( ut.isKeyPressed( ut.KEY_U ) ) this.stats.bulletSpeed += 0.1;
        if( ut.isKeyPressed( ut.KEY_J ) ) this.stats.bulletSpeed -= 0.1;
    },

    updateMouse: function ( deltaTime ) {
        this.shootTime += deltaTime;
        this.shape.rotation = -Math.atan2(this.stage.mouseX - this.x, this.stage.mouseY - this.y) * 180 / Math.PI + 90;

        if( this.stage.mouseDown && this.shootTime >= 0.2 ){
            var count = this.stats.bulletCount;
            var halfCount = count / 2;
            var spread = this.stats.bulletSpread / count;
            for( var i = 0; i < count; i++ ){
                var t = i / ( count - 1 );
                var offset = (t - 1) * halfCount + t * halfCount;
                var angle = this.shape.rotation + offset * spread;
                var nx = Math.cos( angle * Math.PI / 180 );
                var ny = Math.sin( angle * Math.PI / 180 );

                this.world.addEntity( new PlayerBullet(this.world, this.x + nx * this.shape.width / 2, this.y + ny * this.shape.height / 2, nx * this.stats.bulletSpeed, ny * this.stats.bulletSpeed, 1) );
            }

            this.shootTime = 0;
        }
    },

    update: function( $super, deltaTime ){
        this.updateMouse( deltaTime );
        this.updateKeyboard(deltaTime);

        this.x = Math.clip( this.x, this.shape.width / 2, this.stage.width - this.shape.width / 2 );
        this.y = Math.clip( this.y, this.shape.height / 2, this.stage.height - this.shape.height / 2 );
        this.ax = this.ay = 0;
    }
});