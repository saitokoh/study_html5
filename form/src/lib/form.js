const errorMessages = {
    valueMissing: "必須入力項目です",
    tooLong: (size) => {
        return size + "文字以下で入力してください";
    },
    tooShort: (size) => {
        return size + "文字以上で入力してください";
    },
    typeMismatch: {
        email: "@を含んだ文字列を入力してください",
        url: "「http://」もしくは「https://」から始まる文字列を入力してください"
    },
    rangeOverflow: (size) => {
        return size + "以下で入力してください";
    },
    rangeUnderflow: (size) => {
        return size + "以上で入力してください";
    },
    typeMismatch: {
        email: "@を含んだ文字列を入力してください",
        url: "「http://」もしくは「https://」から始まる文字列を入力してください"
    },
    patternMismatch: {
        tel: "1～5桁-1～4桁-4～5桁の形式で入力してください",
        file: "JPEG,PNG,GIFのいずれかの形式の画像を指定してください"
    },
    notEqurl: {
        password: "パスワードが一致しません"
    }
}

const form = document.querySelector('form');

// 親要素(form)にイベントをつけると子要素のイベントが拾える
form.addEventListener('focusout', addFocused);
document.querySelector('#agreement').addEventListener('input', validate);

function addFocused(e) {
    e.target.classList.add("focused");
    validate(e);
}

function validate(e) {
    const target = e.target;
    const type = target.type;
    const validity = target.validity;

    if (type === 'reset') {
        return;
    }
    // HTML5バリデーション
    if (!target.checkValidity()) {
        let errorMessage = "";
        if (validity.patternMismatch) {
            errorMessage = errorMessages.patternMismatch[type];
        } else if (validity.rangeOverflow) {
            errorMessage = errorMessages.rangeOverflow(target.max);
        } else if (validity.rangeUnderflow) {
            errorMessage = errorMessages.rangeUnderflow(target.min);
        } else if (validity.tooLong) {
            errorMessage = errorMessages.tooLong(target.maxLength);
        } else if (validity.tooShort) {
            errorMessage = errorMessages.tooShort(target.minLength);
        } else if (validity.typeMismatch) {
            errorMessage = errorMessages.typeMismatch[type];
        } else if (validity.valueMissing) {
            errorMessage = errorMessages.valueMissing;
        }
        target.setCustomValidity(errorMessage);
        target.nextElementSibling.textContent = errorMessage;
        target.nextElementSibling.style.display = errorMessage === '' ? 'none' : 'inline';
    } else {
        target.setCustomValidity("");
        target.nextElementSibling.textContent = "";
        target.nextElementSibling.style.display = 'none';
    }

    // カスタムバリデーション
    if (type === 'password' && target.name === 'passwordConfirm') {
        const passwords = document.querySelectorAll('input[type="password"]');
        if (passwords[0].value !== passwords[1].value) {
            target.setCustomValidity(errorMessages.notEqurl[type]);
            target.nextElementSibling.textContent = errorMessages.notEqurl[type]
            target.nextElementSibling.style.display = 'inline';
        } else {
            target.setCustomValidity("");
            target.nextElementSibling.textContent = "";
            target.nextElementSibling.style.display = 'none';
        }
    }

    // submitボタン活性/非活性の処理
    document.querySelector('button[type="submit"]').disabled = !form.checkValidity();
}