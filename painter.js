function draw() {
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
   
   //adjust = document.getElementById('adjust').checked;
   
   imageData = context.createImageData(width, height);

   //Start worker for drawing data from function
   startDrawWorker(imageData, width, height, redstring, greenstring, bluestring, tinterval, tstate);
   

   
   //Add stop button if time variable is included
   if (tstate) {
      document.getElementById('stop').disabled=false;
      document.getElementById('start').disabled=true;
   }

}

function stopDraw() {
   drawWorker.postMessage({'command': 'stop'});
   document.getElementById('stop').disabled=true;
   document.getElementById('start').disabled=false;
}

function startDrawWorker(imageData, width, height, redstring, greenstring, bluestring, tinterval, tstate) {
   //Create Worker
   drawWorker = new Worker('paintWorker.js');

   //Add Event listener to paste results on the canvas 
   drawWorker.addEventListener('message', function(e) {handleMessage(e.data)});

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

function handleMessage(data) {
      context.putImageData(data.imageData, 0, 0);
}
