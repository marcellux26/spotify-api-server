const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const spotifyWebApi = require('spotify-web-api-node');
const lyricsFinder = require('spotify-web-api-node')

const app = express();
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    console.log('hi')
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000/callback',
        clientId: 'c991b72bf2104444b083017c3021ad1a',
        clientSecret: 'cbc9fc5feece4335be4ca793c2566225',
        refreshToken,
    })
    spotifyApi.refreshAccessToken().then(
        (data) => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in
            })
        }).catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })
})
app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new spotifyWebApi({
        redirectUri: 'http://localhost:3000/callback', // i needed to use callback
        clientId: 'c991b72bf2104444b083017c3021ad1a',
        clientSecret: 'cbc9fc5feece4335be4ca793c2566225',
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(400)
    })
})

app.get('/lyrics', (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || 'No Lyrics Found'
    res.json({lyrics})
})

app.listen(3001)