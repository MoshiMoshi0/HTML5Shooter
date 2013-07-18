/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 10.07.13
 * Time: 13:31
 * To change this template use File | Settings | File Templates.
 */

var Bullet = Class.create( CollidableEntity, {
    initialize: function( $super, world, x, y, vx, vy, damage, bitmap ){
        $super( world, bitmap );

        this.shape.x = this.x = x;
        this.shape.y = this.y = y;

        //this.shape.rotation = -Math.atan2( vx, vy ) * 180 / Math.PI - 90;

        this.categoryFlags = CollisionFlags.BULLET;
        this.maskFlags = CollisionFlags.ALL;

        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
    },

    update: function( $super, deltaTime ){
        $super( deltaTime );

        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;

        this.shape.x = this.x;
        this.shape.y = this.y;
    },

    isAlive: function( $super ){
        return $super() && !(this.x < -20 || this.x >= this.stage.canvas.width + 20 || this.y < -20 || this.y >= this.stage.canvas.height + 20 );
    },

    onKill: function( e ){}
});

var EnemyBullet = Class.create( Bullet, {
    initialize: function( $super, world, x, y, vx, vy, damage ){
        $super( world, x, y, vx, vy, damage, "images/7-0.png" );

        this.categoryFlags |= CollisionFlags.ENEMYBULLET;
        this.maskFlags = CollisionFlags.PLAYER;
    }
});

var PlayerBullet = Class.create( Bullet, {
    initialize: function( $super, world, x, y, vx, vy, damage ){
        $super( world, x, y, vx, vy, damage, "images/7-8.png" );

        this.categoryFlags |= CollisionFlags.PLAYERBULLET;
        this.maskFlags = CollisionFlags.ENEMY;
        this.player = this.world.player;
    },

    onHit: function( e ){
        if( e instanceof SmallEnemy ) this.player.stats.score += 1;
        else if( e instanceof BigEnemy ) this.player.stats.score += 2;
        else if( e instanceof SpecialEnemy ) this.player.stats.score += 3;
    },

    onKill: function( e ){
        if( e instanceof SmallEnemy ) this.player.stats.score += 10;
        else if( e instanceof BigEnemy ) this.player.stats.score += 200;
        else if( e instanceof SpecialEnemy ) this.player.stats.score += 1000;
    }
});

var GuidedBullet = Class.create( Bullet, {
    initialize: function( $super, world, x, y, target ){
        var tvx = Math.cos( Math.random() * 2 * Math.PI ) * 13;
        var tvy = Math.sin( Math.random() * 2 * Math.PI ) * 13;

        $super( world, x, y, tvx, tvy, 1, "images/7-8.png" );
        this.categoryFlags |= CollisionFlags.PLAYERBULLET;
        this.maskFlags = CollisionFlags.ENEMY;
        this.target = target;
    },

    update: function( $super, deltaTime){
        $super( deltaTime );

        if( this.target != null && this.target.isAlive() ){
            var ax = this.target.x - this.x;
            var ay = this.target.y - this.y;
            var len = Math.sqrt( ax*ax + ay+ay );
            ax *= 6 / len; ay *= 6 / len;

            this.vx += ax;
            this.vy += ay;
        }

        len = Math.sqrt( this.vx*this.vx + this.vy*this.vy );
        this.vx *= 13 * 60 / len;
        this.vy *= 13 * 60 / len;
    },

    isAlive: function( $super ){
        return $super() && this.target.isAlive();
    }
});