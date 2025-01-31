const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { generateSensorData, generateResourceData } = require('./spacecraft-utils');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Input validation middleware
const validateAction = (req, res, next) => {
    const validActions = ['togglePower', 'move', 'refuel', 'activateSensor', 'gatherResources'];
    if (!validActions.includes(req.body.action)) {
        return res.status(400).json({ error: 'Invalid action type' });
    }
    next();
};

// Initialize spacecraft status
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

// Application routes
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

app.post('/action', validateAction, (req, res) => {
    const { action, details } = req.body;
    try {
        switch (action) {
            case 'togglePower':
                spacecraftStatus.power = spacecraftStatus.power === 'ON' ? 'OFF' : 'ON';
                break;
            case 'move':
                const newSpeed = parseInt(details.speed);
                if (isNaN(newSpeed) || newSpeed < 0 || newSpeed > 1000) {
                    throw new Error('Invalid speed value (0-1000)');
                }
                spacecraftStatus.speed = newSpeed;
                break;
            case 'refuel':
                const newFuel = parseInt(details.fuel);
                if (isNaN(newFuel) || newFuel < 0 || newFuel > 1000) {
                    throw new Error('Invalid fuel value (0-1000)');
                }
                spacecraftStatus.fuel = newFuel;
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
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Spacecraft backend running on http://localhost:${PORT}`);
});
