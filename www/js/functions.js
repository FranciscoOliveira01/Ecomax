// Functions

app.on('popupClosed',function(){
    popup = null;
});

function setParam(key, value) {
    window.localStorage.setItem(key, value);
}

function getParam(key) {
    return window.localStorage.getItem(key);
}

function setUsuario(value) {
    setParam('usuario',value);
}

function getUsuario() {
    return JSON.parse(window.localStorage.getItem('usuario'));
}

function clearFields(el) {
    el.find('select,input:not(.noempty):not(.button)').val('');
    el.find('textarea').val('');
}

$$(document).on('click', '.tab-link', function() {
    var v = $$(this)[0].hash.split("#view-")[1];
    if (v == 'servicos') {
        app.preloader.show();
    }
    app.methods.refreshPages(v);
});

app.on('pickerChange',function(picker, value, displayValue){
    if (typeof picker.inputEl != 'undefined') {

        var view = $$('.tab-active .page-current');

        switch(picker.inputEl.id) {
            case 'tipo': 
                view.find('#id_tipo').val(value[0]); 
            break;
            case 'lista-empreendimentos': 
                view.find('#id_empreendimento').val(value[0]); 
            break;
        }

    }
});

app.on('formAjaxBeforeSend', function(formEl, data, xhr){
    $$(formEl).find('input[type="submit"]').val('Enviando...').prop('disabled',true);
});

app.on('formAjaxSuccess', function (formEl, data, xhr) {
    var el = $$(formEl), msg = '';
    var obj = JSON.parse(xhr.response);

    el.find('input[type="submit"]').val('Enviar').prop('disabled',false);

    switch(el.attr('id')) {
        case 'cadastro': 
            msg = obj.mensagem;
            if (typeof obj.error === "boolean" && !obj.error) {
                popup.close();
                clearFields(el);
            }
        break;
        case 'login':
            msg = obj.mensagem;
            if (typeof obj.error === "boolean" && !obj.error) {
                setUsuario(xhr.response);
                popup.close();
                clearFields(el);
                app.methods.refreshPages('inicio');
            }
        break;
        case 'servicos':
            msg = obj.mensagem;
            if (typeof obj.error === "boolean" && !obj.error) {
                clearFields(el);
                app.methods.refreshPages('servicos');
            }
        break;
        case 'minha-conta':
            msg = obj.mensagem;
            if (typeof obj.error === "boolean" && !obj.error) {
                setUsuario(xhr.response);
                app.methods.refreshPages('minhaconta');
            }
        break;
        case 'contato':
            msg = obj.mensagem;
            if (typeof obj.error === "boolean" && !obj.error) {
                clearFields(el);
            }
        break;
    }

    var toast = app.toast.create({
        text: msg,
        position: 'center',
        closeTimeout: 2000
    });

    toast.open();

});