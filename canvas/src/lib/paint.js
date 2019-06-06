(function() {
    // canvas取得
    const canvas = document.querySelector('#paint');
    const canvasPoint = canvas.getBoundingClientRect();

    // コンテキスト取得
    const ctx = canvas.getContext("2d");

    // 初期化処理
    let drawing = false; // true:描画中, false:Not描画中
    lineInit();
    
    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mouseup', endDraw);
    canvas.addEventListener('mouseout', endDraw);
    canvas.addEventListener('mousemove', draw);

    // 初期化関数
    function lineInit() {
        ctx.lineCap = 'round';
        ctx.strokeStyle = document.querySelector('#color').value;
        ctx.lineWidth = document.querySelector('.bold').value;
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
            ctx.globalCompositeOperation = "source-over";
        } else if (e.target.id === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
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
                lineInit();
            }
            image.src = event.target.result;
        }
        fr.readAsDataURL(e.target.files[0]);
        e.target.value = "";
    });
})();