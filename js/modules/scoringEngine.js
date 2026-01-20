/**
 * Moteur de scoring
 * Calcule les scores de confiance globaux et par catégorie
 */

const ScoringEngine = {
    calculerScoreFinal: function (analyseGenerale, analyseModifications) {
        const scoresModifications = analyseModifications.scores || { mecanique: 100, legalite: 100, revente: 100 };
        const scoreGeneral = analyseGenerale.scoreGlobal || 100;

        let mecanique = this.combinerScores([
            { score: scoresModifications.mecanique, poids: 0.6 },
            { score: scoreGeneral, poids: 0.4 }
        ]);

        let legalite = this.combinerScores([
            { score: scoresModifications.legalite, poids: 0.8 },
            { score: scoreGeneral, poids: 0.2 }
        ]);

        let revente = this.combinerScores([
            { score: scoresModifications.revente, poids: 0.7 },
            { score: scoreGeneral, poids: 0.3 }
        ]);

        const penalites = this.calculerPenalites(analyseGenerale, analyseModifications);
        mecanique = Math.max(0, mecanique + penalites.mecanique);
        legalite = Math.max(0, legalite + penalites.legalite);
        revente = Math.max(0, revente + penalites.revente);

        const scoreGlobal = Math.round(
            mecanique * PONDERATIONS.categories.mecanique +
            legalite * PONDERATIONS.categories.legalite +
            revente * PONDERATIONS.categories.revente
        );

        const classification = this.classifierScore(scoreGlobal);

        return {
            global: { score: Math.round(scoreGlobal), classification, description: this.getDescriptionScore(scoreGlobal) },
            details: {
                mecanique: { score: Math.round(mecanique), poids: `${PONDERATIONS.categories.mecanique * 100}%`, description: this.getDescriptionCategorie('mecanique', mecanique) },
                legalite: { score: Math.round(legalite), poids: `${PONDERATIONS.categories.legalite * 100}%`, description: this.getDescriptionCategorie('legalite', legalite) },
                revente: { score: Math.round(revente), poids: `${PONDERATIONS.categories.revente * 100}%`, description: this.getDescriptionCategorie('revente', revente) }
            },
            penalites: penalites.details,
            avertissement: this.genererAvertissement(scoreGlobal, analyseModifications)
        };
    },

    combinerScores: function (scoresAvecPoids) {
        let total = 0, poidsTotal = 0;
        for (const { score, poids } of scoresAvecPoids) {
            if (typeof score === 'number' && !isNaN(score)) { total += score * poids; poidsTotal += poids; }
        }
        return poidsTotal > 0 ? total / poidsTotal : 50;
    },

    calculerPenalites: function (analyseGenerale, analyseModifications) {
        const penalites = { mecanique: 0, legalite: 0, revente: 0, details: [] };

        if (analyseGenerale.alertes) {
            for (const alerte of analyseGenerale.alertes) {
                if (alerte.type === 'eleve') { penalites.mecanique -= 5; penalites.revente -= 3; penalites.details.push({ source: 'analyse générale', message: alerte.message }); }
            }
        }

        if (analyseModifications.combinaisonsDangereuses) {
            for (const combo of analyseModifications.combinaisonsDangereuses) {
                if (combo.niveau === 'critique') { penalites.mecanique -= 15; penalites.legalite -= 15; penalites.revente -= 10; }
                else if (combo.niveau === 'eleve') { penalites.mecanique -= 10; penalites.legalite -= 8; penalites.revente -= 5; }
                else { penalites.mecanique -= 5; penalites.legalite -= 3; penalites.revente -= 3; }
                penalites.details.push({ source: 'combinaison', message: combo.message });
            }
        }

        if (analyseModifications.modifications) {
            for (const mod of analyseModifications.modifications) {
                if (mod.impactLegal && mod.impactLegal.niveau === 'illegal') {
                    penalites.legalite -= 20; penalites.revente -= 15;
                    penalites.details.push({ source: 'modification illégale', message: mod.nom });
                }
            }
        }
        return penalites;
    },

    classifierScore: function (score) {
        if (score >= 80) return { niveau: 'excellent', couleur: '#22c55e', icone: '✅', label: 'Confiance élevée' };
        if (score >= 65) return { niveau: 'bon', couleur: '#84cc16', icone: '👍', label: 'Correct avec vigilance' };
        if (score >= 50) return { niveau: 'moyen', couleur: '#f59e0b', icone: '⚠️', label: 'Attention requise' };
        if (score >= 30) return { niveau: 'risque', couleur: '#f97316', icone: '⚠️', label: 'Risques importants' };
        return { niveau: 'critique', couleur: '#ef4444', icone: '❌', label: 'Fortement déconseillé' };
    },

    getDescriptionScore: function (score) {
        if (score >= 80) return 'Bons indicateurs. Visite recommandée pour confirmer.';
        if (score >= 65) return 'Acceptable avec points de vigilance.';
        if (score >= 50) return 'Signaux d\'alerte. Expertise recommandée.';
        if (score >= 30) return 'Risques significatifs. Expertise obligatoire.';
        return 'Trop de risques. Achat déconseillé.';
    },

    getDescriptionCategorie: function (categorie, score) {
        const niveau = score >= 80 ? 'excellent' : score >= 65 ? 'bon' : score >= 50 ? 'moyen' : score >= 30 ? 'risque' : 'critique';
        const desc = {
            mecanique: { excellent: 'Bon état mécanique probable.', bon: 'Correct, vérifications recommandées.', moyen: 'Points à surveiller.', risque: 'Risques significatifs.', critique: 'Fiabilité compromise.' },
            legalite: { excellent: 'Conforme.', bon: 'Globalement conforme.', moyen: 'Vérification nécessaire.', risque: 'Problèmes probables.', critique: 'Non conforme.' },
            revente: { excellent: 'Bonne valeur.', bon: 'Valeur correcte.', moyen: 'Impact possible.', risque: 'Revente difficile.', critique: 'Forte décote.' }
        };
        return desc[categorie][niveau];
    },

    genererAvertissement: function (scoreGlobal, analyseModifications) {
        const raisons = [];
        if (scoreGlobal < 50) raisons.push('Score faible');
        if (analyseModifications.combinaisonsDangereuses?.length > 0) raisons.push('Combinaisons à risque');
        const modsRisque = analyseModifications.modifications?.filter(m => m.verdict === 'risque') || [];
        if (modsRisque.length > 0) raisons.push(`${modsRisque.length} modification(s) à risque`);
        if (raisons.length === 0) return null;
        return {
            recommandation: 'EXPERTISE PHYSIQUE RECOMMANDÉE',
            message: 'Inspection mécanique par un professionnel conseillée.',
            raisons,
            pointsAVerifier: ['Embrayage', 'Turbo', 'Compression', 'Boîte de vitesses', 'Géométrie', 'Codes défaut']
        };
    }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = { ScoringEngine }; }
