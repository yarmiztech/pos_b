
from odoo import models, fields, api, _

class product_template(models.Model):
	_inherit = 'product.template'

	name_arabic = fields.Char(string="Arabic Name")


class pos_config(models.Model):
    _inherit = 'pos.config' 

    allow_kitchen_ticket_print = fields.Boolean('Allow kitchen ticket print',default=True)