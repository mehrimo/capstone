"use strict";

var CV_URL = "https://vision.googleapis.com/v1/images:annotate?key=" + apiKey;

var canvas
var ctx

$(document).ready(function() {

  canvas = document.querySelector('#canvas')
  ctx = canvas.getContext('2d')

  $('#fileform').on('submit', uploadFiles);
});
/**
 * 'submit' event handler - reads the image bytes and sends it to the Cloud
 * Vision API.
 */
function uploadFiles(event) {
  event.preventDefault(); // Prevent the default form post

  // Grab the file and asynchronously convert to base64.
  var file = $('#fileform [name=fileField]')[0].files[0];
  var reader = new FileReader();
  reader.onloadend = processFile;
  reader.readAsDataURL(file);
}

/**
 * Event handler for a file's data url - extract the image data and pass it off.
 */
function processFile(event) {
  var content = event.target.result;

  drawImage(content)

  sendFileToCloudVision(
      content.replace("data:image/jpeg;base64,", ""));
}

function drawImage(content) {
  var image = new Image()
  image.onload = function () {
    canvas.width = image.width
    canvas.height = image.height
    // canvas.width = image.width
    // canvas.height = image.height
    ctx.drawImage(image, 0, 0)
  }
  image.src = content;
}


/**
 * Sends the given file contents to the Cloud Vision API and outputs the
 * results.
 */
function sendFileToCloudVision(content) {

  // var type = $("#fileform [name=type]").val();

  // Strip out the file prefix when you convert to json.
  var request = {
    requests: [{
      image: {
        content: content
      },
      features: [{
        type: 'LABEL_DETECTION',
        maxResults: 10
      }]
    }]
  };

  $('#results').text('Loading...');
  $.post({
    url: CV_URL,
    data: JSON.stringify(request),
    contentType: 'application/json'
  }).fail(function(jqXHR, textStatus, errorThrown) {
    $('#results').text('ERRORS: ' + textStatus + ' ' + errorThrown);
  }).done(displayJSON).done(drawFaces);
}

/**
 * Displays the results.
 */
function displayJSON(data) {
  var contents = JSON.stringify(data, null, 4);
  $("#results").text(contents);
}

identity = response['responses'][0]['labelAnnotations'][1]['description']

console.log(identity);

// function drawFaces(data) {
//
//   var responses = data.responses;
//
//   if (Object.keys(responses[0]).length === 0) {
//     return;
//   }
//
//   var annotations = responses[0].faceAnnotations
//   var vertices = annotations[0].boundingPoly.vertices
//
//   for (var i = annotations.length - 1; i >= 0; i--) {
//     var vertices = annotations[i].boundingPoly.vertices
//     var width = vertices[2].x - vertices[0].x
//     var height = vertices[2].y - vertices[0].y
//
//     ctx.lineWidth = 5
//     ctx.strokeRect(vertices[0].x, vertices[0].y, width, height)
//   }
//
// }
