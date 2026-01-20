/**
 * Module d'analyse générale des annonces
 * Évalue la cohérence prix/kilométrage et détecte les signaux d'alerte
 */

const GeneralAnalysis = {
    /**
     * Analyse complète d'une annonce
     * @param {Object} annonce - Données de l'annonce
     * @returns {Object} Résultats de l'analyse générale
     */
    analyser: function (annonce) {
        const resultats = {
            prix: this.analyserPrix(annonce),
            kilometrage: this.analyserKilometrage(annonce),
            description: this.analyserDescription(annonce.description || ''),
            urgence: this.detecterUrgence(annonce.description || ''),
            modele: this.analyserModele(annonce),
            scoreGlobal: 0,
            alertes: []
        };

        // Calculer le score global de cette section
        resultats.scoreGlobal = this.calculerScore(resultats);

        // Collecter toutes les alertes
        resultats.alertes = this.collecterAlertes(resultats);

        return resultats;
    },

    /**
     * Analyse du prix de l'annonce
     * Utilise la base de données des prix du marché
     */
    analyserPrix: function (annonce) {
        const { prix, prixEstime, marque, modele, annee, kilometrage, motorisation } = annonce;

        // Si un prix estimé est fourni manuellement, l'utiliser en priorité
        if (prixEstime && prixEstime > 0) {
            const analyse = EXPERT_RULES.prix.analyser(prix, prixEstime);
            analyse.source = 'manuel';
            return analyse;
        }

        // Utiliser la base de données du marché pour estimer le prix
        if (marque && modele && annee && typeof MarketPriceDatabase !== 'undefined') {
            const estimation = MarketPriceDatabase.estimer({
                marque, modele, annee, kilometrage, motorisation
            });

            if (estimation.trouve) {
                const analyse = EXPERT_RULES.prix.analyser(prix, estimation.prixEstime);
                analyse.source = 'base_marche';
                analyse.estimation = estimation;
                analyse.message += ` (Estimation: ${estimation.prixEstime.toLocaleString()}€ basée sur ${marque} ${modele} ${annee})`;
                return analyse;
            } else {
                // Estimation générique utilisée
                const analyse = EXPERT_RULES.prix.analyser(prix, estimation.prixEstime);
                analyse.source = 'estimation_generique';
                analyse.estimation = estimation;
                analyse.hypothese = estimation.message;
                return analyse;
            }
        }

        // Fallback : estimation très basique si pas dans la base
        if (annee && prix) {
            const age = new Date().getFullYear() - annee;
            const prixEstimeBasique = Math.max(2000, 25000 * Math.pow(0.88, age));
            const analyse = EXPERT_RULES.prix.analyser(prix, prixEstimeBasique);
            analyse.source = 'estimation_basique';
            analyse.hypothese = 'Prix estimé approximativement (modèle non référencé).';
            return analyse;
        }

        // Pas assez de données
        return {
            analysable: false,
            message: 'Renseignez la marque, le modèle et l\'année pour une estimation automatique du prix.',
            conseil: 'Ou consultez La Centrale, Argus ou des annonces similaires sur Leboncoin.',
            score: 0
        };
    },

    /**
     * Analyse de la cohérence kilométrique
     */
    analyserKilometrage: function (annonce) {
        const { kilometrage, annee } = annonce;

        if (!kilometrage || !annee) {
            return {
                analysable: false,
                message: 'Kilométrage ou année non renseigné',
                score: -5
            };
        }

        return EXPERT_RULES.kilometrage.analyser(kilometrage, annee);
    },

    /**
     * Analyse de la qualité de la description
     */
    analyserDescription: function (description) {
        if (!description || description.trim() === '') {
            return {
                qualite: 'absente',
                message: 'Aucune description fournie - ATTENTION, signe de mauvaise qualité d\'annonce',
                score: -20,
                alertes: [{
                    type: 'eleve',
                    message: 'Annonce sans description - très suspect'
                }]
            };
        }

        const alertes = EXPERT_RULES.redFlags.analyser(description);
        const longueur = description.length;

        let qualite, message;
        if (longueur < 50) {
            qualite = 'tres_courte';
            message = 'Description trop courte pour être informative';
        } else if (longueur < 150) {
            qualite = 'courte';
            message = 'Description sommaire - demander des précisions';
        } else if (longueur < 500) {
            qualite = 'correcte';
            message = 'Description de longueur acceptable';
        } else {
            qualite = 'detaillee';
            message = 'Description détaillée - bon signe';
        }

        // Calculer le score basé sur les alertes
        let score = alertes.reduce((acc, a) => acc + a.score, 0);

        return {
            qualite,
            message,
            longueur,
            alertes,
            alertesPositives: alertes.filter(a => a.score > 0),
            alertesNegatives: alertes.filter(a => a.score < 0),
            score
        };
    },

    /**
     * Détection des signes d'urgence/précipitation
     */
    detecterUrgence: function (description) {
        const signesUrgence = [
            { pattern: /urgent/i, poids: 3, message: 'Mot "urgent" détecté' },
            { pattern: /vendre (tr[èe]s )?vite/i, poids: 3, message: 'Urgence de vente mentionnée' },
            { pattern: /d[ée]m[ée]nage/i, poids: 2, message: 'Déménagement mentionné' },
            { pattern: /voyage|partir|[ée]tranger/i, poids: 2, message: 'Départ mentionné' },
            { pattern: /besoin (de )?liquidit[ée]/i, poids: 3, message: 'Besoin financier mentionné' },
            { pattern: /premi[èe]re? qui vient/i, poids: 2, message: 'Premier arrivé servi' },
            { pattern: /ne rate[zs]? pas/i, poids: 1, message: 'Incitation à ne pas rater' },
            { pattern: /offre limit[ée]e/i, poids: 2, message: 'Offre limitée suggérée' },
            { pattern: /cette semaine|ce week-?end/i, poids: 2, message: 'Deadline temporelle' },
            { pattern: /pas le temps/i, poids: 2, message: 'Manque de temps mentionné' }
        ];

        const detectes = [];
        let scoreUrgence = 0;

        for (const signe of signesUrgence) {
            if (signe.pattern.test(description)) {
                detectes.push({
                    message: signe.message,
                    poids: signe.poids
                });
                scoreUrgence += signe.poids;
            }
        }

        let niveau, message;
        if (scoreUrgence === 0) {
            niveau = 'normal';
            message = 'Aucun signe de précipitation détecté';
        } else if (scoreUrgence <= 2) {
            niveau = 'leger';
            message = 'Légère urgence suggérée - à vérifier';
        } else if (scoreUrgence <= 5) {
            niveau = 'modere';
            message = 'Signes d\'urgence modérés - prudence';
        } else {
            niveau = 'eleve';
            message = 'Forte urgence détectée - ATTENTION aux arnaques';
        }

        return {
            niveau,
            message,
            signesDetectes: detectes,
            score: -scoreUrgence * 3
        };
    },

    /**
     * Analyse des informations spécifiques au modèle
     */
    analyserModele: function (annonce) {
        const { marque, modele, motorisation } = annonce;

        if (!marque || !modele) {
            return {
                analysable: false,
                message: 'Marque ou modèle non renseigné',
                score: 0
            };
        }

        const infos = VEHICLE_DATABASE.getInfosModele(marque, modele);

        if (!infos) {
            return {
                analysable: false,
                message: `Modèle ${marque} ${modele} non référencé dans notre base`,
                conseil: 'Faites des recherches sur les forums spécialisés pour ce modèle.',
                score: 0
            };
        }

        // Vérifier si la motorisation est problématique
        let alerteMotorisation = null;
        if (motorisation && infos.moteursProblematiques) {
            for (const moteur of infos.moteursProblematiques) {
                if (motorisation.toLowerCase().includes(moteur.toLowerCase().split(' ')[0])) {
                    alerteMotorisation = {
                        type: 'moyen',
                        message: `Motorisation potentiellement problématique : ${moteur}`,
                        score: -10
                    };
                    break;
                }
            }
        }

        return {
            analysable: true,
            marque: infos.marque,
            modele: infos.modele,
            fiabiliteMarque: infos.fiabiliteMarque,
            pointsVigilance: infos.pointsVigilance,
            moteursFiables: infos.moteursFiables,
            moteursProblematiques: infos.moteursProblematiques,
            alerteMotorisation,
            score: alerteMotorisation ? alerteMotorisation.score : 0
        };
    },

    /**
     * Calcule le score global de l'analyse générale
     */
    calculerScore: function (resultats) {
        let score = 100; // Score de base

        // Ajustements basés sur chaque analyse
        if (resultats.prix.score) score += resultats.prix.score;
        if (resultats.kilometrage.score) score += resultats.kilometrage.score;
        if (resultats.description.score) score += resultats.description.score;
        if (resultats.urgence.score) score += resultats.urgence.score;
        if (resultats.modele.score) score += resultats.modele.score;

        // S'assurer que le score reste entre 0 et 100
        return Math.max(0, Math.min(100, score));
    },

    /**
     * Collecte toutes les alertes de l'analyse
     */
    collecterAlertes: function (resultats) {
        const alertes = [];

        // Alertes prix
        if (resultats.prix.alerte) {
            alertes.push({
                source: 'prix',
                type: resultats.prix.niveau,
                message: resultats.prix.alerte
            });
        }

        // Alertes kilométrage
        if (resultats.kilometrage.niveau && resultats.kilometrage.niveau !== 'normal') {
            alertes.push({
                source: 'kilometrage',
                type: resultats.kilometrage.niveau.includes('suspect') ? 'eleve' : 'moyen',
                message: resultats.kilometrage.message
            });
        }

        // Alertes description
        if (resultats.description.alertesNegatives) {
            for (const alerte of resultats.description.alertesNegatives) {
                alertes.push({
                    source: 'description',
                    type: alerte.type,
                    message: alerte.message
                });
            }
        }

        // Alertes urgence
        if (resultats.urgence.niveau !== 'normal') {
            alertes.push({
                source: 'urgence',
                type: resultats.urgence.niveau === 'eleve' ? 'eleve' : 'moyen',
                message: resultats.urgence.message
            });
        }

        // Alerte motorisation
        if (resultats.modele.alerteMotorisation) {
            alertes.push({
                source: 'modele',
                ...resultats.modele.alerteMotorisation
            });
        }

        return alertes;
    }
};

// Export pour utilisation dans les autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GeneralAnalysis };
}
