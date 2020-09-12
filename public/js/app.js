"use strict";

var IMG_URL = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyABVZ-jyFG1avZQJBfz25FLWjqR2wukH08";

var canvas
var ctx

$(document).ready(function() {

  canvas = document.querySelector('#canvas')
  ctx = canvas.getContext('2d')

  $("#result-main").hide();
  $('#fileform').on('submit', uploadFiles);
});

  // $("#identify-btn")

  function showResults() {
    $("#result-main").show();
  }

  function hideResults() {
    $("#result-main").hide();
  }


// Upload photo button
document.getElementById('upload-photo').onclick = function(){
    document.getElementById('upload-field').click();
};

  // Submit event handler - reads the image bytes and sends it to the Cloud Vision API.
function uploadFiles(event) {
  event.preventDefault(); // Prevent the default form post

  // Grab the file and asynchronously convert to base64.
  var file = $('#fileform [name=fileField]')[0].files[0];
  var reader = new FileReader();
  reader.onloadend = processFile;
  reader.readAsDataURL(file);
}

// Event handler for a file's data url - extract the image data and pass it off.
function processFile(event) {
  var content = event.target.result;

  drawImage(content)

  sendFileToCloudVision(
      content.replace("data:image/jpeg;base64,", ""));
}

function drawImage(content) {
  var image = new Image()
  image.onload = function () {
    var perferedWidth = 500;
    var ratio = perferedWidth / image.width;
    canvas.width = image.width * ratio;
    canvas.height = image.height * ratio;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  }
  image.src = content;
}

// Sends the image to the Cloud Vision API and outputs the results.
function sendFileToCloudVision(content) {

  // Strip out the file prefix when you convert to json.
  var request = {
    requests: [{
      image: {
        content: content
      },
      features: [{
        type: 'LABEL_DETECTION',
        maxResults: 5
      }]
    }]
  };

  $('#results').text('Loading...');
  $.post({
    url: IMG_URL,
    data: JSON.stringify(request),
    contentType: 'application/json'
  }).fail(function(jqXHR, textStatus, errorThrown) {
    $('#results').text('ERRORS: ' + textStatus + ' ' + errorThrown);
  }).done(displayJSON);


}

// Displays the flower name
function displayJSON(data) {
  console.log(data);

  var contents = JSON.stringify(data, null, 4);

  var description = [data.responses[0].labelAnnotations[0].description,   data.responses[0].labelAnnotations[1].description,  data.responses[0].labelAnnotations[2].description].filter(onlyName);

  function onlyName(description) {
  	const desc = description.toUpperCase()
    return desc.length > 7 && desc !== "PLANT" && desc !== "FLOWER" && desc !== "LAND PLANT" && desc !== "CLOSE UP" && desc !== "FLORA" && desc !== "MACRO PHOTOGRAPHY" && desc !== "BLUE" && desc !== "YELLOW" && desc !== "PINK" && desc !== "RED";
  }

  var wikiSearch = description.filter(onlyName)[0]

  if (!wikiSearch) {
  	return $('#results').text('NO RESULTS');
  }

  $.ajax({
  	type: 'GET',
  	url: 'https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search='+wikiSearch+'&redirects=resolve',
  	contentType: 'application/json; charset=utf-8',
  	dataType: 'json',
  	success: function (data, textStatus, jqXHR) {
  		console.log('some data for ya, ', data)
  		const [,[title]] = data

  		$("#results").text(title);

  		//Wikipedia Search
		  $.ajax({
		        type: "GET",
		        url: "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&redirects&page="+title+"&callback=?",
		        contentType: "application/json; charset=utf-8",
		        dataType: "json",
		        success: function (data, textStatus, jqXHR) {
		        	console.log('wiki response', data)
		            var markup = data.parse.text["*"];
		            var blurb = $('<div></div>').html(markup);

		            // remove links as they will not work
		            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

		            // remove any references
		            blurb.find('sup').remove();

		            // remove cite error
		            blurb.find('.mw-ext-cite-error').remove();
		            $('#article').html($(blurb).find('p'));

		            showResults();
		            window.scrollTo(0, document.querySelector('#scroll-to-container').getBoundingClientRect().top)

		        },
		        error: function (errorMessage) {
		        }
		    });
  	},
  	error: function (errorMessage) {

  	}
  })

}
