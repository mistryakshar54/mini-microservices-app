const express  = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const axios = require('axios');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

const jsonParser = bodyParser.json()

const eventLogs = [];

app.post('/api/event' , jsonParser ,async(req , res) => {
    const { type , message } = req.body;
    console.log("New event recieved" , type , message);
     axios.post( 'http://localhost:8000/api/event' , { type , message } );    
     axios.post( 'http://localhost:8001/api/event' , { type , message } );    
     axios.post( 'http://localhost:8002/api/event' , { type , message } );    
    eventLogs.push({ type , message });
    res.status(200).json({ message : 'success' , data : "Event Sent" })
});

app.get('/api/event' , async( req,res ) => {
    res.status(200).json({ message : 'success' , eventLogs })
});

const server = app.listen( 8005 );
server.on('listening' , () => {
    console.log("Event Bus listening on 8005");
})