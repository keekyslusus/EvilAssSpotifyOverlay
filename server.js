const fs = require('fs');
const ini = require('ini');
const path = require('path');

const config = ini.parse(fs.readFileSync(path.join(__dirname, 'config.ini'), 'utf-8'));
const CLIENT_ID = config.spotify.client_id;
const CLIENT_SECRET = config.spotify.client_secret;
const REDIRECT_URI = config.spotify.redirect_uri;
const PORT = config.spotify.port;

const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();

let accessToken = null;
let refreshToken = null;
let tokenExpiresAt = null;

app.use(express.static(path.join(__dirname, 'public')))
   .use(cors());

app.get('/', (req, res) => {
    res.redirect('/widget.html');
});

app.get('/login', (req, res) => {
    const scope = 'user-read-currently-playing';
    res.redirect('https://accounts.spotify.com/authorize?' + new URLSearchParams({ response_type: 'code', client_id: CLIENT_ID, scope: scope, redirect_uri: REDIRECT_URI }).toString());
});

app.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: { code: code, redirect_uri: REDIRECT_URI, grant_type: 'authorization_code' },
        headers: { 'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
        json: true
    };

    request.post(authOptions, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            accessToken = body.access_token;
            refreshToken = body.refresh_token;
            tokenExpiresAt = Date.now() + (body.expires_in * 1000);
            console.log('successfully authenticated! tokens received.');
            res.redirect('/');
        } else {
            console.error('error during authentication:', body);
            res.send('error during authentication callback. check terminal for details.');
        }
    });
});

function refreshAccessToken() {
    return new Promise((resolve, reject) => {
        if (!refreshToken) {
            reject(new Error('no refresh token available'));
            return;
        }

        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: { 'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')) },
            form: {
                grant_type: 'refresh_token',
                refresh_token: refreshToken
            },
            json: true
        };

        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                accessToken = body.access_token;
                tokenExpiresAt = Date.now() + (body.expires_in * 1000);
                console.log("access token refreshed!");
                resolve();
            } else {
                console.error("could not refresh token:", error || body);
                reject(error || new Error('token refresh failed'));
            }
        });
    });
}

// check if token needs refreshing (5 min. buffer)
function needsTokenRefresh() {
    if (!tokenExpiresAt) return false;
    return Date.now() > (tokenExpiresAt - 5 * 60 * 1000);
}

app.get('/api/now-playing', async (req, res) => {
    if (!accessToken) {
        return res.status(401).json({ error: 'not authenticated. please go to /login' });
    }

    if (needsTokenRefresh()) {
        try {
            await refreshAccessToken();
        } catch (error) {
            console.error('failed to refresh token:', error);
            return res.status(401).json({ error: 'token refresh failed. please go to /login' });
        }
    }

    const options = {
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: { 'Authorization': 'Bearer ' + accessToken },
        json: true
    };

    request.get(options, async (error, response, body) => {
        if (response && response.statusCode === 401) {
            try {
                await refreshAccessToken();
                options.headers['Authorization'] = 'Bearer ' + accessToken;
                request.get(options, (error, response, body) => {
                    if (!error && response.statusCode === 200 && body && body.item) {
                        const track = {
                            id: body.item.id,
                            name: body.item.name,
                            artist: body.item.artists.map(artist => artist.name).join(', '),
                            isPlaying: body.is_playing
                        };
                        res.json(track);
                    } else {
                        res.status(204).send();
                    }
                });
            } catch (refreshError) {
                console.error('Token refresh failed on 401:', refreshError);
                return res.status(401).json({ error: 'authentication failed. please go to /login' });
            }
        } else if (!error && response.statusCode === 200 && body && body.item) {
            const track = {
                id: body.item.id,
                name: body.item.name,
                artist: body.item.artists.map(artist => artist.name).join(', '),
                isPlaying: body.is_playing
            };
            res.json(track);
        } else {
            res.status(204).send();
        }
    });
});

app.listen(PORT, () => {
    console.log(`server listening on http://127.0.0.1:${PORT}`);
    console.log(`to authorize, open your browser to \x1b[36mhttp://127.0.0.1:${PORT}/login\x1b[0m`);
});

// refresh the token every 50 minutes (spotify tokens last 60m)
setInterval(async () => {
    if (accessToken && refreshToken) {
        try {
            await refreshAccessToken();
        } catch (error) {
            console.error('Scheduled token refresh failed:', error);
        }
    }
}, 50 * 60 * 1000);