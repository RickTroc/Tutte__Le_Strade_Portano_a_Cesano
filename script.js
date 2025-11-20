// Coordinate di Cesano di Roma (frazione di Roma Capitale)
const CESANO_COORDS = { lat: 42.0413, lon: 12.3308 };

// Elementi del DOM
const locationInput = document.getElementById('locationInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultContainer = document.getElementById('result-container');
const animationDiv = document.getElementById('animation');
const distanceResultDiv = document.getElementById('distanceResult');

// Event listener per il pulsante
calculateBtn.addEventListener('click', handleCalculation);
locationInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleCalculation();
    }
});


async function handleCalculation() {
    const query = locationInput.value.trim();
    if (!query) {
        alert("Per favore, inserisci un luogo!");
        return;
    }

    // 1. Mostra l'animazione e nascondi il risultato precedente
    resultContainer.classList.remove('hidden');
    distanceResultDiv.classList.add('hidden');
    animationDiv.classList.remove('hidden');

    try {
        // Simula un'attesa per rendere l'animazione più "drammatica"
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 2. Ottieni le coordinate dal luogo inserito
        const userCoords = await getCoordsFromQuery(query);

        // 3. Calcola la distanza
        const distance = calculateHaversineDistance(CESANO_COORDS, userCoords);

        // 4. Mostra il risultato
        distanceResultDiv.innerHTML = `Sei a circa <strong>${distance.toFixed(2)} km</strong> di distanza in linea d'aria da Cesano di Roma!`;

    } catch (error) {
        distanceResultDiv.innerHTML = `Errore: ${error.message}. Sei sicuro di non trovarti in un'altra dimensione?`;
    } finally {
        // Nascondi l'animazione e mostra il box del risultato
        animationDiv.classList.add('hidden');
        distanceResultDiv.classList.remove('hidden');
    }
}

async function getCoordsFromQuery(query) {
    // Usiamo l'API gratuita Nominatim di OpenStreetMap
    const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    const response = await fetch(apiUrl, {
        headers: { 'User-Agent': 'QuantoSeiLontanoDaCesano/1.0 (https://github.com/)' }
    });

    if (!response.ok) {
        throw new Error("Il servizio di geolocalizzazione non risponde.");
    }

    const data = await response.json();
    if (data.length === 0) {
        throw new Error("Non sono riuscito a trovare il luogo che hai inserito.");
    }

    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

function calculateHaversineDistance(coords1, coords2) {
    const R = 6371; // Raggio della Terra in km

    const toRad = (value) => value * Math.PI / 180;

    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lon - coords1.lon);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distanza in km
}