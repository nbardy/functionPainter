self.addEventListener('message', function(e) {
   if (e.data.command == 'start') {
      startThisWorker(e);
      }
   else if (e.data.command == 'stop') {
      self.close();
   }
   else { 
      //do nothing 
      }
   });

function startThisWorker(e) { 
   currenttime = 0;
   eval("function redFunc(x,y,t) { return " + e.data.redstring + ";}");
   eval("function greenFunc(x,y,t) { return " + e.data.greenstring + ";}");
   eval("function blueFunc(x,y,z,t) { return " + e.data.bluestring + ";}");

   drawPicture(e.data.imageData, e.data.width, e.data.height, redFunc, greenFunc, blueFunc, e.data.currenttime);
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
         // calculate sine based on distance

         // calculate RGB values based on sine
         r = redFunc(x,y,t);
         b = blueFunc(x,y,t);
         g = greenFunc(x,y,t);

         // set red, green, blue, and alpha:
         imageData.data[pos++] = clamp(r);
         imageData.data[pos++] = clamp(g);
         imageData.data[pos++] = clamp(b);
         imageData.data[pos++] = 0xff; // alpha
     }
   }

   self.postMessage({'imageData': imageData});
}

function clamp(value) {
   return Math.max(0, Math.min(255, value));
}
