var express = require('express');
const mongoose = require('mongoose');

var cors = require('cors')
var path = require('path')
require('dotenv').config();

var app = express();

app.use(express.json());
app.use(cors())

let State = require("./States");


const filePath = './states.json';
const states = require(filePath);
const con_states = ['AK', 'HI'];

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

function checkState(req, res, next) {
    const state = req.params.state.toUpperCase();
    let result = states.find(item => item.code == state);
    if (!result) {
        // The :state URL parameter above represents state codes like KS, NE, TX, NY, etc. Entering in
        // full state names should result in a 404
        res.status(404).json({ "message": "Invalid state abbreviation parameter" });
        return;
    }

    req.state = result;

    next();
}

app.get('/states/', async function (req, res) {

    let state_list = await State.find({});
    console.log("req", req.query);

    let result = states.map(item => {
        let model = state_list.find(row => row.stateCode == item.code);
        if (model)
            item.funfacts = model.funfacts;

        return item;
    });

    if ('contig' in req.query) {
        result = result.filter(item => (con_states.includes(item.code) != (req.query.contig == 'true')));
    }
    console.log("req", result.length);

    res.json(result);
});

app.get('/states/:state', checkState, async function (req, res) {
    let result = req.state;

    let model = await State.findOne({ stateCode: result.code });
    if (model)
        result.funfacts = model.funfacts;

    res.json(result);
});

app.get('/states/:state/funfact', checkState, async function (req, res) {
    let result = req.state;

    let model = await State.findOne({ stateCode: result.code });
    if (model) {
        let index = Math.floor(Math.random() * model.funfacts.length);
        if (index >= model.funfacts.length)
            index = model.funfacts.length - 1;

        res.json({ funfact: model.funfacts[index] });
    }
    else
        res.json({ "message": "No Fun Facts found for " + result.state });
});


app.get('/states/:state/capital', checkState, function (req, res) {
    let result = req.state;

    res.json({ state: result.state, capital: result.capital_city });
});


app.get('/states/:state/nickname', checkState, function (req, res) {
    let result = req.state;

    res.json({ state: result.state, nickname: result.nickname });
});


app.get('/states/:state/population', checkState, function (req, res) {
    let result = req.state;

    res.json({ state: result.state, population: result.population.toLocaleString() });
});



app.get('/states/:state/admission', checkState, function (req, res) {
    let result = req.state;

    res.json({ state: result.state, admitted: result.admission_date });
});


app.post('/states/:state/funfact', checkState, async function (req, res) {
    let funfacts = req.body.funfacts;
    if (!funfacts) {
        res.status(404).json({ "message": "State fun facts value required" });
        return;
    }

    if (!Array.isArray(funfacts)) {
        res.status(404).json({ "message": "State fun facts value must be an array" });
        return;
    }

    let result = req.state;
    let stateCode = result.code;

    let model = await State.findOne({ stateCode: stateCode });
    if (!model) {
        model = new State({ stateCode, funfacts })
    } else {
        model.funfacts = model.funfacts.concat(funfacts);
    }
    await model.save();

    res.json(model);
});


app.patch('/states/:state/funfact', checkState, async function (req, res) {
    let funfact = req.body.funfact;
    let index = req.body.index;
    if (!index) {
        res.status(404).json({ "message": "State fun fact index value required" });
        return;
    }

    if (!funfact) {
        res.status(404).json({ "message": "State fun fact value required" });
        return;
    }

    let result = req.state;
    let stateCode = result.code;

    let model = await State.findOne({ stateCode: stateCode });
    if (!model) {
        res.status(404).json({ "message": "No Fun Facts found for " + result.state });
        return;
    }



    if (index < 1 || index > model.funfacts.length) {
        res.status(404).json({ "message": "No Fun Fact found at that index for " + result.state });
        return;
    }

    model.funfacts[index - 1] = funfact;

    await model.save();

    res.json(model);
});

app.delete('/states/:state/funfact', checkState, async function (req, res) {
    let index = req.body.index;
    if (!index) {
        res.status(404).json({ "message": "State fun fact index value required" });
        return;
    }

    let result = req.state;
    let stateCode = result.code;

    let model = await State.findOne({ stateCode: stateCode });
    if (!model) {
        res.status(404).json({ "message": "No Fun Facts found for " + result.state });
        return;
    }

    if (index < 1 || index > model.funfacts.length) {
        res.status(404).json({ "message": "No Fun Fact found at that index for " + result.state });
        return;
    }

    model.funfacts.splice(index - 1);

    await model.save();

    res.json(model);
});

app.use(function (req, res, next) {
    res.status(404);

    res.format({
        'text/html': () => {
            res.set('Content-Type', 'text/html');
            res.sendFile(path.join(__dirname, '/error.html'));
        },
        'application/json': () => {
            res.set('Content-Type', 'application/json');
            res.send({ error: '404 Not Found' });
        },
        'default': () => {
            res.set('Content-Type', 'text/html');
            res.sendFile(path.join(__dirname, '/error.html'));
        }
    })

});

//Start the connection to the database
console.log("trying to connect to MongoDB " + process.env.DATABASE_URI);
mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let states_funfacts_data =
    [
        {
            "stateCode": "KS",
            "funfacts": [
                "The Kansas state bird is the Western Meadowlark.",
                "Home on the Range is the Kansas state song.",
                "Kansas borders Colorado, Missouri, Nebraska, and Oklahoma.",
                "Kansas has a mountain named Mount Sunflower."
            ]
        },
        {
            "stateCode": "MO",
            "funfacts": [
                "The Missouri state bird is the Bluebird.",
                "The Missouri state flower is the White Hawthorn Blossom.",
                "The Missouri state tree is the Flowering Dogwood."
            ]
        },
        {
            "stateCode": "OK",
            "funfacts": [
                "Oklahoma borders Kansas, Colorado, New Mexico, Texas, Arkansas, and Missouri.",
                "The Oklahoma state flag honors more than 60 groups of Native Americans and their ancestors.",
                "The Missouri state tree is the Eastern Redbud."
            ]
        },
        {
            "stateCode": "NE",
            "funfacts": [
                "Nebraska borders Kansas, Colorado, Wyoming, South Dakota, Iowa, and Missouri.",
                "Nebraska has the same state bird as Kansas, Montana, North Dakota, Oregon, and Wyoming: the Western Meadowlark.",
                "The name Nebraska is based on an Otoe Indian word meaning “flat water,” referring to the Platte River."
            ]
        },
        {
            "stateCode": "CO",
            "funfacts": [
                "The Colorado state flower is the Rocky Mountain Columbine.",
                "The Colorado state tree is the Colorado Blue Spruce.",
                "The name Colorado is taken from the Spanish for the color red, referring to the banks of the Colorado river."
            ]
        },
    ];




//Get the default Mongoose connection (can then be shared across multiple files)
db = mongoose.connection;

const PORT = process.env.PORT | 3000;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    State.find({}, function (err, result) {
        if (err) { console.log(err); }
        else {
            console.log("Result :", result);
            if (result.length === 0) {
                console.log("Intializing the types collection...");
                State.insertMany(states_funfacts_data, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    console.log(result);

                    app.listen(PORT, () => {
                        console.log(`Server listening on http://localhost:${PORT}`)
                    });
                });
            }
            else {
                app.listen(PORT, () => {
                    console.log(`Server listening on http://localhost:${PORT}`)
                });
            }
        }
    });
});
