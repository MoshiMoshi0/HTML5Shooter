/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 09.07.13
 * Time: 12:50
 * To change this template use File | Settings | File Templates.
 */

    var shape = new createjs.Shape();
var World = Class.create({
    initialize: function( stage ){
       this.stage = stage;
       this.entities = [];
       this.sequences = [];

       this.player = new Player( this );
       this.sequenceFactory = new EnemySequenceFactory( this );
       this.quadTree = new QuadTree( { x: 0,y: 0, width: this.stage.width, height: this.stage.height }, false, 3 );

        this.stage.addChild( shape );
    },

    update: function( deltaTime ){
        this.totalTime += deltaTime;

        this.solveCollisions();
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

        this.player.update( deltaTime );
        if( this.sequences.length < 8 ){
            this.sequences.push( this.sequenceFactory.getRandom() );
        }

        this.renderQuad();
    },

     renderQuad: function()
{
    var g = shape.graphics;
    g.clear();
    g.setStrokeStyle(1);
    g.beginStroke("rgb(0,0,0)");

    this.drawNode(this.quadTree.root);
},

 drawNode: function(node){
    var bounds = node._bounds;
    var g = shape.graphics;

    g.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);

    //console.log(node);
    var children = node.getChildren();
    var cLen = children.length;
    var childNode;
    if(cLen)
    {
        for(var j = 0; j < cLen; j++)
        {
            childNode = children[j];
            g.beginStroke("rgb(0,0,0)");

            g.drawRect(childNode.x, childNode.y, childNode.width, childNode.height);
            //g.drawCircle(childNode.x, childNode.y,3);
        }
    }

    var len = node.nodes.length;

    for(var i = 0; i < len; i++)
    {
        this.drawNode(node.nodes[i]);
    }
},

    solveCollisions: function(){
        this.quadTree.clear();
        for( var i = 0; i < this.entities.length; i++ ){
            var e = this.entities[i];
            if( e instanceof DamageableEntity ){
                this.quadTree.insert( e );
            }
        }

        for( var i = 0; i < this.entities.length; i++ ){
            var e = this.entities[i];
            var others = this.quadTree.retrieve( e );

            if( e instanceof Player ){
                for( var j = 0; j < others.length; j++ ){
                    var o = others[j];

                    if( o instanceof PlayerBullet || o instanceof Player ) continue;

                    var collision = ndgmr.checkPixelCollision( e.shape, o.shape, 0.1 );
                    if( collision ){
                        if( o instanceof EnemyBullet ){
                            e.damage( o.damage );
                            o.setAlive( false );
                        }
                    }
                }
            }else if( e instanceof PlayerBullet ){
                for( var j = 0; j < others.length; j++ ){
                    var o = others[j];

                    if( !(o instanceof DamageableEntity) || o instanceof PlayerBullet || o instanceof Player ) continue;

                    var collision = ndgmr.checkPixelCollision( e.shape, o.shape, 0.1 );
                    if( collision ){
                        o.damage( e.damage );
                        e.setAlive( false );
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