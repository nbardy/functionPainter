function update() {
   redstring = document.getElementById('redFunction').value;
   greenstring = document.getElementById('greenFunction').value;
   bluestring = document.getElementById('blueFunction').value;

   canvas1 = document.getElementById('painter');
   context = canvas1.getContext('2d');

   width = parseInt(canvas1.width);
   height = parseInt(canvas1.height);

   imageData = context.createImageData(width, height);

   redstring = document.getElementById('redFunction').value;
   greenstring = document.getElementById('greenFunction').value;
   bluestring = document.getElementById('blueFunction').value;

   drawPicture(imageData, width, height, redstring, greenstring, bluestring);

   context.putImageData(imageData, 0, 0);
}

function drawPicture(imageData, width, height, redstring, greenstring, bluestring) {
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
         imageData.data[pos++] = Math.max(0,Math.min(255, r));
         imageData.data[pos++] = Math.max(0,Math.min(255, g));
         imageData.data[pos++] = Math.max(0,Math.min(255, b));
         imageData.data[pos++] = 0xff; // alpha
     }
   }
}

function setPixel(imageData, x, y, r, g, b, a) {
   index = (x + y * imageData.width) * 4;
   imageData.data[index+0] = r;
   imageData.data[index+1] = g;
   imageData.data[index+2] = b;
   imageData.data[index+3] = a;
}

function clamp(value) {
   return Math.max(0, Math.min(255, value));
}

