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

    var tt0 = SAT.checkAxis( e0, e1, b0.n0x, b0.n0y, vx, vy );
    var tt1 = SAT.checkAxis( e0, e1, b0.n1x, b0.n1y, vx, vy );
    var tt2 = SAT.checkAxis( e0, e1, b1.n0x, b1.n0y, vx, vy );
    var tt3 = SAT.checkAxis( e0, e1, b1.n1x, b1.n1y, vx, vy );

    var t0 = Math.min( tt0.t0, Math.min( tt1.t0, Math.min( tt2.t0, tt3.t0 )));
    var t1 = Math.max( tt0.t1, Math.max( tt1.t1, Math.max( tt2.t1, tt3.t1 )));

    if(!( t0 < 0 || t0 > 1 || t1 < 0 | t1 > 1 ) && ( t0 <= t1 ))
    alert( t0 + " " + t1 );
    return !( t0 < 0 || t0 > 1 || t1 < 0 | t1 > 1 ) && ( t0 <= t1 );
};

SAT.dot = function( x0, y0, x1, y1 ){ return x0 * x1 + y0 * y1; };
SAT.getInterval = function( o, ax, ay ){
    var d0 = this.dot( o.n0x, o.n0y, ax, ay ) * o.ex;
    var d1 = this.dot( o.n1x, o.n1y, ax, ay ) * o.ey;
    var c = this.dot( o.x, o.y, ax, ay ); var r = d0 + d1;
    return  { min: c - r, max: c + r };
};

SAT.checkAxis = function( e0, e1, ax, ay, vx, vy ){
    var speed = this.dot( vx, vy, ax, ay );

    var i0 = this.getInterval( e0.obb, ax, ay );
    var i1 = this.getInterval( e1.obb, ax, ay );

    var t;
    var t0 = 0, t1 = Number.MAX_VALUE;
    if( i0.max < i1.min ){
        if( speed <= 0 ) return { t0: t0, t1: t1 };

        t = (i1.min - i0.max) / speed;
        t0 = Math.max(t, t0);

        t = (i1.max - i0.min) / speed;
        t1 = Math.max(t, t1);
    }else  if( i1.max < i0.min ) {
        if (speed >= 0 ) return { t0: t0, t1: t1 };

        t = (i1.max - i0.min) / speed;
        t0 = Math.max(t, t0);

        t = (i1.min - i0.max) / speed;
        t1 = Math.min(t, t1);
    } else {
        if( speed > 0 ){
            t = (i1.max - i0.min) / speed;
        }else if ( speed < 0 ){
            t = (i1.min - i0.max) / speed;
        }
        t1 = Math.min(t, t1);
    }

    return { t0: t0, t1: t1 };
};
