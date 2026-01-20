/**
 * Popup Script - Extension AutoAnalyseur
 */

let extractedData = null;

// Au chargement du popup
document.addEventListener('DOMContentLoaded', async () => {
    const statusEl = document.getElementById('status');
    const previewEl = document.getElementById('data-preview');
    const errorEl = document.getElementById('error');
    const btnAnalyse = document.getElementById('btn-analyse');

    try {
        // Récupérer l'onglet actif
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab || !tab.url || !tab.url.includes('leboncoin.fr')) {
            showError("Ouvrez une annonce sur Leboncoin d'abord !");
            return;
        }

        // Demander au content script d'extraire les données
        statusEl.querySelector('.status-text').textContent = 'Extraction en cours...';

        chrome.tabs.sendMessage(tab.id, { action: 'extractData' }, (response) => {
            if (chrome.runtime.lastError) {
                showError("Rechargez la page Leboncoin et réessayez.");
                return;
            }

            if (!response || !response.success) {
                showError(response?.error || "Impossible d'extraire les données.");
                return;
            }

            // Succès !
            extractedData = response.data;
            showDataPreview(extractedData);
        });

    } catch (err) {
        showError("Erreur: " + err.message);
    }

    // Bouton analyse
    btnAnalyse.addEventListener('click', () => {
        if (!extractedData) return;
        openAnalyser(extractedData);
    });
});

function showDataPreview(data) {
    const statusEl = document.getElementById('status');
    const previewEl = document.getElementById('data-preview');
    const thumbsEl = document.getElementById('photo-thumbs');
    const btnAnalyse = document.getElementById('btn-analyse');

    // Masquer le status, afficher le preview
    statusEl.style.display = 'none';
    previewEl.style.display = 'block';

    // Remplir les données
    document.getElementById('preview-titre').textContent =
        data.titre?.substring(0, 30) + (data.titre?.length > 30 ? '...' : '') || 'Non trouvé';
    document.getElementById('preview-prix').textContent =
        data.prix ? data.prix.toLocaleString() + ' €' : 'Non trouvé';
    document.getElementById('preview-km').textContent =
        data.kilometrage || 'Non trouvé';
    document.getElementById('preview-annee').textContent =
        data.annee || 'Non trouvé';
    document.getElementById('preview-photos').textContent =
        data.photos?.length ? data.photos.length + ' photos' : 'Aucune';

    // Afficher les miniatures
    if (data.photos && data.photos.length > 0) {
        thumbsEl.innerHTML = data.photos.slice(0, 4).map(url =>
            `<img src="${url}" alt="Photo" class="thumb" onerror="this.style.display='none'">`
        ).join('');
        if (data.photos.length > 4) {
            thumbsEl.innerHTML += `<span class="more-photos">+${data.photos.length - 4}</span>`;
        }
    } else {
        thumbsEl.innerHTML = '<span class="no-photos">Photos non détectées</span>';
    }

    // Activer le bouton
    btnAnalyse.disabled = false;
}

function showError(message) {
    const statusEl = document.getElementById('status');
    const errorEl = document.getElementById('error');

    statusEl.style.display = 'none';
    errorEl.style.display = 'block';
    document.getElementById('error-text').textContent = message;
}

function openAnalyser(data) {
    // Encoder les données en base64
    const jsonData = JSON.stringify({
        prix: data.prix,
        kilometrage: data.kilometrage,
        annee: data.annee,
        marque: data.marque,
        modele: data.modele,
        description: data.description,
        photos: data.photos,
        sourceUrl: data.url
    });

    const encodedData = btoa(unescape(encodeURIComponent(jsonData)));

    // URL GitHub Pages
    const analyserUrl = 'https://venatus57.github.io/autoanalyseur/?data=' + encodedData;

    // Ouvrir l'app AutoAnalyseur hébergée sur GitHub Pages
    chrome.tabs.create({ url: analyserUrl });
}

