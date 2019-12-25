import mongoose from "mongoose";

const Item = new mongoose.Schema({
    name: String,
    price: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Item', Item);