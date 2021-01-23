class Validation{
    constructor(){}

    validateForm(e){
        const el = e.target;
        let rule = el.dataset.rule;

        let check;

        switch (rule) {
            case 'name':
                check = /^[А-Яа-яЁёA-Za-z]{3,11}$/.test(el.value);
                break;

            case 'email':
                check = /^[a-zA-Z._-]+\d*@[a-z]+?\.[a-z]{2,3}$/.test(el.value);
                break;

            case 'phone':
                check = this.validatePhone(el.value);
                break;

            //Необязательное поле, может оставаться пустым
            case 'message':
                check = true;
                break;

            default:
                check = false;
        }

        if (check) {
            el.style.border = '2px solid green';
        } else {
            el.style.border = '2px solid red';
            el.value = '';
        }
    }

    //Phone Validation
   validatePhone(val) {

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
}
