class Next{
    constructor(selector){
        const btnNext = this.btnNext = document.querySelector(selector);

        btnNext.addEventListener('click', this.goSection.bind(btnNext));
    }

    goSection(){
        let sectionFirst = document.querySelector('section');

        this.href = `#${sectionFirst.id}`;
    }
}