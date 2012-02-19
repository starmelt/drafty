window.onload = (function() {
    var WIDTH = 640,
        HEIGHT = 640;
    Crafty.init(WIDTH, HEIGHT);

    function IData(imgData) {
        this.data = imgData.data;
        this.width = imgData.width;
        this.height = imgData.height;
    }
    
    IData.prototype.get = function(x,y) {
        var st = 4 * (y * this.width + x);
        return {r: this.data[st], g: this.data[st+1], b: this.data[st+2], a: this.data[st+3]};
    }
    
    IData.prototype.set = function(x,y,col) {
        var st = 4 * (y * this.width + x);
        this.data[st] = col.r;
        this.data[st+1] = col.g;
        this.data[st+2] = col.b;
        this.data[st+3] = col.a;
    }
    
    function bind(fn, scope) {
        return function () {
            return fn.apply(scope, Array.prototype.slice.call(arguments));
        };
    }
    
    Crafty.c("Texture", {
        ready: true,
        redraw: true,
        init: function() {
            this.requires("2D, Canvas");
            
            this.bind("Draw", function(obj) {
                if (this.redraw) {
                    this._draw(obj.ctx, obj.pos);
                    this.redraw = false;
                }
            });
        },
        
        noise1: function(x,y) {
            var n = x + y * 997;
            x = (n << 13) ^ n;
            return (1 - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824);
        },
        
        smoothedNoise1: function(x,y) {
            var noise = this.noise1;
            var corners = ( noise(x-1, y-1)+noise(x+1, y-1)+noise(x-1, y+1)+noise(x+1, y+1) ) / 16;
            var sides   = ( noise(x-1, y)  +noise(x+1, y)  +noise(x, y-1)  +noise(x, y+1) ) /  8;
            var center  =  noise(x, y) / 4;
            return corners + sides + center;
        },

        
        interpolatedNoise1: function(x, y) {
            function interpolate(a, b, x) {
                var ft = x * 3.1415927;
                var f = (1 - Math.cos(ft)) * .5;
                return  a*(1-f) + b*f;
            }
            var integer_X    = Math.floor(x);
            var fractional_X = x - integer_X;
      
            integer_Y    = Math.floor(y);
            fractional_Y = y - integer_Y;
      
            var v1 = this.smoothedNoise1(integer_X,     integer_Y);
            var v2 = this.smoothedNoise1(integer_X + 1, integer_Y);
            var v3 = this.smoothedNoise1(integer_X,     integer_Y + 1);
            var v4 = this.smoothedNoise1(integer_X + 1, integer_Y + 1);
      
            i1 = interpolate(v1 , v2 , fractional_X);
            i2 = interpolate(v3 , v4 , fractional_X);
      
            return interpolate(i1 , i2 , fractional_Y);
        },
        
        perlinNoise2D: function(x, y) {
            var total = 0;
            var p = .6;
            var n = 6;
            
            for (var i=0; i<n; i++) {
                var frequency = Math.pow(2, i);
                var amplitude = Math.pow(p, i);
                total = total + this.interpolatedNoise1(x * frequency, y * frequency) * amplitude;
            }
            //console.log(total);
            return total;
        },
        
        makeTexture: function(imgData, func) {
            for (var x=0; x<imgData.width; x++) {
                for (var y=0; y<imgData.height; y++) {
                    var gr = func(x/16.0,y/16.0) * 128 + 128;
                    var gg = func(160+x/80.0,y/16.0) * 128 + 128;
                    var gb = func(320+x/160.0,y/16.0) * 128 + 128;
                    imgData.set(x, y,  {r: gr, g: gg, b: gb, a: 255});
                }
            }
            return imgData;
        },

        _draw: function(ctx, po) {
            var data = ctx.createImageData(po._w, po._h);
            var imgData = new IData(data);
            imgData = this.makeTexture(imgData, bind(this.perlinNoise2D, this));
            data.data = imgData.data;
            ctx.putImageData(data, po._x, po._y);
        }
    });

    Crafty.e("Texture").attr({x: 0, y: 0, w: 160, h: 160});
});