$(function() {
   window.addEventListener("selectstart", function (e) {
      // If the select event is triggered on the #painter object, prevent the default behavior.
      // This prevents the browser for annoyingly trying to select things when you're clicking/dragging to pan through the canvas.
      if ($(e.target)[0] == $('#painter')[0])
         e.preventDefault();
   });

   $('#painter').mousedown(function (e) {
      if (e.which == 1)
      {
         this.panning = true;

         this.prevMousePosition = getMousePosition(e, this);
      }
   }).mouseup(function (e) {
      this.panning = false;
   }).mousemove(function (e) {
      if (this.panning && typeof drawWorker != 'undefined')
      {
         var mousePosition = getMousePosition(e, this);

         drawWorker.postMessage({
            'command': 'pan',
            'x': mousePosition.x - this.prevMousePosition.x,
            'y': mousePosition.y - this.prevMousePosition.y
         });

         this.prevMousePosition = mousePosition;
      }
   });

   // Returns the position of the mouse relative to the given object
   function getMousePosition(event, object)
   {
      var mouseX = event.pageX - $(object).offset().left;
      var mouseY = event.pageY - $(object).offset().top;
      return { x: mouseX, y: mouseY };
   }
});

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
   preprocessorString = document.getElementById('preprocessor').value;

   tstate = document.getElementById('tVariable').checked;
   tinterval = parseInt(document.getElementById('tInterval').value);
   
   //adjust = document.getElementById('adjust').checked;
   
   imageData = context.createImageData(width, height);

   //Start worker for drawing data from function
   startDrawWorker(imageData, width, height, redstring, greenstring, bluestring, preprocessorString, tinterval, tstate);
   

   
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

function startDrawWorker(imageData, width, height, redstring, greenstring, bluestring, preprocessorString, tinterval, tstate) {
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
                       'tinterval': tinterval,
                       'preprocessorString': preprocessorString
                       });

   return drawWorker;
}

function handleMessage(data) {
      context.putImageData(data.imageData, 0, 0);
}
