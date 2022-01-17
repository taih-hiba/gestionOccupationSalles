const Salle = require('../models/salle')
const Bloc = require('../models/bloc')
const occupation = require('../models/occupation')
const creneau = require('../models/creneau')
const express = require('express')
const router = express()
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');


router.set('views',path.join(__dirname,'../views'));
			
//set view engine
router.set('view engine', 'ejs');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



//router.route('/').get(getNbrOccupations);
router.get('/chart', async(req,res) => {
    
  try{
        var array = []
        var array1 = []
        var array2 = []

        const salles = await Salle.find()
        const blocs = await Bloc.find()
        var k = 0
        for (var i = 0; i < blocs.length; i++) {
          for (var j = 0; j < salles.length; j++) {
            if (blocs[i]._id + '' == salles[j].bloc._id + '') {
              k++
            }
          }

          array1.push({ bloc: blocs[i].name, nbrSalle: k })
          k = 0
        }

        occupation.aggregate(
          [
              { "$group": { 
                  _id:"$date", count:{$sum:1}
              }},
          ],
          function(err,results) {
              if (err) throw err;
              for (var i = 0; i < results.length; i++) {
                  array2.push({ date: results[i]._id, nbrOccupation: results[i].count })
                }
                array.push({ array1: array1, array2: array2 })
                res.status(200).send(array)
          })        
     
}catch(err){
   res.send('Error ' + err)
}
})

router.get('/dash', async(req,res) => {

  console.log("dashhhhhhhhhhh");
  
  try{

    
        var array = []
        const salles = await Salle.find()
        const occupations = await occupation.find()
    
        var k = 0
        for (var i = 0; i < salles.length; i++) {
          for (var j = 0; j < occupations.length; j++) {
            if (salles[i]._id + '' == occupations[j].salle + '') {
              k++
            }
          }
          array.push({ salle: salles[i].name, nombreoccupations: k })
          k = 0
        }
        res.status(200).send(array)
      
      
     
}catch(err){
   res.send('Error ' + err)
}
})



router.get('/', async(req,res) => {
    const salles = await Salle.find()
    const occupations = await occupation.find()
    const blocs = await Bloc.find()
    const creneaux = await creneau.find()
  console.log("HHHHH");
  try{
      
      res.render('index', {
        sallesNbr: salles.length,
        blocsNbr: blocs.length,
        creneauxNbr : creneaux.length

      
   });
}catch(err){
   res.send('Error ' + err)
}
})



module.exports = router



