function update() {
   //Retrieve information from the dom
   canvasDraw = document.getElementById('painter');
   context = canvasDraw.getContext('2d');
   //Retrieve height and width
   width = parseInt(canvasDraw.width);
   height = parseInt(canvasDraw.height);

   //Retrieve functions for drawing each color
   redstring = document.getElementById('redFunction').value;
   greenstring = document.getElementById('greenFunction').value;
   bluestring = document.getElementById('blueFunction').value;

   //Fill pixel grid with data
   drawPicture(imageData, width, height, redstring, greenstring, bluestring);

   //Place picture on canvas
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
         imageData.data[pos++] = clamp(r);
         imageData.data[pos++] = clamp(g);
         imageData.data[pos++] = clamp(b);
         imageData.data[pos++] = 0xff; // alpha
     }
   }
}

function clamp(value) {
   return Math.max(0, Math.min(255, value));
}

