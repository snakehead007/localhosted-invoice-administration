const Invoice = require('../models/invoice');
const path = require('path');
exports.getDefaultNumberOfInvoice = (invoice) => {
    if (!invoice.invoiceNr) {
        if (!invoice.offerNr) {
            return invoice.creditNr
        } else {
            return invoice.offerNr
        }
    } else {
        return invoice.invoiceNr
    }
    return "error no number found";
};

exports.isInvoiceNrAlreadyInUse = async (invoiceNr,userId) => {
  let invoices = await Invoice.find({fromUser:userId},(err,invoices)=>{return invoices;});
  let timesFound = 0;
  for(let i of invoices){
      console.log(i.invoiceNr+" ? "+invoiceNr);
      if(i.invoiceNr==invoiceNr){
          timesFound++;
      }
  }
 return(timesFound>1);
};

exports.isOfferNrAlreadyInUse = async (offerNr,userId) => {
    let invoices = await Invoice.find({fromUser:userId},(err,invoices)=>{return invoices;});
    let timesFound = 0;
    for(let i of invoices){
        if(i.offerNr==offerNr){
            timesFound++;
        }
    }
    return(timesFound>1);
};

exports.isCreditNrAlreadyInUse = async (creditNr,userId) => {
    let invoices = await Invoice.find({fromUser:userId},(err,invoices)=>{return invoices;});
    let timesFound = 0;
    for(let i of invoices){
        if(i.creditNr==creditNr){
            timesFound++;
        }
    }
    return(timesFound>1);
};
exports.getPathOfInvoice = (fromUser,invoice) => {
    let pdfname;
    //only works if you have first prompted a pdf generation
    if (!invoice.invoiceNr) {
        if (!invoice.offerNr) {
            pdfname= "creditnota "+invoice.creditNr+'.pdf'
        } else {
            pdfname= "offerte" + invoice.offerNr+".pdf"
        }
    } else if(invoice.invoiceNr){
        pdfname= invoice.invoiceNr+".pdf"
    }else{
        throw Error();
    }
    return path.resolve(__dirname,'../../temp/'+fromUser+'/'+pdfname);
};

exports.getOnlyTypeOfInvoice = (invoice) => {
    if (!invoice.invoiceNr) {
        if (!invoice.offerNr) {
            return "credit";
        } else {
            return "offer";
        }
    } else {
        return "invoice";
    }
    return "error no number found";
};

/**
 * This method changes a number to an invoice number
 * @example nr: 15 this return 2019015
 * @param nr
 * @returns {number}
 */
exports.getFullNr = (nr) => {
    let nr_str = nr.toString();
    if (nr_str.toString().length === 1) {
        nr_str = "00" + nr.toString();
    } else if (nr_str.toString().length === 2) {
        nr_str = "0" + nr.toString();
    }
    return Number(new Date().getFullYear() + nr_str);
};

