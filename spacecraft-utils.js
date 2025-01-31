// Willekeurige sensor data genereren
function generateSensorData(sensor) {
    switch (sensor) {
        case 'temperature':
            return Math.floor(Math.random() * 100); // Simuleer temperatuur (0-100°C)
        case 'humidity':
            return Math.floor(Math.random() * 100); // Simuleer luchtvochtigheid (0-100%)
        case 'pressure':
            return Math.floor(Math.random() * 2000) + 800; // Simuleer druk (800-2800 hPa)
        default:
            return null;
    }
}

// Willekeurige grondstoffen genereren (ijzer, goud, zilver)
function generateResourceData() {
    return {
        iron: Math.floor(Math.random() * 100),
        gold: Math.floor(Math.random() * 100),
        silver: Math.floor(Math.random() * 100)
    };
}

module.exports = {
    generateSensorData,
    generateResourceData
};
