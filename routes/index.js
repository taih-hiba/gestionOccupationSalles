const express = require('express')
const router = express()

const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');

//definir moteur de template
//set views file
router.set('views',path.join(__dirname,'../views'));
			
//set view engine
router.set('view engine', 'ejs');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.get('/dash', async(req,res) => {
    console.log("HHHHH");
    try{
     
        res.render('index/index', {
        title : 'Gestion Blocs'
         
     });
 }catch(err){
     res.send('Error ' + err)
 }
})