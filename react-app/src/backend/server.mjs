/** server.mjs */
/* server contains endpoint definitions, index listens */
/* test this and not index.mjs! */
import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise';

export const app = express()

app.use(cors())
app.use(express.json())

export const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'ai_chat',
  password: '',
});

app.get('/messages', async (req, res)=>{
    try {
        const sql = 'SELECT id, thread_id, role, message_content FROM chat_completions ORDER BY id ASC LIMIT 100'
        let [results, fields] = [[], []] // TODO
        console.log('results', results)
        return res.status(200).json({results, fields})
    } catch (error) {
        console.warn('error', error)
        return res.status(400).json({error})
    }
})

app.post('/messages', async (req, res)=>{
    try {
        const {role, message_content} = req.body
        const values = 'TODO'
        const sql = 'INSERT INTO chat_completions TODO'
        let [result, fields] = [[], []] // TODO
        console.log('result', result)
        return res.status(201).json({result, fields})
    } catch (error) {
        console.warn('error', error)
        return res.status(400).json({error})        
    }
})

export const port = process?.env?.PORT || 3333
