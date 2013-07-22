app = require('express.io')()
app.http().io()

//Setup the ready route, and emit talk event.
app.io.route('ready', function(req) {
	req.io.emit('talk', {
		message: 'io event from an io route on the server'
	})
	req.io.emit('talk2', {
		message: 'io2 event from an io route on the server'
	})
})

//Send the client html.
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html')
})

app.listen(7076);