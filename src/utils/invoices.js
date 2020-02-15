exports.getDefaultNumberOfInvoice = (invoice) => {
    if(!invoice.invoiceNr){
        if(!invoice.offerNr){
            return invoice.creditNr
        }else{
            return invoice.offerNr
        }
    }else{
        return invoice.creditNr
    }
    return "error no number found";
};