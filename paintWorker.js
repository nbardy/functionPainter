self.addEventListener('message', function(e) {
   if (e.data.command == 'start') {
      startThisWorker(e);
      }
   else if (e.data.command == 'stop') {
      self.close();
   }
   else { 
      //do nothing if command is not known
      }
   });

// Define some handy aliases for the basic math functions and constants
var abs = Math.abs, acos = Math.acos, asin = Math.asin, atan = Math.atan, atan2 = Math.atan2, ceil = Math.ceil, cos = Math.cos, exp = Math.exp, floor = Math.floor, log = Math.log, max = Math.max, min = Math.min, pow = Math.pow, random = Math.random, round = Math.round, sin = Math.sin, sqrt = Math.sqrt, tan = Math.tan, E = Math.E, PI = Math.PI;

function startThisWorker(e) { 
   currenttime = 0;
   eval("function redFunc(x,y,t) { return " + e.data.redstring + ";}");
   eval("function greenFunc(x,y,t) { return " + e.data.greenstring + ";}");
   eval("function blueFunc(x,y,t) { return " + e.data.bluestring + ";}");

   drawPicture(e.data.imageData, e.data.width, e.data.height, redFunc, greenFunc, blueFunc, currenttime);
   if(e.data.tstate){
      setInterval( function() {
         drawPicture(e.data.imageData, e.data.width, e.data.height, redFunc, greenFunc, blueFunc, currenttime); 
         currenttime += 1;
      }, e.data.tinterval);
   }
}

function drawPicture(imageData, width, height, redFunc, greenFunc, blueFunc, t) {
   pos = 0; // index position into imagedata array

   // walk left-to-right, top-to-bottom; it's the
   // same as the ordering in the imagedata array:

   for (y = 0; y < height; y++) {
     for (x = 0; x < width; x++) {
         
         // calculate RGB values based on sine
         r = clamp(redFunc(x,y,t));
         b = clamp(blueFunc(x,y,t));
         g = clamp(greenFunc(x,y,t));

         // set red, green, blue, and alpha:
         imageData.data[pos++] = r;
         imageData.data[pos++] = g;
         imageData.data[pos++] = b;
         imageData.data[pos++] = 0xff; // alpha
     }
   }

   self.postMessage({'imageData': imageData, 'maximum': maximum, 'minimum': minimum});
}

function clamp(value) {
   return Math.max(0, Math.min(255, value));
}
