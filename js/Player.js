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
        $super( world, "images/0-2.png", 0 );

        this.stage = this.world.stage;
        this.shape.x = this.x = this.stage.width / 2;
        this.shape.y = this.y = this.stage.height - 50;

        this.categoryFlags = CollisionFlags.PLAYER;
        this.maskFlags = CollisionFlags.ENEMY | CollisionFlags.ENEMYBULLET | CollisionFlags.ITEM;

        this.vx = this.vy = this.ax = this.ay = 0;
        this.keyWPower = this.keyAPower = this.keySPower = this.keyDPower = this.shootTime = 0;
        this.stats = {
            hpUpgrade: 0, hp: 0, maxHp: 0,
            countUpgrade: 0, bulletCount: 0,
            spreadUpgrade: 0, bulletSpread: 0,
            speedUpgrade: 0, bulletSpeed: 0,
            firerateUpgrade: 0, bulletFirerate: 0,
            score: 0,

            init: function(){
                this.upgradeHp();
                this.upgradeBulletCount();
                this.upgradeBulletSpeed();
                this.upgradeBulletSpread();
                this.upgradeBulletFirerate();
            },

            getMaxHpForLevel: function( l ){ return Math.sqrt( l ) * 10; },
            getBulletCountForLevel: function( l ){ return l; },
            getBulletSpeedForLevel: function( l ){ return Math.log( l ) * 2 + 3; },
            getBulletSpreadForLevel: function( l ){ return 10 / l; },
            getBulletFirerateForLevel: function( l ){ return Math.clip( 0.5 - (l - 1) * 0.02, 0.1, 10 ); },

            upgradeHp: function(){ this.hp = this.maxHp = this.getMaxHpForLevel( ++this.hpUpgrade ); },
            upgradeBulletCount: function(){ this.bulletCount = this.getBulletCountForLevel( ++this.countUpgrade ); },
            upgradeBulletSpeed: function(){ this.bulletSpeed = this.getBulletSpeedForLevel( ++this.speedUpgrade ); },
            upgradeBulletSpread: function(){ this.bulletSpread = this.getBulletSpreadForLevel( ++this.spreadUpgrade ); },
            upgradeBulletFirerate: function(){ this.bulletFirerate = this.getBulletFirerateForLevel( ++this.firerateUpgrade ); },

            toString: function(){
                return "HP " + Math.round( this.hp ) + "[" + this.hpUpgrade + "] " +
                    "MHP " + Math.round( this.maxHp ) + "[" + this.hpUpgrade + "] " +
                    "BC " + Math.round( this.bulletCount ) + "[" + this.countUpgrade + "] " +
                    "BS " + Math.round( this.bulletSpeed ) + "[" + this.speedUpgrade + "] " +
                    "SP " + Math.round( this.bulletSpread ) + "[" + this.spreadUpgrade + "] " +
                    "BF " + Math.round( this.bulletFirerate ) + "[" + this.firerateUpgrade + "] " +
                    "SC " + Math.round( this.score ) + " " +
                    "PL " + this.getPowerLevel();
            },

            getPowerLevel: function(){
                var hpPower = this.maxHp / this.getMaxHpForLevel( 1 ) * 2;

                var countPower = this.bulletCount;
                var speedPower = this.bulletSpeed / this.getBulletSpeedForLevel( 1 ) * 5;
                var spreadPower = this.bulletSpread / this.getBulletSpreadForLevel( 1 ) * 3;
                var fireratePower = this.bulletFirerate / this.getBulletFirerateForLevel( 1 ) * 8;

                var bulletPower = (speedPower + spreadPower + fireratePower) / 3 * countPower;

                return hpPower + bulletPower;
            }
        };

        this.stats.init();
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

        if( this.stage.mouseDown && this.shootTime >= this.stats.bulletFirerate ){
            var count = this.stats.bulletCount;
            var halfCount = count / 2;
            var spread = this.stats.bulletSpread / count;
            for( var i = 0; i < count; i++ ){
                var offset =  count == 1 ? 0 : ( 2 * (i / ( count - 1 )) - 1) * halfCount;
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
        this.updateKeyboard( deltaTime );

        this.x = Math.clip( this.x, this.shape.width / 2, this.stage.width - this.shape.width / 2 );
        this.y = Math.clip( this.y, this.shape.height / 2, this.stage.height - this.shape.height / 2 );
        this.ax = this.ay = 0;
    }
});