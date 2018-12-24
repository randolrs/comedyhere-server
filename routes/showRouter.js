import express from 'express';
import Show from '../models/showModel';
const upload = require('../services/file-upload.js');
const singleUpload = upload.single('image')
const showRouter = express.Router();
const formData = require('express-form-data');
import s3Upload from '../services/s3-upload'

showRouter.use('/:showId', (req, res, next)=>{

	Show.find({slug: req.params.showId}, (err,show)=>{
        if(err)
            res.status(500).send(err)
        else {
        	console.log(show);
        	if(show.length > 0) {
        		req.show = show[0];
            	next();
        	} else {
        		//check id as a backup
        		Show.findById(req.params.showId, (err,show)=>{
			        if(err)
			            res.status(500).send(err)
			        else {
			            req.show = show;
			            next()
			        }
			    })
        	}
        }
    })
})

showRouter.route('/')
    .get((req, res) => {
        Show.find({}, (err, shows) => {
            res.json(shows)
        })
    })
    .post((req, res) => {
			const showData = req.body;
			let show = new Show(showData);
			show.save();

			const files = req.files;

			if(files['file'] && files['file']['path']) {
				const imgPath = files['file']['path'];
				s3Upload(imgPath, show, 'image');
			}

			res.status(201).send(show);
    });

showRouter.route('/:showId')
    .get((req, res) => {
        res.json(req.show);
        console.log(req.show);
    }) // end get Shows/:showId
    .put((req,res) => {
        // req.show.title = req.body.title;
        // req.show.author = req.body.description;
        req.show.save()
        res.json(req.show)
    })
    .patch((req,res)=>{
        if(req.body._id){
            delete req.body._id;
        }
        for( let p in req.body ){
            req.show[p] = req.body[p]
        }
        req.show.save()
        res.json(req.show)
    })// end patch
    .delete((req,res)=>{
        req.show.remove(err => {
            if(err){
                res.status(500).send(err)
            }
            else{
                res.status(204).send('removed')
            }
        })
    })//delete

export default showRouter;
