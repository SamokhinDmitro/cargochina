class Popup{
    constructor(){}

    showPopup(selector, data) {

        let popup = document.querySelectorAll('.popup');
        popup.forEach(elem => {
            elem.style.display = 'block';
        });

        let modal = document.querySelector(selector);
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        let descr = modal.querySelector('.popup-content__descr');

        descr.textContent = data + 'грн';

        window.addEventListener('click', function(event) {
            if(event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        this.closePopup(modal);
    }

    closePopup(modal) {
        let  modalClose = modal.querySelector('.popup-content__close');
        modalClose.addEventListener('click', function(){
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
}
