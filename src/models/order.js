import mongoose from "mongoose";

const Order = new mongoose.Schema({
    description: {
        type: String,
        default: ""
    },
    amount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    }
})

export default mongoose.model('Order', Order);