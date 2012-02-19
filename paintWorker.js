self.addEventListener('message', function(e) { startThisWorker(e);});

function startThisWorker(e) { 
   
   if(e.data.tstate){
      currenttime = 0;
      setInterval( function() {
         drawPicture(e.data.imageData, e.data.width, e.data.height, e.data.redstring, e.data.greenstring, e.data.bluestring, currenttime); 
         currenttime += 1;
      }, e.data.tinverval);
   }
   else
      drawPicture(e.data.imageData, e.data.width, e.data.height, e.data.redstring, e.data.greenstring, e.data.bluestring, e.data.currenttime);
}

function drawPicture(imageData, width, height, redstring, greenstring, bluestring, t) {
   pos = 0; // index position into imagedata array

   // walk left-to-right, top-to-bottom; it's the
   // same as the ordering in the imagedata array:

   for (y = 0; y < height; y++) {
     for (x = 0; x < width; x++) {
         // calculate sine based on distance

         // calculate RGB values based on sine
         r = eval(redstring);
         b = eval(bluestring);
         g = eval(greenstring);

         // set red, green, blue, and alpha:
         imageData.data[pos++] = clamp(r);
         imageData.data[pos++] = clamp(g);
         imageData.data[pos++] = clamp(b);
         imageData.data[pos++] = 0xff; // alpha
     }
   }

   self.postMessage({'imageData': imageData, 't':t});
}

function clamp(value) {
   return Math.max(0, Math.min(255, value));
}
