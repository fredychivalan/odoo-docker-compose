# -*- coding: utf-8 -*-
# License: OPL-1
from odoo import fields, api, models

class pos_config(models.Model):

    _inherit = "pos.config"

    backup_orders = fields.Text('Backup orders', readonly=1)
    backup = fields.Boolean('Backup')


