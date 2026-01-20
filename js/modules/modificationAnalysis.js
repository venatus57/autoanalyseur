/**
 * Module d'analyse des modifications
 * Détecte et évalue les modifications apportées au véhicule
 */

const ModificationAnalysis = {
    /**
     * Analyse complète des modifications
     * @param {string} description - Description de l'annonce
     * @param {Array} modificationsDeclarees - Liste optionnelle de modifications déclarées par l'utilisateur
     * @returns {Object} Résultats de l'analyse des modifications
     */
    analyser: function (description, modificationsDeclarees = []) {
        // Détecter les modifications à partir de la description
        const detectees = this.detecterModifications(description);

        // Ajouter les modifications déclarées manuellement
        const declarees = this.traiterModificationsDeclarees(modificationsDeclarees);

        // Fusionner et dédoublonner
        const toutesModifications = this.fusionnerModifications(detectees, declarees);

        // Évaluer chaque modification
        const evaluations = toutesModifications.map(mod => this.evaluerModification(mod));

        // Vérifier les combinaisons dangereuses
        const ids = evaluations.map(e => e.id);
        const combinaisons = EXPERT_RULES.verifierCombinaisons(ids);

        // Calculer les scores
        const scores = this.calculerScores(evaluations, combinaisons);

        // Générer le résumé
        const resume = this.genererResume(evaluations, combinaisons);

        return {
            modifications: evaluations,
            combinaisonsDangereuses: combinaisons,
            nombreModifications: evaluations.length,
            vehiculeOrigine: evaluations.length === 0,
            scores,
            resume,
            recommandations: this.genererRecommandations(evaluations, combinaisons)
        };
    },

    /**
     * Détecte les modifications à partir du texte de description
     */
    detecterModifications: function (description) {
        if (!description) return [];

        const descLower = description.toLowerCase();
        const detectees = [];
        const dejaTrouvees = new Set();

        // Parcourir toutes les catégories de modifications
        for (const [categorie, modifications] of Object.entries(MODIFICATIONS_DATABASE)) {
            for (const [id, data] of Object.entries(modifications)) {
                // Vérifier chaque mot-clé
                for (const keyword of data.keywords) {
                    const keywordLower = keyword.toLowerCase();
                    if (descLower.includes(keywordLower) && !dejaTrouvees.has(id)) {
                        detectees.push({
                            id,
                            categorie,
                            motCleDetecte: keyword,
                            source: 'detection_automatique',
                            confiance: this.calculerConfiance(descLower, keyword)
                        });
                        dejaTrouvees.add(id);
                        break; // Un seul match suffit par modification
                    }
                }
            }
        }

        return detectees;
    },

    /**
     * Calcule un niveau de confiance pour la détection
     */
    calculerConfiance: function (description, keyword) {
        // Confiance plus élevée si le mot-clé est entouré de séparateurs
        const keywordLower = keyword.toLowerCase();
        const regex = new RegExp(`\\b${this.escapeRegex(keywordLower)}\\b`, 'i');

        if (regex.test(description)) {
            return 'haute';
        }
        return 'moyenne';
    },

    /**
     * Échappe les caractères spéciaux regex
     */
    escapeRegex: function (string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    /**
     * Traite les modifications déclarées manuellement par l'utilisateur
     */
    traiterModificationsDeclarees: function (modifications) {
        if (!modifications || modifications.length === 0) return [];

        return modifications.map(mod => ({
            id: mod.id || 'inconnue',
            categorie: mod.categorie || 'autre',
            source: 'declaration_utilisateur',
            confiance: 'haute',
            descriptionUtilisateur: mod.description
        }));
    },

    /**
     * Fusionne les modifications détectées et déclarées, supprime les doublons
     */
    fusionnerModifications: function (detectees, declarees) {
        const fusion = [...detectees];
        const idsPresents = new Set(detectees.map(m => m.id));

        for (const mod of declarees) {
            if (!idsPresents.has(mod.id)) {
                fusion.push(mod);
            }
        }

        return fusion;
    },

    /**
     * Évalue une modification individuelle
     */
    evaluerModification: function (modification) {
        const { id, categorie, source, confiance, motCleDetecte, descriptionUtilisateur } = modification;

        // Rechercher les données de la modification dans la base
        let data = null;
        for (const [cat, mods] of Object.entries(MODIFICATIONS_DATABASE)) {
            if (mods[id]) {
                data = mods[id];
                break;
            }
        }

        // Si modification non trouvée dans la base
        if (!data) {
            return {
                id,
                categorie: categorie || 'inconnue',
                nom: descriptionUtilisateur || id || 'Modification inconnue',
                source,
                confiance,
                motCleDetecte,
                connue: false,
                objectif: 'Non déterminé',
                benefices: ['Non évaluable sans identification'],
                risques: ['Impact inconnu - prudence recommandée'],
                impactLegal: {
                    niveau: 'inconnu',
                    description: 'Vérification nécessaire auprès d\'un professionnel'
                },
                impactRevente: {
                    niveau: 'inconnu',
                    description: 'Impact non évaluable'
                },
                impactAssurance: 'À vérifier avec votre assureur',
                verdict: 'surveiller',
                verdictIcon: '❓',
                scoreImpact: { mecanique: -5, legalite: -5, revente: -5 },
                explication: 'Cette modification n\'est pas référencée dans notre base de données. Il est recommandé de faire vérifier son impact par un professionnel.'
            };
        }

        // Modification connue - retourner l'évaluation complète
        return {
            id,
            categorie,
            nom: data.nom,
            source,
            confiance,
            motCleDetecte,
            connue: true,
            objectif: data.objectif,
            benefices: data.benefices,
            risques: data.risques,
            impactLegal: data.impactLegal,
            impactRevente: data.impactRevente,
            impactAssurance: data.impactAssurance,
            verdict: data.verdict,
            verdictIcon: this.getVerdictIcon(data.verdict),
            scoreImpact: data.scoreImpact,
            explication: this.genererExplicationModification(data)
        };
    },

    /**
     * Retourne l'icône correspondant au verdict
     */
    getVerdictIcon: function (verdict) {
        switch (verdict) {
            case 'sain': return '✅';
            case 'surveiller': return '⚠️';
            case 'risque': return '❌';
            default: return '❓';
        }
    },

    /**
     * Génère une explication en langage naturel pour une modification
     */
    genererExplicationModification: function (data) {
        let explication = '';

        // Expliquer le verdict
        switch (data.verdict) {
            case 'sain':
                explication = `Cette modification est généralement considérée comme saine. `;
                explication += `Elle vise à ${data.objectif.toLowerCase()} et présente peu de risques mécaniques ou légaux.`;
                break;
            case 'surveiller':
                explication = `Cette modification nécessite une attention particulière. `;
                explication += `Bien qu'elle puisse apporter des bénéfices (${data.benefices[0].toLowerCase()}), `;
                explication += `elle comporte des risques à surveiller : ${data.risques[0].toLowerCase()}.`;
                break;
            case 'risque':
                explication = `ATTENTION : Cette modification présente des risques significatifs. `;
                explication += `Sur le plan légal : ${data.impactLegal.description}. `;
                explication += `Risques mécaniques : ${data.risques[0]}.`;
                break;
            default:
                explication = `L'impact de cette modification doit être évalué au cas par cas.`;
        }

        return explication;
    },

    /**
     * Calcule les scores d'impact des modifications
     */
    calculerScores: function (evaluations, combinaisons) {
        let mecanique = 100;
        let legalite = 100;
        let revente = 100;

        // Impact de chaque modification
        for (const mod of evaluations) {
            if (mod.scoreImpact) {
                mecanique += mod.scoreImpact.mecanique || 0;
                legalite += mod.scoreImpact.legalite || 0;
                revente += mod.scoreImpact.revente || 0;
            }
        }

        // Impact des combinaisons dangereuses
        for (const combo of combinaisons) {
            mecanique += combo.score * 0.4;
            legalite += combo.score * 0.3;
            revente += combo.score * 0.3;
        }

        // Bonus véhicule d'origine
        if (evaluations.length === 0) {
            mecanique += PONDERATIONS.vehiculeOrigine;
            legalite += PONDERATIONS.vehiculeOrigine;
            revente += PONDERATIONS.vehiculeOrigine;
        }

        return {
            mecanique: Math.max(0, Math.min(100, Math.round(mecanique))),
            legalite: Math.max(0, Math.min(100, Math.round(legalite))),
            revente: Math.max(0, Math.min(100, Math.round(revente)))
        };
    },

    /**
     * Génère un résumé des modifications
     */
    genererResume: function (evaluations, combinaisons) {
        if (evaluations.length === 0) {
            return {
                titre: 'Véhicule d\'origine',
                description: 'Aucune modification détectée. Le véhicule semble être dans sa configuration d\'origine.',
                niveau: 'positif'
            };
        }

        const nbSaines = evaluations.filter(m => m.verdict === 'sain').length;
        const nbSurveiller = evaluations.filter(m => m.verdict === 'surveiller').length;
        const nbRisque = evaluations.filter(m => m.verdict === 'risque').length;

        let niveau, description;

        if (nbRisque > 0 || combinaisons.length > 0) {
            niveau = 'critique';
            description = `${nbRisque} modification(s) à risque détectée(s). `;
            if (combinaisons.length > 0) {
                description += `${combinaisons.length} combinaison(s) dangereuse(s) identifiée(s). `;
            }
            description += 'Une expertise mécanique approfondie est fortement recommandée.';
        } else if (nbSurveiller > 0) {
            niveau = 'attention';
            description = `${nbSurveiller} modification(s) nécessitant une attention particulière. `;
            description += 'Vérifiez l\'état mécanique et la conformité légale.';
        } else {
            niveau = 'positif';
            description = `${nbSaines} modification(s) détectée(s), toutes considérées comme saines. `;
            description += 'Impact limité sur la fiabilité et la valeur.';
        }

        return {
            titre: `${evaluations.length} modification(s) détectée(s)`,
            description,
            niveau,
            stats: { saines: nbSaines, surveillance: nbSurveiller, risque: nbRisque }
        };
    },

    /**
     * Génère des recommandations basées sur les modifications
     */
    genererRecommandations: function (evaluations, combinaisons) {
        const recommandations = [];

        // Recommandations si véhicule modifié
        if (evaluations.length > 0) {
            recommandations.push({
                type: 'general',
                message: 'Demandez un historique complet des modifications (factures, marques, professionnels ayant effectué les travaux).'
            });
        }

        // Recommandations spécifiques aux modifications à risque
        const risques = evaluations.filter(m => m.verdict === 'risque');
        if (risques.length > 0) {
            recommandations.push({
                type: 'critique',
                message: 'EXPERTISE MÉCANIQUE OBLIGATOIRE avant achat. Les modifications détectées peuvent compromettre la fiabilité du véhicule.'
            });

            // Vérifier présence de reprogrammation
            if (risques.some(m => m.id === 'reprogrammation' || m.id === 'boitier_additionnel')) {
                recommandations.push({
                    type: 'critique',
                    message: 'Faites vérifier l\'état de l\'embrayage, du turbo et de la boîte de vitesses (usure accélérée probable).'
                });
            }

            // Vérifier présence de suppression FAP/CAT
            if (risques.some(m => m.id === 'decatalyseur' || m.id === 'suppression_fap')) {
                recommandations.push({
                    type: 'legal',
                    message: 'ATTENTION : Le véhicule ne pourra pas passer le contrôle technique en l\'état et n\'est pas légalement vendable.'
                });
            }
        }

        // Combinaisons dangereuses
        if (combinaisons.length > 0) {
            recommandations.push({
                type: 'critique',
                message: 'La combinaison de modifications détectée multiplie les risques. Véhicule potentiellement très sollicité.'
            });
        }

        // Vérifications légales
        const illegales = evaluations.filter(m =>
            m.impactLegal && (m.impactLegal.niveau === 'illegal' || m.impactLegal.niveau === 'non_conforme')
        );
        if (illegales.length > 0) {
            recommandations.push({
                type: 'legal',
                message: 'Vérifiez la conformité administrative : certaines modifications nécessitent une homologation ou sont interdites.'
            });
        }

        // Assurance
        if (evaluations.length > 0) {
            recommandations.push({
                type: 'assurance',
                message: 'Contactez votre assureur pour déclarer les modifications et vérifier votre couverture.'
            });
        }

        return recommandations;
    }
};

// Export pour utilisation dans les autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ModificationAnalysis };
}
