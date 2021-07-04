"use strict";
odoo.define('pos_backup_orders', function (require) {

    var PosBaseWidget = require('point_of_sale.BaseWidget');
    var chrome = require('point_of_sale.chrome');
    var PopupWidget = require('point_of_sale.popups');
    var gui = require('point_of_sale.gui');
    var core = require('web.core');
    var _t = core._t;
    var rpc = require('web.rpc');
    var models = require('point_of_sale.models');

    models.PosModel = models.PosModel.extend({
        import_pending_order: function (str) {
            var json = JSON.parse(str);
            var report = {
                paid: 0,
                unpaid: 0,
                unpaid_skipped_existing: 0,
                unpaid_skipped_session: 0,
                unpaid_skipped_sessions: [],
            };
            var exist_orders = 0;
            var existing = this.get_order_list();
            var existing_uids = {};

            for (var i = 0; i < existing.length; i++) {
                existing_uids[existing[i].uid] = true;
            }
            if (json.length <= 0) {
                return this.gui.show_popup('error', {
                    title: 'Warning',
                    body: 'Your file attachment have not any orders, please checking file name for correct file need import'
                })
            } else {

            }
            for (var i = 0; i < json.length; i++) {
                var order = json[i]['data'];
                if (!existing_uids[order['uid']]) {
                    var new_order = new models.Order({}, {
                        pos: this,
                        json: order,
                    })
                    this.get('orders').add(new_order);
                    report['paid'] += 1
                } else {
                    exist_orders += 1
                }
            }
            if (exist_orders) {
                this.gui.show_popup('error', {
                    title: 'Warning',
                    body: 'Have total exist orders : ' + exist_orders
                })
            }
            return report;
        }
    });

    var BackUpOrdersWidget = PosBaseWidget.extend({
        template: 'BackUpOrdersWidget',
        init: function (parent, options) {
            options = options || {};
            this._super(parent, options);
            this.action = options.action;
            this.label = options.label;
        },
        renderElement: function () {
            var self = this;
            this._super();
            this.$el.click(function () {
                self.pos.gui.show_popup('popup_backup_orders', {})
            });
        },
        show: function () {
            this.$el.removeClass('oe_hidden');
        },
        hide: function () {
            this.$el.addClass('oe_hidden');
        }
    });
    chrome.Chrome.include({
        build_widgets: function () {
            this.widgets = _.filter(this.widgets, function (widget) {
                return widget['name'] != 'BackUpOrdersWidget';
            });
            if (this.pos.config.backup) {
                this.widgets.push(
                    {
                        'name': 'backup_order_widget',
                        'widget': BackUpOrdersWidget,
                        'append': '.pos-rightheader'
                    }
                );
            }
            this._super();
        }
    });
    var popup_backup_orders = PopupWidget.extend({
        template: 'popup_backup_orders',
        _get_orders_backup: function () {
            var paid_orders_exist_session_data = JSON.parse(this.pos.export_paid_orders()).paid_orders;
            var paid_orders_exist_session = [];
            for (var n = 0; n < paid_orders_exist_session_data.length; n++) {
                debugger;
                paid_orders_exist_session.push(paid_orders_exist_session_data[n].data)
            }
            var unpaid_orders_value = JSON.parse(this.pos.export_unpaid_orders());
            var unpaid_orders = unpaid_orders_value.unpaid_orders;
            if (paid_orders_exist_session.length) {
                unpaid_orders = unpaid_orders.concat(paid_orders_exist_session);
                unpaid_orders = _.filter(unpaid_orders, function (o) {
                    return (o.lines.length != 0)
                })
            }
            unpaid_orders_value.unpaid_orders = unpaid_orders;
            return unpaid_orders_value
        },
        show: function (options) {
            var self = this;
            this._super(options);
            this.$('.backup_orders_via_file').click(function () {
                var unpaid_orders_value = self._get_orders_backup();
                if (unpaid_orders_value.unpaid_orders.length == 0) {
                    self.wrong_input('input[name="name"]', _t('Your Session have not any Orders have Lines in Cart for backup'));
                } else {
                    var json_datas = JSON.stringify(unpaid_orders_value, null, 4);
                    return self.gui.prepare_download_link(
                        json_datas,
                        _t("unpaid orders") + ' ' + moment().format('YYYY-MM-DD-HH-mm-ss') + '.json',
                        ".backup_orders_via_file", ".download_backup_orders"
                    );
                }
            });
            this.$('.backup_orders_via_backend').click(function () {
                var unpaid_orders_value = self._get_orders_backup();
                if (unpaid_orders_value.unpaid_orders.length == 0) {
                    self.wrong_input('input[name="name"]', _t('Your Session have not any Orders have Lines in Cart for backup'));
                } else {
                    var json_datas = JSON.stringify(unpaid_orders_value, null, 4);
                    return rpc.query({
                        model: 'pos.config',
                        method: 'write',
                        args: [[parseInt(self.pos.config.id)], {
                            backup_orders: json_datas
                        }]
                    }).then(function (result) {
                        if (result == true) {
                            self.pos.gui.show_popup('confirm', {
                                title: 'Saved',
                                body: _t('Orders save to Backend succeed'),
                            })
                        }
                    }, function (err) {
                        self.pos.query_backend_fail(err);
                    });
                }
            });

            this.$('.backup_pending_order').click(function () {
                return self.gui.prepare_download_link(
                    self.pos.db.get_orders(),
                    _t("pending orders") + ' ' + moment().format('YYYY-MM-DD-HH-mm-ss') + '.json',
                    ".backup_orders_via_file", ".download_backup_orders"
                );
            });
            this.$('.restore_orders input').on('change', function (event) {
                var file = event.target.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var report = self.pos.import_orders(event.target.result);
                        self.gui.show_popup('orderimport', {report: report});
                    };
                    reader.readAsText(file);
                }
            });
            this.$('.restore_pending_order').on('change', function (event) {
                var file = event.target.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var report = self.pos.import_pending_order(event.target.result);
                        self.gui.show_popup('orderimport', {report: report});
                    };
                    reader.readAsText(file);
                }
            });
            this.$('.restore_orders_via_backend').click(function () {
                return rpc.query({
                    model: 'pos.config',
                    method: 'search_read',
                    domain: [['id', '=', self.pos.config.id]],
                    fields: ['backup_orders']
                }).then(function (results) {
                    if (results[0] && results[0]['backup_orders'] != '') {
                        var report = self.pos.import_orders(results[0]['backup_orders']);
                        return self.gui.show_popup('orderimport', {report: report});
                    } else {
                        self.pos.gui.show_popup('confirm', {
                            title: 'Warning',
                            body: _t('Nothing orders restore')
                        })
                    }
                }, function (err) {
                    self.pos.query_backend_fail(err);
                });
            });

            this.$('.close').click(function () {
                self.pos.gui.close_popup();
            });
        }
    });
    gui.define_popup({name: 'popup_backup_orders', widget: popup_backup_orders});
});

