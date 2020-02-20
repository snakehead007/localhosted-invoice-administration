global.window = {
    document: {
        createElementNS: () => {
            return {}
        },
    },
};
global.navigator = {};
global.html2pdf = {};
global.btoa = require('atob');
//global.PNG = require('png-js');
//global.zlib = require('zlib');
const fs = require('fs');
const jsPDF = require('jspdf');
window.jsPDF = require('jspdf');
const i18n = require('i18n');
const path = require('path');
const {callGetBase64,createJSON, replaceAll} =require('../utils/pdfCreation');
require('jspdf-autotable');
exports.createPDF = async (req,res,style="invoice",profile,settings,client,invoice,orders) => {
    console.log("invoice: ");
    console.log(invoice);
    let imgData;
    try {
        imgData = await callGetBase64(req.session._id);
    }catch(err){
        console.trace(err);
    }
    let dataText;
    if(style==="invoice")
        dataText=replaceAll(settings.invoiceText, profile, client, invoice, settings.locale);
    if(style==="offer")
        dataText= replaceAll(settings.offerText, profile, client, invoice, settings.locale);
    if(style==="credit")
        dataText=replaceAll(settings.creditText, profile, client, invoice, settings.locale);
    let c = [0,0];
    let date;
    date=new Date(invoice.date).toLocaleString(settings.locale,{ year: 'numeric', month: 'numeric', day: 'numeric' });
    console.log(date);
    console.log(settings.locale);
    let doc = new jsPDF();
    doc.setFont(doc.getFontList()[0]);
    if(style==="invoice") {
        doc.setProperties({
            title: profile.firm + " " + i18n.__('invoice') + " " + invoice.invoiceNr,
            subject: i18n.__('invoice of') + " " + profile.firm,
            author: profile.firm,
            keywords: profile.firm + "," + i18n.__('invoice') + "," + invoice.invoiceNr,
            creator: profile.firm + " " + i18n.__('invoice administration')
        });
    }
    if(style==="offer") {
        doc.setProperties({
            title: profile.firm + " " + i18n.__('offer') + " " + invoice.creditNr,
            subject: i18n.__('offer of') + " " + profile.firm,
            author: profile.firm,
            keywords: profile.firm + "," + i18n.__('offer') + "," + invoice.offerNr,
            creator: profile.firm + " " + i18n.__('invoice administration')
        });
    }
    if(style==="credit") {
        doc.setProperties({
            title: profile.firm + " " + i18n.__('creditnote')    + " " + invoice.creditNr,
            subject: i18n.__('creditnote of') + " " + profile.firm,
            author: profile.firm,
            keywords: profile.firm + "," + i18n.__('invoice') + "," + invoice.creditNr,
            creator: profile.firm + " " + i18n.__('invoice administration')
        });
    }
    try {
        doc.addImage(imgData, 'JPEG', 15, 5, 50, 50);
    }catch(err){
        console.trace(err);
    }
    doc.setFontType('bold');
    doc.setFontSize(36);
    doc.setTextColor(170, 170, 170);
    if(style==="invoice")
        doc.text(140,35,i18n.__('Invoice'));
    if(style==="credit")
        doc.text(140,35,i18n.__('creditnote'));
    if(style==="offer")
        doc.text(140,35,i18n.__('offer'));
    doc.setTextColor(0,0,0);
    doc.setFontSize(12);
    doc.setFontType("courier");
    c = [20,60];
    doc.text(c[0],c[1],profile.name);
    doc.setFontType("bold");
    /*c[1] += 10;
    doc.text(c[0],c[1],i18n.__('Company info'));
     */
    doc.setFontType("courier");
    c[1] += 5;
    doc.text(c[0],c[1],profile.firm);
    c[1] += 5;
    doc.text(c[0],c[1],profile.street + " " + profile.streetNr);
    c[1] += 5;
    doc.text(c[0],c[1],i18n.__('vat nr')+": "+ profile.vat);
    doc.setFontType("bold");
    c[1] += 10;
    doc.text(c[0],c[1],i18n.__('Banking info'));
    doc.setFontType("courier");
    c[1] += 5;
    doc.text(c[0],c[1],"IBAN: "+profile.iban);
    c[1] += 5;
    doc.text(c[0],c[1],"BIC: "+profile.bic);
    doc.setFontType("bold");
    c = [120,60];
    doc.text(c[0],c[1],i18n.__('Date'));
    c[1] +=5;
    if(style==="invoice")
        doc.text(c[0],c[1],i18n.__('Invoice nr'));
    if(style==="offer")
        doc.text(c[0],c[1],i18n.__('Offer nr'));
    if(style==="credit")
        doc.text(c[0],c[1],i18n.__('creditnote nr'));
    doc.setFontType("courier");
    c[0] += 30;
    c[1] -= 5;
    doc.text(c[0],c[1],date);
    c[1] += 5;
    if(style==="invoice")
        doc.text(c[0],c[1],invoice.invoiceNr.toString());
    if(style==="credit")
        doc.text(c[0],c[1],invoice.creditNr.toString());
    if(style==="offer")
        doc.text(c[0],c[1],invoice.offerNr.toString());

    c = [120,75];
    doc.setFontType("bold");
    doc.text(c[0],c[1],i18n.__('Client'));
    c[1] +=5;
    doc.setFontType("courier");
    if(client.firm){
        doc.text(c[0],c[1],client.firm);
        c[1] +=5;
    }
    doc.text(c[0],c[1],client.clientName);
    c[1] +=5;
    doc.text(c[0],c[1],client.street+" "+client.streetNr);
    c[1] +=5;
    if(client.place){
        if(client.postalCode){
            doc.text(c[0],c[1],client.postalCode+" "+client.place);
        }else{
            doc.text(c[0],c[1],client.place);
        }
        c[1] +=5;
    }
    if(client.vat){
        doc.text(c[0],c[1],i18n.__('vat nr')+": "+client.vat);
    }
    let pdfOrders = [];
    let totalEx = 0;
    let _vat;
    let totalInc;
    try {
        orders.forEach((o)=> {
            pdfOrders.push([o.description, o.amount, o.price, o.total]);
        });
    }catch (e) {
        console.trace(e);

        req.flash('danger',i18n.__('Something went wrong, please try again'));
        req.redirect('back');
    }
    for(let i = 0; i <=pdfOrders.length-1; i++){
        totalEx +=pdfOrders[i][3];
    }
    let ordersPrint = [];
    console.log(orders);
    try {
        orders.forEach((o) => {
                console.log("order: ");
                console.log(o);
                ordersPrint.push([o.description, o.amount, o.price.toFixed(2) + " €", o.total.toFixed(2) + " €"]);

        });
    }catch(err){
        console.trace(err);
        req.flash('danger',i18n.__('Something went wrong, please try again'));
        req.redirect('back');
    }
    console.log(ordersPrint);
    console.log(pdfOrders);
    doc.autoTable({
        theme: 'grid',
        columnStyles: {
            0:{fillColor:[255,255,255]},
            1:{fillColor:[255,255,255],halign:'right'},
            2:{fillColor:[255,255,255],halign:'right'},
            3:{fillColor:[255,255,255],halign:'right'}
        },
        styles: {fillColor: [140, 140, 140]},
        startY: 110,
        head: [[i18n.__('Order'), i18n.__('Amount'), i18n.__('Price'),i18n.__('Total')]],
        body: ordersPrint
    });
    _vat = Math.round((totalEx-invoice.advance)*client.vatPercentage)/100;
    totalExSub  = totalEx - invoice.advance;
    totalInc = totalExSub+_vat;
    if(invoice.advance==0){
        doc.autoTable({
            theme: 'plain',
            startX: 200,
            columnStyles: {
                0:{fillColor:[255,255,255]},
                1:{fillColor:[255,255,255]},
                2:{fillColor:[255,255,255],halign:'right'},
                3:{fillColor:[180,180,180],halign:'right'}},
            styles: {fillColor: [140, 140, 140]},
            body: [
                [[""],["                               "],[i18n.__('subtotal')],[totalEx.toFixed(2)+" €"]],
                [[""],["                               "],[i18n.__('vat')+" "+client.vatPercentage+"%"],[_vat.toFixed(2)+" €"]],
                [[""],["                               "],[i18n.__('total')],[totalInc.toFixed(2)+" €"]]
            ]
        })
    }else{
        doc.autoTable({
            theme: 'plain',
            startX: 200,
            columnStyles: {
                0:{fillColor:[255,255,255]},
                1:{fillColor:[255,255,255]},
                2:{fillColor:[255,255,255],halign:'right'},
                3:{fillColor:[140,140,140],halign:'right'}},
            styles: {fillColor: [140, 140, 140]},
            body: [
                [[""],["                               "],[i18n.__('subtotal')],[totalEx.toFixed(2)+" €"]],
                [[""],["                               "],[i18n.__('advance')],["-"+invoice.advance.toFixed(2)+" €"]],
                [[""],["                               "],[i18n.__('subtotal')],[totalExSub.toFixed(2)+" €"]],
                [[""],["                               "],[i18n.__('vat')+" "+client.vatPercentage+"%"],[_vat.toFixed(2)+" €"]],
                [[""],["                               "],[i18n.__('total')],[totalInc.toFixed(2)+" €"]]
            ]
        })
    }
    /**Footer & Disclaimer**/
    doc.setFontType("courier");
    doc.setFontSize(10);
    let textC = 265;
    dataText.forEach(text => () => {
        doc.text(20,textC,text);
        textC +=5
    });
    doc.setFontType("bold");
    doc.text(80,285,i18n.__('We thank you for your trust.'));
    let filename;
    if(style==="invoice")
        filename = invoice.invoiceNr+".pdf";
    if(style==="credit")
        filename = i18n.__('creditnote')+" "+invoice.creditNr+".pdf";
    if(style==="offer")
        filename = i18n.__('offer')+" "+invoice.offerNr+".pdf";
    let file = './public/images/'+req.session._id+'/'+filename;
    await fs.writeFileSync(file, doc.output(), 'binary');
    await fs.readFile(file, function(err, data) {
        if(data) {
            res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Length', data.length);
            res.status(200).end(data, 'binary');
        }else{
            req.flash('danger','something went wrong, please try again');
            res.redirect('back');
        }
    });
    /*let stream = await fs.readStream(location);
    filename = encodeURIComponent(filename);
    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    stream.pipe(res);*/
    delete global.window;
    delete global.navigator;
    delete global.btoa;
    delete global.html2pdf;
};