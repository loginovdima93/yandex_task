class Form {
    constructor() {
        document.getElementById('myForm').addEventListener('submit', this.submit.bind(this));
        this.validate = this.validate.bind(this);
        this.getData = this.getData.bind(this);
        this.setData = this.setData.bind(this);
        this.submit = this.submit.bind(this);
    }

//Прохождение валидации введенных значений
    validate() {
        let isValid = true; //Для возвращения объекта с результатом валидации
        let errorFields = []; //Для получения непрошедших валидацию

        const checkDomain = document.getElementById('email').value.replace(/.*@/, '');
        const neededDomain = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];


        if (!neededDomain.includes(checkDomain)) {
            isValid = false;
            errorFields.push('email');
        }

        const fio = document.getElementById('fio').value;
        const fioCountWords = document.getElementById('fio').value.trim().split(/\s+/).length;
        const fioTotalWords = 3;

        if (fioCountWords !== fioTotalWords) {
            isValid = false;
            errorFields.push('fio');
        }

        if (!/^[a-zA-Z а-яА-ЯёЁ]*$/g.test(fio)) {
            isValid = false;
            errorFields.push('fio');
        }

        const phoneNumber = document.getElementById('phone').value;
        const phoneMask = new RegExp(/^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/);
        const maxSumOfNumbers = 30;

        let sumOfNumbers = (number) => {
            return number.match(/\d/g).reduce((a, b) => +a + +b);
        };

        if (phoneMask.test(phoneNumber)) {
            if (sumOfNumbers(phoneNumber) >= maxSumOfNumbers) {
                isValid = false;
                errorFields.push('phone');
            }

        } else {
            isValid = false;
            errorFields.push('phone');
        }

        return {
            isValid: isValid,
            errorFields: errorFields
        };

    }

//Возвращение объекта с совпадающими данными формы
    getData() {
        return [].reduce.call(document.getElementById('myForm').Elements, (data, element2) => {
            let isValidElements = (element2) => {
            return element1.name === element2.type;
    };

        if (isValidElements(element2)) {
            data[element2.name] = element2.value;
        }

        return data;
    }, {});
    }

//Прием объекта с данными формы с их расстановкой по input'ам
    setData(data) {
        const form = document.getElementById('myForm');

        for (let [key, value] of Object.entries(data)) {
            if (key === 'fio' || key === 'email' || key === 'phone') {
                if (form.Elements[key]) {
                    form.Elements[key].value = value;
                }
            }
        }
    }

//Отправка AJAX-запроса при успешном прохождении валидации
    submit(event) {
        if (typeof event !== 'undefined') {
            event.preventDefault();
        }

        let validationResult = this.validate();
        const resultContainer = document.getElementById('resultContainer');
        const submitButton = document.getElementById('submitButton');

        for (let input of document.getElementsByTagName('input')) {
            input.classList.remove('error');
        }

        resultContainer.className = '';
        resultContainer.innerHTML = '';

        if (validationResult.isValid) {
            submitButton.disabled = true;

            let fetchJSONFile = () => {
                const xhr = new XMLHttpRequest();

                xhr.open('GET', document.getElementById('myForm').action, false);
                xhr.send();
                const successStatusCode = 200;
                const operationCompleteCode = 4;

                if (xhr.readyState === operationCompleteCode) {
                    if (xhr.status === successStatusCode) {
                        let data = JSON.parse(xhr.responseText);

                        if (data.status === 'success') {
                            resultContainer.className = 'success';
                            resultContainer.innerHTML = 'success';
                        } else if (data.status === 'error') {
                            resultContainer.className = 'error';
                            resultContainer.innerHTML = data.reason;
                        } else if (data.status === 'progress') {
                            resultContainer.className = 'progress';
                            setTimeout(() => {
                                fetchJSONFile();
                        }, data.timeout);
                        }
                    }
                }
            };

            fetchJSONFile();

        } else {
            for (let value of validationResult.errorFields) {
                document.getElementById(value).className = 'error';
            }
        }
    }
}

const MyForm = new Form();
