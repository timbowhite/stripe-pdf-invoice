# Stripe PDF Invoice/Receipt Generator # 

Makes a PDF file that looks like a Stripe invoice or receipt.

## Render ##

![ScreenShot](/invoice.jpg)

## Install ##
Install the [wkhtmltopdf executable](http://wkhtmltopdf.org/downloads.html)

```
    npm install stripe-pdf-invoice
```

## Usage ##

### Generate invoice or receipt to a file ####

```js
const StripePdfInvoice = require('/var/gitrepos/stripe-pdf-invoice');
const fs = require('fs');
const path = require('path');

var spi = new StripePdfInvoice({
    stripe: require('stripe')('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    company_name: 'My Company',
    company_address: '123 My Company Street',
    company_zipcode: '66666',
    company_city: 'Paris',
    company_country: 'France',
    company_email: 'my@company.com',
    color: '#2C75FF'
});

return spi.generate({
    invoice_id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx',
    client_company_name: 'Client Company',
    client_company_address: '1 Infinite Loop',
    client_company_zipcode: '95014',
    client_company_city: 'Cupertino, CA',
    client_company_country: 'USA',
    label_invoice: 'Receipt',
    label_due: 'paid'
})
.then(function(stream){
    stream.pipe(fs.createWriteStream('/tmp/invoice.pdf'));
    stream.on('end', () => {
        console.log('done');
    });
    stream.on('error', (error) => {
        console.log(error);
    });
})
.catch(function(err){
    console.log('error', err);
})
.done();

```
### Options ####
```
number (Number)
currency_position_before (Bool)
currency_symbol (String)
date_format (String)
due_days (Number)
color (Number)

company_name (String)
company_logo (String)
company_address (String)
company_zipcode (String)
company_city (String)
company_country (String)
company_siret (String)
company_vat_number (String)

client_company_name (String)
client_company_address (String)
client_company_zipcode (String)
client_company_city (String)
client_company_country (String)

label_invoice (String)
label_invoice_to (String)
label_invoice_by (String)
label_due_on (String)
label_invoice_for (String)
label_description (String)
label_unit (String)
label_price (String)
label_amount (String)
label_subtotal (String)
label_total (String)
label_vat (String)
label_invoice_by (String)
label_invoice_date (String)
label_company_siret (String)
label_company_vat_number (String)
label_invoice_number (String)
label_reference_number (String)
label_invoice_due_date (String)
```
