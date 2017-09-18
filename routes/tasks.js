var router = require('express').Router();
var pool = require('../modules/pool');

// inventory get route
// every get needs a send, a send is a response sent from the server to display data
router.get('/', function (req, res) {
    console.log('in get tasks route');
    pool.connect(function (connectionError, client, done) {
        // connectionError = connection to db error
        // client = worker to ask query of
        // done = function we will call to release client
        if (connectionError) {
            console.log('tasks get route connection error ->', connectionError);
            res.sendStatus(500);
            // 500 = something BLEW UP
        } else {
            // ask the client to run our query
            // param 1 is query itself, 2 is callback
            client.query('SELECT * FROM tasks;', function (queryError, resultObj) {
                done(); // releases the client
                if (queryError) {
                    console.log(queryError);
                    res.sendStatus(500);
                } else {
                    console.log('resultsObject ->', resultObj.rows);
                    res.send(resultObj.rows);
                }
            });
        }

    });
});

router.post('/', function (req, res) {
    console.log('in post tasks route, req.body ->', req.body);
    var input = req.body;
    pool.connect(function (connectionError, client, done) {
        if (connectionError) {
            console.log('tasks post route connection error ->', connectionError);
            done();
            res.sendStatus(500);
        } else {
            var queryString = 'INSERT INTO tasks (task, due) VALUES ($1, $2)';
            var values = [input.task, input.due];
            console.log('value ->', values);
            client.query(queryString, values, function (qErr, resultObj) {
                done();
                if (qErr) {
                    console.log('qErr ->', qErr);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
        }
    });
});

router.post('/complete', function (req, res) {
    console.log('in complete tasks route, req.body ->', req.body, 'req.body.id ->', req.body.id);
    var input = req.body.id;
    pool.connect(function (connectionError, client, done){
        if (connectionError) {
            console.log('complete tasks post route connection error ->', connecionError);
            done();
            res.sendStatus(500);
        } else {
            var queryString = 'UPDATE tasks SET completed=true WHERE id=$1';
            var values = [input];
            client.query(queryString, values, function (qErr, resultObj){
                done();
                if (qErr) {
                    console.log('qErr ->', qErr);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            })
        }
    })
})

router.delete('/:id', function (req, res) {
    var dbId = req.params.id;
    console.log('in delete task route, req.params.id ->', dbId);
    pool.connect(function (connectionError, client, done) {
        if (connectionError) {
            console.log('delete task route connection error ->', connectionError);
            done();
            res.sendStatus(500);
        } else {
            var queryString = 'DELETE FROM tasks WHERE id=$1';
            var values = [dbId];
            console.log('delete values ->', values);
            client.query(queryString, values, function (qErr, resultObj) {
                done();
                if (qErr) {
                    console.log('delete tasks qErr ->', qErr);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            })
            
        }
    })
})

module.exports = router;