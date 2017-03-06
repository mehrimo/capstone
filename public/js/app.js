"use strict";

var IMG_URL = "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyABVZ-jyFG1avZQJBfz25FLWjqR2wukH08";

// var WIKI_QUERY = "http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page=Aquilegia_caerulea&callback=?";

// colorado blue columbine
// var plantName = "Aquilegia_caerulea"
// hedgehog cactus
var plantName = "Echinocereus_engelmannii"


// var description
var canvas
var ctx

// var WIKI_QUERY = "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="+encodeURIComponent(description)+"&callback=?";
// console.log("Can I find you? ", description);

var WIKI_QUERY = "https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page="+plantName+"&callback=?";

$(document).ready(function() {

  canvas = document.querySelector('#canvas')
  ctx = canvas.getContext('2d')

  $('#fileform').on('submit', uploadFiles);
});

//Upload photo button
document.getElementById('upload-photo').onclick = function(){
    document.getElementById('upload-field').click();
};

  // 'submit' event handler - reads the image bytes and sends it to the Cloud
  // Vision API.
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


/**
 Sends the given file contents to the Cloud Vision API and outputs the
results.
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


  //Wikipedia Link 1
  $.ajax({
        type: "GET",
        url: WIKI_QUERY,
        contentType: "application/json; charset=utf-8",
        async: false,
        dataType: "json",
        success: function (data, textStatus, jqXHR) {

            var markup = data.parse.text["*"];
            var blurb = $('<div></div>').html(markup);

            // remove links as they will not work
            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });

            // remove any references
            blurb.find('sup').remove();

            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();
            $('#article').html($(blurb).find('p'));

        },
        error: function (errorMessage) {
        }
    });

}





// Displays the flower name

function displayJSON(data) {
  console.log(data);

  var contents = JSON.stringify(data, null, 4);

  var description = [data.responses[0].labelAnnotations[0].description,   data.responses[0].labelAnnotations[1].description ,  data.responses[0].labelAnnotations[2].description].filter(onlyName);

  function onlyName(description) {
    return description !== "plant" && description !== "flower"  && description !== "cactus" && description !== "close up";
  }

  // function matchingWiki(description) {
  //   if (description === "colorado blue columbine") {
  //   plantName = "Aquilegia_caerulea";
  // }

$("#results").text(description);

console.log("The name is: ", description);
console.log(encodeURIComponent(description));


}
