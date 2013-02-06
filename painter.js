$(document).ready(function() {
   pullParams()
   linkify()
})

function pullParams() {
   // Pull url paramaters at start
   var end = document.location.href.length - 1
   var url = document.location.href

   // Rid the url of the ending / if ther
   if (document.location.href[end] == '/') {
      url = url.slice(0,-1)
   } 

   var parse = $.url(url)
  
   var redValue = parse.param('red')
   var blueValue = parse.param('blue')
   var greenValue = parse.param('green')

   // Set default drawing if url is empty
   if(!(redValue || greenValue || blueValue)) {
      redValue = "(21*sin(x+y)*t/50+(x-y))^(3*t+50)"
      greenValue = "(5*sin(x-y)*t/50+(x+y))^t"
      blueValue = "23+123*sin(t/20)*sin(t/320*sqrt((123-x)*(123-x) + (45-y)*(45-y)))"
   }

   // Parse and add if exsists
   if(redValue) {
      document.getElementById('redFunction').value = redValue;
   }
   if(blueValue) {
      document.getElementById('blueFunction').value = blueValue;
   }
   if(greenValue) {
      document.getElementById('greenFunction').value = greenValue;
   }
}

function updateShareURL() {
   document.getElementById('url').value = urlize();
}

function draw() {
   // Retrieve information from the dom
   canvasDraw = document.getElementById('painter');
   context = canvasDraw.getContext('2d');
   // Retrieve height and width
   width = parseInt(canvasDraw.width);
   height = parseInt(canvasDraw.height);

   // Retrieve functions for drawing each color
   redstring = document.getElementById('redFunction').value;
   greenstring = document.getElementById('greenFunction').value;
   bluestring = document.getElementById('blueFunction').value;

   tstate = document.getElementById('tVariable').checked;
   tinterval = parseInt(document.getElementById('tInterval').value);
   
   //adjust = document.getElementById('adjust').checked;
   
   imageData = context.createImageData(width, height);

   // Start worker for drawing data from function
   startDrawWorker(imageData, width, height, redstring, greenstring, bluestring, tinterval, tstate);
   

   
   // Add stop button if time variable is included
   if (tstate) {
      document.getElementById('stop').disabled=false;
      document.getElementById('start').disabled=true;
   }

   // Update url for share
   updateShareURL()

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

// Turn current example into a link
function urlize() {
   var base = document.location.origin + document.location.pathname
   return base + "?" +
      $.param({
      red: document.getElementById('redFunction').value,
      blue: document.getElementById('blueFunction').value,
      green: document.getElementById('greenFunction').value
   })
}

// Adds links to all examples
function linkify() {
   $('.link.single').each(function() {
      linkify_single(this)
   })
   $('.link.multiple').each(function() {
      linkify_multiple(this)
   })
}

function linkify_single(item) {
   newInside = $("<a>", {
      href : "./?" + $.param({ red: item.innerText }),
      html : item.innerText
   })

   $(item).html(newInside)
}

function linkify_multiple(item) {
   newInside = $("<a>", {
      href : "./?" + $.param({ 
         red: $(item).find('.red').text(),
         green: $(item).find('.green').text(),
         blue: $(item).find('.blue').text()
      }),
      html : item.innerHTML
   })

   $(item).html(newInside)
}
