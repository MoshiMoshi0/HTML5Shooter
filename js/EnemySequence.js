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

        this.totalTime = 0;
        this.enemies = [];
        this.stage = this.world.stage;
        this.canRelease = true;
        this.time = 0;
    },

    update: function( deltaTime ){
        this.totalTime += deltaTime;

        if( this.totalTime > this.tweenInfo.duration * 2 / 1000 ) this.destroy();
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
        //return this.count == 0;

        for( var i = 0; i < this.enemies.length; i++ ){
            var enemy = this.enemies[i];
            if( enemy.isAlive() ){
                return false;
            }
        }

        return true;
    },

    destroy: function(){
        this.path.destroy();

        for( var i = 0; i < this.enemies.length; i++ ){
            this.enemies[i].setAlive( false );
        }

        this.enemies.splice( 0, this.enemies.length );
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
        }

        if( end == -1 ) return null;

        var endPoint = this.getPoint( end );
        var control0 = new createjs.Point( Math.random() * this.stage.width, Math.random() * this.stage.height );
        var control1 = new createjs.Point( Math.random() * this.stage.width, Math.random() * this.stage.height );
        var path = new EnemyPath( this.stage, startPoint, control0, control1, endPoint );
        var tweenInfo = {duration: Math.random() * 10000 + 5000, ease: createjs.Ease.linear };

        var types = [];
        var delay = Math.random() * 500 + 200;
        var count = Math.round( Math.random() * 5 + 1);

        var sequencePower;
        var maxPower = this.world.player.stats.getPowerLevel();
        var enemyScale = Math.clip( maxPower / 200, 0, 1 );
        do {
            types.clear();
            sequencePower = 0;
            while( types.length < count ){
                var x = Math.random();

                if( maxPower > 40 && x < 0.05 +  + 0.2 * enemyScale ){
                    types.push( SpecialEnemy );
                    sequencePower += 40;
                }else if( maxPower > 20 && x < 0.2 + 0.4 * enemyScale  ){
                    types.push( BigEnemy );
                    sequencePower += 20;
                }else if( maxPower > 1 && x < 1 - enemyScale * 0.8 ){
                    types.push( SmallEnemy );
                    sequencePower += 1;
                }
            }
        } while( sequencePower > maxPower );

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