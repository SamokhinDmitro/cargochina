class Scroll{
    constructor(elem){

        let btnTop = this.btnTop;
        btnTop = document.querySelector(elem);

        btnTop.addEventListener('click', ()=> {
            // window.scroll(0, 0);

            window.scrollTo({
                left: 0,
                top: 0,
                behavior: "smooth"
            });
        });

        window.addEventListener('scroll', this.showBtn.bind(btnTop));

    }

     showBtn() {
        if(window.pageYOffset > document.documentElement.clientHeight) {
            this.style.display = 'block';
        }else{
            this.style.display = 'none';
        }
    }
}
