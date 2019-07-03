(function () {
    // Table領域の取得
    const tableInsertDiv = document.querySelector('#table_area');

    // 読み込まれているfile
    let file;

    const errorMessage = {
        noFile: "ファイルを選択してください。",
        overFileNum: "ファイルは１つだけ選択してください。",
        wrongFileFormat: "CSVファイルを選択してください。"
    };

    const createError = errorStr => {
        const errorP = document.createElement('p');
        errorP.textContent = errorStr;
        return errorP;
    };

    const convertor = {
        csv2table: csvStr => {
            const table = document.createElement('table');
            for (const row of csvStr.split("\n")) {
                const tr = document.createElement('tr');
                for (const value of row.split(",")) {
                    const td = document.createElement('td');
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = value;
                    td.appendChild(input)
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            return table;    
        },
        table2csv: tableElem => {
            return Array.from(tableElem.querySelectorAll('tr'))
                .map(tr => 
                    // 配列を用意してjoinなら、1行ずつAllocateされる
                    Array.from(tr.querySelectorAll('input'))
                        .map(input => input.value
                ).join(',')
            ).join("\n")
        }
    }

    // 読み込みボタンクリックイベント
    document.querySelector('#input_button').addEventListener('click', () => {
        const fileList = document.querySelector('#csv_input').files;
        tableInsertDiv.removeChild
        // 読み込み数チェック
        if (fileList.length === 0) {
            tableInsertDiv.appendChild(createError(errorMessage.noFile));
            return;
        }
        if (fileList.length > 1) {
            tableInsertDiv.appendChild(createError(errorMessage.overFileNum));
            return;
        }

        file = fileList[0];
        // ファイルの拡張子チェック
        if (!file.name.toLowerCase().endsWith('.csv')) {
            tableInsertDiv.appendChild(createError(errorMessage.wrongFileFormat));
            return;
        }

        // 初期化
        while (tableInsertDiv.firstChild) {
            tableInsertDiv.removeChild(tableInsertDiv.firstChild);
        }

        // ファイル読み込み->表示
        const fileReader = new FileReader();
        fileReader.onload = e => {
            const table = convertor.csv2table(e.target.result)
            tableInsertDiv.appendChild(table);
        };
        fileReader.readAsText(file);
    });

    // 保存ボタンのクリックイベント
    document.querySelector('#save_button').addEventListener('click', () => {
        const table = document.querySelector('table');
        if (table === null) {
            return;
        }
        const csv = convertor.table2csv(table);
        const a = document.createElement('a');
        a.href = 'data:text/csv,' + encodeURIComponent(csv);
        a.download = file.name;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
}())