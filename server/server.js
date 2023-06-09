import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const current_messages = [{role: "system", content: ``}]

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from openAI!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    current_messages.push({role: "user", content: `${prompt}`})
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.66,
        max_tokens: 2048,
        frequency_penalty: 0,
        presence_penalty: 0,
        top_p: 1,
        messages: current_messages, // {role: "assistant", content: ''}
    });
    console.log()
    res.status(200).send({
      bot: response.data.choices[0].message.content
    });
    current_messages.push({role: "assistant", content: response.data.choices[0].message.content})
  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))
