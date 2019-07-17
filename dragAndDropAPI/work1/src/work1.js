(function () {
    const dropzone = document.querySelector(".dropzone");

    document.querySelectorAll(".animal").forEach(animal => {
        // 各img要素にdragstartイベントの関数を設定
        animal.addEventListener("dragstart", e => {
            e.dataTransfer.setData("id", e.target.id);
        });
    });

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
})()