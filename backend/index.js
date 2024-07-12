import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const app = express();
const port = 8080;
app.use(bodyParser.json());
app.use(cors());

// Load environment variables from .env file
dotenv.config(); 

// openai initialization
const openai = new OpenAI({
    organization: process.env.OPENAI_ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY
});

// set endpoints
app.post("/", async(request, response)=>{
    const {chats} = request.body;

    // create openai completion
    const result = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: "You are BellaGPT. You can write emails" }, ...chats],
    });

    // send the response
    response.json({
        output: result.choices[0].message
    })

})

// set the server
app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})