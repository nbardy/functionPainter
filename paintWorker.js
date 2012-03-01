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
   minimum = {'red':255, 'blue':255, 'green':255};
   maximum = {'red':0, 'blue':0, 'green':0};

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
