/**
 * Règles expertes pour l'analyse des annonces automobiles
 * Système de pondération et de détection des signaux d'alerte
 */

const EXPERT_RULES = {
    // ═══════════════════════════════════════════════════════════════
    // RÈGLES DE COHÉRENCE KILOMÉTRIQUE
    // ═══════════════════════════════════════════════════════════════
    kilometrage: {
        // Kilométrage moyen annuel attendu par type d'usage
        moyenneAnnuelle: {
            min: 8000,      // Usage très léger (ville uniquement)
            normal: 15000,  // Usage mixte standard
            max: 30000      // Usage professionnel/autoroute
        },

        /**
         * Vérifie la cohérence kilométrique
         * @param {number} km - Kilométrage affiché
         * @param {number} annee - Année du véhicule
         * @param {number} anneeActuelle - Année actuelle
         * @returns {Object} Résultat de l'analyse
         */
        analyser: function (km, annee, anneeActuelle = new Date().getFullYear()) {
            const age = anneeActuelle - annee;
            if (age <= 0) {
                return {
                    coherent: true,
                    niveau: 'normal',
                    message: 'Véhicule neuf ou récent',
                    score: 0
                };
            }

            const kmParAn = km / age;

            if (kmParAn < 3000) {
                return {
                    coherent: false,
                    niveau: 'suspect_bas',
                    message: `Kilométrage anormalement bas (${Math.round(kmParAn)} km/an). Risque de compteur trafiqué.`,
                    hypothese: 'Le kilométrage pourrait avoir été manipulé. Demander historique d\'entretien et factures.',
                    score: -20
                };
            } else if (kmParAn < this.moyenneAnnuelle.min) {
                return {
                    coherent: true,
                    niveau: 'bas',
                    message: `Kilométrage faible (${Math.round(kmParAn)} km/an). Usage urbain probable.`,
                    hypothese: 'Usage ville uniquement, attention aux embrayages et FAP sur diesel.',
                    score: -5
                };
            } else if (kmParAn <= this.moyenneAnnuelle.max) {
                return {
                    coherent: true,
                    niveau: 'normal',
                    message: `Kilométrage cohérent (${Math.round(kmParAn)} km/an).`,
                    score: 0
                };
            } else if (kmParAn <= 50000) {
                return {
                    coherent: true,
                    niveau: 'eleve',
                    message: `Kilométrage élevé (${Math.round(kmParAn)} km/an). Usage intensif (commercial, VTC ?).`,
                    hypothese: 'Vérifier état mécanique général et historique d\'entretien.',
                    score: -10
                };
            } else {
                return {
                    coherent: false,
                    niveau: 'suspect_haut',
                    message: `Kilométrage extrêmement élevé (${Math.round(kmParAn)} km/an). Usage professionnel intensif.`,
                    hypothese: 'Usure mécanique probablement importante. Prudence recommandée.',
                    score: -25
                };
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // RÈGLES D'ANALYSE DU PRIX
    // ═══════════════════════════════════════════════════════════════
    prix: {
        /**
         * Analyse le prix par rapport à une estimation
         * @param {number} prixAnnonce - Prix affiché
         * @param {number} prixEstime - Prix estimé du marché
         * @returns {Object} Résultat de l'analyse
         */
        analyser: function (prixAnnonce, prixEstime) {
            if (!prixEstime || prixEstime <= 0) {
                return {
                    analysable: false,
                    message: 'Prix de référence non disponible',
                    score: 0
                };
            }

            const ratio = prixAnnonce / prixEstime;
            const ecartPourcent = ((prixAnnonce - prixEstime) / prixEstime) * 100;

            if (ratio < 0.7) {
                return {
                    analysable: true,
                    niveau: 'tres_bas',
                    message: `Prix très inférieur au marché (${Math.abs(Math.round(ecartPourcent))}% en dessous).`,
                    alerte: 'ATTENTION : Prix suspect. Risque d\'arnaque, de défauts cachés ou de problème administratif.',
                    hypotheses: [
                        'Véhicule accidenté non déclaré',
                        'Problème administratif (gage, opposition)',
                        'Arnaque (véhicule inexistant)',
                        'Vente précipitée (divorce, décès, dette)',
                        'Kilométrage trafiqué'
                    ],
                    score: -30
                };
            } else if (ratio < 0.85) {
                return {
                    analysable: true,
                    niveau: 'bas',
                    message: `Prix inférieur au marché (${Math.abs(Math.round(ecartPourcent))}% en dessous).`,
                    alerte: 'Prix attractif mais vigilance recommandée.',
                    hypotheses: [
                        'Vendeur pressé',
                        'Petits défauts non mentionnés',
                        'Négociation anticipée'
                    ],
                    score: -10
                };
            } else if (ratio <= 1.15) {
                return {
                    analysable: true,
                    niveau: 'normal',
                    message: 'Prix conforme au marché.',
                    score: 0
                };
            } else if (ratio <= 1.3) {
                return {
                    analysable: true,
                    niveau: 'eleve',
                    message: `Prix supérieur au marché (${Math.round(ecartPourcent)}% au-dessus).`,
                    hypotheses: [
                        'Options premium',
                        'Faible kilométrage',
                        'État exceptionnel',
                        'Vendeur optimiste'
                    ],
                    score: -5
                };
            } else {
                return {
                    analysable: true,
                    niveau: 'tres_eleve',
                    message: `Prix bien supérieur au marché (${Math.round(ecartPourcent)}% au-dessus).`,
                    alerte: 'Prix excessif. Négociation fortement recommandée.',
                    score: -15
                };
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // SIGNAUX D'ALERTE (RED FLAGS)
    // ═══════════════════════════════════════════════════════════════
    redFlags: {
        // Mots-clés suspects dans les descriptions
        motsClesSuspects: [
            { pattern: /urgent/i, niveau: 'moyen', message: 'Mention "urgent" - précipitation suspecte', score: -10 },
            { pattern: /vite/i, niveau: 'moyen', message: 'Mention de vente rapide - précipitation suspecte', score: -8 },
            { pattern: /pas s[ée]rieux? s'abstenir/i, niveau: 'faible', message: 'Formule défensive', score: -3 },
            { pattern: /prix ferme/i, niveau: 'faible', message: 'Prix non négociable - vérifier la cohérence', score: -2 },
            { pattern: /(?:cause|pour cause|suite)/i, niveau: 'info', message: 'Raison de vente mentionnée - à vérifier', score: 0 },
            { pattern: /jamais eu de probl[èe]me/i, niveau: 'faible', message: 'Affirmation de fiabilité parfaite - à vérifier', score: -2 },
            { pattern: /parfait [ée]tat/i, niveau: 'faible', message: 'État "parfait" annoncé - soyez critique', score: -2 },
            { pattern: /aucun(e)? frais [àa] pr[ée]voir/i, niveau: 'faible', message: 'Affirmation "aucun frais" - à vérifier', score: -3 },
            { pattern: /ct ok|contr[ôo]le technique ok/i, niveau: 'info', message: 'CT mentionné comme OK - demander le rapport détaillé', score: 0 },
            { pattern: /pas de ct/i, niveau: 'eleve', message: 'Contrôle technique non effectué - ATTENTION', score: -15 },
            { pattern: /carnet (d'entretien )?[àa] jour/i, niveau: 'positif', message: 'Carnet d\'entretien mentionné comme à jour', score: 5 },
            { pattern: /factures? disponible/i, niveau: 'positif', message: 'Factures disponibles - bon signe', score: 5 },
            { pattern: /premi[èe]re main/i, niveau: 'positif', message: 'Première main annoncée', score: 3 },
            { pattern: /plusieurs propri[ée]taires/i, niveau: 'info', message: 'Plusieurs propriétaires - historique à vérifier', score: -3 },
            { pattern: /import/i, niveau: 'moyen', message: 'Véhicule importé - vérifier l\'historique et la conformité', score: -10 },
            { pattern: /accidenté|accident/i, niveau: 'eleve', message: 'Accident mentionné - ATTENTION', score: -20 },
            { pattern: /repeint|repeinture/i, niveau: 'moyen', message: 'Repeinture mentionnée - possible réparation', score: -8 }
        ],

        /**
         * Analyse une description à la recherche de signaux d'alerte
         * @param {string} description - Texte de l'annonce
         * @returns {Array} Liste des alertes détectées
         */
        analyser: function (description) {
            const alertes = [];
            const descLower = description.toLowerCase();

            for (const flag of this.motsClesSuspects) {
                if (flag.pattern.test(description)) {
                    alertes.push({
                        type: flag.niveau,
                        message: flag.message,
                        score: flag.score
                    });
                }
            }

            // ===== ALERTES MÉCANICIEN/ASSUREUR =====
            // Embrayage changé prématurément = signe de sollicitation
            const regexEmbrayage = /embrayage.{0,30}(chang|remplac|neuf|refait|km)/i;
            if (regexEmbrayage.test(description)) {
                const matchKm = description.match(/embrayage.{0,50}?(\d{2,3})\s?000/i);
                if (matchKm) {
                    const kmEmbrayage = parseInt(matchKm[1]) * 1000;
                    if (kmEmbrayage < 100000) {
                        alertes.push({
                            type: 'eleve',
                            message: `Embrayage changé à ${kmEmbrayage.toLocaleString()} km - ANORMALEMENT TÔT. Signe de conduite sportive ou reprogrammation.`,
                            score: -15,
                            sourcePro: 'mecanicien'
                        });
                    }
                }
            }

            // Mention de circuit ou track day
            if (/circuit|track ?day|journée piste|roulage/i.test(description)) {
                alertes.push({
                    type: 'eleve',
                    message: 'Usage circuit mentionné - sollicitation mécanique extrême probable',
                    score: -20,
                    sourcePro: 'mecanicien'
                });
            }

            // Vocabulaire technique suggérant préparation
            if (/stage\s?[123]|e85|flexfuel|launch.?control|pop.?and.?bang|crackle/i.test(description)) {
                alertes.push({
                    type: 'eleve',
                    message: 'Vocabulaire de préparation détecté - véhicule probablement modifié',
                    score: -15,
                    sourcePro: 'assureur'
                });
            }

            // Mention de pièce renforcée = préparation
            if (/renforc[ée]|upgrad[ée]|racing|compétition|sachs|clutch masters/i.test(description)) {
                alertes.push({
                    type: 'moyen',
                    message: 'Pièces renforcées mentionnées - suggère préparation pour puissance accrue',
                    score: -10,
                    sourcePro: 'mecanicien'
                });
            }

            // Volant moteur allégé/bimasse = indice de préparation
            if (/volant.{0,20}(all[ée]g|bimasse|mono.?masse|sachs)/i.test(description)) {
                alertes.push({
                    type: 'moyen',
                    message: 'Volant moteur modifié - associé à préparations moteur',
                    score: -10,
                    sourcePro: 'mecanicien'
                });
            }

            // Entretien hors réseau après modifications
            if (/hors r[ée]seau|garage ind[ée]pendant/i.test(description) &&
                /(reprog|stage|pr[ée]par|modif)/i.test(description)) {
                alertes.push({
                    type: 'moyen',
                    message: 'Entretien hors réseau après modifications - historique difficile à vérifier',
                    score: -8,
                    sourcePro: 'assureur'
                });
            }

            // Analyse de la longueur de description
            if (description.length < 50) {
                alertes.push({
                    type: 'moyen',
                    message: 'Description très courte - manque d\'informations',
                    score: -10
                });
            } else if (description.length < 150) {
                alertes.push({
                    type: 'faible',
                    message: 'Description sommaire - demander plus de détails',
                    score: -5
                });
            } else if (description.length > 500) {
                alertes.push({
                    type: 'positif',
                    message: 'Description détaillée - bon signe de transparence',
                    score: 3
                });
            }

            return alertes;
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // COMBINAISONS DE MODIFICATIONS DANGEREUSES
    // ═══════════════════════════════════════════════════════════════
    combinaisonsDangereuses: [
        {
            modifications: ['reprogrammation', 'turbo_upgrade'],
            niveau: 'critique',
            message: 'Reprogrammation + Upgrade turbo = Sollicitation extrême du moteur',
            risques: [
                'Risque de casse moteur très élevé',
                'Durée de vie embrayage/boîte fortement réduite',
                'Expertise mécanique approfondie OBLIGATOIRE'
            ],
            score: -40
        },
        {
            modifications: ['reprogrammation', 'decatalyseur'],
            niveau: 'critique',
            message: 'Reprogrammation + Décatalyseur = Véhicule non conforme et potentiellement dangereux',
            risques: [
                'Illégal (amende jusqu\'à 7500€)',
                'CT impossible à passer',
                'Assurance nulle'
            ],
            score: -50
        },
        {
            modifications: ['reprogrammation', 'echappement', 'admission'],
            niveau: 'eleve',
            message: 'Préparation moteur complète détectée',
            risques: [
                'Fiabilité compromise',
                'Historique d\'utilisation intensive probable',
                'Vérifier état embrayage, turbo, boîte'
            ],
            score: -30
        },
        {
            modifications: ['rabaissement', 'jantes_non_oem'],
            niveau: 'moyen',
            message: 'Rabaissement + Jantes aftermarket',
            risques: [
                'Vérifier la géométrie',
                'Usure pneus potentiellement anormale',
                'Confort dégradé'
            ],
            score: -15
        },
        {
            modifications: ['suppression_fap', 'reprogrammation'],
            niveau: 'critique',
            message: 'Suppression FAP + Reprogrammation',
            risques: [
                'STRICTEMENT ILLÉGAL',
                'Véhicule invendable légalement',
                'Pollution massive'
            ],
            score: -60
        },
        // ===== NOUVELLES RÈGLES AJOUTÉES (perspective mécanicien/assureur) =====
        {
            modifications: ['intercooler', 'echappement'],
            niveau: 'eleve',
            message: 'Intercooler + Échappement = INDICE FORT de reprogrammation cachée',
            risques: [
                'Ces modifications seules n\'ont pas de sens',
                'Reprogrammation très probablement présente ou passée',
                'Demander explicitement si reprog effectuée'
            ],
            score: -25,
            alerteAssureur: 'Cumul suggérant modification puissance non déclarée'
        },
        {
            modifications: ['intercooler', 'admission'],
            niveau: 'eleve',
            message: 'Intercooler + Admission = Préparation moteur évidente',
            risques: [
                'Reprogrammation très probable',
                'Véhicule préparé pour la performance',
                'Usure mécanique potentiellement avancée'
            ],
            score: -25
        },
        {
            modifications: ['boitier_additionnel', 'echappement'],
            niveau: 'eleve',
            message: 'Boîtier additionnel + Échappement = Préparation complète',
            risques: [
                'Mêmes risques qu\'une reprog complète',
                'Embrayage/turbo/boîte fortement sollicités',
                'Historique d\'utilisation sportive probable'
            ],
            score: -30,
            alerteAssureur: 'Équivalent à modification puissance : surprime ou refus probable'
        },
        {
            modifications: ['boitier_additionnel', 'admission', 'echappement'],
            niveau: 'critique',
            message: 'Boîtier + Admission + Échappement = Véhicule intensivement préparé',
            risques: [
                'Usure mécanique très probable',
                'Embrayage/volant moteur potentiellement à remplacer',
                'EXPERTISE OBLIGATOIRE avant achat'
            ],
            score: -40
        }
    ],

    /**
     * Vérifie les combinaisons dangereuses de modifications
     * @param {Array} modificationsDetectees - Liste des IDs de modifications détectées
     * @returns {Array} Combinaisons dangereuses trouvées
     */
    verifierCombinaisons: function (modificationsDetectees) {
        const alertes = [];

        for (const combo of this.combinaisonsDangereuses) {
            const toutesPresentes = combo.modifications.every(
                mod => modificationsDetectees.includes(mod)
            );

            if (toutesPresentes) {
                alertes.push({
                    niveau: combo.niveau,
                    message: combo.message,
                    risques: combo.risques,
                    score: combo.score
                });
            }
        }

        return alertes;
    }
};

// ═══════════════════════════════════════════════════════════════
// PONDÉRATIONS POUR LE CALCUL DU SCORE
// ═══════════════════════════════════════════════════════════════
const PONDERATIONS = {
    categories: {
        mecanique: 0.40,    // 40% du score final
        legalite: 0.30,     // 30% du score final
        revente: 0.30       // 30% du score final
    },

    // Bonus et malus selon l'âge du véhicule
    ageVehicule: {
        neuf: { bonus: 10, seuilAnnees: 2 },
        recent: { bonus: 5, seuilAnnees: 5 },
        normal: { bonus: 0, seuilAnnees: 10 },
        ancien: { malus: -5, seuilAnnees: 15 },
        tresAncien: { malus: -10 }
    },

    // Bonus pour véhicule d'origine
    vehiculeOrigine: 15
};

// Export pour utilisation dans les autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EXPERT_RULES, PONDERATIONS };
}
