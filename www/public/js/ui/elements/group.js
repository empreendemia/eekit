/**
 * Ícones do eekit
 *
 * @author Mauro Ribeiro
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    Collection = module.use('collection'),
    Icon       = module.use('icon'),
    Action     = module.use('action'),
    Item       = module.use('item');

module.exports(new Class(function (params) {

    var element,
        headerTitle, headerIcons, headerActions,
        footer, footerTitle, footerIcons,
        items;

    element = new Element('div', {attributes : {'class' : 'group'}, html : [
        new Element('div', {attributes : {'class' : 'header'}, html : [
            headerTitle = new Element('h3', {attributes : {'class' : 'hide'}}),
            headerIcons = new Element('ul', {attributes : {'class' : 'icons'}}),
            headerActions = new Element('menu', {attributes : {'class' : 'actions'}})
        ]}),
        items = new Element('ol', {attributes : {'class' : 'items'}}),
        footer = new Element('div', {attributes : {'class' : 'hide'}, html : [
            footerTitle = new Element('div', {attributes : {'class' : 'name'}}),
            footerIcons = new Element('ul', {attributes : {'class' : 'icons'}})
        ]})
    ]});


//    element.addEventListener('click', function () {
//        var releasable = app.ui.releasable();
//
//        /* Marca o grupo para receber o item */
//        if (releasable && releasable.constructor === app.ui.item && that.droppable()) {
//            app.ui.receptive(that);
//
//            setTimeout(function () {
//                var releasable = app.ui.releasable(),
//                    receptive =  app.ui.receptive();
//
//                if (releasable && releasable.constructor === app.ui.item && receptive && receptive.constructor === app.ui.group) {
//                    releasable.detach(document.body, ['aaa']);
//
//                    var position = receptive.items.get().length + 1;
//                    if (receptive.droppable && receptive.droppable()) {
//                        releasable.drop(receptive, position);
//                    }
//                }
//            }, 10);
//        }
//    }, true);


    this.attach = element.attach;
    this.detach = element.detach;

    /**
     * Controla o cabeçalho do grupo
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.header = {
        title : function (value) {
            if (value === '') {
                headerTitle.attribute('class').set('hide');
            }
            if (value) {

                if (value.constructor !== String) {
                    throw new Error({
                        source    : 'group.js',
                        method    : 'header.title',
                        message   : 'Title value must be a string',
                        arguments : arguments
                    });
                }

                headerTitle.attribute('class').set('name');
                headerTitle.html.set(value);
            } else {
                return headerTitle.html.get();
            }
        },
        icons : new Collection(headerIcons, [Icon]),
        actions : new Collection(headerActions, [Action])
    };

    /**
     * Controla o rodapé do grupo
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.footer = {
        title : function (value) {
            if (value === '') {
                footerTitle.attribute('class').set('hide');
            }
            if (value) {

                if (value.constructor !== String) {
                    throw new Error({
                        source    : 'group.js',
                        method    : 'footer.title',
                        message   : 'Title value must be a string',
                        arguments : arguments
                    });
                }

                footer.attribute('class').set('footer');
                footerTitle.attribute('class').set('name');
                footerTitle.html.set(value);
            } else {
                return footerTitle.html.get();
            }
        },
        icons : new Collection(footerIcons, [Icon]),
        //helper : new Helper(footer)
    };

    /**
     * Define grupo como dropável ou não
     * @TODO implementar
     */
//    this.droppable = function (value) {
//        if (value === true || value === false) {
//            if (value) {
//                element.setAttribute('class', 'group droppable');
//            } else {
//                element.setAttribute('class', 'group');
//            }
//        } else {
//            return element.getAttribute('class') === 'group droppable';
//        }
//    }


    /**
     * Controla a visibilidade do grupo
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.visibility = function (value) {
        if (value) {

            if (value.constructor !== String) {
                throw new Error({
                    source    : 'group.js',
                    method    : 'visibility',
                    message   : 'Visibility value must be a string',
                    arguments : arguments
                });
            }

            switch (value) {
                case 'hide' :
                    element.attribute('class').set('group hide');
                    break;
                case 'show' :
                    element.attribute('class').set('group');
                    break;
                case 'fade' :
                    element.attribute('class').set('group fade');
                    break;
            }
        } else {
            return element.attribute('class').get().replace('group', '');
        }
    }

    /**
     * Controla os items de um grupo
     *
     * @author Mauro Ribeiro
     * @since  2013-05
     */
    this.items = new Collection(items, [Item]);

    /*
     * Valores iniciais
     */
    if (params) {
        this.items.add(params.items);
        if (params.header) {
            this.header.title(params.header.title);
            this.header.icons.add(params.header.icons);
            this.header.actions.add(params.header.actions);
        }
        if (params.footer) {
            this.footer.title(params.footer.title);
            this.footer.icons.add(params.footer.icons);
//            if (params.footer.helper) {
//                this.footer.helper.description(params.footer.helper.description);
//                this.footer.helper.example(params.footer.helper.example);
//            }
        }
//        this.visibility(params.visibility);
    }
}));