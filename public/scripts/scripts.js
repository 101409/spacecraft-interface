const API_BASE_URL = 'http://localhost:3000';

// Haal de status van het ruimtevoertuig op
async function fetchStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/status`);
        const status = await response.json();
        // Update the UI with the current status
        document.getElementById('power').getElementsByTagName("span")[0].textContent = `${status.power}`;
        document.getElementById('speed').textContent = `Speed: ${status.speed}`;
        document.getElementById('fuel').textContent = `Fuel: ${status.fuel}`;
    } catch (error) {
        console.error('Error fetching status:', error);
    }
}

// Vul het ruimtevoertuig bij met brandstof
async function updateSpeed() {
    const speed = document.getElementById('speedInput').value;
    if (speed) {
        await sendAction('move', { speed });
        fetchStatus();
    }
}

// Fuel de spacecraft
async function refuel() {
    const fuel = document.getElementById('fuelInput').value;
    if (fuel) {
        await sendAction('refuel', { fuel });
        fetchStatus();
    }
}

// Power aan/uit van de spacecraft
async function setPower() {
    await sendAction('togglePower');
    fetchStatus();
}

// Stuur actie naar de server
async function sendAction(action, details = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}/action`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action, details })
        });
        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error('Error sending action:', error);
    }
}

// Fetch status
fetchStatus();