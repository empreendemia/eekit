/** empreendemia
 *
 * @autor : Rafael Erthal
 * @since : 2012-11
 *
 * @description : javascript do corpo da empreendemia
 */
var empreendemia = {

    /** load
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : carrega a seção do usuário na empreendemia
     */
    load : function () {
        empreendemia.socket.emit('auth', {
            user : sdk.config.user
        });

        empreendemia.ui.content.navigation.navigables.remove();
        empreendemia.ui.content.roll.sheets.apps.remove();
        empreendemia.ui.content.roll.menu.remove();
        /* Exibindo user section */
        empreendemia.user.profile(function (user) {
            var routes,
                slug,
                route, old_route;

            empreendemia.ui.header.user.options.remove();
            if (user) {
                /* Usuário logado */
                empreendemia.ui.header.user.login();
                empreendemia.ui.header.user.options.add(new empreendemia.ui.userOption({
                    legend : user.name + ' - configurações',
                    style  : 'name',
                    click  : function () {
                        empreendemia.apps.open({
                            app   : 'ee',
                            route : '/usuarios',
                            open  : function (tool) {
                                tool.open();
                                empreendemia.apps.render(tool);
                            }
                        });
                    }
                }));
                empreendemia.ui.header.user.options.add(new empreendemia.ui.userOption({
                    legend : 'sair',
                    style  : 'logout',
                    click  : empreendemia.user.logout
                }));
                /* Monta a rota */
                old_route = empreendemia.routes.get();
                if (old_route === 'ee/' || old_route === 'ee/planos' || old_route === 'ee/como-funciona' || old_route === 'ee/duvidas' || old_route === 'ee/cadastrar' ) {
                    routes = 'tarefas/';
                } else {
                    routes = old_route;
                }
                slug = routes.split('/')[0];
                route = routes.replace(slug, '') || '/';
            } else {
                /* Usuário deslogado */
                empreendemia.ui.header.user.logout();
                empreendemia.ui.header.user.options.add(new empreendemia.ui.userOption({
                    legend : 'cadastre-se',
                    style  : 'signup',
                    click  : empreendemia.user.signup
                }));
                empreendemia.ui.header.user.options.add(new empreendemia.ui.userOption({
                    legend : 'login',
                    style  : 'login',
                    click  : empreendemia.user.login
                }));
                /* Monta a rota */
                routes = empreendemia.routes.get() || 'ee/';
                slug = routes.split('/')[0];
                route = routes.replace(slug, '') || '/';
            }
            /* Exibindo aplicativo da rota */
            empreendemia.apps.open({
                app   : slug,
                route : route,
                open  : function (tool) {
                    tool.open();
                    empreendemia.apps.render(tool);
                }
            });
        });
        /* Exibindo lista de aplicativos */
        empreendemia.user.apps(function (apps) {
            empreendemia.ui.header.menu.apps.remove();
            for (var i in apps) {
                if (
                    apps[i].name.toLowerCase() !== 'ee' &&
                    apps[i].name.toLowerCase() !== 'boletos'
                ) {
                    empreendemia.ui.header.menu.apps.add(new empreendemia.ui.appIcon({
                        legend : apps[i].name,
                        image  : apps[i].slug,
                        title  : apps[i].name,
                        href   : apps[i].slug
                    }));
                }
            }
        });
    },

    /** start
     *
     * @autor : Rafael Erthal
     * @since : 2012-11
     *
     * @description : inicia a empreendemia
     */
    start : function () {
        empreendemia.socket = io.connect('http://' + empreendemia.config.services.kamisama.host + ':' + empreendemia.config.services.kamisama.port);
        empreendemia.socket.on('trigger', function (data) {
            empreendemia.events.trigger(data.label, data.data);
        });

        empreendemia.user.auth(function () {
            empreendemia.ui = new empreendemia.ui();
            window.addEventListener('resize', empreendemia.ui.content.roll.sheets.fitHeight, true);
            empreendemia.load();
        });
    }
};
