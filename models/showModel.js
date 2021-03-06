import mongoose from 'mongoose';
import slug from 'mongoose-slug-generator';
mongoose.plugin(slug);

const Schema = mongoose.Schema;
const showModel = new Schema({
    title: { type: String },
    slug: { type: String, slug: "title" },
    description: { type: String },
    venueName: { type: String },
    address: { type: String },
    addressLat: { type: Number },
    addressLng: { type: Number },
    videoPreview: { type: String },
    videoDescription: { type: String },
    reasonRecommend: { type: String },
    eventURL: { type: String },
    image: {type: String}
})
export default mongoose.model('shows', showModel)
