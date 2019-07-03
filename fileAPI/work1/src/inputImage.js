(function(){
    // 画像表示領域の取得
    const imageInsertDiv = document.querySelector('#image_area');

    // input[type=file]のイベント設定
    document.querySelector('#image_input').addEventListener('change', e => {
        // 1. FileListオブジェクトを取得
        const fileList = e.target.files;
        // 2. FileListオブジェクトからFileオブジェクトを取得
        const file = fileList[0];

        const fileReader = new FileReader();
        fileReader.onload = e => {
            // 4. 読み込んだデータをあれこれする（画面に表示する）
            const result = e.target.result;
            const img = document.createElement('img');
            img.src = result;
            imageInsertDiv.appendChild(img);
        };

        // 3. FileReaderAPIでFileオブジェクトのファイルを実際に読み込む
        fileReader.readAsDataURL(file);
    });
}())