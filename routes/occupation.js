const express = require('express')
const router = express()
const Salle = require('../models/salle')
const Bloc = require('../models/bloc')
const occupation = require('../models/occupation')
const creneau = require('../models/creneau')
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const WebSocket = require('ws')
///////////////////////////////////////////////////////////




             
  





//definir moteur de template
//set views file
router.set('views',path.join(__dirname,'../views'));
			
//set view engine
router.set('view engine', 'ejs');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.get('/', async(req,res) => {
    try{
        const salles = await occupation.find().populate("salle").populate("creneau")
        //console.log(salles)
        res.render('occupation/index', {
         title : 'Gestion Occupation',
         salles : salles
     });
    }catch(err){
        res.send('Error ' + err)
    }
   
})
router.get('/all', async(req,res) => {
    try{
        const salles = await occupation.find().populate("salle").populate("creneau")
        //console.log(salles)
        res.send(salles)
     
    }catch(err){
        res.send('Error ' + err)
    }
   
})


router.get('/occupe/:salle/:creneau/:datee', async(req,res) => {
    try{
 
        const creneauu = await creneau.find({"label":req.params.creneau})
        //console.log(creneauu)
        const sallee = await Salle.find({"name":req.params.salle})
        //console.log(sallee)
        const occupationn = await occupation.find({"creneau":creneauu,"salle":sallee,"date":req.params.datee})
        console.log(occupationn)
        if (occupationn.length === 0) {  res.send('salle non ocuupe') }
        else{res.send('salle deja occupe')}
     
    }catch(err){
        res.send('Error ' + err)
    }
   
})


router.post('/', async(req,res) => {

    Salle.findById(req.body.salle).then(function(salle){
        creneau.findById(req.body.creneau).then(function(creneau){

            if(salle != null && creneau!= null){

                console.log(req.body)
                var currentDate = new Date(); //use your date here

                var datee = currentDate.toLocaleDateString('fr-FR');
                var newdate = datee.split("/").join("-");

                occupation.create({
                    "salle": req.body.salle,
                    "creneau": req.body.creneau,
                    "date":newdate
                   
                }).then(function(occupation){

                    
                 // Create WebSocket connection.
                 const socket = new WebSocket('ws://localhost:8080');

                 // Connection opened
                 socket.addEventListener('open', function (event) {
                          socket.send(JSON.stringify(occupation))
                  });

    

                      

                      


                res.send(occupation);
            });
        }else {
            res.json({
                "erreur":"salle n'est pas disponible"
            })
        }
        })
    })

})

router.get('/delete/:id',async(req,res)=> {
    try{
        const a1 = await occupation.findOneAndDelete(req.params.id)
        const salles = await occupation.find().populate("salle").populate("creneau")
        //console.log(salles)
        res.send(salles)
    }catch(err){
        res.send('Error')
    }
    
})

router.get('/salles/:id',async function (req, res, next) {
    var query = {salle: req.params.id};
    var today = new Date("<YYYY-mm-dd>");


    const salles = await creneau.find({"label":req.params.id})
    occupation.find({"creneau":salles,"date":  {
            $gte:   new Date(new Date().setHours(0,0,0)) ,
            $lt :  new Date(new Date().setHours(23,59,59))
        }    }).populate('salle').then(function (salle) {
        res.send(salle);
    }).catch(next);
});

module.exports = router