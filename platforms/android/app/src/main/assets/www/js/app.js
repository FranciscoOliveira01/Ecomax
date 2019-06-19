// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var popup = null;

var app = new Framework7({
    root: '#app',
    name: 'Ecomax',
    id: 'com.ecomax.app',
    popup: {
        closeByBackdropClick: false,
    },
    panel: {
        swipe: 'left',
    },
    statusbar: {
      overlay: true,
      iosOverlaysWebview: true
    },
    data: {
        urlJivo: 'http://open.velty.com.br/ecomax/jivochat.html',
        url: 'http://open.velty.com.br/ecomax/api_app',
        chave: '8a002216f31cbfae2ddcfa039343a215ee35c4c517080d72',
        moderador: 'Ecomax',
        statusBar: {
            amarela: {
                backgroundColor: '#FFCB05',
                textColor: 'white',
                hexTextColor: '#FFFFFF'
            },
            branca: {
                backgroundColor: '#f7f7f8',
                textColor: 'black',
                hexTextColor: '#000000'
            }
        },
        usuario: null
    },
    on: {
        pageInit: function(e, page) {
            app.statusbar.setTextColor(app.data.statusBar.branca.textColor);
            app.statusbar.setBackgroundColor(app.data.statusBar.branca.backgroundColor);
            app.methods.tabSuporte();
        }
    },
    routes: [
        {
            path: '/',
            async(routeTo, routeFrom, resolve, reject) {
                var usuario = (app.methods.existeUsuario()) ? app.methods.getUsuario() : null ;
                if (usuario) {
                    app.methods.enableTabs();
                    resolve(
                        { 
                            componentUrl: './tabs/logado.html' 
                        },
                        {
                            context: {
                                usuario: usuario.cliente
                            }
                        }
                    )
                } else {
                    app.methods.disabledTabs();
                    resolve({ componentUrl: './tabs/inicio.html' })
                }
            },
            on: {
                pageInit: function(e,page) {
                    if (page.name == "inicio") {
                        app.methods.formCadastrar();
                    }
                }
            }
        },
        {
            path: '/minha-conta/',
            componentUrl: './tabs/minha-conta.html',
            on: {
                pageInit: function(e, page) {
                    app.methods.mask(e,page);
                }
            }
        },
        {
            path: '/servicos/',
            componentUrl: './tabs/servicos.html',
        },
        // {
        //     path: '/suporte/',
        //     url: './tabs/suporte.html',
        //     on: {
        //         pageInit: function(e,page) {
        //         }
        //     }
        // },
        {
            path: '/contato/',
            componentUrl: './tabs/contato.html',
            on: {
                pageInit: function(e, page) {
                    app.methods.pickerForm(e,'#lista-empreendimentos');
                }
            }
        }
    ],
    // App root methods
    methods: {
        tabSuporte: function(e, page) {
            $$('.btn-suporte:not(.disabled)').on('click',function(){
                var options = [
                    'location=no',
                    'hidden=no',
                    'footer=yes',
                    'toolbar=yes',
                    'clearcache=yes',
                    'clearsessioncache=yes',
                    'mediaPlaybackRequiresUserAction=yes',
                    'closebuttoncaption=fechar',
                    'footercolor='+app.data.statusBar.amarela.backgroundColor,
                    'toolbarcolor='+app.data.statusBar.branca.backgroundColor,
                    'navigationbuttoncolor='+app.data.statusBar.amarela.hexTextColor
                ];
    
                var ref = cordova.InAppBrowser.open(app.data.urlJivo, '_blank', options.join());
                ref.addEventListener('exit', function(){
                    ref = undefined;
                });
            });
        },
        disabledTabs: function() {
            $$('.toolbar-inner a').each(function(){
                var tab = $$(this), S = tab.attr('href');
                if (!S.includes("inicio") && !tab.hasClass('disabled')) {
                    tab.addClass('disabled');
                }
            });
        },
        enableTabs: function() {
            $$('.toolbar-inner a').each(function(){
                var tab = $$(this);
                if (tab.hasClass('disabled')) {
                    tab.removeClass('disabled');
                }
            });
        },
        verificarSenha: function(senha, repetir_senha) {
            function validatePassword(senha,repetir_senha){
                if(senha.val() != repetir_senha.val()) {
                    repetir_senha[0].setCustomValidity("As senhas não são iguais");
                } else {
                    repetir_senha[0].setCustomValidity('');
                }
            }
            senha.on('change',function(){
                validatePassword(senha,repetir_senha);
            });
            repetir_senha.on('keyup',function(){
                validatePassword(senha,repetir_senha);
            });
        },
        verificarCPF: function(cpf) {
            function validateCPF(strCPF) {
                var numeros, digitos, soma, i, resultado, digitos_iguais;
                cpf = strCPF.replace(/[^\d]+/g,'');
                digitos_iguais = 1;
                if (cpf.length < 11)
                    return false;
                for (i = 0; i < cpf.length - 1; i++)
                    if (cpf.charAt(i) != cpf.charAt(i + 1))
                            {
                            digitos_iguais = 0;
                            break;
                            }
                if (!digitos_iguais)
                    {
                    numeros = cpf.substring(0,9);
                    digitos = cpf.substring(9);
                    soma = 0;
                    for (i = 10; i > 1; i--)
                            soma += numeros.charAt(10 - i) * i;
                    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                    if (resultado != digitos.charAt(0))
                            return false;
                    numeros = cpf.substring(0,10);
                    soma = 0;
                    for (i = 11; i > 1; i--)
                            soma += numeros.charAt(11 - i) * i;
                    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                    if (resultado != digitos.charAt(1))
                            return false;
                    return true;
                    }
                else
                    return false;
            }
            cpf.on('change',function(){
                if (!validateCPF($(this).val())) {
                    $$('#cpf')[0].setCustomValidity("Este CPF não é válido");
                } else {
                    $$('#cpf')[0].setCustomValidity("");
                }
            });
        },
        createPopup: function(el) {
            return app.popup.create({el: el});
        },
        existeUsuario: function() {
            return (window.localStorage.getItem("usuario") === null) ? false : true ;
        },
        getUsuario: function() {
            return JSON.parse(window.localStorage.getItem('usuario'));
        },
        mask: function(e,page) {
            var maskBehavior = function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            },
            options = {
                onKeyPress: function(val, e, field, options) {
                    field.mask(maskBehavior.apply({}, arguments), options);
                }
            };
            //var newTabEl = (page) ? e.path[0] : e;
            var newTabEl = '.page-current';
            $(newTabEl).find('#telefone').mask(maskBehavior, options);
            $(newTabEl).find('#cpf').mask('000.000.000-00', {reverse: true});
        },
        clearForms: function(e,page) {
            var index = $$('#app');
            $(index).find('input:not(.noempty):not(.button),select,textarea').each(function(){
                $(this).val('');
            });
        },
        refreshPages: function(view) {
            switch(view) {
                case 'inicio': inicioView.router.refreshPage(); break;
                case 'minhaconta': minhacontaView.router.refreshPage(); break;
                case 'servicos': servicosView.router.refreshPage(); break;
                case 'contato': contatoView.router.refreshPage(); break;
                default:
                    inicioView.router.refreshPage();
                    minhacontaView.router.refreshPage();
                    servicosView.router.refreshPage();
                    contatoView.router.refreshPage();
                break;
            }
        },
        sair: function() {
            window.localStorage.removeItem('usuario');
            app.methods.clearForms();
            app.methods.refreshPages('inicio');
        },
        formCadastrar: function() {
            var el = $$('#app'),
            senha = el.find('.cadastrar-agora #senha'),
            repetir_senha = el.find('.cadastrar-agora #repetir_senha'),
            cpf = el.find('.cadastrar-agora #cpf');
            app.methods.verificarSenha(senha,repetir_senha);
            app.methods.verificarCPF(cpf);
            app.methods.mask(el,null);
        },
        servico: function(id_servico) {

            function template(dataehora, titulo, texto, rodape) {
                var template = '<div class="card card-outline">'+
                        '<div class="card-header">'+titulo+'<br><small>'+dataehora+'</small></div>';

                if (texto) {
                    template += '<div class="card-content card-content-padding">'+texto+'</div>';
                } else {
                    template += '<div class="card-content card-content-padding">A sua solicitação foi enviada.</div>';
                }

                if (rodape) {
                    template += '<div class="card-footer"><a href="'+rodape.arquivo+'" class="link arquivo">'+rodape.titulo+'</a></div>';
                }

                template += '</div>';

                return template;
            }

            app.preloader.show();

            app.request.post(app.data.url+'/servico', { 
                chave:app.data.chave, 
                id_servico: id_servico
            }, function (d) {

                var usuario = (app.methods.existeUsuario()) ? app.methods.getUsuario() : null ;
                var data = JSON.parse(d);

                // console.log(data.arquivo);
                var html_popup = $('#app .popup.servico').clone();

                app.preloader.hide();

                var mensagem = data.mensagem !== null && data.mensagem !== '' ? data.mensagem : 'A sua solicitação foi enviada.' ;

                var card = template(data.dataehora, usuario.cliente.nome,mensagem,null);

                html_popup.find('.page-content .block').prepend(card);

                if (data.data_gerado !== null && data.data_gerado !== '') {
                    
                    var resposta = data.resposta !== null && data.resposta !== '' ? data.resposta : 'Sem resposta.' ;

                    var rodape = null;

                    if (data.arquivo !== null && data.arquivo !== '') {
                        var path = app.data.url.split('api_app');
                        rodape = {
                            'titulo': 'Baixar arquivo',
                            'arquivo': path[0]+data.arquivo
                        };
                    }

                    var card_resposta = template(data.data_gerado,app.data.moderador,resposta,rodape);
                    html_popup.find('.page-content .block').prepend(card_resposta);
                }

                popup = app.popup.create({
                    content: '<div class="popup">'+html_popup.html()+'</div>',
                    // Events
                    on: {
                        open: function (popup) {
                            $$(popup.el).find('.link.arquivo').on('click',function(){
                                var options = "location=yes,hidden=yes,beforeload=yes";
                                var ref = cordova.InAppBrowser.open($(this).attr('href'), '_system', options);
                                ref.addEventListener('exit', function(){
                                    ref = undefined;
                                });
                            });
                        }
                    }
                });
                popup.open();

                html_popup = null;

            });

        },
        pickerForm: function(e,ids) {

            if (typeof ids == 'string') {
                app.methods.picker(e,ids);
            } else if (typeof ids == 'object') {
                $.each(ids,function(k,id){
                    app.methods.picker(e,id);
                });
            }

        },
        picker: function(e, id) {

            var newTabEl = '.tab-active .page-current', el = $$(newTabEl).find(id);
            var lista = Array();
            var valores = Array();

            switch(id) {
                case '#tipo': 
                    lista = ['Assistência técnica','Segunda via de boleto'];
                    valores = [1,2];
                break;
                default: 
                    var usuario = (app.methods.existeUsuario()) ? app.methods.getUsuario() : null ;
                    if (usuario) {
                        $.each(usuario.cliente.empreendimentos,function(k,v){
                            lista.push(v.nome);
                            valores.push(v.id);
                        });
                    }
                break;
            }

            if (el.length > 0) {
                app.picker.create({
                    inputEl: el,
                    toolbarCloseText: 'Pronto',
                    value: [valores[0]],
                    cols: [{
                        textAlign: 'center',
                        values: valores,
                        displayValues: lista
                    }],
                    formatValue: function(values, displayValues) {
                        return displayValues[0];
                    }
                });
            }
        }
    }
});