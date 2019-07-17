(function(){
    const dropzones = document.querySelectorAll(".dropzone");
    
    document.querySelectorAll(".animal").forEach(animal => {
        // 各img要素にdragstartイベントの関数を設定
        animal.addEventListener("dragstart", e => {
            const draggable = e.target.getAttribute('draggable');
            // 明示的にdraggableにしている要素以外はドラッグ禁止
            if (!draggable || draggable === 'auto') {
                e.preventDefault();
                return;
            }
            e.dataTransfer.setData("id", e.target.id);
            e.target.classList.add("active");
            dropzones.forEach(dropzone => {
                dropzone.classList.add("dragstart");
            });
        });

        // ドラッグが終了したときの処理
        animal.addEventListener("dragend", e => {
            e.target.classList.remove("active");
            dropzones.forEach(dropzone => {
                dropzone.classList.remove("dragenter");
                dropzone.classList.remove("dragstart");
            });
        });
    });

    dropzones.forEach(dropzone => {
        // ドロップを許すために、ドラッグ先の既存のdragoverイベントの処理をキャンセル
        dropzone.addEventListener("dragover", e => {
            e.preventDefault();
        });

        // ドロップをした時の処理
        dropzone.addEventListener("drop", e => {
            const id = e.dataTransfer.getData("id");
            const imgElem = document.getElementById(id);
            e.currentTarget.append(imgElem);
            // 既存のdropイベントの処理をキャンセル
            e.preventDefault();
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
    });
})()