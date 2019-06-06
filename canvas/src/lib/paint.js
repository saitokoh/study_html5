(function() {
    // canvas取得
    const canvas = document.querySelector('#paint');
    const canvasPoint = canvas.getBoundingClientRect();

    // コンテキスト取得
    const ctx = canvas.getContext("2d");

    // 初期化処理
    let drawing = false; // true:描画中, false:Not描画中
    lineInit();
    changeDrawLineMode();

    // 初期化関数
    function lineInit() {
        ctx.lineCap = 'round';
        ctx.strokeStyle = document.querySelector('#color').value;
        ctx.lineWidth = document.querySelector('.bold').value;
        ctx.font = document.querySelector('.font_size').value + "px 'ＭＳ Ｐゴシック'";
    }

    // 描画モード変更
    function changeDrawLineMode() {
        canvas.removeEventListener('click', putString);
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mouseup', endDraw);
        canvas.addEventListener('mouseout', endDraw);
        canvas.addEventListener('mousemove', draw);
    }
    function changePutCharMode() {
        canvas.removeEventListener('mousedown', startDraw);
        canvas.removeEventListener('mouseup', endDraw);
        canvas.removeEventListener('mouseout', endDraw);
        canvas.removeEventListener('mousemove', draw);
        canvas.addEventListener('click', putString);
    }

    // 線描画関数
    function draw(e) {
        if (drawing) {
            endX = e.clientX - canvasPoint.left + document.scrollingElement.scrollLeft;
            endY = e.clientY - canvasPoint.top + document.scrollingElement.scrollTop;
            ctx.beginPath();
            ctx.moveTo(startX,startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            ctx.closePath();
            startX = endX;
            startY = endY;
        }
    }
    function startDraw(e) {
        drawing = true;
        startX = e.clientX - canvasPoint.left + document.scrollingElement.scrollLeft;
        startY = e.clientY - canvasPoint.top + document.scrollingElement.scrollTop;
        draw(e);
    }
    function endDraw() {
        drawing = false;
    }

    // 文字列描画関数
    function putString(e) {
        const x = e.clientX - canvasPoint.left + document.scrollingElement.scrollLeft;
        const y = e.clientY - canvasPoint.top + document.scrollingElement.scrollTop;
        const str = document.querySelector('#string').value;
        ctx.fillStyle = document.querySelector('#color').value;
        ctx.fillText(str, x, y);
    }

    // 色の変更
    document.querySelector('#color').addEventListener('change', e => {
        ctx.strokeStyle = e.target.value;
    });

    // 太さの変更
    document.querySelectorAll('.bold').forEach(bold => bold.addEventListener('change', e => {
        document.querySelectorAll('.bold').forEach(elem => {
            elem.value = e.target.value;
        });
        ctx.lineWidth = e.target.value;
    }));

    // 描画形式切り替え
    document.querySelectorAll('.drawing_mode').forEach(drawingMode => drawingMode.addEventListener('change', e => {
        if (e.target.id === "pencil") {
            changeDrawLineMode();
            ctx.globalCompositeOperation = "source-over";
            document.querySelector('#string').disabled = true;
            document.querySelectorAll('.font_size').forEach(fontSize => fontSize.disabled = true);
        } else if (e.target.id === "eraser") {
            changeDrawLineMode();
            ctx.globalCompositeOperation = "destination-out";
            document.querySelector('#string').disabled = true;
            document.querySelectorAll('.font_size').forEach(fontSize => fontSize.disabled = true);
        } else if (e.target.id === "char") {
            changePutCharMode();
            ctx.globalCompositeOperation = "source-over";
            document.querySelector('#string').disabled = false;
            document.querySelectorAll('.font_size').forEach(fontSize => fontSize.disabled = false);
        }
    }));

    // クリア
    document.querySelector('#clear').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // 画像取り込み
    document.querySelector('#image').addEventListener('change', e => {
        if (e.target.value === '') {
            return;
        }
        const image = new Image();
        const fr = new FileReader();
        fr.onload = (event) => {
            image.onload = () => {
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
                document.querySelector('#canvas_width').value = image.naturalWidth;
                document.querySelector('#canvas_height').value = image.naturalHeight;
                lineInit();
            }
            image.src = event.target.result;
        }
        fr.readAsDataURL(e.target.files[0]);
        e.target.value = "";
    });

    // キャンバスサイズ変更
    document.querySelector('#canvas_size_change').addEventListener('click', () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = document.querySelector('#canvas_width').value;
        canvas.height = document.querySelector('#canvas_height').value;
        ctx.putImageData(imageData, 0, 0);
        lineInit();
    });

    // フォントサイズの変更
    document.querySelectorAll('.font_size').forEach(fontSize => fontSize.addEventListener('change', e => {
        document.querySelectorAll('.font_size').forEach(elem => {
            elem.value = e.target.value;
        });
        ctx.font = e.target.value + "px 'ＭＳ Ｐゴシック'";
    }));
})();