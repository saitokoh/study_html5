(function(){
    // 画像表示領域の取得
    const imageInsertDiv = document.querySelector('#image_area');

    const errorMessage = {
        noFile: "ファイルを１つ以上選択してください。",
        overFileSize: "ファイルサイズは500kbyteまでです。",
        wrongFileFormat: "ファイル形式はjpegかpngのみです。"
    }

    const createError = errorStr => {
        const errorP = document.createElement('p');
        errorP.textContent = errorStr;
        return errorP;
    }

    // input[type=file]のイベント設定
    document.querySelector('#image_input').addEventListener('change', e => {
        // イメージ貼り付け領域の初期化
        while (imageInsertDiv.firstChild) {
            imageInsertDiv.removeChild(imageInsertDiv.firstChild);
        }

        const fileList = e.target.files;

        // ファイル数チェック
        if (fileList.length === 0) {
            imageInsertDiv.appendChild(createError(errorMessage.noFile));
            return;
        }

        // ファイルチェック
        for (const file of fileList) {
            // ファイルサイズチェック
            if (file.size > 500000 ) {
                imageInsertDiv.appendChild(createError(errorMessage.overFileSize));
                return;
            }
            // ファイル種類チェック
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                imageInsertDiv.appendChild(createError(errorMessage.wrongFileFormat));
                return;
            }
        }
        
        // ファイル読み込み->表示
        for (const file of fileList) {
            const fileReader = new FileReader();
            fileReader.onload = e => {
                const result = e.target.result;
                const img = document.createElement('img');
                img.src = result;
                imageInsertDiv.appendChild(img);
            };
            fileReader.readAsDataURL(file);
        }
        
    });
}())