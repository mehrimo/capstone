(function(){
  'use strict';
console.log("camera-script");
  var setEventListeners = function(uploadBox) {
    var previewContainer = uploadBox.querySelectorAll('.jst-preview')[0];
    var fileInputs = uploadBox.querySelectorAll('[type="file"]');

    var previewImage = function (event) {
      var file = event.target.files[0];
      var imageType = /image.*/;

      if(typeof FileReader !== 'undefined' && file.type.match(imageType)) {
        var reader = new FileReader();

        reader.onload = function() {
          previewContainer.style.backgroundImage = 'url(' + reader.result + ')';
        };

        reader.readAsDataURL(file);
      }
    };

    for(var k = 0; k < fileInputs.length; k++) {
      fileInputs[k].addEventListener('change', previewImage);
    }
  };

  var uploadBoxes = document.querySelectorAll('.js-fileupload');

  for(var j = 0; j < uploadBoxes.length; j++) {
    var uploadBox = uploadBoxes[j];

    setEventListeners(uploadBox);
  }
}());
