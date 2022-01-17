const express = require('express')
const mongoose = require('mongoose')
const url ="mongodb+srv://hibataih:hibataih@cluster0.zlo0k.mongodb.net/tpbloc?retryWrites=true&w=majority"


const app = express()

mongoose.connect(url, {useNewUrlParser:true})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})


const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');

//definir moteur de template
//set views file
app.set('views',path.join(__dirname,'/views'));
app.use(express.static(path.join(__dirname, 'public')));
			
//set view engine
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json())

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    //console.log('A new client Connected!');
    //ws.send('Welcome New Client!');
  
    ws.on('message', function incoming(message) {
      //console.log('received: %s', message);
  
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
      
    });
});   
/*app.get('/', async(req,res) => {
  console.log("HHHHH");
  try{
      
      res.render('index', {
       
   });
}catch(err){
   res.send('Error ' + err)
}
})*/


const alienRouter = require('./routes/aliens')
app.use('/aliens',alienRouter)
const dash= require('./routes/dash')
app.use('/',dash)
const blocRouter = require('./routes/blocs')
app.use('/blocs',blocRouter)
const salleRouter = require('./routes/salles')
app.use('/salles',salleRouter)
const creaneauRouter = require('./routes/creneau')
app.use('/creneau',creaneauRouter)
const occupationRouter = require('./routes/occupation')
app.use('/occupation',occupationRouter)
app.use(express.static('public'));


const swaggerUi = require("swagger-ui-express"),
swaggerDocument = require("./swagger.json");
const { urlencoded } = require('express')

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });