const API_BASE_URL = 'http://localhost:3000';

// Error handling utility
function showError(message) {
    const errorDiv = document.getElementById('error-display');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}

// Update power status display
function updatePowerStatus(powerState) {
    const powerElement = document.getElementById('power');
    powerElement.classList.remove('on', 'off');
    powerElement.classList.add(powerState.toLowerCase());
    powerElement.querySelector('span').textContent = powerState;
}

// Update sensors and resources status on the UI
function updateSensorsAndResources(sensors, resources) {
    // Update sensor data
    if (sensors) {
        document.getElementById('temperature').textContent = `Temperature: ${sensors.temperature}°C`;
        document.getElementById('humidity').textContent = `Humidity: ${sensors.humidity}%`;
        document.getElementById('pressure').textContent = `Pressure: ${sensors.pressure} hPa`;
    }

    // Update resource data
    if (resources) {
        document.getElementById('iron').textContent = `Iron: ${resources.iron}`;
        document.getElementById('gold').textContent = `Gold: ${resources.gold}`;
        document.getElementById('silver').textContent = `Silver: ${resources.silver}`;
    }
}

// Fetch and display current status
async function fetchStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const status = await response.json();
        updatePowerStatus(status.power);
        document.getElementById('speed').textContent = `Speed: ${status.speed}`;
        document.getElementById('fuel').textContent = `Fuel: ${status.fuel}`;
        
        // Update sensors and resources
        updateSensorsAndResources(status.sensors, status.resources);
    } catch (error) {
        showError(`Status update failed: ${error.message}`);
    }
}

// Command execution handlers
async function updateSpeed() {
    const speedInput = document.getElementById('speedInput');
    const speed = parseInt(speedInput.value);
    
    if (isNaN(speed) || speed < 0 || speed > 1000) {
        showError('Please enter a valid speed (0-1000)');
        speedInput.focus();
        return;
    }
    
    try {
        await sendAction('move', { speed });
        speedInput.value = '';
        fetchStatus();
    } catch (error) {
        showError(error.message);
    }
}

async function refuel() {
    const fuelInput = document.getElementById('fuelInput');
    const fuel = parseInt(fuelInput.value);
    
    if (isNaN(fuel) || fuel < 0 || fuel > 1000) {
        showError('Please enter a valid fuel amount (0-1000)');
        fuelInput.focus();
        return;
    }
    
    try {
        await sendAction('refuel', { fuel });
        fuelInput.value = '';
        fetchStatus();
    } catch (error) {
        showError(error.message);
    }
}

async function setPower() {
    try {
        await sendAction('togglePower');
        fetchStatus();
    } catch (error) {
        showError(error.message);
    }
}

async function activateSensor(sensorType) {
    try {
        await sendAction('activateSensor', { sensor: sensorType });
        fetchStatus();  // Re-fetch and update the status after activation
    } catch (error) {
        showError(error.message);
    }
}

async function gatherResources() {
    try {
        await sendAction('gatherResources');
        fetchStatus();  // Re-fetch and update the resources
    } catch (error) {
        showError(error.message);
    }
}

// Generic action sender
async function sendAction(action, details = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action, details })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Action failed');
        }
        
        return await response.json();
    } catch (error) {
        throw new Error(`Action failed: ${error.message}`);
    }
}

// Initial status fetch
document.addEventListener('DOMContentLoaded', fetchStatus);
