/**
 * Base de données de référence pour les véhicules courants
 * Données indicatives pour aider à l'évaluation
 */

const VEHICLE_DATABASE = {
    // ═══════════════════════════════════════════════════════════════
    // MARQUES ET MODÈLES COURANTS
    // ═══════════════════════════════════════════════════════════════
    marques: {
        // Marques françaises
        renault: {
            nom: 'Renault',
            fiabiliteGenerale: 'moyenne',
            modeles: {
                clio: {
                    nom: 'Clio',
                    generations: ['Clio 4 (2012-2019)', 'Clio 5 (2019+)'],
                    pointsVigilance: ['Turbo (TCe)', 'Boîte EDC', 'Électronique'],
                    moteursFiables: ['1.5 dCi', '1.0 SCe'],
                    moteursProblematiques: ['1.2 TCe (chaîne distribution)']
                },
                megane: {
                    nom: 'Mégane',
                    generations: ['Mégane 3 (2008-2016)', 'Mégane 4 (2016+)'],
                    pointsVigilance: ['Boîte EDC', 'Électronique', 'Injecteurs diesel'],
                    moteursFiables: ['1.5 dCi', '1.6 dCi'],
                    moteursProblematiques: ['1.2 TCe', '1.3 TCe (early)']
                },
                captur: {
                    nom: 'Captur',
                    generations: ['Captur 1 (2013-2019)', 'Captur 2 (2019+)'],
                    pointsVigilance: ['Mêmes que Clio', 'Suspension'],
                    moteursFiables: ['1.5 dCi'],
                    moteursProblematiques: ['1.2 TCe']
                }
            }
        },
        peugeot: {
            nom: 'Peugeot',
            fiabiliteGenerale: 'moyenne_bonne',
            modeles: {
                '208': {
                    nom: '208',
                    generations: ['208 I (2012-2019)', '208 II (2019+)'],
                    pointsVigilance: ['Boîte EAT6/EAT8', 'Courroie de distribution'],
                    moteursFiables: ['1.2 PureTech 3 cylindres (récents)', '1.5 BlueHDi'],
                    moteursProblematiques: ['1.2 PureTech (early - courroie)']
                },
                '308': {
                    nom: '308',
                    generations: ['308 II (2013-2021)', '308 III (2021+)'],
                    pointsVigilance: ['1.2 PureTech courroie', 'Boîte EAT'],
                    moteursFiables: ['1.5 BlueHDi', '1.6 BlueHDi'],
                    moteursProblematiques: ['1.2 PureTech (distribution)']
                },
                '3008': {
                    nom: '3008',
                    generations: ['3008 II (2016+)'],
                    pointsVigilance: ['Boîte EAT8', 'Électronique'],
                    moteursFiables: ['1.5 BlueHDi', '1.6 BlueHDi'],
                    moteursProblematiques: ['1.6 THP (early)']
                }
            }
        },
        citroen: {
            nom: 'Citroën',
            fiabiliteGenerale: 'moyenne',
            modeles: {
                c3: {
                    nom: 'C3',
                    generations: ['C3 III (2016+)'],
                    pointsVigilance: ['BVA EAT6', 'Suspension'],
                    moteursFiables: ['1.5 BlueHDi'],
                    moteursProblematiques: ['1.2 PureTech (distribution)']
                }
            }
        },

        // Marques allemandes
        volkswagen: {
            nom: 'Volkswagen',
            fiabiliteGenerale: 'bonne',
            modeles: {
                golf: {
                    nom: 'Golf',
                    generations: ['Golf 7 (2012-2020)', 'Golf 8 (2020+)'],
                    pointsVigilance: ['Boîte DSG', 'Chaîne distribution (TSI)', 'Turbo'],
                    moteursFiables: ['2.0 TDI', '1.5 TSI'],
                    moteursProblematiques: ['1.4 TSI (early)', '1.2 TSI']
                },
                polo: {
                    nom: 'Polo',
                    generations: ['Polo 6 (2017+)'],
                    pointsVigilance: ['DSG', 'Coûts d\'entretien'],
                    moteursFiables: ['1.0 TSI', '1.6 TDI'],
                    moteursProblematiques: []
                },
                tiguan: {
                    nom: 'Tiguan',
                    generations: ['Tiguan II (2016+)'],
                    pointsVigilance: ['DSG', 'Consommation AdBlue'],
                    moteursFiables: ['2.0 TDI'],
                    moteursProblematiques: ['1.4 TSI (early)']
                }
            }
        },
        bmw: {
            nom: 'BMW',
            fiabiliteGenerale: 'bonne',
            modeles: {
                serie3: {
                    nom: 'Série 3',
                    generations: ['F30/F31 (2012-2019)', 'G20/G21 (2019+)'],
                    pointsVigilance: ['Chaîne distribution (N47)', 'Turbo', 'Coûts d\'entretien'],
                    moteursFiables: ['320d (B47)', '330d'],
                    moteursProblematiques: ['318d/320d N47 (chaîne)']
                },
                serie1: {
                    nom: 'Série 1',
                    generations: ['F20/F21 (2011-2019)', 'F40 (2019+)'],
                    pointsVigilance: ['Chaîne distribution', 'Coûts d\'entretien'],
                    moteursFiables: ['118d (B47)', '120d'],
                    moteursProblematiques: ['N47 diesel (chaîne)']
                }
            }
        },
        audi: {
            nom: 'Audi',
            fiabiliteGenerale: 'bonne',
            modeles: {
                a3: {
                    nom: 'A3',
                    generations: ['8V (2012-2020)', '8Y (2020+)'],
                    pointsVigilance: ['DSG', 'Chaîne distribution', 'Électronique'],
                    moteursFiables: ['2.0 TDI', '1.5 TFSI'],
                    moteursProblematiques: ['1.4 TFSI (early)', '1.8 TFSI']
                },
                a4: {
                    nom: 'A4',
                    generations: ['B8 (2007-2015)', 'B9 (2015+)'],
                    pointsVigilance: ['Consommation huile (TFSI)', 'Mechatronique DSG'],
                    moteursFiables: ['2.0 TDI'],
                    moteursProblematiques: ['2.0 TFSI (consommation huile)']
                }
            }
        },
        mercedes: {
            nom: 'Mercedes-Benz',
            fiabiliteGenerale: 'bonne',
            modeles: {
                classeA: {
                    nom: 'Classe A',
                    generations: ['W176 (2012-2018)', 'W177 (2018+)'],
                    pointsVigilance: ['Boîte DCT', 'Électronique complexe'],
                    moteursFiables: ['A180d', 'A200d'],
                    moteursProblematiques: []
                },
                classeC: {
                    nom: 'Classe C',
                    generations: ['W205 (2014-2021)', 'W206 (2021+)'],
                    pointsVigilance: ['Coûts d\'entretien', 'Électronique'],
                    moteursFiables: ['C220d', 'C300d'],
                    moteursProblematiques: []
                }
            }
        },

        // Marques asiatiques
        toyota: {
            nom: 'Toyota',
            fiabiliteGenerale: 'excellente',
            modeles: {
                yaris: {
                    nom: 'Yaris',
                    generations: ['Yaris 3 (2011-2020)', 'Yaris 4 (2020+)'],
                    pointsVigilance: ['Peu de points faibles'],
                    moteursFiables: ['1.5 Hybrid', '1.0 VVT-i', '1.5 VVT-i'],
                    moteursProblematiques: []
                },
                corolla: {
                    nom: 'Corolla',
                    generations: ['E210 (2019+)'],
                    pointsVigilance: ['Très peu'],
                    moteursFiables: ['1.8 Hybrid', '2.0 Hybrid'],
                    moteursProblematiques: []
                },
                chr: {
                    nom: 'C-HR',
                    generations: ['AX10 (2016+)'],
                    pointsVigilance: ['Visibilité arrière'],
                    moteursFiables: ['1.8 Hybrid', '2.0 Hybrid'],
                    moteursProblematiques: []
                }
            }
        },
        honda: {
            nom: 'Honda',
            fiabiliteGenerale: 'excellente',
            modeles: {
                civic: {
                    nom: 'Civic',
                    generations: ['10e gen (2017-2022)', '11e gen (2022+)'],
                    pointsVigilance: ['Moteur 1.5 VTEC Turbo (dilution huile - corrigé)'],
                    moteursFiables: ['1.0 VTEC Turbo', '2.0 i-VTEC'],
                    moteursProblematiques: []
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // PRIX DE RÉFÉRENCE INDICATIFS
    // Note: Ces valeurs sont des estimations grossières et doivent être
    // prises comme des ordres de grandeur uniquement
    // ═══════════════════════════════════════════════════════════════

    /**
     * Estime un prix de référence basique basé sur l'âge et le kilométrage
     * ATTENTION: Estimation très approximative - pour indication uniquement
     * @param {number} prixNeuf - Prix du neuf approximatif
     * @param {number} age - Âge du véhicule en années
     * @param {number} km - Kilométrage
     * @returns {Object} Estimation avec fourchette
     */
    estimerPrix: function (prixNeuf, age, km) {
        // Décote basique (approximative)
        let decote = 1;

        // Première année : -20%
        if (age >= 1) decote *= 0.80;
        // Années 2-5 : -10% par an
        if (age >= 2) decote *= Math.pow(0.90, Math.min(age - 1, 4));
        // Années 6+ : -7% par an
        if (age > 5) decote *= Math.pow(0.93, age - 5);

        // Ajustement kilométrique
        const kmAttendu = age * 15000;
        const ecartKm = km - kmAttendu;
        const ajustementKm = 1 - (ecartKm * 0.00001); // -1% par 10000km d'écart

        const prixEstime = prixNeuf * decote * Math.max(0.3, Math.min(1.2, ajustementKm));

        return {
            estimation: Math.round(prixEstime / 100) * 100,
            fourchetteBasse: Math.round(prixEstime * 0.85 / 100) * 100,
            fourchetteHaute: Math.round(prixEstime * 1.15 / 100) * 100,
            avertissement: 'Estimation indicative uniquement. Consultez les annonces similaires pour une meilleure évaluation.'
        };
    },

    /**
     * Retourne les informations de vigilance pour un modèle donné
     * @param {string} marque - Nom de la marque
     * @param {string} modele - Nom du modèle
     * @returns {Object|null} Informations du modèle ou null
     */
    getInfosModele: function (marque, modele) {
        const marqueNormalisee = marque.toLowerCase().replace(/[^a-z]/g, '');
        const modeleNormalise = modele.toLowerCase().replace(/[^a-z0-9]/g, '');

        if (this.marques[marqueNormalisee]) {
            const marqueData = this.marques[marqueNormalisee];

            // Chercher le modèle exact ou partiel
            for (const [key, data] of Object.entries(marqueData.modeles || {})) {
                if (modeleNormalise.includes(key) || key.includes(modeleNormalise)) {
                    return {
                        marque: marqueData.nom,
                        fiabiliteMarque: marqueData.fiabiliteGenerale,
                        modele: data.nom,
                        pointsVigilance: data.pointsVigilance,
                        moteursFiables: data.moteursFiables,
                        moteursProblematiques: data.moteursProblematiques
                    };
                }
            }
        }

        return null;
    }
};

// Export pour utilisation dans les autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VEHICLE_DATABASE };
}
