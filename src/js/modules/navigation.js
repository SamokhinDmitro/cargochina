class Navigation{
    constructor(navBtnSelector, navBlockSelector, navCloseSelector){
        let navBtn = this.navBtn = document.querySelector(navBtnSelector),
            navBlock = this.navBlock = document.querySelector(navBlockSelector),
            navClose = this.navClose = document.querySelector(navCloseSelector);

        navBtn.addEventListener('click', () => {
            this.navBlock.classList.add('header-navigation__active');
        });

        navClose.addEventListener('click', () => {
            this.navBlock.classList.remove('header-navigation__active');
        });

        navBlock.addEventListener('click', () => {
            let target = event.target;

            if(target.classList.contains('header-navigation__link')) {
                this.navBlock.classList.remove('header-navigation__active');
            }
        });
    }
}
