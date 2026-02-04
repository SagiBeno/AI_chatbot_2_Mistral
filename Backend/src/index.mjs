/** index.mjs */
import { app, port, connection } from "./server.mjs"

app.listen(port, (error)=>{
    if (error) console.warn(error)
    else console.log('Backend runs at port ', port)
})
