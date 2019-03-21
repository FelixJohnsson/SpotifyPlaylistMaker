const express = require('express')
const app = express()
const port = 5000


app.get('/login', function(req, res) {
    const my_client_id = 'a3bdbe8518e042efab6aa0ad30f27090'
    const redirect_uri = 'http://localhost:5000/'
    var scopes = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id=' + my_client_id +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent(redirect_uri));
    });

app.use(express.static('public'))
app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))