/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 09.07.13
 * Time: 12:24
 * To change this template use File | Settings | File Templates.
 */

var Enemy = Class.create( DamageableEntity, {
    initialize: function( $super, world, path, tween, bitmap, hp ){
        $super( world, bitmap, hp );

        this.tween = tween;
        this.path = path;

        this.dropRate = 0;
        this.tweenSpeed = 1;
        var point = this.path.getPointOnPath( this.tween.target.value );
        this.shape.x = this.x = point.x;
        this.shape.y = this.y = point.y;
        this.shape.rotation = -90;

        this.obb.init( this.x, this.y, this.shape.rotation, 12, 12 );
        this.categoryFlags = CollisionFlags.ENEMY;
        this.maskFlags = CollisionFlags.PLAYER |CollisionFlags.PLAYERBULLET;

        this.stats = {
            hp: hp, maxHp: hp,
            bulletSpeed: 0,
            bulletFirerate: 0
        };
    },

    isAlive: function( $super ){
        return $super() && this.y <= this.stage.height + 20;
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        var point = this.path.getPointOnPath( this.tween.target.value );

        this.shape.x = this.x = point.x;
        this.shape.y = this.y = point.y;

        this.tween.tick( deltaTime * this.tweenSpeed * 1000 );
        //this.shape.rotation = -Math.atan2( this.world.player.x - this.x, this.world.player.y - this.y ) * 180 / Math.PI - 90;
    },

    destroy: function( $super ){
        if( Math.random() < this.dropRate ){
            var ctor = Item.getRandom();
            var item = new ctor( this.world, this.x, this.y );
            this.world.addEntity( item );
        }
        $super();
    }
});

var SmallEnemy = Class.create( Enemy, {
    initialize: function( $super, world, path, tween ){
        $super( world, path, tween, "images/6-1.png", 1 );

        var power = this.world.player.stats.getPowerLevel();
        this.dropRate = 0.5 - Math.clip( power / 30, 0, 1 ) * 0.4;
    }
});

var BigEnemy = Class.create( Enemy, {
    initialize: function( $super, world, path, tween ){
        $super( world, path, tween, "images/0-0.png", 4 );

        var power = this.world.player.stats.getPowerLevel();
        this.stats.bulletSpeed = Math.clip( (power / 30), 3, 8) * 60;
        this.stats.fireRate = 30 - Math.round( Math.clip( (power - 20) / 8, 0, 20) );
        this.dropRate = 0.3 - Math.clip( power / 300, 0, 1 ) * 0.3;
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        if( this.tickTime % this.stats.fireRate == 0 ){
            var nx = this.world.player.x - this.x + Math.random();
            var ny = this.world.player.y - this.y + Math.random();
            var len = Math.sqrt( nx*nx + ny*ny );
            nx /= len; ny /= len;

            var bullet = new EnemyBullet( this.world, this.x + nx * this.shape.width / 2, this.y + ny * this.shape.height / 2, nx * this.stats.bulletSpeed, ny * this.stats.bulletSpeed, 3 );
            this.world.addEntity( bullet );
        }
    }
});

var SpecialEnemy = Class.create( Enemy, {
    initialize: function( $super, world, path, tween ){
        $super( world, path, tween, "images/0-2.png", 10 );

        var power = this.world.player.stats.getPowerLevel();
        this.stats.bulletSpeed = Math.clip( (power / 40), 2, 5) * 60;
        this.stats.fireRate = 8 - Math.round( Math.clip( power / 80, 0, 2) );
        this.dropRate = 0.8 - Math.clip( power / 300, 0, 1 ) * 0.8;
        this.tweenSpeed = 0.8;
        this.rot = 0;
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        if( this.tickTime % this.stats.fireRate == 0 ){
            var nx = Math.cos( this.rot * Math.PI / 180 );
            var ny = Math.sin( this.rot * Math.PI / 180 );
            this.rot += 10;

            var bullet = new EnemyBullet( this.world, this.x + nx * this.shape.width / 2, this.y + ny * this.shape.height / 2, nx * this.stats.bulletSpeed, ny * this.stats.bulletSpeed, 1 );
            this.world.addEntity( bullet );
        }
    }
});