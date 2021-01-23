document.addEventListener('DOMContentLoaded', function(){

    /*Scroll to Top*/
    const btnTop = document.querySelector('.button_up');

    btnTop.addEventListener('click', ()=> {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener('scroll', showBtn);

    function showBtn() {
        if(window.pageYOffset > document.documentElement.clientHeight) {
            btnTop.style.display = 'block';
        }else{
            btnTop.style.display = 'none';
        }
    }
    /*End Scroll to Top*/

    /*Next Section*/
    const btnNext = document.querySelector('.header-content__down');

    btnNext.addEventListener('click', function() {

        let sectionFirst = document.querySelector('section');

        btnNext.href = `#${sectionFirst.id}`;
        });
    /*END Next Section*/

    /*Navigation*/

    let navBtn = document.querySelector('.header-navigation__btn');
    let navBlock = document.querySelector('.header-navigation');
    let navClose = document.querySelector('.header-navigation__close');

    navBtn.addEventListener('click', () => {
       navBlock.classList.add('header-navigation__active');
    });

    navClose.addEventListener('click', () => {
       navBlock.classList.remove('header-navigation__active');
    });

    navBlock.addEventListener('click', function(event) {
        let target = event.target;

        if(target.classList.contains('header-navigation__link')) {
            navBlock.classList.remove('header-navigation__active');
        }
    });

    /*END Navigation*/


    /*Process Form Обработка форм данных от клиентов*/

    //Подсказка
    let info = document.createElement('div');
    info.classList.add('warning');

    //Статус AJAX запроса
    let message = {
        loading: 'Загрузка...',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        error: 'Что-то пошло не так',
        phone: 'Введите телефон!'
    };


    //Обработка всех форм с data-form="client"
    let allClientForms = document.querySelectorAll('form[data-form=client]');

    allClientForms.forEach((el) => {
        processForm(el);
    });


    //Обработка формы
    function processForm(form) {
        for (let i = 0; i < form.elements.length; i++) {
            if (form.elements[i].type !== 'submit') {
                form.elements[i].setAttribute('required', 'required');
                form.elements[i].addEventListener('blur', validateForm);
            }
        }

        if(form.elements.message) {
            form.elements.message.removeAttribute('required');
            form.elements.message.addEventListener('input', textAreaEdit);
        }

        form.addEventListener('submit', sendForm);

    }

    //Validation Form
    function validateForm(){
        let rule = this.dataset.rule;

        let check;

        switch (rule) {
            case 'name':
                check = /^[А-Яа-яЁёA-Za-z]{3,11}$/.test(this.value);
                break;

            case 'email':
                check = /^[a-zA-Z._-]+\d*@[a-z]+?\.[a-z]{2,3}$/.test(this.value);
                break;

            case 'phone':
                check = validatePhone(this.value);
                break;

            //Необязательное поле, может оставаться пустым
            case 'message':
                check = true;
                break;

            default:
                check = false;
        }

        if (check) {
            this.style.border = '2px solid green';
        } else {
            this.style.border = '2px solid red';
            this.value = '';
        }
    }

    //Phone Validation
    function validatePhone(val) {

        let massCode = [67, 96, 97, 98, 50, 66, 95, 99, 63, 73, 93, 91, 92, 94];

        let resCode = massCode.map(function (i) {
            return '0' + i;
        });

        let str = resCode.join('|');

        let reg = new RegExp("/\\+38\\(" + str + "\\)\\-(\d{3})\\-(\d{2})\\-(\d{2})/");

        if (reg.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    //textAreaEdit
    function textAreaEdit() {
        let numberLine = 50;
        if (this.value.length <= numberLine) {
            this.maxLength = numberLine;

            info.innerText = `Осталось символов: ${numberLine - this.value.length}`;
            this.parentElement.insertBefore(info, this.nextElementSibling);
        }
    }


    //SendForm AJAX
    function sendForm(event) {
        event.preventDefault();

        //Инфо блок - оповещение пользователя
        let messageBlock = document.createElement('div');
        messageBlock.classList.add('form__message');

        let data = {};

        //Перебор элементов формы
        for(let i in this.elements){

            //Проверка наличия свойств
            if(this.elements.hasOwnProperty(i)){
                if( this.elements[i].name){
                    //Формируем объект с данными
                    data[this.elements[i].name] = this.elements[i].value;
                }
            }
        }

        //AJAX запрос
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://localhost:3010/clients');
        xhr.setRequestHeader('Content-type', 'application/json; charset = utf-8');

        xhr.send(JSON.stringify(data));

        this.append(messageBlock);


        xhr.addEventListener('readystatechange', function () {
            if (xhr.readyState < 4) {
                messageBlock.textContent = message.loading;
            } else if (xhr.readyState === 4 && xhr.status === 200) {

                messageBlock.textContent = xhr.response;

            } else {
                messageBlock.textContent = message.error;
            }
        });

        setTimeout(()=> {
           this.removeChild(messageBlock);
        }, 5000);

        clearForm(this);

    }

    function clearForm(form) {
        for(let i = 0; i < form.elements.length; i++) {
            form.elements[i].value = '';
            form.elements[i].style.border = '1px solid #c1c4c7';
        }
    }

    /*END Process Form*/

    /*Preloader News*/

        let newsSection = document.querySelector('.news');
        let newsContainer = newsSection.querySelector('.container');

        //Создаем кнопку Все новости
        let newsBtn = document.createElement('button');
        newsBtn.classList.add('button', 'button-o', 'news-button');
        newsBtn.innerText = 'Все новости';

        let lim = 3;
        let from = 0;


        localStorage.setItem('test', JSON.stringify(lim));

        //Ряд
        let newsRow = document.createElement('div');
        newsRow.classList.add('row');

        //AJAX запрос на получения всех новостей из БД

        let newsXhr = new XMLHttpRequest();
        newsXhr.open('GET', `http://localhost:3010/news/${from}/${lim}`);

        newsXhr.setRequestHeader('Content-type', 'application/json; charset = utf-8');

        newsXhr.send();

        newsXhr.addEventListener('readystatechange', function () {
            if (newsXhr.readyState < 4) {

            } else if (newsXhr.readyState === 4 && newsXhr.status === 200) {
                let data = JSON.parse(newsXhr.response);

                for(let i = 0; i < data.length; i++) {
                    newsRow.append(createNews(data[i]));
                }

            } else {
                console.log('Ошибка');
            }
        });


        if(newsSection.contains(newsContainer)) {
            //Вставка кнопки и ряда с новостями
            newsContainer.append(newsBtn);
            newsBtn.before(newsRow);

        }else{
            console.log(false);
        }


        function createNews(data) {

            let newsWrap = document.createElement('div');
            newsWrap.classList.add('col-10', 'offset-1', 'col-sm-8', 'offset-sm-2', 'col-md-4', 'offset-md-0');

            let months = [
                'янв', 'фев', 'мар', 'апр', 'май', 'июн',
                'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
            ];

            let newsImg;

            if(data.img !== null){
                newsImg = data.img;
            }else{
                newsImg = `https://via.placeholder.com/350x200`;
            }
            //Обработка даты
            let newsDate = new Date(Date.parse(data.date));
            //Новость
            let newsItem = document.createElement('div');

            newsItem.classList.add('news-block');

            newsItem.innerHTML = `  <div class="news-block__img">
                           <img src= ${newsImg} alt= ${data.title}>
                       </div>
    
                       <div class="news-block__content">
    
                           <div class="news-block__date">
                               <span class="news-block__day">${newsDate.getDate()}</span>
                               <span class="news-block__month">${months[newsDate.getMonth()]}</span>
                           </div>
                           <!-- /.news-block__date -->
    
                           <div class="news-block__text">
                               <h3 class="news-block__title">${data.title}</h3>
    
                               <p class="news-block__descr">
                                   ${data.text}
                               </p>
                               <!-- /.news-block__descr -->
                           </div>
                           <!-- /.news-block__text -->
                       </div>
                       <!-- /.news-block__content -->`;
            newsWrap.append(newsItem);

            return newsWrap;

        }

        //Обработка нажатия кнопки показать новости
        newsBtn.addEventListener('click', function () {

            //1 Запрос Количество записей в таблице Новости
            let xhr = new XMLHttpRequest();
            xhr.open('GET', `http://localhost:3010/news`);

            xhr.setRequestHeader('Content-type', 'application/json; charset = utf-8');

            xhr.send();

            xhr.addEventListener('readystatechange', function () {
                if (xhr.readyState < 4) {

                } else if (xhr.readyState === 4 && xhr.status === 200) {
                    let tmp = JSON.parse(xhr.response);
                    let newsLength;
                    for(let key in tmp[0]) {
                        newsLength = tmp[0][key];
                    }

                    //2 Запрос Выборка новостей из БД

                    from = localStorage.getItem('test');
                    if (from < newsLength) {

                        lim = 1;

                        let newsXhr = new XMLHttpRequest();
                        newsXhr.open('GET', `http://localhost:3010/news/${from}/${lim}`);

                        newsXhr.setRequestHeader('Content-type', 'application/json; charset = utf-8');

                        newsXhr.send();

                        newsXhr.addEventListener('readystatechange', function () {
                            if (newsXhr.readyState < 4) {

                            } else if (newsXhr.readyState === 4 && newsXhr.status === 200) {
                                let data = JSON.parse(newsXhr.response);

                                for (let i = 0; i < data.length; i++) {
                                    newsRow.append(createNews(data[i]));
                                }

                            } else {
                                console.log('Ошибка');
                            }

                            lim++;
                            from++;

                            localStorage.setItem('test', JSON.stringify(from));

                        });
                        //Конец запроса 2 на выборку новостей
                    }else{
                        lim = 0;
                        console.log(from);
                        //Скрываем кнопку 'Все Новости'
                        newsBtn.hidden = true;
                    }

                } else {
                    console.log('Ошибка');
                }
                //Конец запроса 1 на получения количество записей в таблице
            });


        });

    /*End Preloader News*/


});
