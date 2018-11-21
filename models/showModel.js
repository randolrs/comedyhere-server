import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const showModel = new Schema({
    title: { type: String },
    description: { type: String }
})
export default mongoose.model('shows', showModel)