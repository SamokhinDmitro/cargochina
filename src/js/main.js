document.addEventListener('DOMContentLoaded', function () {

    /*Scroll to Top*/
    new Scroll('.button_up');
    /*End Scroll to Top*/

    /*Next Section*/
    new Next('.header-content__down');
    /*END Next Section*/

    /*Navigation*/
    new Navigation('.header-navigation__btn', '.header-navigation', '.header-navigation__close');
    /*END Navigation*/


    /*Process Form Обработка форм данных от клиентов*/

    //Обработка всех форм с data-form="client"
    let allClientForms = document.querySelectorAll('form[data-form=client]');

    allClientForms.forEach((el) => {
        new SendForm().processForm(el);
    });

    /*END Process Form*/

    //Заглушка для формы
    const form = document.querySelector('.order-form');

    form.addEventListener('submit', event => {
    	event.preventDefault();
    	alert('Демо версия сайта!');
    	form.reset();
    });

    //Заглушка для кнопок Блок delivery
    const deliveryBtn = document.querySelectorAll('.delivery-block__button');
    deliveryBtn.forEach(item => {
       item.addEventListener('click', () => {
           alert('Демо версия сайта!');
       });
    });

    /*Preloader News*/
    new News('.news');
    /*End Preloader News*/
});
