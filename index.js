const pug = require('pug');
const wkhtmltopdf = require('wkhtmltopdf');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const sizeOf = require('image-size');
const template = require(`./templates/default`);
const Q = require('q');
const lo = require('lodash');

var StripePdfInvoice = function(opt){
    var that = this;
    opt = opt || {};
    that.config = {};

    that.init = function(opt){
        opt = opt || {};
        lo.defaults(opt, {
            stripe: undefined,
            stripe_key: undefined,
            company_name: 'My Company',
            company_address: '123 My Company Street',
            company_zipcode: '66666',
            company_city: 'Paris',
            company_country: 'France',
            company_email: 'my@company.com',
            color: '#2C75FF'
        });

        if (opt.stripe || opt.stripe_key){
            that.config.stripe = opt.stripe ? opt.stripe : require('stripe')(opt.stripe_key);
            delete(opt.stripe);
            delete(opt.stripe_key);
        }
        lo.assign(that.config, lo.cloneDeep(opt));
    }

    that.generate = function(opt){
        opt = opt || {};
        lo.defaults(opt, {
            invoice: undefined,
            invoice_id: undefined,
            currency_symbol: '$',
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
            label_vat: 'VAT',
            label_total: 'Total',
            label_gst: 'GST #:',
            label_pst: 'PST #:',
            date_format: 'MMMM DD, YYYY',
            client_company_name: 'Client Company',
            //number: '12345',
            currency_position_before: true,
            language: 'en'
        });

        // obtain invoice if necessary
        return Q().then(function(){
            if (opt.invoice) return;

            var def = Q.defer();
            that.config.stripe.invoices.retrieve(opt.invoice_id, function(err, invoice){
                if (err) return def.reject(err);
                opt.invoice = invoice;
                def.resolve();
            });

            return def.promise;
        })
        .then(function(){
            const tpld = template(Object.assign({}, opt.invoice, that.config, opt));

            var def = Q.defer();
            wkhtmltopdf(pug.compileFile(tpld.body)(Object.assign(tpld.data, {
                moment,
                path,
                fs,
                sizeOf
            })),
            { pageSize: 'letter'}, function(err, stream){

                if (err) return def.reject(err);
                def.resolve(stream);
            });

            return def.promise;
        });
    }

    that.init(opt);
};

module.exports = function(opt){
    if (this instanceof StripePdfInvoice) return this;
    return new StripePdfInvoice(opt);
}
