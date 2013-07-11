/**
 * Created with JetBrains PhpStorm.
 * User: _UX31A
 * Date: 09.07.13
 * Time: 12:23
 * To change this template use File | Settings | File Templates.
 */

var EnemyPath = Class.create({
    initialize: function( stage, p0, p1, p2, p3 ) {
        this.points = [ p0, p1, p2, p3 ];
        this.stage = stage;

        var g = new createjs.Graphics();
        g.setStrokeStyle(1);
        g.beginStroke(createjs.Graphics.getRGB(0,0,0));
        g.moveTo( p0.x, p0.y );
        g.bezierCurveTo( p1.x, p1.y, p2.x, p2.y, p3.x, p3.y );

        this.shape = new createjs.Shape(g);
        this.stage.addChild( this.shape );
    },

    getPointOnPath: function( t ){
        var tt = 1 - t; var a = tt*tt*tt; var b = 3*tt*tt*t; var c = 3*tt*t*t; var d = t*t*t;
        var rx = a * this.points[0].x + b * this.points[1].x + c * this.points[2].x + d * this.points[3].x;
        var ry = a * this.points[0].y + b * this.points[1].y + c * this.points[2].y + d * this.points[3].y;

        return new createjs.Point( rx, ry );
    },

    destroy: function(){
        this.stage.removeChild( this.shape );
    }
});

var ComplexEnemyPath = Class.create({
    initialize: function( stage, paths ){
        this.stage = stage;
        this.paths = paths;
    },

    getPointOnPath: function( t ){
        var pathIndex = Math.round( (this.paths.length - 1) * t);
        var path = this.paths[ pathIndex ];

        var projT = this.paths.length * t;
        var localT = projT - Math.floor( projT );
        if( t == 0 || t == 1 ) localT = t;

        return path.getPointOnPath( localT );
    },

    destroy: function(){
        for( var i = 0; i < this.paths.length; i++ ){
            this.paths[i].destroy();
        }
    }
});