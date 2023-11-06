const express = require('express')
const app = express()

const fs = require('fs')
const studentJson = require('./data.json')
const bodyParser = require('body-parser')

app.use(express.static('public'))
app.use('/views', express.static('views'))

app.use(bodyParser.json())
app.use(express.json());
app.use(bodyParser.urlencoded({ extended : false }));

//Function
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

function getIndexFromJson(name, lastID) {
    for (var i in studentJson) {
        if (studentJson[i].name == name && studentJson[i].lastID == lastID) {
            return i + 1
        }
    }
    return -1
}

function toBarcodeForm(index) {
    var result = index.toString()
    const length = result.length
    for (var i = 0; i < 4 - length; i++) {
        result = "0" + result
    }
    return "2022"+result
}

function forcedMoveHTML(url) {
    return `<script>window.location.href = "${url}"</script>`
}

function alertMoveHTML(alert_text, url) {
    return `<script>alert('${alert_text}');window.location.href = "${url}"</script>`
}

// WEB
app.get('/', async (req, res) => {
    const body = req.query
    res.send(await renderFile('views/index.html', {
        'name': body.name,
        'studentID': body.id,
        'DBindex': body.dbindex
    }))
})

app.get('/login', async (req, res) => {
    res.send(await renderFile('views/login.html'))
})


app.get('/login-check', async (req, res) => {
    const body = req.query
    var index = getIndexFromJson(body.name, body.lastID)
    if (index == -1) {
        res.send(alertMoveHTML('존재하지 않는 정보입니다.', '/login'))
        return
    }
    res.send(forcedMoveHTML(`/?name=${body.name}&id=${body.lastID}&dbindex=${toBarcodeForm(index)}`))
})

app.listen(5500, () => console.log('Server run https://localhost:5500'))