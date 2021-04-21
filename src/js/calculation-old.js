document.addEventListener('DOMContentLoaded', () => {

    let calcForm = document.forms.calculationForm;

    //Универсальный переключатель декоративных селектов и связь с реальным ++
    const selectAllElements = document.querySelectorAll('[data-select]');

    selectAllElements.forEach(item => {
        item.setAttribute('tabindex', 0);
        item.querySelector('.form-select__dropdown').style.overflowY = 'scroll';
        item.addEventListener('click', function (event) {
            //Реальный селект
            const realSelect = this.nextElementSibling;

            if (event.target.hasAttribute('data-select-item')) {
                //Клик по пунктам в dropdown
                let itemTitle = event.target.getAttribute('data-select-item');
                this.querySelector('[data-select-title]').textContent = event.target.textContent;
                this.querySelector('.form-select__dropdown').classList.toggle('hidden');


                realSelect.value = itemTitle;
            } else {
                //Клик по заголовку
                this.querySelector('.form-select__dropdown').classList.toggle('hidden');
            }

        });

    });

    //END Универсальный переключатель декоративных селектов и связь с реальным ++

    //Вызов обработчика формы
    processCalcForm(calcForm);

    //Обработка формы
    function processCalcForm(form) {
        for (let i = 0; i < form.elements.length; i++) {

            //Обработка декоративного селекта
            if (form.elements[i].className === 'form__custom-select' && form.elements[i].previousElementSibling.hasAttribute('data-select')) {
                form.elements[i].previousElementSibling.addEventListener('blur', function () {

                    if (form.elements[i].value !== 'none') {
                        this.querySelector('[data-select-title]').style.border = '2px solid green';
                    } else {
                        this.querySelector('[data-select-title]').style.border = '2px solid red';
                    }
                });
            }


            //Обработка всех полей формы
            if (form.elements[i].type !== 'button' && form.elements[i].type !== 'submit') {
                form.elements[i].setAttribute('required', 'required');

                //Валидация формы калькулятора
                form.elements[i].addEventListener('blur', validationCalcForm);
            }
        }

        //Обработка отправки формы
        form.addEventListener('submit', sendCalcForm);

    }

    //Валидация формы калькулятора
    function validationCalcForm() {
        if (this.value !== 'none' && this.value.trim()) {

            this.style.border = '1px solid green';

        } else {

            if (this.className === 'form__custom-select') {
                this.previousElementSibling.querySelector('[data-select-title]').style.border = '2px solid red';
            }

            this.style.border = '1px solid red';

            this.value = '';
        }
    }

    //Очистка формы
    function resetForm(form) {
        for (let i = 0; i < form.elements.length; i++) {

            if (form.elements[i].className === 'form__custom-select') {
                form.elements[i].previousElementSibling.querySelector('[data-select-title]').textContent = 'Выберите из списка';
                form.elements[i].previousElementSibling.querySelector('[data-select-title]').style.border = '1px solid #c1c4c7';
            }
            form.elements[i].value = '';
            form.elements[i].style.border = '1px solid #c1c4c7';

        }
    }

    //Отправка формы - вычисление стоимости доставки
    function sendCalcForm(event) {
        event.preventDefault();

        //Формируем объект с данными формы
        let data = {};


        //Перебор элементов формы
        for (let i in this.elements) {

            //Проверка наличия свойств
            if (this.elements.hasOwnProperty(i)) {
                if (this.elements[i].name) {
                    //Формируем объект с данными
                    data[this.elements[i].name] = this.elements[i].value;
                }
            }
        }

        //Сброс формы
        resetForm(this);
        //console.log(data);

        //Формируем объект данных калькулятора
        let obj = {
            "modelName": "InternetDocument",
            "calledMethod": "getDocumentPrice",
            "methodProperties": {
                "CitySender": data['cargo-city-from'],
                "CityRecipient": data['cargo-city-to'],
                "Weight": data['cargo-weight'],

                "ServiceType": data['cargo-option'],
                "Cost": "100",
                "CargoType": data['cargo-type'],
                "OptionsSeat": [
                    {
                        "volumetricVolume": data['cargo-volume'],
                        "volumetricWidth": data['cargo-width'],
                        "volumetricLength": data['cargo-length'],
                        "volumetricHeight": data['cargo-height'],
                        "weight": data['cargo-weight']
                    }],
                "SeatsAmount": "1"

            },
            "apiKey": apiKey
        };

        let xhr = new XMLHttpRequest();

        xhr.open('POST', 'https://api.novaposhta.ua/v2.0/json/');

        xhr.setRequestHeader('Content-type', 'application/json; charset = utf-8');

        //Отправка данных на сервер
        xhr.send(JSON.stringify(obj));

        //проверяем состояние запроса
        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState < 4) {

            } else if (xhr.readyState === 4 && xhr.status === 200) {

                let data = JSON.parse(xhr.response);

                for(let i = 0; i < data.data.length; i++) {
                    //Результат вычисления стоимости доставки
                    console.log(data.data[i].Cost);
                    console.log(data.data[i]);
                    new Popup().showPopup('#popup-result', data.data[i].Cost);
                    break;
                    //showPopup('#popup-result', data.data[i]);
                }

            } else {
                console.log('Что то пошло не так');
            }

        });

    }

    //API ключ NovaPoshta
    let apiKey = '04934ab23a2965497d012e4857e7527e';
    alert(apiKey);

    //API NovaPoshta

    //Тип груза
    let cargoType = calcForm.elements['cargo-type'];
    const cargoTypeObj = {
        "modelName": "Common",
        "calledMethod": "getCargoTypes",
        "methodProperties": {},
        "apiKey": apiKey
    };

    sendAjax(cargoType, cargoTypeObj);

    //Вариант доставки
    let cargoOptions = calcForm.elements['cargo-option'];
    const cargoOptionsObj = {
        "modelName": "Common",
        "calledMethod": "getServiceTypes",
        "apiKey": apiKey,
        "methodProperties": {}
    };

    sendAjax(cargoOptions, cargoOptionsObj);


    //Получение городов компании
    let cityTo = calcForm.elements['cargo-city-to'];
    let cityFrom = calcForm.elements['cargo-city-from'];

    checkKeyCity('Mycity', cityTo);
    checkKeyCity('Mycity', cityFrom);

    //Универсальный AJAX-запрос для селектов кроме городов
    function sendAjax(elem, reqObj, url = 'https://api.novaposhta.ua/v2.0/json/') {
    let xhr = new XMLHttpRequest();

    xhr.open('POST', url);

    xhr.setRequestHeader('Content-type', 'application/json; charset = utf-8');

    //Отправка данных на сервер
    xhr.send(JSON.stringify(reqObj));

    //проверяем состояние запроса
    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState < 4) {

        } else if (xhr.readyState === 4 && xhr.status === 200) {

            let type = JSON.parse(xhr.response);

            for(let i = 0; i < type.data.length; i++) {

                createOptions(type.data[i]);

                elem.append(createOptions(type.data[i]));
            }

            //Формируем данные в декоративном селекте
            if(elem.previousElementSibling.hasAttribute('data-select')){
                let select = elem.previousElementSibling.querySelector('.form-select__dropdown');

                for(let i = 0; i < type.data.length; i++) {
                    createSelectItem(type.data[i]);
                    select.append(createSelectItem(type.data[i]));
                }

            }

        } else {
            console.log('Что то пошло не так');
        }

    });
}

    //Создаем пункты реального селекта
    function createOptions(data){
    //Формируем рекальный селект
    let opt = document.createElement('option');
    opt.value = data.Ref;
    opt.textContent = data.Description;

    return opt;
}

    //Создаем пункты декоративного селекта
    function createSelectItem(data) {
    let selectItem = document.createElement('div');
    selectItem.classList.add('form-select__item');
    selectItem.setAttribute('data-select-item', data.Ref);
    selectItem.textContent = data.Description;
    return selectItem;
}

    //Получение куки
    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    //Загрузка городов в localStorage
    function getCities(){
        let date = new Date();
        date = new Date(date.setDate(date.getDate() + 1));


        let cityObj = {
            "modelName": "Address",
            "calledMethod": "getCities",
            "methodProperties": {},
            "apiKey": apiKey
        };

        let xhr = new XMLHttpRequest();

        xhr.open('POST', 'https://api.novaposhta.ua/v2.0/json/');

        xhr.setRequestHeader('Content-type', 'application/json; charset = utf-8');

        //Отправка данных на сервер
        xhr.send(JSON.stringify(cityObj));

        //проверяем состояние запроса
        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState < 4) {

            } else if (xhr.readyState === 4 && xhr.status === 200) {
                let city = [];
                let obj = {};

                let cities = JSON.parse(xhr.response);

                for (let i = 0; i < cities.data.length; i++) {


                    obj = {
                        Ref: cities.data[i].Ref,
                        Description: cities.data[i].Description
                    };

                    //Сформировали справочник населенных пунктов
                    city.push(obj);

                }

                localStorage.setItem('Mycity', JSON.stringify(city));

            } else {
                console.log('Что то пошло не так');
            }
        });

        document.cookie = `${decodeURI('cities')} = ${decodeURI(true)}; expires = ${date}; path = /`;
    }

    //Проверка наличие куки
    if(getCookie('cities') === undefined) {
        getCities();
    }

    //Проверка наличия ключа в localStorage
    function checkKeyCity(key, element){

        if (localStorage.getItem(key) !== null){
            let data = JSON.parse(localStorage.getItem(key));

            //Формируем данные в селекте
            for(let i = 0; i < data.length; i++) {

                createOptions(data[i]);

                element.append(createOptions(data[i]));
            }



            //Формируем данные в декоративном селекте
            if(element.previousElementSibling.hasAttribute('data-select')){
                let select = element.previousElementSibling.querySelector('.form-select__dropdown');
                select.overflowY = 'scroll';

                for(let i = 0; i < data.length; i++) {
                    createSelectItem(data[i]);
                    select.append(createSelectItem(data[i]));
                }
            }


            let el = element.previousElementSibling.querySelector('[data-select-title]');
            el.setAttribute('contenteditable', true);

            el.addEventListener('focus', function(){
                this.textContent = '';
            });


            //Живой поиск
            el.addEventListener('input', function(){

                element.previousElementSibling.querySelector('.form-select__dropdown').classList.remove('hidden');

                let val = this.textContent.trim().toLowerCase();

                let items = element.previousElementSibling.querySelectorAll('.form-select__item');


                if(val != ''){
                    items.forEach(function(elem) {
                        if(elem.textContent.toLowerCase().search(val) == -1) {
                            elem.classList.add('hidden');
                        }else{
                            elem.classList.remove('hidden');
                        }
                    });
                }else{
                    items.forEach(function(elem) {
                        elem.classList.remove('hidden');
                    });
                }
        });

        }
    }

//END Получение городов компании

});
