const Stripe = require('stripe');
const pug = require('pug');
const wkhtmltopdf = require('wkhtmltopdf');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const sizeOf = require('image-size');

const template = require(`./templates/default`);

module.exports = (key, config = {}) => async (invoiceId, data = {}) => {
  const stripe = new Stripe(key);
  if(!invoiceId) {
    throw new Error('missing_invoice_id');
  }
  const invoice = await stripe.invoices.retrieve(invoiceId);
  const tpld = template(Object.assign({
    currency_symbol: 'C$',
    label_invoice: 'Invoice',
    label_payable_to: 'Payable to',
    label_bill_to: 'Bill to',
    label_invoice_number: 'Invoice number',
    label_date_of_issue: 'Date of issue',
    label_date_due: 'Date due',
    label_due: 'due',
    label_unit: 'Unit',
    label_description: 'Description',
    label_qty: 'Qty',
    label_price: 'Unit price',
    label_amount: 'Amount',
    label_to: 'To',
    label_subtotal: 'Subtotal',
    label_invoice_gst: 'GST',
    label_invoice_pst: 'PST',
    label_invoice_hst: 'HST',
    label_amunt_duo: 'Amunt duo',
    label_gst: 'GST #:',
    label_pst: 'PST #:',
    company_name: 'My company',
    date_format: 'MMMM DD, YYYY',
    client_company_name: 'Client Company',
    number: '12345',
    currency_position_before: true,
    language: 'en',
  }, invoice, config, data));
  return wkhtmltopdf(pug.compileFile(tpld.body)(Object.assign(tpld.data, {
    moment,
    path,
    fs,
    sizeOf
  })), { pageSize: 'letter' });
}
