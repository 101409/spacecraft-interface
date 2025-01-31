/**
 * Generates simulated sensor data for spacecraft monitoring
 * @param {string} sensor - Sensor type to generate data for
 * @returns {number|null} - Simulated sensor value or null for invalid sensor
 */
function generateSensorData(sensor) {
    switch (sensor) {
        case 'temperature':
            return Math.floor(Math.random() * 100);
        case 'humidity':
            return Math.floor(Math.random() * 100);
        case 'pressure':
            return Math.floor(Math.random() * 2000) + 800;
        default:
            return null;
    }
}

/**
 * Generates random resource quantities for mining operations
 * @returns {Object} - Resource quantities {iron: number, gold: number, silver: number}
 */
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