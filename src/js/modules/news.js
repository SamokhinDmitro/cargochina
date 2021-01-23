class News{
    constructor(newsSectionSelector){

        let newsSection = this.newsSection = document.querySelector(newsSectionSelector),
            newsContainer = this.newsContainer = newsSection.querySelector('.container');

        //Глобальный контектс
        let glob = this.glob = this;

        //Создаем кнопку Все новости
        let newsBtn = this.newsBtn = document.createElement('button');
        newsBtn.classList.add('button', 'button-o', 'news-button');
        newsBtn.innerText = 'Все новости';

        //Задаем начальное количество новостей для показа
        let lim = this.lim = 3;
        let from = this.from = 0;


        localStorage.setItem('test', JSON.stringify(lim));

        //Ряд
        let newsRow = this.newsRow = document.createElement('div');
        newsRow.classList.add('row');

        //AJAX запрос на получения всех новостей из БД

        let newsXhr = new XMLHttpRequest();
        newsXhr.open('GET', `https://cargochina.herokuapp.com/news/${from}/${lim}`);

        newsXhr.setRequestHeader('Content-type', 'application/json; charset = utf-8');

        newsXhr.send();

        newsXhr.addEventListener('readystatechange', function () {
            if (newsXhr.readyState < 4) {

            } else if (newsXhr.readyState === 4 && newsXhr.status === 200) {
                let data = JSON.parse(newsXhr.response);

                for(let i = 0; i < data.length; i++) {
                    newsRow.append(glob.createNews(data[i]));
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

        //Обработка нажатия кнопки показать новости
        newsBtn.addEventListener('click',  () => glob.showNews(glob));

    }

    createNews(data) {

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

    //Показать новость
     showNews(glob){
        //Глобальный контекст
        let globs = glob;
        //console.log(globs);


        //1 Запрос Количество записей в таблице Новости
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `https://cargochina.herokuapp.com/news`);

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

                globs.from = localStorage.getItem('test');
                if (globs.from < newsLength) {

                    globs.lim = 1;

                    let newsXhr = new XMLHttpRequest();
                    newsXhr.open('GET', `https://cargochina.herokuapp.com/news/${globs.from}/${globs.lim}`);

                    newsXhr.setRequestHeader('Content-type', 'application/json; charset = utf-8');

                    newsXhr.send();

                    newsXhr.addEventListener('readystatechange', function () {

                        if (newsXhr.readyState < 4) {

                        } else if (newsXhr.readyState === 4 && newsXhr.status === 200) {
                            let data = JSON.parse(newsXhr.response);

                            for (let i = 0; i < data.length; i++) {
                                globs.newsRow.append(globs.createNews(data[i]));
                            }

                        } else {
                            console.log('Ошибка');
                        }

                        globs.lim++;
                        globs.from++;

                        localStorage.setItem('test', JSON.stringify(globs.from));

                    });
                    //Конец запроса 2 на выборку новостей
                }else{
                    globs.lim = 0;
                    console.log(globs.from);
                    //Скрываем кнопку 'Все Новости'
                    globs.newsBtn.hidden = true;
                }

            } else {
                console.log('Ошибка');
            }
            //Конец запроса 1 на получения количество записей в таблице
        });

    }
}
