document.addEventListener('DOMContentLoaded', () => {

    const apiKey = `04934ab23a2965497d012e4857e7527e`;
    const apiUrl = `https://api.novaposhta.ua/v2.0/json/`;
    let calcForm = document.forms.calculationForm;

    const cityTo = calcForm.elements['cargo-city-to'];
    const cityFrom = calcForm.elements['cargo-city-from'];
    const cargoType = calcForm.elements['cargo-type'];
    const cargoDelivery = calcForm.elements['cargo-option'];

    //Универсальный переключатель декоративных селектов и связь с реальным
    const selectAllElements = document.querySelectorAll('[data-select]');

    selectAllElements.forEach(item => {
        item.setAttribute('tabindex', 0);
       item.querySelector('.form-select__dropdown').style.overflowY = 'scroll';

       item.addEventListener('click', function(event){
           const realSelect = this.nextElementSibling;

           //Клик по пунктам в dropdown
           if(event.target.hasAttribute('data-select-item')){
               let itemTitle = event.target.getAttribute('data-select-item');
               this.querySelector('[data-select-title]').textContent = event.target.textContent;
               this.querySelector('.form-select__dropdown').classList.toggle('hidden');
               realSelect.value = itemTitle;
           }else{
               //Клик по заголовку
               this.querySelector('.form-select__dropdown').classList.toggle('hidden');
           }

       });
    });

    //Обработкм формы
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



    //Проверка наличия cookies
    const getCookie = name => {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    //Real option
    const createOption = data => {
        const option = document.createElement('option');
        option.value = data.Ref;
        option.innerText = data.Description
        return option;
    }

    //Fake option
    const createSelectItem = data => {
        const selectItem = document.createElement('div');
        selectItem.classList.add('form-select__item');
        selectItem.setAttribute('data-select-item', data.Ref);
        selectItem.textContent = data.Description;
        return selectItem;
    }

    //Загрузка городов компании
    const loadCity = async (url, data) => {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(data), // тип данных в body должен соответвовать значению заголовка "Content-Type"})
        })
        return await response.json();
    }

    //Получение городов компании
    const getCities = () => {
        let date = new Date();
        date = new Date(date.setDate(date.getDate() + 1));

        //Ответ для сервера
        const cityObj = {
            "modelName": "Address",
            "calledMethod": "getCities",
            "methodProperties": {},
            "apiKey": apiKey
        };

        loadCity(apiUrl, cityObj)
            .then(data => {
                //Формируем справочник городов компании
                const cities = data.data.map(item => {
                    const city = {
                        Description: item.Description,
                        Ref: item.Ref
                    };
                    return city;
                });

                //Готовый справочник городов компании
                localStorage.setItem('cities', JSON.stringify(cities));
                document.cookie = `${decodeURI('cities')} = ${decodeURI(true)}; expires = ${date}; path = /`;

                checkKey('cities', cityTo);
                checkKey('cities', cityFrom);
            })
            .catch(error => {
                console.log(error);
            })
    }


    //Проверка наличия городов в справочнике
    if(getCookie('cities') === undefined){
        getCities();
    }


    //Тип груза
    const cargoTypeObj = {
        "modelName": "Common",
        "calledMethod": "getCargoTypes",
        "methodProperties": {},
        "apiKey": apiKey
    };

    //Вид отправки
    const deliveryTypeObj = {
        "modelName": "Common",
        "calledMethod": "getServiceTypes",
        "apiKey": apiKey,
        "methodProperties": {}
    };

    //Получение данных тип груза, вид отправки
    const loadSubParams = async(url, obj) => {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(obj), // тип данных в body должен соответвовать значению заголовка "Content-Type"})
        })
        return await response.json();
    }

    //Формируем списки тип доставки, тип груза
    const getContentField = (elem, url, objParams) => {
        loadSubParams(url, objParams)
            .then(data => {
                //Формруем список данных
                data.data.forEach(item => {
                    const option = createOption(item);
                    elem.append(option);
                });

                //Формируем данные в декоративном селекте
                if(elem.previousElementSibling.hasAttribute(['data-select'])){
                    const select = elem.previousElementSibling.querySelector('.form-select__dropdown');
                    select.style.overflowY = 'scroll';

                    for(let i = 0; i < data.data.length; i++){
                        const selectItem = createSelectItem(data.data[i]);
                        select.append(selectItem);
                    }
                }
            })
    }

    //Тип товара
    getContentField(cargoType, apiUrl, cargoTypeObj);
    //Вариант отправки
    getContentField(cargoDelivery, apiUrl, deliveryTypeObj);

    //Проверка данных в localstorage
    const checkKey = (keyName, elem) => {
        if (localStorage.getItem(keyName) !== null) {

            const data = JSON.parse(localStorage.getItem(keyName));
            //console.log(data);

            //Формруем список данных
            data.forEach(item => {
                const option = createOption(item);
                elem.append(option);
            });

            //Формируем данные в декоративном селекте
            if (elem.previousElementSibling.hasAttribute(['data-select'])) {
                const select = elem.previousElementSibling.querySelector('.form-select__dropdown');
                select.style.overflowY = 'scroll';

                for (let i = 0; i < data.length; i++) {
                    const selectItem = createSelectItem(data[i]);
                    select.append(selectItem);
                }
            }

            //Live Search
            let selectTitle = elem.previousElementSibling.querySelector('[data-select-title]');
            selectTitle.setAttribute('contenteditable', true);

            selectTitle.addEventListener('focus', function () {
                this.textContent = '';
            });

            selectTitle.addEventListener('input', function () {
                elem.previousElementSibling.querySelector('.form-select__dropdown').classList.remove('hidden');

                let value = this.textContent.trim().toLowerCase();
                let items = elem.previousElementSibling.querySelectorAll('.form-select__item');

                if (value !== '') {
                    items.forEach(item => {
                        if (item.textContent.toLowerCase().search(value) == -1) {
                            item.classList.add('hidden');
                        } else {
                            item.classList.remove('hidden');
                        }
                    });
                } else {
                    items.forEach(item => {
                        item.classList.remove('hidden');
                    });
                }
            });
            //END Live Search
        }
    }

    //Формирование списка городов из localStorage
    checkKey('cities', cityTo);
    checkKey('cities', cityFrom);


    //Отправка формы
    function sendCalcForm(event){
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

        fetch(apiUrl, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(obj)
        })
            .then(response => {
                return response.json()
            })
            .then(data => {
                //Вывод модального окна с результатом
                new Popup().showPopup('#popup-result', data.data[0].Cost);
            })
            .catch(error => {
                console.log(error);
            })
    }

});
