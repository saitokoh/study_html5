(function() {
    // canvas取得
    const canvas = document.querySelector('#paint');
    const canvasPoint = canvas.getBoundingClientRect();

    // コンテキスト取得
    const ctx = canvas.getContext("2d");

    // 頻出要素取得
    const colorElem = document.querySelector('#color');
    const boldElems = document.querySelectorAll('.bold');
    const stampStrElem = document.querySelector('#string');
    const fontSizeElems = document.querySelectorAll('.font_size');

    // 初期化処理
    let drawing = false; // true:描画中, false:Not描画中
    lineInit();
    changeDrawLineMode();

    // 初期化関数
    function lineInit() {
        ctx.lineCap = 'round';
        ctx.strokeStyle = colorElem.value;
        ctx.lineWidth = boldElems[0].value;
        ctx.font = fontSizeElems[0].value + "px 'ＭＳ Ｐゴシック'";
    }

    // 描画モード変更
    function changeDrawLineMode(compositeOperationType) {
        // イベントの付け替え
        canvas.removeEventListener('click', putString);
        canvas.addEventListener('mousedown', startDraw);
        canvas.addEventListener('mouseup', endDraw);
        canvas.addEventListener('mouseout', endDraw);
        canvas.addEventListener('mousemove', draw);

        // 合成処理の付け替え
        ctx.globalCompositeOperation = compositeOperationType;

        // 表示切り替え
        stampStrElem.disabled = true;
        fontSizeElems.forEach(fontSize => fontSize.disabled = true);
    }
    function changePutCharMode() {
        // イベントの付け替え
        canvas.removeEventListener('mousedown', startDraw);
        canvas.removeEventListener('mouseup', endDraw);
        canvas.removeEventListener('mouseout', endDraw);
        canvas.removeEventListener('mousemove', draw);
        canvas.addEventListener('click', putString);

        // 合成処理の付け替え
        ctx.globalCompositeOperation = 'source-over';

        // 表示切替
        stampStrElem.disabled = false;
        fontSizeElems.forEach(fontSize => fontSize.disabled = false);
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
        // その場でクリックした時用の描画処理
        draw(e);
    }
    function endDraw() {
        drawing = false;
    }

    // 文字列描画関数
    function putString(e) {
        const x = e.clientX - canvasPoint.left + document.scrollingElement.scrollLeft;
        const y = e.clientY - canvasPoint.top + document.scrollingElement.scrollTop;
        const str = stampStrElem.value;
        ctx.fillStyle = colorElem.value;
        ctx.fillText(str, x, y);
    }

    // 色の変更
    colorElem.addEventListener('change', e => {
        ctx.strokeStyle = e.target.value;
    });

    // 太さの変更
    boldElems.forEach(bold => bold.addEventListener('change', e => {
        boldElems.forEach(elem => {
            elem.value = e.target.value;
        });
        ctx.lineWidth = e.target.value;
    }));

    // 描画形式切り替え
    document.querySelector('#pencil').addEventListener('click', () => {
        changeDrawLineMode('source-over');
    });
    document.querySelector('#eraser').addEventListener('click', () => {
        changeDrawLineMode('destination-out');
    });
    document.querySelector('#char').addEventListener('click', () => {
        changePutCharMode();
    });

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
    fontSizeElems.forEach(fontSize => fontSize.addEventListener('change', e => {
        fontSizeElems.forEach(elem => {
            elem.value = e.target.value;
        });
        ctx.font = e.target.value + "px 'ＭＳ Ｐゴシック'";
    }));

    // フィルタ
    document.querySelectorAll('.filter').forEach(filter => filter.addEventListener('click', e => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        filtering[e.target.value](imageData.data);
        ctx.putImageData(imageData, 0, 0);
    }));

    // フィルタリングオブジェクト
    const filtering = {
        // グレースケール
        toGrayscale: (data) => {
            for (let i = 0; i < data.length; i += 4) {
                const color = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = color;
            }
        },
        // ネガポジ補正
        toNegative: (data) => {
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
        },
        // 二値化
        toBinarization: (data) => {
            const threshold =  255/2;
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = threshold < avg ? 255 : 0;
            }
        },
        // ガンマ補正
        toGamma: (data) => {
            const gamma = 2.0;
            const correctify = val => 255 * Math.pow(val / 255, 1 / gamma);
            for (let i = 0; i < data.length; i += 4) {
                data[i] = correctify(data[i]);
                data[i + 1] = correctify(data[i + 1]);
                data[i + 2] = correctify(data[i + 2]);
            }
        },
        // ぼかし
        toBlur: (data) => {
            const width = canvas.width;
            const _data = data.slice();
            const avgColor = (color, i) => {
                const prevLine = i - (width * 4);
                const nextLine = i + (width * 4);

                const sumPrevLineColor = _data[prevLine - 4 + color] + _data[prevLine + color] + _data[prevLine + 4 + color];
                const sumCurrLineColor = _data[i - 4 + color] + _data[i + color] + _data[i + 4 + color];
                const sumNextLineColor = _data[nextLine - 4 + color] + _data[nextLine + color] + _data[nextLine + 4 + color];

                return (sumPrevLineColor + sumCurrLineColor + sumNextLineColor) / 9
            };

            // 2行目〜n-1行目
            for (let i = width * 4; i < data.length - (width * 4); i += 4) {
                // 2列目〜n-1列目
                if (i % (width * 4) === 0 || i % ((width * 4) + 300) === 0) {
                    // nop
                } else {
                    data[i] = avgColor(0, i);
                    data[i + 1] = avgColor(1, i);
                    data[i + 2] = avgColor(2, i);
                }
            }
        },
        // シャープネス
        toSharpness: (data) => {
            const width = canvas.width;
            const _data = data.slice();
            const sharpedColor = (color, i) => {
                // 係数
                const sub = -1;
                const main = 10;

                const prevLine = i - (width * 4);
                const nextLine = i + (width * 4);

                const sumPrevLineColor = (_data[prevLine - 4 + color] * sub) + (_data[prevLine + color] * sub) + (_data[prevLine + 4 + color] * sub);
                const sumCurrLineColor = (_data[i - 4 + color] * sub) + (_data[i + color] * main) + (_data[i + 4 + color] * sub);
                const sumNextLineColor = (_data[nextLine - 4 + color] * sub) + (_data[nextLine + color] * sub) + (_data[nextLine + 4 + color] * sub);

                return (sumPrevLineColor + sumCurrLineColor + sumNextLineColor) / 2
            };

            // 2行目〜n-1行目
            for (let i = width * 4; i < data.length - (width * 4); i += 4) {
                // 2列目〜n-1列目
                if (i % (width * 4) === 0 || i % ((width * 4) + 300) === 0) {
                    // nop
                } else {
                    data[i] = sharpedColor(0, i);
                    data[i + 1] = sharpedColor(1, i);
                    data[i + 2] = sharpedColor(2, i);
                }
            }
        },
        // ノイズ除去
        toMedian: (data) => {
            const width = canvas.width;
            const _data = data.slice();
            const getMedian = (color, i) => {
                // 3x3の中央値を取得
                const prevLine = i - (width * 4);
                const nextLine = i + (width * 4);

                const colors = [
                    _data[prevLine - 4 + color], _data[prevLine + color], _data[prevLine + 4 + color],
                    _data[i - 4 + color], _data[i + color], _data[i + 4 + color],
                    _data[nextLine - 4 + color], _data[nextLine + color], _data[nextLine + 4 + color],
                ];

                colors.sort((a, b) => a - b);
                return colors[Math.floor(colors.length / 2)];
            };

            // 2行目〜n-1行目
            for (let i = width * 4; i < data.length - (width * 4); i += 4) {
                // 2列目〜n-1列目
                if (i % (width * 4) === 0 || i % ((width * 4) + 300) === 0) {
                    // nop
                } else {
                    data[i] = getMedian(0, i);
                    data[i + 1] = getMedian(1, i);
                    data[i + 2] = getMedian(2, i);
                }
            }
        },
        // エンボス
        toEmbossing: (data) => {
            const width = canvas.width;
            const _data = data.slice();
            const embossColor = (color, i) => {
                const prevLine = i - (width * 4);
                return ((_data[prevLine - 4 + color] * -1) + _data[i + color]) + (255 / 2);
            };

            // 2行目〜n-1行目
            for (let i = width * 4; i < data.length - (width * 4); i += 4) {
                // 2列目〜n-1列目
                if (i % (width * 4) === 0 || i % ((width * 4) + 300) === 0) {
                    // nop
                } else {
                    data[i] = embossColor(0, i);
                    data[i + 1] = embossColor(1, i);
                    data[i + 2] = embossColor(2, i);
                }
            }
        },
        // モザイク
        toMosaic: (data) => {
            const width = canvas.width;
            const height = canvas.height;
            const _data = data.slice();
            const avgColor = (i, j, color) => {
                // 3x3の平均値
                const prev = (((i - 1) * width) + j) * 4;
                const curr = ((i * width) + j) * 4;
                const next = (((i + 1) * width) + j) * 4;

                const sumPrevLineColor = _data[prev - 4 + color] + _data[prev + color] + _data[prev + 4 + color];
                const sumCurrLineColor = _data[curr - 4 + color] + _data[curr + color] + _data[curr + 4 + color];
                const sumNextLineColor = _data[next - 4 + color] + _data[next + color] + _data[next + 4 + color];

                return (sumPrevLineColor + sumCurrLineColor + sumNextLineColor) / 9;
            };

            // 3x3ブロックずつ色をぬる
            for (let i = 1; i < width; i += 3) {
                for (let j = 1; j < height; j += 3) {

                    const prev = (((i - 1) * width) + j) * 4;
                    const curr = ((i * width) + j) * 4;
                    const next = (((i + 1) * width) + j) * 4;

                    ['r', 'g', 'b'].forEach((_, color) => {
                        data[prev - 4 + color] = data[prev + color] = data[prev + 4 + color] = avgColor(i, j, color);
                        data[curr - 4 + color] = data[curr + color] = data[curr + 4 + color] = avgColor(i, j, color);
                        data[next - 4 + color] = data[next + color] = data[next + 4 + color] = avgColor(i, j, color);
                    });
                }
            }
        }
    }
})();