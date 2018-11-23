import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import showRouter from './routes/showRouter';
import formData from 'express-form-data'
import slug from 'mongoose-slug-generator';

mongoose.plugin(slug);

const db = mongoose.connect('mongodb://shane:Secure10ml@ds125618.mlab.com:25618/comedyhere');
const app = express();
const port = process.env.PORT || 5656;

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS, PATCH');
  next();
});

// routes go here
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

app.use(formData.parse())

app.use('/api/Shows', showRouter);