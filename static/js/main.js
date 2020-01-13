$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.input-form').hide();
    $('.loader').hide();
    $('#result').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var filename = input.files[0].name;
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#imagePreview').hide();
                $('#imagePreview').text(filename);
                $('#imagePreview').fadeIn(650);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#audioUpload").change(function () {
        $('.image-section').show();
        $('.input-form').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        readURL(this);
    });

    function upload_file(){
      var form_data = new FormData($('#upload-file')[0]);
      console.log("uploading...");

      $.ajax({
            type: 'POST',
            url: '/clone',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                console.log('Success!');
            },
        });
    }

    function get_script(){
      // var form_script_data = new FormData($('#script')[0]);
      var form_script_data = document.getElementById('input-text').value;
      // console.log("Script");
      console.log(form_script_data);


        $.ajax({
              type: 'POST',
              url: '/script',
              data: JSON.stringify(form_script_data),
              contentType: "application/json",
              dataType: "json",
              cache: false,
              processData: false,
              async: true,
              success: function (data) {
                  console.log('Success!');
              },
          });

    }


    // Predict
    $('#btn-clone').click(function () {
        // var form_data = new FormData($('#upload-file')[0]);
        // var form_transcript_data = new FormData($('#script')[0]);
        upload_file();
        get_script();
    });

});
