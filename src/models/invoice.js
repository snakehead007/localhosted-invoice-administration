import mongoose from 'mongoose';

const Invoice = new mongoose.Schema({
    date: Date,
    datePaid: Date,
    invoiceNr: Number,
    offerNr: Number,
    creditNr: Number,
    isPaid: {
        type: Boolean,
        default: false
    },
    advance: {
        type: Number,
        default: 0
    },
    clientName: String,
    total: {
        type: Number,
        default: 0
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Order'
    }],
});

export default mongoose.model('Invoice', Invoice);