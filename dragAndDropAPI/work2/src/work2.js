(function(){
    const dropzone = document.querySelector("#dropzone");
    
    // ドロップを許すために、ドラッグ先の既存のdragoverイベントの処理をキャンセル
    dropzone.addEventListener("dragover", e => {
        e.preventDefault();
    });

    // ドロップをした時の処理
    dropzone.addEventListener("drop", e => {
        const target = e.currentTarget;
        // 既存のdropイベントの処理をキャンセル
        e.stopPropagation();
        e.preventDefault();
        // fileListオブジェクトを取得
        const fileList = e.dataTransfer.files;
        for(file of fileList) {
            const fileReader = new FileReader();
            fileReader.addEventListener('load', e => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.width = 200;
                dropzone.appendChild(img);
            });
            fileReader.readAsDataURL(file);
        }

        dropzone.classList.remove("dragenter");
    });

    // ドロップ領域に入ったときの処理
    dropzone.addEventListener("dragenter", e => {
        dropzone.classList.remove("dragstart");
        dropzone.classList.add("dragenter");
    });

    // ドロップ領域から出たときの処理
    dropzone.addEventListener("dragleave", e => {
        dropzone.classList.remove("dragenter");
        dropzone.classList.add("dragstart");
    });
})()