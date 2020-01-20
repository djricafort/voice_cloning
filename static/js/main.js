$(document).ready(function () {

  let log = console.log.bind(console),
  id = val => document.getElementById(val),
  ul = id('ul'),
  // gUMbtn = id('gUMbtn'),
  start = id('start'),
  stop = id('stop'),
  stream,
  recorder,
  counter=1,
  chunks,
  media;

  gUMbtn.onclick = e => {
    // let mv = id('mediaVideo'),
    //     mediaOptions = {
    //       video: {
    //         tag: 'video',
    //         type: 'video/webm',
    //         ext: '.mp4',
    //         gUM: {video: true, audio: true}
    //       },
    //       audio: {
    //         tag: 'audio',
    //         type: 'audio/ogg',
    //         ext: '.ogg',
    //         gUM: {audio: true}
    //       }
    //     };
    // media = mv.checked ? mediaOptions.video : mediaOptions.audio;
    navigator.mediaDevices.getUserMedia({ audio: true}).then(_stream => {
      stream = _stream;
      id('gUMArea').style.display = 'none';
      id('btns').style.display = 'inherit';
      start.removeAttribute('disabled');
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = e => {
        chunks.push(e.data);
        // const blobDataInWavFormat: Blob = new Blob([blobDataInWebaFormat], { type : 'audio/wav; codecs=0' });
        if(recorder.state == 'inactive')  sendRawAudio(); //makeLink()
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
    //
    // recorded_src
    // audio.attr("src", sourceUrl);
    // // Play wav URL
    //   audio[0].pause();
    //   audio[0].load(); //suspends and restores all audio element
  }


  function makeLink(){
    let blob = new Blob(chunks, {type: 'audio/ogg' })
      , url = URL.createObjectURL(blob)
      , li = document.createElement('li')
      , mt = document.createElement('audio')
      , hf = document.createElement('a')
    ;
    // link = document.createElement("a");
    // link.href = url;
    // link.download = "audiofile.ogg"
    console.log(url)
    mt.controls = true;
    mt.src = url;
    hf.href = url;
    hf.download = `${counter++}${'.ogg'}`;
    hf.innerHTML = `donwload ${hf.download}`;
    // hf.click()
    li.appendChild(mt);
    li.appendChild(hf);
    ul.appendChild(li);
    console.log(url);
    // save as wav or mp3 using ffmpeg https://medium.com/jeremy-gottfrieds-tech-blog/javascript-tutorial-record-audio-and-encode-it-to-mp3-2eedcd466e78
    // var ffmpeg = require('ffmpeg');
    // try{
    //   var process = new ffmpeg(url);
    //   console.log("ffmpeg");
    // }
    // catch(e){
    //   console.log(e.code);
    //   console.log(e.msg);
    // }
  }

  function sendRawAudio(){
    blob = new Blob(chunks, {type: 'audio/wav' })
    var form_data = new FormData();
    form_data.append('file', blob, 'recorded.wav');
    console.log("sendRawAudioaudio");
    url = URL.createObjectURL(blob);

    $("#recorded_audio_player").controls = true;
    $("#recorded_audio_player").attr("src", url);//.src = url;
    $("#recorded_audio_player").show();
    // recordedAudioPlayer = document.createElement('audio');
    // recordedAudioPlayer.controls = true;
    // recordedAudioPlayer.src = url;
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
    // Init
    $('.filename-section').hide();
    $('.clone').hide();
    $('.input-form').hide();
    $('.loader').hide();
    $('#result').hide();

    // Upload Preview
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var filename = input.files[0].name;
            reader.onload = function (e) {
                $('#filenamePreview').css('background-image', 'url(' + e.target.result + ')');
                $('#filenamePreview').hide();
                $('#filenamePreview').text(filename);
                $('#filenamePreview').fadeIn(650);
                $('.clone').show();
                $('#btn-clone').show();
                upload_file();
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#audioUpload").change(function () {
        $('.filename-section').show();
        $('.input-form').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();
        // audio.show()
        readURL(this);
    });

    $("#audioRecorder").change(function () {
        console.log("test");
        recordAudio()
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

    function recordAudio(){
      player = document.getElementById('audioRecorder')
      console.log("test");
      // navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      // .then(handleSuccess);

      const handleSuccess = function(stream) {
        console.log("success");
        const options = {mimeType: 'audio/webm'};
        const recordedChunks = [];
        const mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.addEventListener('dataavailable', function(e) {
          console.log("mediaRecorder");
          if (e.data.size > 0) {
            recordedChunks.push(e.data);
          }

          console.log("shouldStop")
          if(shouldStop === true && stopped === false) {
            mediaRecorder.stop();
            stopped = true;
          }
        });

        mediaRecorder.addEventListener('stop', function() {
          downloadLink.href = URL.createObjectURL(new Blob(recordedChunks));
          downloadLink.download = 'acetest.wav';
          console.log("Saved")
        });

        mediaRecorder.start();

      };

      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(handleSuccess);
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
                  sourceUrl = data['audio_id']
                  play_audio_file(audio=$("#audio_player"), wav_url=sourceUrl)
                  console.log('Success!');
              },
          });

    }

    function play_audio_file(audio, sourceUrl){
      	// Display audio player
      	audio.show()
      	// // Set source wav URL
      	audio.attr("src", sourceUrl);
      	// Play wav URL
          audio[0].pause();
          audio[0].load(); //suspends and restores all audio element
        //   audio[0].oncanplaythrough = audio[0].play();
      }


    // Predict
    $('#btn-clone').click(function () {
        // var form_data = new FormData($('#upload-file')[0]);
        // var form_transcript_data = new FormData($('#script')[0]);
        // upload_file();
        get_script();
    });

});
