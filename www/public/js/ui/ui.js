/*
 * Biblioteca de UI do eeKit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var folder = '/js/ui/',
    auth   = module.use('auth');

new Namespace({
    element       : folder + 'elements/element.js',
    css           : folder + 'elements/css.js',
    collection    : folder + 'elements/collection.js',

    app           : folder + 'app/app.js',
    embedApp      : folder + 'app/embedApp.js',
    entity        : folder + 'app/entity/entity.js',
    list          : folder + 'app/list/list.js',
    embedEntity   : folder + 'app/embedEntity/embedEntity.js',
    embedList     : folder + 'app/embedList/embedList.js',
    dialog        : folder + 'app/dialog/dialog.js',
    frame         : folder + 'app/frame/frame.js',

    appIcon       : folder + 'elements/appIcon.js',
    appMenuItem   : folder + 'elements/appMenuItem.js',
    appNavigation : folder + 'elements/appNavigation.js',

    fieldset      : folder + 'elements/fieldset.js',
    inputText     : folder + 'elements/inputText.js',
    inputTextArea : folder + 'elements/inputTextArea.js',
    inputError    : folder + 'elements/inputError.js',
    inputSelector : folder + 'elements/inputSelector.js',
    inputOption   : folder + 'elements/inputOption.js',
    inputDate     : folder + 'elements/inputDate.js',
    inputPassword : folder + 'elements/inputPassword.js',

    helper        : folder + 'elements/helper.js',
    dataset       : folder + 'elements/dataset.js',
    data          : folder + 'elements/data.js',
    value         : folder + 'elements/value.js',
    groupset      : folder + 'elements/groupset.js',
    group         : folder + 'elements/group.js',
    item          : folder + 'elements/item.js',
    icon          : folder + 'elements/icon.js',
    action        : folder + 'elements/action.js'
}, function () {

    var element,
        logoAnchor,
        header,
        name,
        settings,
        help,
        logout,
        appsmenu,
        navigation,
        menuContainer,
        navigationContainer,
        appmenu,
        modals,
        sheets,
        chats,
        dragging = null;

    element = new this.element('div', {attributes : {'class' : 'body'}, html : [
        /* Hearder */
        header = new this.element('div', {attributes : {'class' : 'header hide'}, html : [
            /* Logo */
            new this.element('div', {attributes : {'class' : 'logo'}, html : [
                logoAnchor = new this.element('a', {attributes : {'class' : 'anchor', 'title' : 'Página principal'}, html : [
                    new this.element('span', {attributes : {'class' : 'image'}}),,
                    new this.element('h1', {attributes : {'class' : 'title'}, html : 'EmpreendeKit'})
                ]})
            ]}),
            /* Menu */
            new this.element('div', {attributes : {'class' : 'menu'}, html : [
                appsmenu = new this.element('menu', {attributes : {'class' : 'tools'}})
            ]}),
            /* User */
            new this.element('div', {attributes : {'class' : 'user'}, html : [
                new this.element('menu', {attributes : {'class' : 'options'}, html : [
                    /* Name */
                    new this.element('li', {attributes : {'class' : 'option name'}, html : [
                        name = new this.element('a', {attributes : {'class' : 'anchor'}})
                    ]}),
                    /* Configurações */
                    new this.element('li', {attributes : {'class' : 'option settings'}, html : [
                        settings = new this.element('a', {attributes : {'class' : 'anchor'}, html : 'configurações'})
                    ]}),
                    /* Ajuda */
                    new this.element('li', {attributes : {'class' : 'option help'}, html : [
                        help = new this.element('a', {attributes : {'class' : 'anchor'}, html : 'ajuda'})
                    ]}),
                    /* Sair */
                    new this.element('li', {attributes : {'class' : 'option logout'}, html : [
                        logout = new this.element('a', {attributes : {'class' : 'anchor'}, html : 'sair'})
                    ]})
                ]}),
            ]})
        ]}),
        /* Ferramenta */
        new this.element('div', {attributes : {'class' : 'tool'}, html : [
            /* Menu */
            menuContainer = new this.element('div', {attributes : {'class' : 'menu'}, html : [
                appmenu = new this.element('menu', {attributes : {'class' : 'options'}})
            ]}),
            /* Navigation */
            navigationContainer = new this.element('div', {attributes : {'class' : 'navigation'}, html : [
                navigation = new this.element('menu', {attributes : {'class' : 'sheets'}}),
            ]}),
            /* Sheets */
            sheets = new this.element('div', {attributes : {'class' : 'sheets'}})
        ]}),
        /* modal */
        modals = new this.element('div', {attributes : {'class' : 'modals'}}),
        /* chat */
        chats = new this.element('div', {attributes : {'class' : 'chats'}})
    ]});

    logout.event('click').bind(function () {
        auth.user.signout();
    });

    help.event('click').bind(function () {
        Empreendekit.path.redirect('ee/suporte');
    });

    settings.event('click').bind(function () {
        Empreendekit.path.redirect('ee/usuarios');
    });

    this.attach = element.attach;
    this.detach = element.detach;

    this.attach(document.body);

    this.dragging = function (value) {
        if (value === null || value) {
            var apps = this.apps.get(),
                i, style_classes;

            dragging = value;

            for (i = 0; i < apps.length; i++) {
                style_classes = apps[i].sheet.attribute('class').get();

                if (value) {
                    apps[i].sheet.attribute('class').set(style_classes + ' dragging');
                } else {
                    apps[i].sheet.attribute('class').set(style_classes.replace(' dragging', ''));
                }
            }
        } else {
            return dragging;
        }
    }

    this.collapse = function (value) {
        if (value === true || value === false) {
            header.attribute('class').set(value ? 'hide' : 'header');
            menuContainer.attribute('class').set(value ? 'hide' : 'menu');
            navigationContainer.attribute('class').set(value ? 'hide' : 'navigation');
        } else {
            return header.attribute('class').get() !== 'hide';
        }
    }

    this.user = {

        name : function (value) {

            if (value) {

                if (value.constructor != String) {
                    throw new Error({
                        source     : 'ui.js',
                        method     : 'user.name',
                        message    : 'User name must be a string',
                        arguments : arguments
                    });
                }
                name.html.set(value);
            } else {
                name.html.get()[0];
            }

        }

    };

    this.navigation = new this.collection(navigation, [this.appNavigation]);

    this.appMenu = new this.collection(appmenu, [this.appMenuItem])

    this.menu = new this.collection(appsmenu, [this.appIcon]);

    this.apps = new this.collection(sheets, [this.list, this.entity, this.frame]);

    this.dialogs = new this.collection(modals, [this.dialog]);

    //this.chats = new this.collection(chats, [this.chat]);

    module.exports(this);
});