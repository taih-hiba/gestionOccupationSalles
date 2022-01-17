const express = require('express')
const router = express()
const Salle = require('../models/salle')
const Bloc = require('../models/bloc')
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');

//definir moteur de template
//set views file
router.set('views',path.join(__dirname,'../views'));
router.use(express.static(path.join(__dirname, 'public')));
			
//set view engine
router.set('view engine', 'ejs');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.get('/', async(req,res) => {
    console.log("HHHHH");
    try{
        const blocs = await Bloc.find()
        console.log(blocs);
        res.render('blocs/index', {
         title : 'Gestion Blocs',
         blocs : blocs
     });
 }catch(err){
     res.send('Error ' + err)
 }
})
router.post('/', async(req,res) => {
    
    Bloc.findById(req.body.bloc._id).then(function(bloc){
        if(bloc != null){
            Salle.create(req.body).then(function(salle){
                res.send(salle);
            });
            res.render('salles/index', {
                title : 'Gestion Salles',
                salles : salles
            });
            
        }else {
            res.json({
                "erreur":"Bloc n'est pasdisponible"
            }) 
        }
    })

})

router.get("/add", (req,res) => {
     // console.log('rorrrrrrrrrro')
     try{
        res.render('blocs/add', {
         title : 'Gestion Blocs'
    
     });
    }catch(err){
        res.send('Error ' + err)
    }
})
router.get("/indexnav", (req,res) => {
    // console.log('rorrrrrrrrrro')
    try{
       res.render('blocs/indexnav', {
        
   
    });
   }catch(err){
       res.send('Error ' + err)
   }
})



router.post('/save', async(req,res) => {
    const bloc = new Bloc({
        name: req.body.name,
    })
    try{
        const a1 =  await bloc.save() 
        console.log(a1);
        res.redirect('/blocs');

    }catch(err){
        res.send('Error')
    }
})

router.get('/delete/:id',(req,res)=> {
  console.log(req.params.id + " HH");
   Bloc.findByIdAndDelete(req.params.id).then(function(bloc){
       Salle.deleteMany({"bloc":bloc}).then(function(salle){
        
       
    })
  
   })
   res.redirect('/blocs');
   
})
router.get('/edit/:id',async(req,res)=> {
    try{
        res.render('blocs/edit', {
         title : 'Gestion Blocs',
         id : req.params.id
     });
    }catch(err){
        res.send('Error ' + err)
    }
})


router.post('/update/:id',async(req,res)=> {
    console.log("hibaaaaaaaaaaaaaaaaaaaa")
    try{
        const bloc = await Bloc.findById(req.params.id) 
        bloc.name = req.body.name
        const a1 = await bloc.save()
        res.redirect('/blocs'); 
    }catch(err){
        res.send('Error')
    }

})

router.get("/test", (req,res) => {
    res.send({
        test : "ok"
    })
})
module.exports = router