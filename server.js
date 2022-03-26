const express = require('express')
const dotenv = require('dotenv')
const {OAuth2Client} = require('google-auth-library')
const path =require('path')
const cors= require('cors')

dotenv.config()
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID)

const app = express()
app.use(cors())
app.use(express.json())

const users = []
 
function upsert(array,item){
    const i  = array.findIndex(x=>x.email===item.email)
    if(i>-1) array[i] = item
    else{
        array.push(item)
    }
    console.log(array);
}
app.get('/',(req,res)=>{
    res.send('app---running')
})

app.post('/api/google-login',async(req,res)=>{
    const {token} = req.body
    console.log(token,'token');
    const ticket = await client.verifyIdToken({
        idToken:token,
        audience:process.env.CLIENT_ID
    })
    const {name,email,picture} = ticket.getPayload()
    upsert(users,{ name,email,picture })
    res.status(201) 
    res.json({ name,email,picture })
})

app.use(express.static(path.join(__dirname,'/build')))

app.listen(process.env.PORT||5000,()=>{
    console.log('start');
})