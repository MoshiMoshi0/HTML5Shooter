/**
 * Created with JetBrains WebStorm.
 * User: _UX31A
 * Date: 18.07.13
 * Time: 10:34
 * To change this template use File | Settings | File Templates.
 */

var SAT = {};
SAT.checkCollision = function( e0, e1, deltaTime ){
    var vx = (e0.vx - e1.vx) * deltaTime;
    var vy = (e0.vy - e1.vy) * deltaTime;

    var b0 = e0.obb;
    var b1 = e1.obb;

    var t0 = 0, t1 = Number.MAX_VALUE;
    var axes = [ b0.n0x, b0.n0y, b0.n1x, b0.n1y, b1.n0x, b1.n0y, b1.n1x, b1.n1y ];
    for( var i = 0; i < 4; i++ ){
        var ax = axes[ i * 2 + 0 ];
        var ay = axes[ i * 2 + 1 ];

        var speed = this.dot( vx, vy, ax, ay );

        var i0 = this.getInterval( b0, ax, ay );
        var i1 = this.getInterval( b1, ax, ay );

        var vpr = (i1.min - i0.max) / speed;
        var vpl = (i1.max - i0.min) / speed;
        if( i0.max < i1.min ) {
            if( speed <= 0 ) return false;

            t0 = Math.max(vpr, t0);
            t1 = Math.min(vpl, t1);
        } else if( i1.max < i0.min ) {
            if (speed >= 0 ) return false;

            t0 = Math.max(vpl, t0);
            t1 = Math.min(vpr, t1);
        } else if( speed > 0 ) {
            t1 = Math.min(vpl, t1);
        } else if( speed < 0 ) {
            t1 = Math.min(vpr, t1);
        }

        if( t0 > 1 ) return false;
        if( t0 > t1 ) return false;
    }

    return true;
};

SAT.dot = function( x0, y0, x1, y1 ){ return x0 * x1 + y0 * y1; };
SAT.getInterval = function( o, ax, ay ){
    var dot = this.dot(o.v0x, o.v0y, ax, ay);
    var ret = { min: dot, max: dot };

    dot = this.dot(o.v1x, o.v1y, ax, ay);
    ret.min = Math.min( ret.min, dot); ret.max = Math.max( ret.max, dot );

    dot = this.dot(o.v2x, o.v2y, ax, ay);
    ret.min = Math.min( ret.min, dot); ret.max = Math.max( ret.max, dot );

    dot = this.dot(o.v3x, o.v3y, ax, ay);
    ret.min = Math.min( ret.min, dot); ret.max = Math.max( ret.max, dot );

    return ret;
};
