$(document).ready(function () {

  // Init
  $('.filename-section').hide();
  $('.clone').hide();
  $('.input-form').hide();
  $('.loader').hide();
  // $('#result').hide();

  let log = console.log.bind(console),
  id = val => document.getElementById(val),
  ul = id('ul'),
  recordVoiceBtn = id('recordVoice'),
  start = id('start'),
  stop = id('stop'),
  stream,
  recorder,
  counter=1,
  chunks,
  media;

  recordVoiceBtn.onclick = e => {
    navigator.mediaDevices.getUserMedia({ audio: true}).then(_stream => {
      stream = _stream;
      id('recordArea').style.display = 'none';
      id('btns').style.display = 'inherit';
      start.removeAttribute('disabled');
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => {
        chunks.push(e.data);
        if(recorder.state == 'inactive')  recordAudio();
      };
      log('got media successfully');
    }).catch(log);
  }

  start.onclick = e => {
    start.disabled = true;
    stop.removeAttribute('disabled');
    chunks=[];
    recorder.start();
  }

  stop.onclick = e => {
    stop.disabled = true;
    recorder.stop();
    console.log("test")
    start.removeAttribute('disabled');
    $('.input-form').show();
    $('.clone').show();
    $('#btn-clone').show();
  }


  function recordAudio(){
    blob = new Blob(chunks, {type: 'audio/wav' })
    var form_data = new FormData();
    form_data.append('file', blob, 'recorded.wav');
    url = URL.createObjectURL(blob);

    $("#recorded_audio_player").controls = true;
    $("#recorded_audio_player").attr("src", url);
    $("#recorded_audio_player").show();
    $.ajax({
          type: 'POST',
          url: '/record',
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

  $("#audioUpload").change(function () {
      $('.filename-section').show();
      $('.input-form').show();
      // $('#result').text('');
      // $('#result').hide();
      readURL(this);
  });

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var filename = input.files[0].name;
            reader.onload = function (e) {
                // $('#filenamePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#filenamePreview').hide();
                $('#filenamePreview').text(filename);
                $('#filenamePreview').fadeIn(650);
                $('.clone').show();
                upload_file();
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    // $("#audioUpload").change(function () {
    //     $('.filename-section').show();
    //     $('.input-form').show();
    //     $('#btn-predict').show();
    //     $('#result').text('');
    //     $('#result').hide();
    //     readURL(this);
    // });


    function upload_file(){
      var form_data = new FormData($('#upload-file')[0]);
      console.log("uploading...");

      $.ajax({
            type: 'POST',
            url: '/upload',
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
      var form_script_data = document.getElementById('textarea-field').value; //input-text textarea-field
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
                  $('.loader').hide();
                  console.log('TEST!');
                  sourceUrl = data['audio_id']
                  play_audio_file(audio=$("#audio_player"), wav_url=sourceUrl)
                  console.log('Success!');
                  console.log('TEST!');
                  console.log(sourceUrl);
              },
          });

    }

    function play_audio_file(audio, sourceUrl){
      	// Display audio player
      	audio.show();
        var audio2 = document.getElementById('audio_player');
      	// // Set source wav URL
        console.log("play audio");
      	// audio.attr("src", sourceUrl);
        audio2.src = sourceUrl
        // audio2.show();
      	// Play wav URL
        console.log(sourceUrl);
        // audio[0].play();
        audio2.pause();
        audio2.load(); //suspends and restores all audio element
      }


    // Clone voice and synthesize speech
    $('#btn-clone').click(function () {
        get_script();
        $('.loader').show();
    });

});
