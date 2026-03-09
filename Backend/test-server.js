
import express from "express"
const app = express()
app.get("/test", (req, res) => res.json({ ok: true }))
app.listen(9999, () => console.log("test server on 9999"))