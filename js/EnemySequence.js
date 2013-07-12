/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 09.07.13
 * Time: 13:05
 * To change this template use File | Settings | File Templates.
 */

var EnemySequence = Class.create({
    initialize: function( world, path, tweenInfo, count, delay, types ){
        this.world = world;
        this.path = path;
        this.tweenInfo = tweenInfo;
        this.count = count;
        this.delay = delay;
        this.types = types;

        this.enemies = [];
        this.stage = this.world.stage;
        this.canRelease = true;
        this.time = 0;
    },

    update: function( deltaTime ){
        if( this.count <= 0 ) return;

        if( !this.canRelease ){
            this.time += deltaTime * 1000;

            if( this.time >= this.delay ){
                this.canRelease = true;
            }
        }
        if( this.canRelease ){
            this.releaseEnemy();
            this.canRelease = false;
            this.time = 0;
        }
    },

    finished: function(){
        var allDone = true;
        var allDead = true;

        for( var i = 0; i < this.enemies.length; i++ ){
            var enemy = this.enemies[i];
            if( enemy.isAlive() ){
                allDead = false;
            }

            if( this.count != 0 || enemy.tween.target.value < 1 ){
                allDone = false;
            }

            if( !allDone && !allDead ) return false;
        }

        return allDone || allDead;
    },

    destroy: function(){
        this.path.destroy();

        for( var i = 0; i < this.enemies.length; i++ ){
            this.enemies[i].setAlive( false );
        }
    },

    releaseEnemy: function(){
        if( this.count <= 0 || !this.canRelease ) return;

        this.count--;
        var ctor = this.types[ this.count % this.types.length ];
        var enemy = new ctor( this.world, this.path, createjs.Tween.get( {value: 0} ).to( {value: 1}, this.tweenInfo.duration, this.tweenInfo.ease ) );
        this.enemies.push( enemy );
        this.world.addEntity( enemy );
    }
});

EnemySequenceFactory = Class.create({
    initialize: function( world ){
        this.world = world;
        this.stage = world.stage;
    },

    getRandom: function(){
        var start = Math.round( Math.random() * 2 ) + 1;
        var startPoint = this.getPoint( start );
        var end = -1;

        if( start == 1 ){
            end = 3 | (1 << 2);
        }else if( start == 2 ){
            end = (Math.round( Math.random() * 2 ) + 1) | (1 << 2);
        }else if( start == 3 ){
            end = 1 | (1 << 2);
        }else{}

        if( end == -1 ) return null;

        var endPoint = this.getPoint( end );
        var control0 = new createjs.Point( Math.random() * this.stage.width, Math.random() * this.stage.height );
        var control1 = new createjs.Point( Math.random() * this.stage.width, Math.random() * this.stage.height );
        var path = new EnemyPath( this.stage, startPoint, control0, control1, endPoint );
        var tweenInfo = {duration: Math.random() * 10000 + 5000, ease: createjs.Ease.linear };

        var delay = Math.random() * 500 + 200;
        var types = [];
        var count = Math.round( Math.random() * 5 + 1);
        for( var i = 0; i < count; i++ ){
            var x = Math.random();

            if( x < 0.05 ){
                types.push( SpecialEnemy );
            }else if( x < 0.2 ){
                types.push( BigEnemy );
            }else if( x < 1 ){
                types.push( SmallEnemy );
            }
        }

        return new EnemySequence( this.world, path, tweenInfo, count, delay, types );
    },

    getPoint: function( i ){
        var startX = ( (i & 3) - 2 ) * this.stage.width;
        var endX = startX + this.stage.width;

        var startY = ( -1 + ((i >> 2) & 1) * 2 ) * this.stage.height;
        var endY = startY + this.stage.height;

        var rx = Math.random() * ( endX - startX ) + startX;
        var ry = Math.random() * ( endY - startY ) + startY;

        return new createjs.Point( rx, ry );
    }
});