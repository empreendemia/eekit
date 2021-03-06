/*
 * Interface de frame de aplicativos do eekit
 *
 * @author Rafael Erthal
 * @since  2013-05
 */

var Element    = module.use('element'),
    Css        = module.use('css'),
    App        = module.use('app'),
    Collection = module.use('collection');

module.exports(new Class(function (context) {

    var self = this,
        close_cb, click_cb,
        element;

    element = new Element('div', {attributes : {'class' : 'sheet frame', 'style' : 'width:' + window.innerWidth + 'px;'}});

    element.template = this;
    this.id = element.id;
    this.attach = element.attach;
    this.detach = element.detach;

    this.tag     = Element;
    this.css     = Css;

    this.context = function () {

        return context;

    };

    /* Controla o fechamento da ui
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.close = function (value) {
        if (value) {

            if (value.constructor === Function) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'click',
                    message   : 'Click value must be a function',
                    arguments : arguments
                });
            }

            close_cb = value;
        } else {

            self.detach();
            if (close_cb) {
                close_cb();
            }
        }
    };

    /* Controla o click no app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.click = function (value) {
        if (value) {

            if (value.constructor === Function) {
                throw new Error({
                    source    : 'app.js',
                    method    : 'click',
                    message   : 'Click value must be a function',
                    arguments : arguments
                });
            }

            click_cb = value;
        } else {
            history.pushState({}, 'EmpreendeKit', context.route());
            _gaq.push(['_trackPageview', context.route()]);

            if (click_cb) {
                click_cb.apply(self);
            }
            
            if (
                window.$zopim && (
                    context.route().indexOf('/ee/precos-e-planos') >= 0 ||
                    context.route().indexOf('/ee/como-funciona') >= 0 ||
                    context.route().indexOf('/ee/suporte') >= 0 ||
                    context.route().indexOf('/ee/cadastrar') >= 0
                )
            ) {
                if (!$zopim.hide) {
                    $zopim.livechat.window.show();
                    $zopim.hide = true;
                }
            }

        }
    };


    /**
     * Ajusta ao tamanho da janela
     *
     * @author Mauro Ribeiro
     * @since  2013-06
     */
    this.adjust = function () {

        var width = 1000;

        if (
            document.body &&
            document.body.offsetWidth
        ) {
            width = document.body.offsetWidth;
        } else if (
            document.compatMode=='CSS1Compat' &&
            document.documentElement &&
            document.documentElement.offsetWidth
        ) {
            width = document.documentElement.offsetWidth;
        } else if (
            window.innerWidth
        ) {
            width = window.innerWidth;
        }

        element.attribute('style').set('width : ' + width + 'px');

    };

    /* Controla as tags do app
     *
     * @author Rafael Erthal
     * @since  2013-05
     */
    this.html = new Collection(element, [Element]);


    window.addEventListener('resize', self.adjust);
    this.adjust();


}));