function initializeCropper(aspectRatio = 1) {
    let result  = document.querySelector('.result');
    let upload  = document.querySelector('#file-input');
    let done    = document.querySelector('#done_adjust');
    let cropper = '';

    if(result && upload) {
        upload.addEventListener('change', e => {
            $('#done_adjust').prop('disabled', false);

            if (e.target.files.length) {
                const reader = new FileReader();
                reader.onload = e => {
                    if (e.target.result) {
                        let img = document.createElement('img');
                        img.id  = 'image';
                        img.src = e.target.result;
                        result.innerHTML = '';
                        result.appendChild(img);

                        cropper = new Cropper(img, {
                            aspectRatio: aspectRatio,
                            viewMode: 1,
                            minCropBoxWidth: 200,
                            minCropBoxHeight: 200
                        });
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });

        done.addEventListener('click', e => {
            alert('OK');
            e.preventDefault();

            canvas = cropper.getCroppedCanvas({
                width: 400,
                height: 400
            });

            canvas.toBlob(function (response) {
                var reader = new FileReader();
                reader.readAsDataURL(response);

                reader.onloadend = function() {
                    var base64data = reader.result;
                    $('#image_data').val(base64data);
                }
            });
        });
    }
}
