odoo.define('e_pos_saudi_vat_qr.maiReceiptScreen', function(require) {
	"use strict";

	const { Printer } = require('point_of_sale.Printer');
	const ReceiptScreen = require('point_of_sale.ReceiptScreen');
	const Registries = require('point_of_sale.Registries');

	const maiReceiptScreen = ReceiptScreen => 
		class extends ReceiptScreen {
			constructor() {
				super(...arguments);
			}

			async _sendReceiptToCustomer() {
				const printer = new Printer(null, this.env.pos);
				$(".pos-receipt-container").append($(".pos-receipt").clone());
				var html = $(".pos-receipt:first");
				const receiptString = this.orderReceipt.comp.el.outerHTML;
				const ticketImage = await printer.htmlToImg(html);
				const order = this.currentOrder;
				const client = order.get_client();
				const orderName = order.get_name();
				const orderClient = { email: this.orderUiState.inputEmail, name: client ? client.name : this.orderUiState.inputEmail };
				const order_server_id = this.env.pos.validated_orders_name_server_id_map[orderName];
				await this.rpc({
					model: 'pos.order',
					method: 'action_receipt_to_customer',
					args: [[order_server_id], orderName, orderClient, ticketImage],
				});
			}

	};

	Registries.Component.extend(ReceiptScreen, maiReceiptScreen);
	return ReceiptScreen;
});