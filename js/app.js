/**
 * Application principale - Analyseur d'annonces automobiles
 * Avec extraction automatique et analyse budget
 */

const App = {
    photos: [],

    init: function () {
        this.bindEvents();
        this.initPhotoUpload();
        this.loadFromExtension(); // Charger les données depuis l'extension Chrome
        console.log('AutoAnalyseur initialisé');
    },

    /**
     * Charge les données envoyées par l'extension Chrome via query params
     */
    loadFromExtension: function () {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');

        if (!encodedData) return;

        try {
            // Décoder les données base64
            const jsonData = decodeURIComponent(escape(atob(encodedData)));
            const data = JSON.parse(jsonData);

            console.log('📦 Données reçues de l\'extension:', data);

            // Remplir les champs
            if (data.prix) document.getElementById('prix').value = data.prix;
            if (data.kilometrage) {
                // Nettoyer le kilométrage (enlever "km" et espaces)
                const km = String(data.kilometrage).replace(/[^\d]/g, '');
                document.getElementById('kilometrage').value = km;
            }
            if (data.annee) {
                const annee = String(data.annee).match(/\d{4}/)?.[0];
                if (annee) document.getElementById('annee').value = annee;
            }
            if (data.marque) document.getElementById('marque').value = data.marque;
            if (data.modele) document.getElementById('modele').value = data.modele;
            if (data.description) document.getElementById('description').value = data.description;

            // Stocker l'URL source pour affichage
            this.sourceUrl = data.sourceUrl;
            this.sourcePhotosCount = data.photos?.length || 0;

            // Afficher un message de succès avec lien vers l'annonce
            const hint = document.getElementById('extractHint');
            if (hint) {
                hint.style.display = 'block';
                if (this.sourceUrl) {
                    hint.innerHTML = `✅ Données importées ! <a href="${this.sourceUrl}" target="_blank" style="color: #818cf8;">Voir l'annonce (${this.sourcePhotosCount} photos)</a>`;
                } else {
                    hint.textContent = `✅ Données importées depuis Leboncoin`;
                }
                hint.style.color = '#22c55e';
            }

            // Nettoyer l'URL
            window.history.replaceState({}, document.title, window.location.pathname);

        } catch (error) {
            console.error('Erreur de chargement des données extension:', error);
        }
    },

    /**
     * Charge les photos depuis leurs URLs (depuis l'extension)
     */
    loadPhotosFromUrls: function (urls) {
        urls.forEach((url, index) => {
            // Créer une entrée photo avec l'URL directe
            this.photos.push({
                id: Date.now() + index,
                src: url,
                name: `Photo ${index + 1} (Leboncoin)`,
                isExternal: true
            });
        });
        this.renderPhotos();
    },


    bindEvents: function () {
        document.getElementById('btnAnalyser')?.addEventListener('click', () => this.lancerAnalyse());
        document.getElementById('btnExemple')?.addEventListener('click', () => this.chargerExemple());
        // Le bouton auto-remplir force la mise à jour des champs
        document.getElementById('btnAutoFill')?.addEventListener('click', () => this.autoRemplir(true));

        // Auto-remplir silencieux quand on quitte le champ description (ne remplace pas les champs existants)
        document.getElementById('description')?.addEventListener('blur', () => {
            const desc = document.getElementById('description')?.value || '';
            if (desc.length > 50) {
                this.autoRemplir(false);
            }
        });
    },

    /**
     * Extraction automatique des données depuis le texte de l'annonce
     * @param {boolean} forceUpdate - Si true, remplace même les champs remplis
     */
    autoRemplir: function (forceUpdate = false) {
        const description = document.getElementById('description')?.value || '';
        if (!description) {
            alert('Collez d\'abord une annonce dans le champ texte !');
            return;
        }

        const extracted = TextExtractor.extraire(description);
        let filled = 0;

        // Remplir les champs (si forceUpdate=true, on écrase les valeurs existantes)
        if (extracted.prix && (forceUpdate || !document.getElementById('prix')?.value)) {
            document.getElementById('prix').value = extracted.prix;
            filled++;
        }
        if (extracted.kilometrage && (forceUpdate || !document.getElementById('kilometrage')?.value)) {
            document.getElementById('kilometrage').value = extracted.kilometrage;
            filled++;
        }
        if (extracted.annee && (forceUpdate || !document.getElementById('annee')?.value)) {
            document.getElementById('annee').value = extracted.annee;
            filled++;
        }
        if (extracted.marque && (forceUpdate || !document.getElementById('marque')?.value)) {
            document.getElementById('marque').value = extracted.marque;
            filled++;
        }
        if (extracted.modele && (forceUpdate || !document.getElementById('modele')?.value)) {
            document.getElementById('modele').value = extracted.modele;
            filled++;
        }

        // Afficher le hint
        const hint = document.getElementById('extractHint');
        if (hint) {
            if (filled > 0) {
                hint.style.display = 'block';
                hint.textContent = `✅ ${filled} champ(s) rempli(s) automatiquement`;
                hint.style.color = '#22c55e';
            } else {
                hint.style.display = 'block';
                hint.textContent = '⚠️ Aucune donnée trouvée. Vérifiez le texte de l\'annonce.';
                hint.style.color = '#f59e0b';
            }
            setTimeout(() => { hint.style.display = 'none'; }, 4000);
        }

        console.log('Extraction:', extracted, '| Remplis:', filled);
    },

    initPhotoUpload: function () {
        const uploadArea = document.getElementById('photoUploadArea');
        const photoInput = document.getElementById('photoInput');

        if (!uploadArea || !photoInput) return;

        ['dragenter', 'dragover'].forEach(event => {
            uploadArea.addEventListener(event, (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(event => {
            uploadArea.addEventListener(event, (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
            });
        });

        uploadArea.addEventListener('drop', (e) => {
            this.handleFiles(e.dataTransfer.files);
        });

        photoInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    },

    handleFiles: function (files) {
        for (const file of files) {
            if (!file.type.startsWith('image/')) continue;

            const reader = new FileReader();
            reader.onload = (e) => {
                this.photos.push({
                    id: Date.now() + Math.random(),
                    src: e.target.result,
                    name: file.name
                });
                this.renderPhotos();
            };
            reader.readAsDataURL(file);
        }
    },

    renderPhotos: function () {
        const grid = document.getElementById('photoGrid');
        const prompt = document.getElementById('uploadPrompt');

        if (!grid) return;

        prompt.style.display = this.photos.length > 0 ? 'none' : 'block';

        grid.innerHTML = this.photos.map(photo => `
            <div class="photo-thumb" data-id="${photo.id}">
                <img src="${photo.src}" alt="${photo.name}">
                <button class="remove-btn" onclick="App.removePhoto(${photo.id})">×</button>
            </div>
        `).join('');
    },

    removePhoto: function (id) {
        this.photos = this.photos.filter(p => p.id !== id);
        this.renderPhotos();
    },

    chargerExemple: function () {
        document.getElementById('description').value = `Volkswagen Golf 7 GTD 2017
184ch DSG - 95 000 km
Prix: 16 500€

Golf 7 GTD DSG 184ch - Préparation Stage 1
Reprogrammation stage 1 (220ch environ)
Ligne Milltek catback homologuée
Admission BMC
Suspension KW V2 réglable
Jantes BBS 19 pouces
Entretien suivi hors réseau VW depuis la reprog.
Embrayage changé à 80000km suite à patinage.
CT OK. Vente car changement de situation.`;

        // Déclencher l'auto-remplissage
        setTimeout(() => this.autoRemplir(), 100);
    },

    lancerAnalyse: function () {
        // Auto-remplir d'abord si pas fait
        this.autoRemplir();

        const annonce = {
            marque: document.getElementById('marque')?.value?.trim() || '',
            modele: document.getElementById('modele')?.value?.trim() || '',
            annee: parseInt(document.getElementById('annee')?.value) || 0,
            kilometrage: parseInt(document.getElementById('kilometrage')?.value) || 0,
            prix: parseInt(document.getElementById('prix')?.value) || 0,
            description: document.getElementById('description')?.value?.trim() || ''
        };

        const budget = {
            mensuel: parseInt(document.getElementById('budgetMensuel')?.value) || 0,
            total: parseInt(document.getElementById('budgetTotal')?.value) || 0,
            dureeCredit: parseInt(document.getElementById('dureCredit')?.value) || 48
        };

        if (!annonce.description) {
            alert('Veuillez coller une description d\'annonce.');
            return;
        }

        this.afficherLoader(true);

        setTimeout(() => {
            try {
                const resultats = this.analyser(annonce, budget);
                this.afficherResultats(resultats);
            } catch (error) {
                console.error('Erreur:', error);
                document.getElementById('resultats').innerHTML =
                    `<div class="erreur"><h3>❌ Erreur</h3><p>${error.message}</p></div>`;
            } finally {
                this.afficherLoader(false);
            }
        }, 400);
    },

    analyser: function (annonce, budget) {
        const analyseGenerale = GeneralAnalysis.analyser(annonce);
        const analyseModifications = ModificationAnalysis.analyser(annonce.description);
        const scores = ScoringEngine.calculerScoreFinal(analyseGenerale, analyseModifications);
        const checklistPhotos = PhotoAnalysis.genererChecklist({
            modifications: analyseModifications.modifications
        });

        // Prédiction de revente
        let predictionRevente = null;
        if (typeof MarketPriceDatabase !== 'undefined' && annonce.marque && annonce.modele) {
            predictionRevente = MarketPriceDatabase.predireRevente(annonce, 3);
        }

        // Analyse budget
        let analyseBudget = null;
        if (budget.mensuel > 0 || budget.total > 0) {
            analyseBudget = BudgetAnalyzer.analyser(annonce, budget, predictionRevente);
        }

        // Sauvegarde automatique
        if (typeof UserAdsDatabase !== 'undefined' && annonce.prix) {
            UserAdsDatabase.save(annonce);
        }

        return {
            annonce,
            analyseGenerale,
            analyseModifications,
            scores,
            checklistPhotos,
            predictionRevente,
            analyseBudget,
            photos: this.photos,
            dateAnalyse: new Date().toLocaleString('fr-FR')
        };
    },

    afficherResultats: function (resultats) {
        const container = document.getElementById('resultats');
        if (!container) return;

        const rapportHTML = ReportGenerator.genererRapport(resultats);
        const budgetHTML = this.genererRapportBudget(resultats.analyseBudget);
        const photosHTML = this.genererAnalysePhotos(resultats.photos, resultats.checklistPhotos);

        container.innerHTML = `
            <div class="resultats-container">
                <div class="rapport-header">
                    <h2>📊 Rapport d'analyse</h2>
                    <p class="date-analyse">${resultats.dateAnalyse}</p>
                </div>
                ${rapportHTML}
                ${budgetHTML}
                ${photosHTML}
                <div class="disclaimer">
                    <h4>⚠️ Avertissement</h4>
                    <p>Analyse indicative. Ne remplace pas une inspection physique par un professionnel.</p>
                </div>
            </div>
        `;

        container.scrollIntoView({ behavior: 'smooth' });
    },

    genererRapportBudget: function (analyseBudget) {
        if (!analyseBudget) return '';

        const verdictIcons = {
            'parfait': '✅',
            'ok': '👍',
            'limite': '⚠️',
            'depasse': '❌'
        };

        const verdictColors = {
            'parfait': '#22c55e',
            'ok': '#84cc16',
            'limite': '#f59e0b',
            'depasse': '#ef4444'
        };

        const icon = verdictIcons[analyseBudget.verdict] || '💰';
        const color = verdictColors[analyseBudget.verdict] || '#6366f1';

        return `
            <section class="budget-analysis">
                <h3>💰 Analyse Budget</h3>
                <div class="budget-verdict" style="border-color: ${color}">
                    <span class="budget-icon">${icon}</span>
                    <div class="budget-verdict-text">
                        <strong style="color: ${color}">${analyseBudget.verdictTexte}</strong>
                        <p>${analyseBudget.conseil}</p>
                    </div>
                </div>
                <div class="budget-details">
                    <div class="budget-row">
                        <span>Prix du véhicule</span>
                        <strong>${analyseBudget.prixVehicule?.toLocaleString() || '?'}€</strong>
                    </div>
                    <div class="budget-row">
                        <span>Mensualité crédit (${analyseBudget.dureeCredit} mois)</span>
                        <strong>${analyseBudget.mensualiteCredit?.toLocaleString() || '?'}€/mois</strong>
                    </div>
                    <div class="budget-row">
                        <span>+ Carburant estimé</span>
                        <strong>~${analyseBudget.coutCarburant || '?'}€/mois</strong>
                    </div>
                    <div class="budget-row">
                        <span>+ Assurance estimée</span>
                        <strong>~${analyseBudget.coutAssurance || '?'}€/mois</strong>
                    </div>
                    <div class="budget-row">
                        <span>+ Entretien estimé</span>
                        <strong>~${analyseBudget.coutEntretien || '?'}€/mois</strong>
                    </div>
                    <div class="budget-row total">
                        <span>TOTAL MENSUEL</span>
                        <strong style="color: ${color}">${analyseBudget.coutMensuelTotal?.toLocaleString() || '?'}€/mois</strong>
                    </div>
                    <div class="budget-row">
                        <span>Votre budget mensuel</span>
                        <strong>${analyseBudget.budgetMensuel?.toLocaleString() || '?'}€/mois</strong>
                    </div>
                    ${analyseBudget.difference ? `
                    <div class="budget-row difference" style="color: ${color}">
                        <span>${analyseBudget.difference > 0 ? 'Marge restante' : 'Dépassement'}</span>
                        <strong>${analyseBudget.difference > 0 ? '+' : ''}${analyseBudget.difference?.toLocaleString() || '?'}€/mois</strong>
                    </div>
                    ` : ''}
                </div>
                ${analyseBudget.alternatives ? `
                <div class="budget-alternatives">
                    <p><strong>💡 Alternatives :</strong> ${analyseBudget.alternatives}</p>
                </div>
                ` : ''}
            </section>
        `;
    },

    genererAnalysePhotos: function (photos, checklist) {
        if (photos && photos.length > 0) {
            return `
                <section class="photo-analysis-section">
                    <h3>📸 Analyse des photos (${photos.length})</h3>
                    <p style="color: var(--color-text-muted); margin-bottom: 1rem; font-size: 0.85rem;">
                        Cochez les éléments que vous avez vérifiés sur chaque photo :
                    </p>
                    <div class="photo-analysis-grid">
                        ${photos.map((photo, i) => `
                            <div class="photo-analysis-card">
                                <img src="${photo.src}" alt="Photo ${i + 1}">
                                <div class="checklist">
                                    <div class="check-item">
                                        <input type="checkbox" id="check_${i}_1">
                                        <label for="check_${i}_1">État carrosserie OK</label>
                                    </div>
                                    <div class="check-item">
                                        <input type="checkbox" id="check_${i}_2">
                                        <label for="check_${i}_2">Pas de modification visible</label>
                                    </div>
                                    <div class="check-item">
                                        <input type="checkbox" id="check_${i}_3">
                                        <label for="check_${i}_3">Cohérent avec annonce</label>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
            `;
        } else {
            return `
                <section class="checklist-photos">
                    <h3>📸 Checklist photos</h3>
                    <p style="color: var(--color-text-muted); margin-bottom: 1rem; font-size: 0.85rem;">
                        Aucune photo ajoutée. Utilisez cette checklist pour analyser les photos de l'annonce :
                    </p>
                    ${checklist.sections.slice(0, 3).map(section => `
                        <div class="checklist-section">
                            <h4>${section.icone} ${section.titre}</h4>
                            <ul class="checklist-items">
                                ${section.items.slice(0, 4).map(item => `
                                    <li class="checklist-item importance-${item.importance}">
                                        <label>
                                            <input type="checkbox" class="checklist-checkbox">
                                            <span class="question">${item.question}</span>
                                        </label>
                                        <span class="indice">${item.indice}</span>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </section>
            `;
        }
    },

    afficherLoader: function (show) {
        const loader = document.getElementById('loader');
        const btn = document.getElementById('btnAnalyser');
        if (loader) loader.style.display = show ? 'flex' : 'none';
        if (btn) btn.disabled = show;
    }
};

/**
 * Extracteur de données depuis le texte d'annonce
 */
const TextExtractor = {
    marques: ['volkswagen', 'vw', 'audi', 'bmw', 'mercedes', 'peugeot', 'renault', 'citroen', 'citroën',
        'toyota', 'honda', 'nissan', 'mazda', 'subaru', 'mitsubishi', 'ford', 'opel', 'fiat',
        'seat', 'skoda', 'hyundai', 'kia', 'volvo', 'porsche', 'alfa romeo', 'mini', 'suzuki',
        'dacia', 'jaguar', 'land rover', 'lexus', 'infiniti', 'tesla', 'chevrolet', 'jeep', 'dodge'],

    modeles: {
        'volkswagen': ['golf', 'polo', 'passat', 'tiguan', 'touran', 'scirocco', 'arteon', 't-roc', 't-cross', 'touareg', 'sharan', 'up', 'eos', 'jetta', 'beetle', 'cc', 'phaeton', 'corrado'],
        'vw': ['golf', 'polo', 'passat', 'tiguan', 'touran', 'scirocco', 'arteon', 't-roc', 'gti', 'gtd', 'r'],
        'bmw': ['serie 1', 'serie 2', 'serie 3', 'serie 4', 'serie 5', 'serie 6', 'serie 7', 'serie 8', 'm2', 'm3', 'm4', 'm5', 'm6', 'm8', 'x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'z3', 'z4', 'i3', 'i4', 'i8', 'ix'],
        'audi': ['a1', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 's1', 's3', 's4', 's5', 's6', 's7', 's8', 'rs3', 'rs4', 'rs5', 'rs6', 'rs7', 'tt', 'tts', 'ttrs', 'r8', 'q2', 'q3', 'q5', 'q7', 'q8', 'e-tron', 'sq5', 'sq7', 'sq8', 'rsq8'],
        'mercedes': ['classe a', 'classe b', 'classe c', 'classe e', 'classe s', 'classe g', 'cla', 'clk', 'cls', 'glc', 'gle', 'gls', 'gla', 'glb', 'amg gt', 'sl', 'slc', 'slk', 'ml', 'eqc', 'eqs', 'eqe', 'a35', 'a45', 'c43', 'c63', 'e53', 'e63'],
        'peugeot': ['106', '107', '108', '205', '206', '207', '208', '306', '307', '308', '309', '405', '406', '407', '508', '605', '607', '806', '807', '1007', '2008', '3008', '4008', '5008', 'rcz', 'partner', 'expert', 'traveller', 'rifter'],
        'renault': ['clio', 'megane', 'scenic', 'twingo', 'captur', 'kadjar', 'koleos', 'talisman', 'laguna', 'espace', 'zoe', 'arkana', 'austral', 'kangoo', 'trafic', 'master', 'r5', 'r19', 'r21', 'safrane', 'vel satis', 'wind', 'fluence', 'latitude'],
        'citroen': ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c8', 'ds3', 'ds4', 'ds5', 'ds7', 'c3 aircross', 'c4 cactus', 'c5 aircross', 'berlingo', 'xsara', 'saxo', 'ax', 'bx', 'cx', 'xm', 'zx', 'picasso', 'spacetourer'],
        'toyota': ['yaris', 'corolla', 'auris', 'avensis', 'camry', 'prius', 'chr', 'c-hr', 'rav4', 'land cruiser', 'hilux', 'supra', 'gt86', 'gr86', 'gr yaris', 'celica', 'mr2', 'mr-2', 'aygo', 'verso', 'proace'],
        'honda': ['civic', 'accord', 'jazz', 'fit', 'cr-v', 'hr-v', 'type r', 'type-r', 's2000', 'nsx', 'integra', 'prelude', 'crx', 'cr-x', 'legend', 'insight', 'e', 'city'],
        'nissan': ['micra', 'note', 'juke', 'qashqai', 'x-trail', 'navara', 'pathfinder', 'murano', 'leaf', '370z', '350z', '300zx', 'gtr', 'gt-r', 'skyline', 'silvia', '200sx', '180sx', 'primera', 'almera', 'pulsar'],
        'mazda': ['mazda2', 'mazda3', 'mazda6', 'cx-3', 'cx-30', 'cx-5', 'cx-60', 'mx5', 'mx-5', 'miata', 'rx7', 'rx-7', 'rx8', 'rx-8', '323', '626', 'xedos', 'bt-50'],
        'subaru': ['impreza', 'wrx', 'sti', 'brz', 'forester', 'outback', 'legacy', 'levorg', 'xv', 'crosstrek', 'tribeca', 'svx', 'justy'],
        'mitsubishi': ['lancer', 'evo', 'evolution', 'outlander', 'asx', 'eclipse', 'eclipse cross', 'pajero', 'l200', '3000gt', 'gto', 'colt', 'galant', 'space star', 'carisma'],
        'ford': ['fiesta', 'focus', 'mondeo', 'mustang', 'kuga', 'puma', 'ecosport', 'edge', 'explorer', 'ranger', 'transit', 'galaxy', 's-max', 'c-max', 'ka', 'escort', 'sierra', 'capri', 'gt', 'bronco'],
        'opel': ['corsa', 'astra', 'insignia', 'mokka', 'crossland', 'grandland', 'zafira', 'meriva', 'adam', 'karl', 'combo', 'vivaro', 'movano', 'vectra', 'omega', 'calibra', 'tigra', 'speedster', 'gt'],
        'fiat': ['500', 'panda', 'punto', 'tipo', '500x', '500l', 'bravo', 'stilo', 'grande punto', 'doblo', 'ducato', 'freemont', 'multipla', 'barchetta', 'coupe', 'seicento', 'uno', 'croma'],
        'seat': ['leon', 'ibiza', 'ateca', 'arona', 'tarraco', 'alhambra', 'altea', 'toledo', 'exeo', 'mii', 'cupra'],
        'skoda': ['fabia', 'octavia', 'superb', 'kodiaq', 'karoq', 'kamiq', 'scala', 'rapid', 'yeti', 'roomster', 'citigo', 'enyaq'],
        'hyundai': ['i10', 'i20', 'i30', 'i40', 'tucson', 'kona', 'santa fe', 'nexo', 'ioniq', 'veloster', 'genesis', 'coupe', 'n'],
        'kia': ['picanto', 'rio', 'ceed', 'proceed', 'sportage', 'sorento', 'stinger', 'niro', 'soul', 'ev6', 'stonic', 'xceed', 'optima', 'carnival', 'telluride'],
        'volvo': ['v40', 'v60', 'v90', 's40', 's60', 's90', 'xc40', 'xc60', 'xc90', 'c30', 'c70', '850', '940', 'polestar'],
        'porsche': ['911', 'carrera', 'turbo', 'gt3', 'gt2', 'cayman', 'boxster', 'cayenne', 'macan', 'panamera', 'taycan', '718', '944', '928', '968', '356'],
        'alfa romeo': ['giulia', 'stelvio', 'giulietta', 'mito', '159', '156', '147', '166', 'brera', 'spider', 'gtv', '4c', 'tonale', 'quadrifoglio'],
        'mini': ['cooper', 'one', 'clubman', 'countryman', 'paceman', 'cabrio', 'jcw', 'john cooper works', 's'],
        'dacia': ['sandero', 'duster', 'logan', 'spring', 'jogger', 'lodgy', 'dokker'],
        'tesla': ['model 3', 'model s', 'model x', 'model y', 'roadster', 'cybertruck'],
        'lexus': ['is', 'es', 'gs', 'ls', 'ct', 'rc', 'lc', 'ux', 'nx', 'rx', 'gx', 'lx', 'lfa'],
        'jaguar': ['xe', 'xf', 'xj', 'f-type', 'f-pace', 'e-pace', 'i-pace', 'x-type', 's-type'],
        'land rover': ['defender', 'discovery', 'range rover', 'evoque', 'velar', 'sport', 'freelander'],
        'jeep': ['wrangler', 'cherokee', 'grand cherokee', 'renegade', 'compass', 'gladiator']
    },

    extraire: function (texte) {
        const result = { prix: null, kilometrage: null, annee: null, marque: null, modele: null };
        const texteLower = texte.toLowerCase();

        // Prix
        const prixMatch = texte.match(/(\d{1,3}[\s.,]?\d{3})\s*€/) || texte.match(/prix\s*:?\s*(\d{1,3}[\s.,]?\d{3})/i);
        if (prixMatch) result.prix = parseInt(prixMatch[1].replace(/[\s.,]/g, ''));

        // Kilométrage
        const kmMatch = texte.match(/(\d{1,3}[\s.]?\d{3})\s*km/i) || texte.match(/(\d{2,3})\s*000\s*km/i);
        if (kmMatch) {
            let km = kmMatch[1].replace(/[\s.]/g, '');
            if (km.length <= 3) km += '000';
            result.kilometrage = parseInt(km);
        }

        // Année
        const anneeMatch = texte.match(/\b(20[0-2][0-9])\b/) || texte.match(/\b(19[89][0-9])\b/);
        if (anneeMatch) {
            const year = parseInt(anneeMatch[1]);
            if (year >= 1990 && year <= 2025) result.annee = year;
        }

        // Marque et modèle
        for (const marque of this.marques) {
            if (texteLower.includes(marque)) {
                result.marque = marque === 'vw' ? 'Volkswagen' : marque.charAt(0).toUpperCase() + marque.slice(1);
                const modeles = this.modeles[marque.toLowerCase()] || [];
                for (const modele of modeles) {
                    if (texteLower.includes(modele.toLowerCase())) {
                        result.modele = modele.toUpperCase();
                        break;
                    }
                }
                break;
            }
        }

        // Variantes sportives
        const variants = ['gti', 'gtd', 'rs', 'type r', 'sti', 'wrx', 'amg', 'n', 'm sport', 's line', 'fr', 'vrs'];
        for (const v of variants) {
            if (texteLower.includes(v) && result.modele && !result.modele.toLowerCase().includes(v)) {
                result.modele += ' ' + v.toUpperCase();
                break;
            }
        }

        return result;
    }
};

/**
 * Analyseur de budget
 */
const BudgetAnalyzer = {
    analyser: function (annonce, budget, predictionRevente) {
        const prix = annonce.prix || 0;
        const budgetMensuel = budget.mensuel || 0;
        const budgetTotal = budget.total || 0;
        const dureeCredit = budget.dureeCredit || 48;

        // Si budget total fourni, calculer mensuel équivalent
        const budgetMensuelEffectif = budgetMensuel > 0 ? budgetMensuel :
            budgetTotal > 0 ? Math.round(budgetTotal / dureeCredit) + 200 : 0;

        if (budgetMensuelEffectif === 0) return null;

        // Calculer les coûts
        const tauxInteret = 0.05; // 5% approximatif
        const mensualiteCredit = Math.round(prix * (1 + tauxInteret * (dureeCredit / 12)) / dureeCredit);

        // Estimations mensuelles
        const coutCarburant = this.estimerCarburant(annonce);
        const coutAssurance = this.estimerAssurance(annonce);
        const coutEntretien = this.estimerEntretien(annonce);

        const coutMensuelTotal = mensualiteCredit + coutCarburant + coutAssurance + coutEntretien;
        const difference = budgetMensuelEffectif - coutMensuelTotal;

        // Verdict
        let verdict, verdictTexte, conseil, alternatives;
        const ratio = coutMensuelTotal / budgetMensuelEffectif;

        if (ratio <= 0.7) {
            verdict = 'parfait';
            verdictTexte = 'Parfait pour votre budget !';
            conseil = 'Cette voiture rentre largement dans votre budget. Vous aurez une marge confortable.';
        } else if (ratio <= 0.9) {
            verdict = 'ok';
            verdictTexte = 'Ça rentre dans le budget';
            conseil = 'Cette voiture est accessible avec votre budget, mais sans beaucoup de marge.';
        } else if (ratio <= 1.1) {
            verdict = 'limite';
            verdictTexte = 'Budget limite';
            conseil = 'Attention, le coût total est proche ou légèrement au-dessus de votre budget.';
            alternatives = 'Cherchez un modèle moins puissant ou plus ancien pour réduire l\'assurance.';
        } else {
            verdict = 'depasse';
            verdictTexte = 'Dépasse votre budget';
            conseil = 'Cette voiture est au-dessus de vos moyens. Risque financier.';
            const budgetVoitureMax = Math.round((budgetMensuelEffectif - 200) * dureeCredit * 0.85);
            alternatives = `Cherchez autour de ${budgetVoitureMax.toLocaleString()}€ maximum.`;
        }

        return {
            prixVehicule: prix,
            budgetMensuel: budgetMensuelEffectif,
            dureeCredit,
            mensualiteCredit,
            coutCarburant,
            coutAssurance,
            coutEntretien,
            coutMensuelTotal,
            difference,
            verdict,
            verdictTexte,
            conseil,
            alternatives
        };
    },

    estimerCarburant: function (annonce) {
        // Estimation basique : ~100€/mois en moyenne
        const description = (annonce.description || '').toLowerCase();
        if (description.includes('diesel') || description.includes('tdi') || description.includes('hdi') || description.includes('bluehdi')) {
            return 80; // Diesel moins cher
        } else if (description.includes('hybride') || description.includes('hybrid')) {
            return 50;
        } else if (description.includes('electrique') || description.includes('électrique') || description.includes('ev')) {
            return 30;
        } else if (description.includes('gti') || description.includes('rs') || description.includes('amg') || description.includes('type r')) {
            return 150; // Sportive = plus de conso
        }
        return 100;
    },

    estimerAssurance: function (annonce) {
        // Estimation basique selon puissance/type
        const description = (annonce.description || '').toLowerCase();
        if (description.includes('gti') || description.includes('rs') || description.includes('amg') ||
            description.includes('type r') || description.includes('sti') || description.includes('turbo')) {
            return 120; // Sportive = plus cher
        } else if (annonce.annee && annonce.annee < 2010) {
            return 50; // Vieille voiture = moins cher
        } else if (description.includes('diesel')) {
            return 70;
        }
        return 80;
    },

    estimerEntretien: function (annonce) {
        const description = (annonce.description || '').toLowerCase();
        const marque = (annonce.marque || '').toLowerCase();

        // Marques premium = entretien plus cher
        if (['bmw', 'audi', 'mercedes', 'porsche'].some(m => marque.includes(m))) {
            return 100;
        } else if (description.includes('turbo') || description.includes('gti') || description.includes('rs')) {
            return 80;
        } else if (['toyota', 'honda', 'mazda'].some(m => marque.includes(m))) {
            return 40; // Japonaises fiables
        }
        return 60;
    }
};

// Init
document.addEventListener('DOMContentLoaded', () => App.init());
