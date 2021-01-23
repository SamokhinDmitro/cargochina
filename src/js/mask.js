$(document).ready(function(){
    $("input[type='tel']").each(function() {
        $(this).mask("+38(999)-999-99-99");
    });
});
