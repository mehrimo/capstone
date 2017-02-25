function previewFile(){
       var preview = document.querySelector('img'); //selects the query named img
       var file    = document.querySelector('input[type=file]').files[0]; //sames as here
       var reader  = new FileReader();

       reader.onloadend = function () {
           preview.src = reader.result;
       }

       if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
       } else {
           preview.src = "";
       }
  }

  $('#submitBtn').click(function(){
    var formData = new FormData();
    formData.append("image", $("#myFile")[0].files[0]);

     $.ajax({
      url: "https://api.imgur.com/3/image",
      type: "POST",
      datatype: "json",
      headers: {
        "Authorization": "Client-ID aca6d2502f5bfd8"
      },
      data: formData,
      success: function(response) {
        console.log(response);
        var photo = response.data.link;
        var photo_hash = response.data.deletehash;
      },
      cache: false,
      contentType: false,
      processData: false
    });

  });





// (function(){
//   'use strict';
//   var setEventListeners = function(uploadBox) {
//     var previewContainer = uploadBox.querySelectorAll('.jst-preview')[0];
//     var fileInputs = uploadBox.querySelectorAll('[type="file"]');
//
//     var previewImage = function (event) {
//       var file = event.target.files[0];
//       var imageType = /image.*/;
//
//       if(typeof FileReader !== 'undefined' && file.type.match(imageType)) {
//         var reader = new FileReader();
//
//         reader.onload = function() {
//           previewContainer.style.backgroundImage = 'url(' + reader.result + ')';
//         };
//
//         reader.readAsDataURL(file);
//       }
//     };
//
//     for(var k = 0; k < fileInputs.length; k++) {
//       fileInputs[k].addEventListener('change', previewImage);
//     }
//   };
//
//   var uploadBoxes = document.querySelectorAll('.js-fileupload');
//
//   for(var j = 0; j < uploadBoxes.length; j++) {
//     var uploadBox = uploadBoxes[j];
//
//     setEventListeners(uploadBox);
//   }
//
//   console.log("camera-script");
//
// }());
