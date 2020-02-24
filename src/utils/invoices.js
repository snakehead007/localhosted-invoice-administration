exports.getDefaultNumberOfInvoice = (invoice) => {
    if (!invoice.invoiceNr) {
        if (!invoice.offerNr) {
            return invoice.creditNr
        } else {
            return invoice.offerNr
        }
    } else {
        return invoice.creditNr
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

