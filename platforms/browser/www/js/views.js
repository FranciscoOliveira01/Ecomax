// Init/Create views

var inicioView = app.views.create('#view-inicio', {
  url: '/',
  dynamicNavbar: true
});

var minhacontaView = app.views.create('#view-minhaconta', {
  url: '/minha-conta/'
});

var servicosView = app.views.create('#view-servicos', {
  url: '/servicos/'
});

var suporteView = app.views.create('#view-suporte', {
  url: '/suporte/'
});

var contatoView = app.views.create('#view-contato', {
  url: '/contato/'
});