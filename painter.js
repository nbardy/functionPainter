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

   tstate = document.getElementById('tVariable').checked;
   tinterval = parseInt(document.getElementById('tInterval').value);
   
   imageData = context.createImageData(width, height);

   //Fill pixel grid with data
   startDrawWorker(imageData, width, height, redstring, greenstring, bluestring, tinterval, tstate);
}

function startDrawWorker(imageData, width, height, redstring, greenstring, bluestring, tinterval, tstate) {
   //Create Worker
   drawWorker = new Worker('paintWorker.js');

   //Add Event listener to paste results on the canvas 
   drawWorker.addEventListener('message', function(e) {console.log( e.data.t); context.putImageData(e.data.imageData, 0, 0)});

   //Post initial Message to Worker
   drawWorker.postMessage({'command': 'start',
                       'imageData': imageData,
                       'width': width,
                       'height': height,
                       'redstring': redstring,
                       'greenstring': greenstring,
                       'bluestring': bluestring,
                       'tstate': tstate,
                       'tinterval': tinterval});

   return drawWorker;
}


