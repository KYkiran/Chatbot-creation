const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
const bodyParser = require("body-parser");
const express=require("express");
const env=require("dotenv");

env.config();
const port=3000;
const app=express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

const apiKey =process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
model: "gemini-2.0-flash",
});

const generationConfig = {
temperature: 1,
topP: 0.95,
topK: 40,
maxOutputTokens: 8192,
responseMimeType: "text/plain",
};

async function run(incomingmsg) {
    const chatSession = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chatSession.sendMessage(incomingmsg);
    return result.response.text();
}

app.get('/',(req,res)=>{
    res.render('index.ejs',{reply:null});
});

app.post('/submit',async(req,res)=>{
    let msg=req.body.chinp;
    let reply=await run(msg);
    res.render('index.ejs',{reply:reply});
});
  
app.listen(port,()=>{
    console.log("Listening on port: "+port);
    
})