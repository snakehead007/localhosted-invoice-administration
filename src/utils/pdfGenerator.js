global.window = {
    document: {
        createElementNS: () => {
            return {};
        },
    },
};
global.navigator = {};
global.html2pdf = {};
global.btoa = require("atob");
//global.PNG = require("png-js");
//global.zlib = require("zlib");
const fs = require("fs");
const JsPDF = require("jspdf");
window.jsPDF = require("jspdf");
const i18n = require("i18n");
const path = require("path");

const {callGetBase64, createJSON, replaceAll} = require("../utils/pdfCreation");
require("jspdf-autotable");
exports.createPDF = async (req, res, style = "invoice", profile, settings, client, invoice, orders,download=false,onlyPrompt=false) => {
    console.log('download set to: '+download);
    let imgData;
    try {
        imgData = await callGetBase64(req.session._id);
    } catch (err) {
        console.log("[Error]: No image found");
    }
    let dataText;
    if (style === "invoice")
        dataText = replaceAll(settings.invoiceText, profile, client, invoice, settings.locale);
    if (style === "offer")
        dataText = replaceAll(settings.offerText, profile, client, invoice, settings.locale);
    if (style === "credit")
        dataText = replaceAll(settings.creditText, profile, client, invoice, settings.locale);
    let c = [0, 0];
    let dateObject = new Date(invoice.date);
    let date = dateObject.getDate() + "/" + (dateObject.getMonth()+1) + "/" + dateObject.getFullYear();
    let doc = new JsPDF();
    doc.setFont(doc.getFontList()[0]);
    if (style === "invoice") {
        doc.setProperties({
            title: profile.firm + " " + i18n.__("invoice") + " " + invoice.invoiceNr,
            subject: i18n.__("invoice of") + " " + profile.firm,
            author: profile.firm,
            keywords: profile.firm + "," + i18n.__("invoice") + "," + invoice.invoiceNr,
            creator: profile.firm + " " + i18n.__("invoice administration")
        });
    }
    if (style === "offer") {
        doc.setProperties({
            title: profile.firm + " " + i18n.__("offer") + " " + invoice.creditNr,
            subject: i18n.__("offer of") + " " + profile.firm,
            author: profile.firm,
            keywords: profile.firm + "," + i18n.__("offer") + "," + invoice.offerNr,
            creator: profile.firm + " " + i18n.__("invoice administration")
        });
    }
    if (style === "credit") {
        doc.setProperties({
            title: profile.firm + " " + i18n.__("creditnote") + " " + invoice.creditNr,
            subject: i18n.__("creditnote of") + " " + profile.firm,
            author: profile.firm,
            keywords: profile.firm + "," + i18n.__("invoice") + "," + invoice.creditNr,
            creator: profile.firm + " " + i18n.__("invoice administration")
        });
    }
    try {
        doc.addImage(imgData, "JPEG", 15, 5, 50, 50);
    } catch (err) {
        console.log("Putting in place holder name");
        doc.setFontType("bold");
        doc.setFontSize(42);
        doc.text(15, 20,profile.firm);
    }
    doc.setFontType("bold");
    doc.setFontSize(36);
    doc.setTextColor(170, 170, 170);
    if (style === "invoice")
        doc.text(140, 35, i18n.__("Invoice"));
    if (style === "credit")
        doc.text(140, 35, i18n.__("creditnote"));
    if (style === "offer")
        doc.text(140, 35, i18n.__("offer"));
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFontType("courier");
    c = [20, 60];
    doc.text(c[0], c[1], profile.name);
    doc.setFontType("bold");
    /*c[1] += 10;
    doc.text(c[0],c[1],i18n.__("Company info"));
     */
    doc.setFontType("courier");
    c[1] += 5;
    doc.text(c[0], c[1], profile.firm);
    c[1] += 5;
    doc.text(c[0], c[1], profile.street + " " + profile.streetNr);
    c[1] += 5;
    doc.text(c[0], c[1], i18n.__("VAT nr") + ": " + profile.vat);
    doc.setFontType("bold");
    c[1] += 10;
    doc.text(c[0], c[1], i18n.__("Banking info"));
    doc.setFontType("courier");
    c[1] += 5;
    doc.text(c[0], c[1], "IBAN: " + profile.iban);
    c[1] += 5;
    doc.text(c[0], c[1], "BIC: " + profile.bic);
    doc.setFontType("bold");
    c = [120, 60];
    doc.text(c[0], c[1], i18n.__("Date"));
    c[1] += 5;
    if (style === "invoice")
        doc.text(c[0], c[1], i18n.__("Invoice nr"));
    if (style === "offer")
        doc.text(c[0], c[1], i18n.__("Offer nr"));
    if (style === "credit")
        doc.text(c[0], c[1], i18n.__("creditnote nr"));
    doc.setFontType("courier");
    c[0] += 30;
    c[1] -= 5;
    doc.text(c[0], c[1], date);
    c[1] += 5;
    if (style === "invoice")
        doc.text(c[0], c[1], invoice.invoiceNr.toString());
    if (style === "credit")
        doc.text(c[0], c[1], invoice.creditNr.toString());
    if (style === "offer")
        doc.text(c[0], c[1], invoice.offerNr.toString());

    c = [120, 75];
    doc.setFontType("bold");
    doc.text(c[0], c[1], i18n.__("Client"));
    c[1] += 5;
    doc.setFontType("courier");
    if (client.firm) {
        doc.text(c[0], c[1], client.firm);
        c[1] += 5;
    }
    doc.text(c[0], c[1], client.clientName);
    c[1] += 5;
    doc.text(c[0], c[1], client.street + " " + client.streetNr);
    c[1] += 5;
    if (client.place) {
        if (client.postalCode) {
            doc.text(c[0], c[1], client.postalCode + " " + client.place);
        } else {
            doc.text(c[0], c[1], client.place);
        }
        c[1] += 5;
    }
    if (client.vat) {
        doc.text(c[0], c[1], i18n.__("VAT nr") + ": " + client.vat);
    }
    let pdfOrders = [];
    let totalEx = 0;
    let _vat;
    let totalInc;
    try {
        orders.forEach((o) => {
            pdfOrders.push([o.description, o.amount, o.price, o.total]);
        });
    } catch (e) {
        console.trace(e);

        req.flash("danger", i18n.__("Something went wrong, please try again"));
        req.redirect("back");
    }
    for (let i = 0; i <= pdfOrders.length - 1; i++) {
        totalEx += pdfOrders[i][3];
    }
    let ordersPrint = [];
    try {
        orders.forEach((o) => {
            ordersPrint.push([o.description, o.amount, o.price.toFixed(2) + " €", o.total.toFixed(2) + " €"]);

        });
    } catch (err) {
        console.trace(err);
        req.flash("danger", i18n.__("Something went wrong, please try again"));
        req.redirect("back");
    }
    doc.autoTable({
        theme: "grid",
        columnStyles: {
            0: {fillColor: [255, 255, 255]},
            1: {fillColor: [255, 255, 255], halign: "right"},
            2: {fillColor: [255, 255, 255], halign: "right"},
            3: {fillColor: [255, 255, 255], halign: "right"}
        },
        styles: {fillColor: [140, 140, 140]},
        startY: 110,
        head: [[i18n.__("Description"), i18n.__("Amount"), i18n.__("Price"), i18n.__("Total")]],
        body: ordersPrint
    });
    _vat = Math.round((totalEx - invoice.advance) * client.vatPercentage) / 100;
    totalExSub = totalEx - invoice.advance;
    totalInc = totalExSub + _vat;
    if (invoice.advance == 0) {
        doc.autoTable({
            theme: "plain",
            startX: 200,
            columnStyles: {
                0: {fillColor: [255, 255, 255]},
                1: {fillColor: [255, 255, 255]},
                2: {fillColor: [255, 255, 255], halign: "right"},
                3: {fillColor: [180, 180, 180], halign: "right"}
            },
            styles: {fillColor: [140, 140, 140]},
            body: [
                [[""], ["                               "], [i18n.__("subtotal")], [totalEx.toFixed(2) + " €"]],
                [[""], ["                               "], [i18n.__("VAT") + " " + client.vatPercentage + "%"], [_vat.toFixed(2) + " €"]],
                [[""], ["                               "], [i18n.__("total")], [totalInc.toFixed(2) + " €"]]
            ]
        })
    } else {
        doc.autoTable({
            theme: "plain",
            startX: 200,
            columnStyles: {
                0: {fillColor: [255, 255, 255]},
                1: {fillColor: [255, 255, 255]},
                2: {fillColor: [255, 255, 255], halign: "right"},
                3: {fillColor: [140, 140, 140], halign: "right"}
            },
            styles: {fillColor: [140, 140, 140]},
            body: [
                [[""], ["                               "], [i18n.__("subtotal")], [totalEx.toFixed(2) + " €"]],
                [[""], ["                               "], [i18n.__("advance")], ["-" + invoice.advance.toFixed(2) + " €"]],
                [[""], ["                               "], [i18n.__("subtotal")], [totalExSub.toFixed(2) + " €"]],
                [[""], ["                               "], [i18n.__("VAT") + " " + client.vatPercentage + "%"], [_vat.toFixed(2) + " €"]],
                [[""], ["                               "], [i18n.__("total")], [totalInc.toFixed(2) + " €"]]
            ]
        })
    }
        c[0] = 150 + (pdfOrders.length * 7) + 10;
        c[1] = 20;
        if(invoice.description) {
            let description = invoice.description.split('\r\n');
            description.forEach((text) => {
                doc.text(c[1], c[0], text);
                c[0] += 5;
            });
        }
    if(invoice.offerNr){
        c[0] += 10;
        doc.setFontType("courier");
        doc.setFontSize(12);
        doc.text(c[1], c[0], i18n.__("Name") + ":");
        c[0] += 15;
        doc.setFontSize(12);
        doc.text(c[1], c[0], i18n.__("Date") + ":");
        c[0] -= 15;
        c[1] += 105;
        doc.setFontType("courier");
        doc.setFontSize(12);
        doc.text(c[1], c[0], i18n.__("Signature for agreement") + ":");
    }


    /**Footer & Disclaimer**/
    doc.setFontType("courier");
    doc.setFontSize(10);
    let textC = 270;
    dataText.forEach((text) => {
        let px = 92.0 - visualLength(text);
        doc.text(px, textC, text);
        textC += 5
    });
    let filename;
    if (style === "invoice")
        filename = invoice.invoiceNr + ".pdf";
    if (style === "credit")
        filename = i18n.__("creditnote") + " " + invoice.creditNr + ".pdf";
    if (style === "offer")
        filename = i18n.__("offer") + " " + invoice.offerNr + ".pdf";
    try{
        await fs.mkdirSync("./temp/"+req.session._id);
    }catch(e){
        console.error(e);
    }
    let file = "./temp/" + req.session._id + "/" + filename;
    console.log(file);
    await fs.writeFileSync(file, doc.output(), "binary");
    if(!onlyPrompt) {
        if (download) {
            res.download(file);
        } else {
            fs.readFile(file, function (err, data) {
                res.contentType("application/pdf");
                res.send(data);
            });
            /*await fs.readFile(file, function (err, data) {
                if (data) {
                    res.setHeader("Content-Disposition", "inline; filename=\"" + filename + "\"");
                    res.setHeader("Content-Type", "application/pdf");
                    res.setHeader("Content-Length", data.length);
                    res.status(200).end(data, "binary");
                } else {
                    req.flash("danger", "something went wrong, please try again");
                    res.redirect("back");
                }
            });*/
        }
    }
    delete global.window;
    delete global.navigator;
    delete global.btoa;
    delete global.html2pdf;
};
visualLength = (string) => {
    return string.length * 0.7;
};
String.prototype.splice = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};

function addreturnsInString(s) {
    let newStr = "";
    for(let i = 0; i < 5;i++){
        console.log(i);
        let cur = s.substring(i,78*(i+1));
        console.log(cur);
        if(cur.indexOf('\r\n')=== -1){
            cur = cur.splice(78,0,"\r\n");
        }
        newStr+=cur;

    }
    return newStr;
}