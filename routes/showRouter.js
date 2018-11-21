import express from 'express';
import Show from '../models/showModel';
const showRouter = express.Router();

showRouter.use('/:showId', (req, res, next)=>{

	Show.find({slug: req.params.showId}, (err,show)=>{
        if(err)
            res.status(500).send(err)
        else {
        	console.log(show);
        	if(show.length > 0) {
        		req.show = show;
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
        let show = new Show(req.body);
        show.save();
        res.status(201).send(show) 
    })

showRouter.route('/:showId')
    .get((req, res) => {
        res.json(req.show)
    }) // end get Shows/:showId 
    .put((req,res) => {
        req.show.title = req.body.title;
        req.show.author = req.body.description;
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
        // res.json(req.show)
        res.json([]); //empty placeholder
    })//patch
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