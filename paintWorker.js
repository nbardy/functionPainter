var xOffset = 0, yOffset = 0;

self.addEventListener('message', function(e) {
   if (e.data.command == 'start') {
      startThisWorker(e);
      }
   else if (e.data.command == 'stop') {
      self.close();
   }
   else if (e.data.command == 'pan') {
      xOffset += e.data.x;
      yOffset += e.data.y; 
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
   eval("function getColor(x,y,t) { " + e.data.preprocessorString + " return { r: clamp(redFunc(x,y,t)), g: clamp(greenFunc(x,y,t)), b: clamp(blueFunc(x,y,t)) }; }");

   drawPicture(e.data.imageData, e.data.width, e.data.height, getColor, currenttime);
   if(e.data.tstate){
      setInterval( function() {
         drawPicture(e.data.imageData, e.data.width, e.data.height, getColor, currenttime); 
         currenttime += 1;
      }, e.data.tinterval);
   }
}

function drawPicture(imageData, width, height, getColor, t) {
   pos = 0; // index position into imagedata array

   // walk left-to-right, top-to-bottom; it's the
   // same as the ordering in the imagedata array:

   for (y = 0; y < height; y++) {
     for (x = 0; x < width; x++) {

         var pannedX = x - xOffset;
         var pannedY = y - yOffset;
        
         // Calculate rgb values
         color = getColor(pannedX, pannedY, t);

         // set red, green, blue, and alpha:
         imageData.data[pos++] = color.r;
         imageData.data[pos++] = color.g;
         imageData.data[pos++] = color.b;
         imageData.data[pos++] = 0xff; // alpha
     }
   }

   self.postMessage({'imageData': imageData});
}

function clamp(value) {
   return Math.max(0, Math.min(255, value));
}
