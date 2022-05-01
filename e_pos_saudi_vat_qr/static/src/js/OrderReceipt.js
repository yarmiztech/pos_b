odoo.define('e_pos_saudi_vat_qr.maiOrderReceipt', function(require) {
	"use strict";

	const OrderReceipt = require('point_of_sale.OrderReceipt');
	const Registries = require('point_of_sale.Registries');

	const maiOrderReceipt = OrderReceipt => 
		class extends OrderReceipt {
			constructor() {
				super(...arguments);
			}

			get qr_code() {
				let order = this.env.pos.get_order();
				let data = order.get_qrcode_data();
				$('.receipt_qr_code').html();
				$('.receipt_qr_code').empty();
				jQuery(".receipt_qr_code").qrcode({
				    width: 140,
				    height: 140,
				    text: data,
				});
			}
	};

	Registries.Component.extend(OrderReceipt, maiOrderReceipt);
	return OrderReceipt;
});