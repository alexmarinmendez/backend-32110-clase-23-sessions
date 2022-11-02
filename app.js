const express = require('express')
const session = require('express-session')

const app = express()
const server = app.listen(8080, () => console.log('Server Up!'))

app.use(express.json())
app.use(session({
    secret: 'c0d3r',
    cookie: { maxAge: 50000 },
    resave: true,
    saveUninitialized: true
}))

app.get('/connect', (req, res) => {
    if (req.session.counter) {
        req.session.counter++
        return res.send({ message: `Hola de nuevo. Esta es tu visita ${req.session.counter}`})
    }
    req.session.counter = 1
    res.send({ messge: `Bienvenido! Esta es la ${req.session.counter}era vez que nos visitas!`})
})

app.get('/login', (req, res) => {
    let { username , password } = req.query
    //buscar el user en la BD
    if (username!=='alex' || password!='coder') {
        return res.send({err: 'Usuario o contraseña incorrectos'})
    }
    req.session.user = {
        username,
        role: 'admin'
    }
    res.send({message: 'Usuario logueado correctamente'})
})

const isAdmin = (req, res, next) => {
    if (req.session.user&&req.session.user.role==='admin') return next()
    else return res.status(401).send({err: 'No autorizado'})
}

app.get('/ruta-secreta', isAdmin, (req, res) => {
    res.send({message: "Si estas autorizado!"})
})