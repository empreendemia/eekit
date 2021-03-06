/**
 * Balanço de caixa
 *
 * @author Mauro Ribeiro
 * @since 2012-12
 */
app.routes.list('/', function (params, data) {

    var
    /**
     * Classe que representa um item
     */
    Item,

    /**
     * Classe que representa um grupo
     */
    Group,

    /*
     * Objeto com os grupos de grupos
     */
    groupsets,

    /*
     * Vetor com as categorias do usuário
     */
    categories,

    /*
     * Vetor com as contas do usuário
     */
    accounts,

    /**
     * Data atual
     */
    now = new Date(),

    /**
     * Data de hoje sem horário
     */
    today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    /* montando os groupsets */
    groupsets = {
        groupset : new app.ui.groupset({header : {title : 'Transações'}})
    };
    app.ui.groups.add([groupsets.groupset])

    /* montando os grupos */
    Group = function (data) {
        var that = this,
            date = new Date(data),
            actions;

        this.group = new app.ui.group();
        this.group.date = date;

        /* Botões do grupo */
        actions = {
            credit : new app.ui.action({
                tip : 'adicionar receita neste dia',
                image : 'add',
                click : function () {
                    app.open({
                        app : app.slug(),
                        route : '/adicionar-receita',
                        data : {date : date}
                    })
                }
            }),
            debt : new app.ui.action({
                tip : 'adicionar despesa neste dia',
                image : 'sub',
                click : function () {
                    app.open({
                        app : app.slug(),
                        route : '/adicionar-despesa',
                        data : {date : date}
                    })
                }
            }),
            transfer : new app.ui.action({
                tip : 'adicionar transferência neste dia',
                image : 'transfer',
                click : function () {
                    app.open({
                        app : app.slug(),
                        route : '/adicionar-transferencia',
                        data : {date : date}
                    })
                }
            })
        };
        this.group.header.actions.add([actions.credit, actions.debt, actions.transfer]);

        /* Exibe a data do grupo */
        this.date = function (value) {
            var monthsNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
                daysNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

            if (date.toString() === today.toString()) {
                this.group.header.title('Hoje ('+today.getDate() + '/' + monthsNames[today.getMonth()] + '/' + today.getFullYear() + ' - ' + daysNames[today.getDay()] + ')');
            } else {
                this.group.header.title(date.getDate() + '/' + monthsNames[date.getMonth()] + '/' + date.getFullYear() + ' - ' + daysNames[date.getDay()]);
            }
        };

        /* Retorna o balanço do grupo */
        this.group.balance = function (balance) {
            var items = that.group.items.get(),
                i,
                visible = 0;

            for (i in items) {
                balance += items[i].balance();
            }
            that.group.footer.title('Saldo: $ ' + balance.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.') );
            return balance;
        };

        /* Pegando quando elementos do grupo são filtrados é acionado */
        app.bind('filter group', function () {
            var items = that.group.items.get(),
                i,
                visible = 0;

            for (i in items) {
                if (items[i].visibility() != 'hide') {
                    visible++;
                }
            }
            if (visible === 0) {
                that.group.visibility('hide');
            } else {
                that.group.visibility('show');
            }
        });

        if (date) {
            this.date(date);
        }
    }

    /**
     * Grupo que uma transação se encaixa
     *
     * @author Mauro Ribeiro
     * @since  2012-12
     *
     * @param  transaction : transaction
     * @return ui.group
     */
    function fitGroup (transaction) {
        var i,
            groups,
            groupz,
            transactionDate,
            dateYear, dateMonth, dateDay;

        groups = groupsets.groupset.groups.get();

        if (groups) {
            transactionDate = new Date(transaction.date);
            dateYear = transactionDate.getFullYear();
            dateMonth = transactionDate.getMonth();
            dateDay = transactionDate.getDate();

            for (i in groups) {
                if (
                    groups[i].date.getFullYear() === dateYear &&
                    groups[i].date.getMonth() === dateMonth &&
                    groups[i].date.getDate() === dateDay
                ) {
                    return groups[i];
                }
            }
        }
        /* Caso não tenha grupo para a transação cria-o e ordena os grupos */
        group = new Group(transaction.date);
        groups.push(group.group);
        groupsets.groupset.groups.add(group.group);
        return group.group;
    }

    function reorderGroups() {
        groups = groupsets.groupset.groups.get();

        groups.sort(function (a, b) {
            var aDate = a.date || new Date(),
                bDate = b.date || new Date();

            if (aDate > bDate) return  1;
            if (aDate < bDate) return -1;
            return 0;
        });
        groupsets.groupset.groups.remove();
        for (i in groups) {
            groupsets.groupset.groups.add(groups[i]);
        }
    }

    /* montando os items */
    Item = function (data) {
        var that = this,
            transaction = new app.models.transaction(data),
            icons,
            actions,
            balanceable = true;

        this.item = new app.ui.item({
            click : function () {
                app.open({app : app.slug(), route : '/transacao/' + transaction._id})
            }
        });

        /* Icones do item */
        icons = {
            debt    : new app.ui.icon({image : 'sub'}),
            credit  : new app.ui.icon({image : 'add'}),
            account : new app.ui.icon({image : 'wallet'})
        };

        /* Botões do item */
        actions = {
            edit         : new app.ui.action({
                tip : 'editar esta transação',
                image  : 'pencil',
                click  : function() {
                    app.open({app : app.slug(), route : '/editar-transacao/' + transaction._id});
                }
            }),
            remove       : new app.ui.action({
                tip : 'remover esta transação',
                image  : 'trash',
                click  : function() {
                    app.open({app : app.slug(), route : '/remover-transacao/' + transaction._id});
                }
            })
        };
        this.item.actions.add([actions.edit, actions.remove]);

        /* Exibe o nome da transação */
        this.name = function (value) {
            this.item.title(value);
        };

        /* Exibe a categoria da transação */
        this.category = function (value) {
            var i;

            this.item.label.legend('transferência');
            for (i in categories) {
                if (categories[i]._id === value) {
                    this.item.label.legend(categories[i].name);
                }
            }
            if (transaction.isTransfer) {
                this.item.label.color('cyan');
            } else {
                this.item.label.color(transaction.type === 'credit' ? 'green' : 'red');
            }
        };

        /* Exibe a conta da transação */
        this.account = function (value) {
            var i;

            if (value) {
                for (i in accounts) {
                    if (accounts[i]._id === value) {
                        this.item.icons.add(icons.account);
                        icons.account.legend(accounts[i].name);
                    }
                }
            } else {
                this.item.icons.remove(icons.account);
                icons.account.legend('-');
            }
        };

        /* Exibe o valor da transação */
        this.value = function (value) {
            if (value) {
                if (transaction.type === 'credit') {
                    this.item.icons.add(icons.credit);
                    icons.credit.legend(parseFloat(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.'));
                } else {
                    this.item.icons.add(icons.debt);
                    icons.debt.legend(parseFloat(value).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.'));
                }
            } else {
                this.item.icons.remove(icons.credit);
                icons.credit.legend('-');
                this.item.icons.remove(icons.debt);
                icons.debt.legend('-');
            }
        };

        /* Retorna o balanço da transação */
        this.item.balance = function () {
            if (balanceable) {
                return (transaction.type === 'credit' ? 1 : -1) * parseFloat(transaction.value);
            } else {
                return 0;
            }
        };

        /* Pegando a edição da transação */
        app.bind('update transaction ' + transaction._id, function (data) {
            var newGroup,
                oldGroup = fitGroup(transaction);

            transaction = new app.models.transaction(data);
            newGroup = fitGroup(transaction);

            if (oldGroup !== newGroup) {
                that.item.detach();
                if (oldGroup.items.get().length === 0) {
                    oldGroup.detach();
                    delete oldGroup;
                }
                newGroup.items.add(that.item);
                reorderGroups();
            }

            if (transaction) {
                that.name(transaction.name + (transaction.subtitle ? ' (' + transaction.subtitle + ')' : ''));
                that.category(transaction.category);
                that.account(transaction.account);
                that.value(transaction.value);
            }
            app.ui.filter.submit();
        });

        /* Pegando a exclusão da transação */
        app.bind('remove transaction ' + transaction._id, function () {
            var oldGroup = fitGroup(transaction);

            that.item.detach();
            if (oldGroup.items.get().length === 0) {
                oldGroup.detach();
                delete oldGroup;
            }
            that.deleted = true;
            app.ui.filter.submit();
        });

        /* Pegando quando o filtro é acionado */
        app.bind('filter transaction', function (fields) {
            var categories = {
                    debt   : fields.categories.debt.value(),
                    credit : fields.categories.credit.value()
                },
                accounts = fields.accounts.value(),
                types = fields.type.value(),
                query = fields.query.value(),
                dateStart = fields.dateStart.date() || new Date()
                dateEnd = fields.dateEnd.date() || new Date();

            if (
                !that.deleted &&
                //Filtra por data
                (
                    transaction.date <= dateEnd
                ) &&
                //Filtra por tipo
                (
                    (
                        types.indexOf(transaction.type) > -1 &&
                        !transaction.isTransfer
                    ) || (
                        types.indexOf('transfer') > -1 &&
                        transaction.isTransfer
                    )
                ) &&
                //Filtra por categoria
                (
                    categories.debt.indexOf(transaction.category) > -1 ||
                    categories.credit.indexOf(transaction.category) > -1 ||
                    transaction.isTransfer
                ) &&
                //Filtra por conta
                (
                    accounts.indexOf(transaction.account) > -1
                ) &&
                //Filtra por query
                (
                    query.length = 0 ||
                    (
                        transaction.name + ' ' +
                        transaction.subtitle + ' ' +
                        transaction.value + ' ' +
                        transaction.observation
                    ).toLowerCase().indexOf(query.toLowerCase()) > -1
                )
            ) {
                balanceable = true;
                if (transaction.date >= dateStart) {
                    that.item.visibility('show');
                } else {
                    that.item.visibility('hide');
                }
            } else {
                balanceable = false;
                that.item.visibility('hide');
            }
        });

        if (transaction) {
            this.name(transaction.name + (transaction.subtitle ? ' (' + transaction.subtitle + ')' : ''));
            this.category(transaction.category);
            this.account(transaction.account);
            this.value(transaction.value);
        }
    }

    /* autenticando usuário e pegando categorias */
    app.models.user.auth(function () {
        app.models.category.list(function (data) {
            /* variável global com categorias */
            categories = data;

            /* ordena as categorias */
            categories.sort(function (a,b) {
                var aposition = a.name || '',
                    bposition = b.name || '';
                if (aposition > bposition) return  1;
                if (aposition < bposition) return -1;
                return 0;
            })
            /* autenticando usuário e pegando contas */
            app.models.account.list(function (data) {
                /* variável global com contas */
                accounts = data;
                /* monta a listagem */
                app.models.transaction.list({}, function (transactions) {
                    var fields = {},
                        monthStart = new Date(now.getFullYear(), now.getMonth()),
                        monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0),
                        icons;

                    /* Icones globais */
                    icons = {
                        period : new app.ui.icon(),
                        previous : new app.ui.icon(),
                        current : new app.ui.icon()
                    };
                    groupsets.groupset.header.icons.add([icons.period, icons.previous, icons.current]);

                    app.ui.title('Fluxo de Caixa');

                    /* Botão global de baixar dados */
                    app.ui.actions.add(new app.ui.action({
                        legend : 'baixar dados',
                        tip : 'importar seus dados em um arquivo CSV',
                        image : 'download'
                    }));
                    /* Botão global de adicionar receita */
                    app.ui.actions.add(new app.ui.action({
                        legend : 'receita',
                        tip : 'adicionar receita',
                        image : 'add',
                        click : function () {
                            app.open({app : app.slug(), route : '/adicionar-receita'});
                        }
                    }));
                    /* Botão global de adicionar despesa */
                    app.ui.actions.add(new app.ui.action({
                        legend : 'despesa',
                        tip : 'adicionar despesa',
                        image : 'sub',
                        click : function () {
                            app.open({app : app.slug(), route : '/adicionar-despesa'});
                        }
                    }));
                    /* Botão global de adicionar transferencia */
                    app.ui.actions.add(new app.ui.action({
                        legend : 'transferência',
                        tip : 'adicionar transferência',
                        image : 'transfer',
                        click : function () {
                            app.open({app : app.slug(), route : '/adicionar-transferencia'});
                        }
                    }));

                    /* Monta o filtro */
                    app.ui.filter.action('filtrar');
                    /* filtro por texto */
                    fields.query = new app.ui.inputText({
                        legend : 'Buscar',
                        type : 'text',
                        name : 'query',
                        change : app.ui.filter.submit
                    });
                    /* filtro por data de inicio */
                    fields.dateStart = new app.ui.inputDate({
                        legend : 'Data inicial',
                        type : 'text',
                        name : 'dateStart',
                        value : parseInt(monthStart.getDate()) + '/' + parseInt(monthStart.getMonth() + 1) + '/' + monthStart.getFullYear(),
                        change : app.ui.filter.submit
                    });
                    /* filtro por data de fim */
                    fields.dateEnd = new app.ui.inputDate({
                        legend : 'Data final',
                        type : 'text',
                        name : 'dateEnd',
                        value : parseInt(monthEnd.getDate()) + '/' + parseInt(monthEnd.getMonth() + 1) + '/' + monthEnd.getFullYear(),
                        change : app.ui.filter.submit
                    });
                    /* filtro por contas */
                    fields.accounts = new app.ui.inputSelector({
                        type : 'multiple',
                        name : 'account',
                        legend : 'Contas',
                        options : (function () {
                            var options = [],
                                i;
                            for (i in accounts) {
                                options.push(new app.ui.inputOption({
                                    legend : accounts[i].name,
                                    value : accounts[i]._id,
                                    click : true
                                }));
                            }
                            return options;
                        } ()),
                        change : app.ui.filter.submit,
                        actions : true
                    });
                    /* filtro por tipo */
                    fields.type = new app.ui.inputSelector({
                        type : 'multiple',
                        name : 'type',
                        legend : 'Tipo',
                        options : [
                            new app.ui.inputOption({legend : 'Transferencia', value : 'transfer', click : true}),
                            new app.ui.inputOption({legend : 'Receita', value : 'credit', click : true}),
                            new app.ui.inputOption({legend : 'Despesa', value : 'debt', click : true})
                        ],
                        change : app.ui.filter.submit,
                        actions : true
                    });
                    /* filtro por categoria */
                    fields.categories = {
                        debt : new app.ui.inputSelector({
                            type : 'multiple',
                            name : 'category',
                            legend : 'Categorias de despesas',
                            options : (function () {
                                var options = [],
                                    i;
                                for (i in categories) {
                                    if (categories[i].type === 'debt') {
                                        options.push(new app.ui.inputOption({
                                            legend : categories[i].name,
                                            value : categories[i]._id,
                                            click : true
                                        }));
                                    }
                                }
                                return options;
                            } ()),
                            change : app.ui.filter.submit,
                            actions : true
                        }),
                        credit : new app.ui.inputSelector({
                            type : 'multiple',
                            name : 'category',
                            legend : 'Categorias de receitas',
                            options : (function () {
                                var options = [],
                                    i;
                                for (i in categories) {
                                    if (categories[i].type === 'credit') {
                                        options.push(new app.ui.inputOption({
                                            legend : categories[i].name,
                                            value : categories[i]._id,
                                            click : true
                                        }));
                                    }
                                }
                                return options;
                            } ()),
                            change : app.ui.filter.submit,
                            actions : true
                        })
                    }
                    /* fieldset principal */
                    app.ui.filter.fieldsets.add(new app.ui.fieldset({
                        legend : 'Filtrar transações',
                        fields : [fields.query, fields.dateStart, fields.dateEnd, fields.accounts, fields.type, fields.categories.debt, fields.categories.credit]
                    }));
                    /* dispara o evento de filtro */
                    app.ui.filter.submit(function () {
                        var url = 'http://' + app.config.services.finances.host + ':' + app.config.services.finances.port + '/export.csv?',
                            j,
                            values;

                        url += 'query=' + fields.query.value() + '&';

                        j = 0;
                        values = fields.accounts.value();
                        for (var i in values) {
                            url += 'accounts[' + j + ']=' + values[i] + '&';
                            j++;
                        }

                        j = 0;
                        values = fields.categories.debt.value().concat(fields.categories.credit.value());
                        for (var i in values) {
                            url += 'categories[' + j + ']=' + values[i] + '&';
                            j++;
                        }

                        url += 'dateStart=' + fields.dateStart.date() + '&';
                        url += 'dateEnd=' + fields.dateEnd.date() + '&';
                        url += 'token=' + app.config.services.finances.token;

                        app.ui.actions.get()[0].href(url);

                        /* dispara o evento */
                        app.trigger('filter transaction', fields);
                        app.trigger('filter group');

                        var i,j,
                            groups = groupsets.groupset.groups.get(),
                            current = 0,
                            initial;

                        /* saldo anterior */
                        groups.sort(function (a, b) {
                            var aDate = a.date || new Date(),
                                bDate = b.date || new Date();

                            if (aDate > bDate) return  1;
                            if (aDate < bDate) return -1;
                            return 0;
                        });

                        for (i in accounts) {
                            if (fields.accounts.value().indexOf(accounts[i]._id) > -1) {
                                current += accounts[i].initialBalance;
                            }
                        }

                        for (i in groups) {
                            if (groups[i].date < (fields.dateStart.date() || new Date())) {
                                current = groups[i].balance(current);
                            }
                        }
                        initial = current;

                        for (i in groups) {
                            if (groups[i].date >= (fields.dateStart.date() || new Date())) {
                                current = groups[i].balance(current);
                            }
                        }

                        /* icone do saldo anterior */
                        icons.previous.image(initial >= 0 ? 'add' : 'sub');
                        icons.previous.legend('$ ' + initial.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.') + ' (anterior)');

                        /* icone do saldo do período */
                        icons.period.image((current - initial) >= 0 ? 'add' : 'sub');
                        icons.period.legend('$ ' + (current - initial).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.') + ' (período)');

                        /* icone do saldo corrente */
                        icons.current.image(current >= 0 ? 'add' : 'sub');
                        icons.current.legend('$ ' + current.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(\,))/g, '.') + ' (acumulado)');
                    });

                    /* listando as transações */
                    for (var i in transactions) {
                        fitGroup(transactions[i]).items.add((new Item(transactions[i])).item);
                    }
                    reorderGroups();

                    /* Pegando transações que são cadastradas ao longo do uso do app */
                    app.bind('create transaction', function (transaction) {
                        fitGroup(transaction).items.add((new Item(transaction)).item);
                        reorderGroups();
                        app.ui.filter.submit();
                    });

                    /* exibe o orientador */
                    if (transactions.length === 0) {
                        app.ui.actions.get()[2].helper.description('Adicione sua primeira movimentação');
                        app.ui.actions.get()[2].helper.example('Ex: Pagar conta de internet');
                    }

                    app.ui.filter.submit();
                })
            });
        });
    });
});
