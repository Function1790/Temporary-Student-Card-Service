const express = require('express')
const app = express()
const fs = require('fs')

app.use(express.static('public'))
app.use('/views', express.static('views'))

const print = (data) => console.log(data)

async function readFile(path) {
    return await new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            resolve(data)
        })
    })
}

async function renderFile(path, replaceItems = {}) {
    var content = await readFile(path)

    for (i in replaceItems) {
        content = content.replaceAll(`{{${i}}}`, replaceItems[i])
    }

    return content
}

app.get('/', async(req, res) => {
    const body = req.query
    res.send(await renderFile('views/index.html', {
        'name': body.name,
        'studentID': body.id,
        'DBindex': body.dbindex
    }))
})


app.listen(5500, () => console.log('Server run https://localhost:5500'))