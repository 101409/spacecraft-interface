const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { generateSensorData, generateResourceData } = require('./spacecraft-utils');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Gegevens van het ruimtevoertuig in geheugen
let spacecraftStatus = {
    power: 'OFF',
    speed: 0,
    fuel: 100,
    sensors: {
        temperature: 22,
        humidity: 50,
        pressure: 1013
    },
    resources: {
        iron: 0,
        gold: 0,
        silver: 0
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/status', (req, res) => {
    res.json({
        power: spacecraftStatus.power,
        speed: spacecraftStatus.speed,
        fuel: spacecraftStatus.fuel,
        sensors: spacecraftStatus.sensors,
        resources: spacecraftStatus.resources
    });
});

app.post('/action', (req, res) => {
    const { action, details } = req.body;
    switch (action) {
        case 'togglePower':
            spacecraftStatus.power = spacecraftStatus.power === 'ON' ? 'OFF' : 'ON';
            break;
        case 'move':
            spacecraftStatus.speed = parseInt(details.speed);
            break;
        case 'refuel':
            spacecraftStatus.fuel = parseInt(details.fuel);
            break;
        case 'activateSensor':
            if (details.sensor && spacecraftStatus.sensors[details.sensor] !== undefined) {
                spacecraftStatus.sensors[details.sensor] = generateSensorData(details.sensor);
            }
            break;
        case 'gatherResources':
            spacecraftStatus.resources = generateResourceData();
            break;
        default:
            return res.status(400).json({ error: 'Unknown action' });
    }
    res.json({ message: 'Action executed', status: spacecraftStatus });
});

app.listen(PORT, () => {
    console.log(`Spacecraft backend is running on http://localhost:${PORT}`);
});
