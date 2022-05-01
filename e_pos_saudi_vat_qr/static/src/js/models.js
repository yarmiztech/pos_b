odoo.define("e_pos_saudi_vat_qr.models", function (require) {
"use strict";

	let models = require('point_of_sale.models');

	models.load_fields('res.company', ['street','street2','city','state_id','vat']);
	models.load_fields('product.product',['name','name_arabic']);

	models.Order = models.Order.extend({

		decimalToHex: function(rgb) {
			let hex = Number(rgb).toString(16);
			if(hex.length < 2) {
				hex = "0" + hex;
			}
			return hex;
		},
		ascii_to_hexa: function(str) {
			let arr1 = [];
			for (let n = 0, l = str.length; n < l; n++) {
				let hex = Number(str.charCodeAt(n)).toString(16);
				arr1.push(hex);
			}
			return arr1.join('');
		},
		hexToBase64: function(hexstring) {
			return btoa(hexstring.match(/\w{2}/g).map(function (a) {
				return String.fromCharCode(parseInt(a, 16));
			}).join(""));
		},

		getTLV:function (tag, field) {
			const textEncoder = new TextEncoder();
			const name_byte_array = Array.from(textEncoder.encode(field));
			const name_tag_encoding = [tag];
			const name_length_encoding = [name_byte_array.length];
			return name_tag_encoding.concat(name_length_encoding, name_byte_array);
		},

		get_qrcode_data: function () {
			let self = this;
			let seller_name = self.pos.company.name;
			let seller_vat_no = self.pos.company.vat;
			let date = self.creation_date.toISOString();
			let total_vat =  self.get_total_tax();
			let total_with_vat = self.get_total_with_tax();

			let sallerName = self.getTLV("01",seller_name);
			let sallerVat = self.getTLV("02",seller_vat_no);
			let timeStamp = self.getTLV("03",date);
			let invoiceAmt = self.getTLV("04",total_with_vat);
			let vatAmt = self.getTLV("05",total_vat);

			const str_to_encode = sallerName.concat(sallerVat, timeStamp, invoiceAmt, vatAmt);

			let binary = '';
			for (let i = 0; i < str_to_encode.length; i++) {
				binary += String.fromCharCode(str_to_encode[i]);
			}
			return btoa(binary);
		},

	});

})

