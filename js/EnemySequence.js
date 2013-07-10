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

        if( !(types instanceof Array) ){
            this.types = [ types ];
        }else{
            this.types = types;
        }

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

    destroy: function(){
        this.path.destroy();
    },

    releaseEnemy: function(){
        if( this.count <= 0 || !this.canRelease ) return;

        var ctor = this.types[ this.count % this.types.length ];
        var enemy = new ctor( this.world, this.path, createjs.Tween.get( {value: 0} ).to( {value: 1}, this.tweenInfo.duration, this.tweenInfo.ease ) );
        this.world.addEntity( enemy );

        this.count--;
    }
});