import mongoose from 'mongoose';
const Database = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }]
})
export default mongoose.model('Database',Database);
