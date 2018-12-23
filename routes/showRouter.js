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
			let showData = req.body;
			console.log('showData:', showData);

			let files = req.files;
			console.log('req.files:', files);

			// let parsedShowData = formData.parse(showData);
			// console.log('parsedShowData:', parsedShowData);
			if(files['file'] && files['file']['path']) {
				// console.log('files', files);
				// console.log('files[file]', files['file']);
				// console.log('files[file][path]', files['file']['path']);

				let imgPath = files['file']['path'];
				s3Upload(imgPath);

				//*****Currently responds with 'Access Denied' response*****

				// s3Upload(imgPath).then((res) => {
				// 	let imgRoute = res;
				// 	showData['image'] = imgRoute;
				// 	let show = new Show(showData);
				// 	show.save();
				// 	res.status(201).send(show);
				// })
			}

			let show = new Show(showData);
			res.status(201).send(show);

        // console.log('req.body: ', req.body);


    	// singleUpload(req, res, function(err, some) {
		  //   if (err) {
		  //     return res.status(422).send({errors: [{title: 'Image Upload Error', detail: err.message}] });
		  //   }
		  //   show['image'] = req.file;
		  //   console.log('req.file: ', req.file)
		  //   if(req.file && req.file.location) {
			//
		  //   	show['image'] = req.file.location;
		  //   } else {
		  //   	console.log('no img')
		  //   }
			//
		  //   show.save();
		  //   res.status(201).send(show)
			// });
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
