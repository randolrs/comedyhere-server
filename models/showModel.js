import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const showModel = new Schema({
    title: { type: String },
    description: { type: String },
    venueName: { type: String },
    address: { type: String },
    videoPreview: { type: String },
    videoDescription: { type: String },
    reasonRecommend: { type: String }
})
export default mongoose.model('shows', showModel)