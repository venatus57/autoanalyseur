/**
 * Content Script - Extracteur de données Leboncoin
 * Injecté automatiquement sur les pages leboncoin.fr
 */

const LeboncoinExtractor = {
    /**
     * Extrait toutes les données de l'annonce
     */
    extractData() {
        const data = {
            url: window.location.href,
            titre: this.extractTitre(),
            prix: this.extractPrix(),
            description: this.extractDescription(),
            photos: this.extractPhotos(),
            timestamp: Date.now()
        };

        // Extraire km et année depuis le sous-titre (ex: "Mazé-Milon · 1989 · 125000 km · Essence")
        const subtitleData = this.extractFromSubtitle();
        data.annee = subtitleData.annee;
        data.kilometrage = subtitleData.kilometrage;
        data.carburant = subtitleData.carburant;

        // Essayer aussi d'extraire marque/modèle depuis le titre
        const titleParts = this.parseTitle(data.titre);
        data.marque = titleParts.marque;
        data.modele = titleParts.modele;

        console.log('🚗 Données extraites:', data);
        return data;
    },

    extractTitre() {
        // Sélecteurs pour le titre
        const selectors = [
            '[data-qa-id="adview_title"]',
            'h1[data-qa-id="adview_title"]',
            'h1'
        ];

        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.textContent.trim()) {
                return el.textContent.trim();
            }
        }
        return '';
    },

    extractPrix() {
        const selectors = [
            '[data-qa-id="adview_price"]',
            'span[data-qa-id="adview_price"]',
            'p[data-qa-id="adview_price"]'
        ];

        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el) {
                const text = el.textContent.trim();
                // Extraire le nombre du prix (gérer les espaces et €)
                const match = text.replace(/\s/g, '').match(/(\d+)/);
                if (match) {
                    return parseInt(match[1]);
                }
            }
        }
        return null;
    },

    /**
     * Extrait les données depuis le sous-titre de l'annonce
     * Format: "Ville · Année · Kilométrage · Carburant"
     */
    extractFromSubtitle() {
        const result = { annee: null, kilometrage: null, carburant: null };

        // Chercher le texte avec le format "1989 · 125000 km"
        const bodyText = document.body.innerText;

        // Chercher l'année (4 chiffres entre 1980 et 2030)
        const anneeMatch = bodyText.match(/\b(19[89]\d|20[0-2]\d)\b/);
        if (anneeMatch) {
            result.annee = anneeMatch[1];
        }

        // Chercher le kilométrage (nombre suivi de km)
        const kmMatch = bodyText.match(/(\d[\d\s]*)\s*km\b/i);
        if (kmMatch) {
            result.kilometrage = kmMatch[1].replace(/\s/g, '');
        }

        // Chercher le carburant
        const carburants = ['essence', 'diesel', 'électrique', 'hybride', 'gpl'];
        for (const carb of carburants) {
            if (bodyText.toLowerCase().includes(carb)) {
                result.carburant = carb.charAt(0).toUpperCase() + carb.slice(1);
                break;
            }
        }

        return result;
    },

    parseTitle(titre) {
        const result = { marque: null, modele: null };
        if (!titre) return result;

        const marques = ['nissan', 'toyota', 'honda', 'mazda', 'subaru', 'mitsubishi',
            'volkswagen', 'vw', 'audi', 'bmw', 'mercedes', 'porsche',
            'peugeot', 'renault', 'citroen', 'ford', 'opel', 'fiat',
            'seat', 'skoda', 'hyundai', 'kia', 'volvo', 'alfa romeo', 'mini'];

        const titreLower = titre.toLowerCase();
        for (const marque of marques) {
            if (titreLower.includes(marque)) {
                result.marque = marque === 'vw' ? 'Volkswagen' :
                    marque.charAt(0).toUpperCase() + marque.slice(1);
                // Le reste après la marque = modèle
                const idx = titreLower.indexOf(marque);
                const reste = titre.substring(idx + marque.length).trim();
                if (reste) {
                    result.modele = reste.split(/\s+/).slice(0, 3).join(' ');
                }
                break;
            }
        }
        return result;
    },

    extractDescription() {
        const selectors = [
            '[data-qa-id="adview_description_container"]',
            '[data-qa-id="adview_description"]',
            'div[data-qa-id="adview_description_container"] p'
        ];

        for (const sel of selectors) {
            const el = document.querySelector(sel);
            if (el && el.textContent.trim()) {
                return el.textContent.trim();
            }
        }
        return '';
    },

    extractPhotos() {
        const photos = [];

        // Méthode 1: Extraire depuis __NEXT_DATA__ (le plus fiable)
        try {
            const nextDataScript = document.getElementById('__NEXT_DATA__');
            if (nextDataScript) {
                const data = JSON.parse(nextDataScript.textContent);
                const ad = data?.props?.pageProps?.ad;

                if (ad?.images?.urls_large) {
                    console.log('📸 Photos trouvées via __NEXT_DATA__:', ad.images.urls_large.length);
                    return ad.images.urls_large;
                } else if (ad?.images?.urls) {
                    console.log('📸 Photos trouvées via __NEXT_DATA__ (urls):', ad.images.urls.length);
                    return ad.images.urls;
                }
            }
        } catch (e) {
            console.log('Erreur extraction __NEXT_DATA__:', e);
        }

        // Méthode 2: Fallback - chercher les images dans le DOM
        const seenUrls = new Set();
        document.querySelectorAll('picture img, div.slick-slide img').forEach(img => {
            let url = img.src || '';

            if (url &&
                url.includes('img.leboncoin.fr') &&
                !seenUrls.has(url)) {

                // Convertir en haute définition
                url = url.replace(/rule=ad-thumb/, 'rule=ad-large');
                seenUrls.add(url);
                photos.push(url);
            }
        });

        console.log('📸 Photos trouvées via DOM:', photos.length);
        return photos.slice(0, 10);
    },

    /**
     * Vérifie si on est sur une page d'annonce voiture
     */
    isCarAdPage() {
        const url = window.location.href;
        return url.includes('/voitures/') ||
            url.includes('/ad/vehicules/') ||
            url.includes('/vi/') ||
            (url.includes('leboncoin.fr') && document.querySelector('[data-qa-id="adview_price"]'));
    }
};

// Écouter les messages du popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractData') {
        try {
            if (!LeboncoinExtractor.isCarAdPage()) {
                sendResponse({
                    success: false,
                    error: 'Cette page ne semble pas être une annonce de voiture.'
                });
            } else {
                const data = LeboncoinExtractor.extractData();
                sendResponse({ success: true, data });
            }
        } catch (error) {
            console.error('Erreur extraction:', error);
            sendResponse({ success: false, error: error.message });
        }
    }
    return true; // Important pour réponse asynchrone
});

console.log('🚗 AutoAnalyseur content script chargé');
