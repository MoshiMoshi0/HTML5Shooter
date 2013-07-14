/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 09.07.13
 * Time: 12:50
 * To change this template use File | Settings | File Templates.
 */

var World = Class.create({
    initialize: function( stage ){
       this.stage = stage;
       this.entities = [];
       this.sequences = [];

       this.totalTime = 0;
       this.player = new Player( this );
       this.sequenceFactory = new EnemySequenceFactory( this );
       this.quadTree = new QuadTree( 0, 0,  this.stage.width,  this.stage.height, 0 );

       this.addEntity( this.player );
    },

    update: function( deltaTime ){
        this.totalTime += deltaTime;

        for( var i = this.entities.length - 1; i >= 0 ; i-- ){
            var e = this.entities[i];

            if( !e.isAlive() ){
                this.removeEntityIndex( e, i );
                continue;
            }

            e.update( deltaTime );
        }

        for( var i = this.sequences.length - 1; i >= 0; i-- ){
            var seq = this.sequences[i];
            seq.update( deltaTime );

            if( seq.finished() ){
                seq.destroy();
                this.sequences.splice( i, 1 );
            }
        }

        if( this.sequences.length < this.totalTime % 5 ){
            this.sequences.push( this.sequenceFactory.getRandom() );
        }

        this.solveCollisions();
        //this.quadTree.draw( this.stage.context );
    },

    solveCollisions: function(){
        this.quadTree.clear();
        for( var i = 0; i < this.entities.length; i++ ){
            var e = this.entities[i];
            if( e instanceof DamageableEntity ){
                if( e instanceof Bullet ){
                    this.quadTree.add( e, e.x - 4, e.y - 4, 8, 8 );
                }else{
                    this.quadTree.add( e, e.x - e.shape.width / 2, e.y - e.shape.height / 2, e.shape.width, e.shape.height );
                }
            }
        }

        for( var i = 0; i < this.entities.length; i++ ){
            var e = this.entities[i];

            if( e instanceof Player || e instanceof Enemy ){
                var others = this.quadTree.getElemsNearby(e.x, e.y, e.shape.width, e.shape.height);
                for( var j = 0; j < others.length; j++ ){
                    var o = others[j];

                    if( !(o instanceof DamageableEntity) ) continue;
                    if( (e.maskFlags & o.categoryFlags) == 0 && (o.maskFlags & e.categoryFlags) == 0 ) continue;

                    var collision = ndgmr.checkPixelCollision( e.shape, o.shape, 1 );
                    if( collision ){
                        if( o instanceof Bullet ){
                            e.hit( o.damage );
                            o.setAlive( false );
                        }else{
                            e.hit( 5 );
                            o.hit( 5 );
                        }
                    }
                }
            }
        }
    },

    addEntity: function( e ){
        this.entities.push( e );
    },

    removeEntity: function( e ){
        this.removeEntityIndex( e, this.entities.indexOf(e) );
    },

    removeEntityIndex: function( e, i ){
        e.destroy();
        this.entities.splice( i, 1 );
    },

    addSequence: function( path, tweenInfo, count, delay, types ){
        this.sequences.push( new EnemySequence( this, path, tweenInfo, count, delay, types ) );
    }
});