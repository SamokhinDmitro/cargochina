class SendForm{
    constructor(){
        //Подсказка
        let info = this.info = document.createElement('div');
        let glob = this.glob = this;
        info.classList.add('warning');

        //Статус AJAX запроса
        let message = this.message = {
            loading: 'Загрузка...',
            success: 'Спасибо! Скоро мы с вами свяжемся',
            error: 'Что-то пошло не так',
            phone: 'Введите телефон!'
        };
    }

    //Обработка формы
    processForm(form) {

        for (let i = 0; i < form.elements.length; i++) {
            if (form.elements[i].type !== 'submit') {
                form.elements[i].setAttribute('required', 'required');
                form.elements[i].addEventListener('blur',  (e) => new Validation().validateForm(e));
            }
        }

        if(form.elements.message) {
            form.elements.message.removeAttribute('required');
            form.elements.message.addEventListener('input', e => this.textAreaEdit(e));
        }

        form.addEventListener('submit', e => this.sendForm(e));

    }

    //textAreaEdit
    textAreaEdit(e) {
      const el = e.target;
      const {value} = el;

        let numberLine = 50;
        if (value.length <= numberLine) {
            el.maxLength = numberLine;

            this.info.innerText = `Осталось символов: ${numberLine - value.length}`;
            el.parentElement.insertBefore(this.info, el.nextElementSibling);
        }

    }


    //SendForm AJAX
    sendForm(event) {
        event.preventDefault();
        //this - глобальная область видимости
        //event - локальная область видимости - ссылаемся на текущую форму

        let el = event.target;

        //Сообщения для пользователя
        const msg = this.message;

        //Инфо блок - оповещение пользователя
        let messageBlock = document.createElement('div');
        messageBlock.classList.add('form__message');


        let data = {};

        //Перебор элементов формы
        for(let i in el.elements){

            //Проверка наличия свойств
            if(el.elements.hasOwnProperty(i)){
                if(el.elements[i].name){
                    //Формируем объект с данными
                    data[el.elements[i].name] = el.elements[i].value;
                }
            }
        }

        //AJAX запрос
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://cargochina.herokuapp.com/clients');
        xhr.setRequestHeader('Content-type', 'application/json; charset = utf-8');

        xhr.send(JSON.stringify(data));

        el.append(messageBlock);


        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState < 4) {
                messageBlock.textContent = msg.loading;
            } else if (xhr.readyState === 4 && xhr.status === 200) {

                //Ответ сервера - форма успешно отправленна
                messageBlock.textContent = xhr.response;

            } else {
                messageBlock.textContent = msg.error;
            }
        });

        //Уюираем пользовательские сообщения
        setTimeout(()=> {
            el.removeChild(messageBlock);
        }, 5000);

        //Очищаем форму
        this.clearForm(el);

    }

    //Очистка формы
    clearForm(form) {
        for(let i = 0; i < form.elements.length; i++) {
            form.elements[i].value = '';
            form.elements[i].style.border = '1px solid #c1c4c7';
        }
    }
}
