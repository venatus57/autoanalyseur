/**
 * Module d'analyse des photos
 * Génère une checklist guidée pour l'utilisateur (pas d'analyse automatique d'image)
 */

const PhotoAnalysis = {
    /**
     * Génère une checklist d'analyse visuelle pour l'utilisateur
     * @param {Object} contexte - Contexte de l'annonce (modifications détectées, etc.)
     * @returns {Object} Checklist structurée
     */
    genererChecklist: function (contexte = {}) {
        const checklist = {
            sections: [],
            alertes: [],
            conseils: []
        };

        // Section 1 : Vérifications générales
        checklist.sections.push(this.getSectionGenerale());

        // Section 2 : État de la carrosserie
        checklist.sections.push(this.getSectionCarrosserie());

        // Section 3 : Intérieur
        checklist.sections.push(this.getSectionInterieur());

        // Section 4 : Compartiment moteur (si visible)
        checklist.sections.push(this.getSectionMoteur(contexte));

        // Section 5 : Trains roulants
        checklist.sections.push(this.getSectionTrainsRoulants(contexte));

        // Section 6 : Vérifications spécifiques aux modifications détectées
        if (contexte.modifications && contexte.modifications.length > 0) {
            checklist.sections.push(this.getSectionModifications(contexte.modifications));
        }

        // Conseils généraux
        checklist.conseils = this.getConseilsGeneraux();

        return checklist;
    },

    /**
     * Section générale de la checklist
     */
    getSectionGenerale: function () {
        return {
            titre: 'Vérifications générales des photos',
            icone: '📷',
            items: [
                {
                    question: 'Le nombre de photos est-il suffisant ?',
                    indice: 'Méfiez-vous des annonces avec moins de 5 photos',
                    importance: 'haute'
                },
                {
                    question: 'Les photos sont-elles de bonne qualité ?',
                    indice: 'Photos floues ou sombres peuvent masquer des défauts',
                    importance: 'moyenne'
                },
                {
                    question: 'Le véhicule est-il photographié sous tous les angles ?',
                    indice: 'Avant, arrière, côtés, intérieur, moteur',
                    importance: 'haute'
                },
                {
                    question: 'Les photos semblent-elles récentes ?',
                    indice: 'Vérifiez la météo, végétation, arrière-plan',
                    importance: 'moyenne'
                },
                {
                    question: 'La plaque d\'immatriculation est-elle visible ou floutée ?',
                    indice: 'Une plaque visible permet de vérifier l\'historique (SIV)',
                    importance: 'info'
                },
                {
                    question: 'Le compteur kilométrique est-il visible sur une photo ?',
                    indice: 'Permet de vérifier le kilométrage annoncé',
                    importance: 'haute'
                }
            ]
        };
    },

    /**
     * Section carrosserie
     */
    getSectionCarrosserie: function () {
        return {
            titre: 'État de la carrosserie',
            icone: '🚗',
            items: [
                {
                    question: 'Y a-t-il des différences de teinte entre les éléments ?',
                    indice: 'Signe de repeinture/réparation après accident',
                    importance: 'haute'
                },
                {
                    question: 'Les joints de porte et de coffre sont-ils alignés ?',
                    indice: 'Décalages = réparation ou accident',
                    importance: 'haute'
                },
                {
                    question: 'Voyez-vous des traces de rouille visibles ?',
                    indice: 'Particulièrement autour des passages de roue et bas de caisse',
                    importance: 'haute'
                },
                {
                    question: 'Les phares sont-ils clairs (non ternis) ?',
                    indice: 'Phares ternis = véhicule vieillissant ou mal entretenu',
                    importance: 'faible'
                },
                {
                    question: 'Y a-t-il des bosses, rayures ou traces d\'impacts ?',
                    indice: 'Estimez le coût des réparations nécessaires',
                    importance: 'moyenne'
                },
                {
                    question: 'Les jantes sont-elles en bon état (pas de voile visible) ?',
                    indice: 'Jantes abîmées = montages/démontages fréquents ou chocs',
                    importance: 'moyenne'
                },
                {
                    question: 'Les pneus semblent-ils en bon état et identiques ?',
                    indice: 'Pneus dépareillés = économies douteuses',
                    importance: 'moyenne'
                }
            ]
        };
    },

    /**
     * Section intérieur
     */
    getSectionInterieur: function () {
        return {
            titre: 'État de l\'intérieur',
            icone: '🪑',
            items: [
                {
                    question: 'Le siège conducteur est-il très usé ?',
                    indice: 'Usure importante = kilométrage potentiellement élevé',
                    importance: 'haute'
                },
                {
                    question: 'Le volant et le levier de vitesse sont-ils usés ?',
                    indice: 'Très révélateur du kilométrage réel',
                    importance: 'haute'
                },
                {
                    question: 'Les pédales sont-elles très lisses/usées ?',
                    indice: 'Usure des pédales = fort kilométrage',
                    importance: 'haute'
                },
                {
                    question: 'Le tableau de bord montre-t-il des voyants allumés ?',
                    indice: 'Voyants moteur, airbag, ESP = problèmes potentiels',
                    importance: 'critique'
                },
                {
                    question: 'L\'intérieur est-il propre et bien entretenu ?',
                    indice: 'Reflète généralement l\'entretien global du véhicule',
                    importance: 'moyenne'
                },
                {
                    question: 'Y a-t-il des traces d\'humidité ou de moisissure ?',
                    indice: 'Risque d\'infiltrations ou de véhicule inondé',
                    importance: 'critique'
                }
            ]
        };
    },

    /**
     * Section moteur
     */
    getSectionMoteur: function (contexte) {
        const items = [
            {
                question: 'Y a-t-il des photos du compartiment moteur ?',
                indice: 'Absence suspecte si aucune photo moteur',
                importance: 'haute'
            },
            {
                question: 'Le moteur semble-t-il propre ?',
                indice: 'Trop propre = nettoyage pour cacher des fuites',
                importance: 'moyenne'
            },
            {
                question: 'Voyez-vous des traces de fuite (huile, liquide de refroidissement) ?',
                indice: 'Traces noires ou vertes = fuites probables',
                importance: 'haute'
            },
            {
                question: 'Les durites et flexibles semblent-ils en bon état ?',
                indice: 'Craquelures = remplacement à prévoir',
                importance: 'moyenne'
            }
        ];

        // Ajouts si modifications moteur détectées
        if (contexte.modifications) {
            const modsMoteur = contexte.modifications.filter(m =>
                ['moteur', 'electronique'].includes(m.categorie)
            );

            if (modsMoteur.length > 0) {
                items.push({
                    question: 'Repérez-vous des pièces aftermarket dans le moteur ?',
                    indice: 'Admission, intercooler, tuyauteries modifiées, boîtier additionnel visible',
                    importance: 'haute'
                });
                items.push({
                    question: 'Les modifications sont-elles visibles et proprement installées ?',
                    indice: 'Installation propre = travail professionnel probable',
                    importance: 'haute'
                });
            }
        }

        return {
            titre: 'Compartiment moteur',
            icone: '🔧',
            items
        };
    },

    /**
     * Section trains roulants
     */
    getSectionTrainsRoulants: function (contexte) {
        const items = [
            {
                question: 'Les pneus s\'usent-ils de manière uniforme ?',
                indice: 'Usure inégale = problème de géométrie ou suspension',
                importance: 'haute'
            },
            {
                question: 'La garde au sol semble-t-elle normale ?',
                indice: 'Véhicule très bas = suspension modifiée',
                importance: 'moyenne'
            },
            {
                question: 'Y a-t-il un espace égal entre les roues et les passages de roue ?',
                indice: 'Écart différent = ressorts fatigués ou rabaissement',
                importance: 'moyenne'
            }
        ];

        // Ajouts si modifications châssis détectées
        if (contexte.modifications) {
            const modsChassis = contexte.modifications.filter(m =>
                ['chassis', 'roues'].includes(m.categorie)
            );

            if (modsChassis.length > 0) {
                items.push({
                    question: 'Le véhicule semble-t-il anormalement bas ?',
                    indice: 'Rabaissement > 40mm = confort et fiabilité impactés',
                    importance: 'haute'
                });
                items.push({
                    question: 'Les roues dépassent-elles de la carrosserie ?',
                    indice: 'INTERDIT au CT - élargisseurs ou jantes trop larges',
                    importance: 'haute'
                });
            }
        }

        return {
            titre: 'Trains roulants et suspensions',
            icone: '🛞',
            items
        };
    },

    /**
     * Section spécifique aux modifications détectées
     */
    getSectionModifications: function (modifications) {
        const items = [];

        for (const mod of modifications) {
            switch (mod.id) {
                case 'reprogrammation':
                case 'boitier_additionnel':
                    items.push({
                        question: `Vérifiez la cohérence de l'usure pour un véhicule "${mod.nom}"`,
                        indice: 'Embrayage, turbo et boîte sollicités = usure plus rapide',
                        importance: 'haute'
                    });
                    break;
                case 'echappement':
                    items.push({
                        question: 'L\'échappement semble-t-il aftermarket ?',
                        indice: 'Sortie(s) plus large(s), logo fabricant visible',
                        importance: 'moyenne'
                    });
                    break;
                case 'admission':
                    items.push({
                        question: 'Voyez-vous un filtre à air sport / admission directe ?',
                        indice: 'Souvent coloré (rouge, vert) ou en forme de cône',
                        importance: 'moyenne'
                    });
                    break;
                case 'suspension_sport':
                case 'rabaissement':
                    items.push({
                        question: 'Les ressorts semblent-ils courts ou colorés ?',
                        indice: 'Ressorts aftermarket souvent colorés (bleu, rouge)',
                        importance: 'moyenne'
                    });
                    break;
                case 'vitres_teintees':
                    items.push({
                        question: 'Les vitres avant sont-elles teintées ?',
                        indice: 'INTERDIT sur vitres avant (pare-brise et vitres conducteur/passager)',
                        importance: 'haute'
                    });
                    break;
                case 'body_kit':
                    items.push({
                        question: 'Le kit carrosserie est-il bien ajusté ?',
                        indice: 'Mauvais ajustement = qualité médiocre ou dégâts',
                        importance: 'moyenne'
                    });
                    break;
                case 'feux_modifies':
                    items.push({
                        question: 'Les phares semblent-ils d\'origine ?',
                        indice: 'Phares aftermarket souvent brillants ou avec anneaux lumineux',
                        importance: 'moyenne'
                    });
                    break;
                case 'covering':
                    items.push({
                        question: 'Le covering présente-t-il des bulles ou décollements ?',
                        indice: 'État du covering révèle l\'âge et la qualité de pose',
                        importance: 'moyenne'
                    });
                    break;
            }
        }

        // Message si aucune modification spécifique à vérifier
        if (items.length === 0) {
            items.push({
                question: 'Recherchez des indices de modifications non déclarées',
                indice: 'Éléments aftermarket, autocollants tuning, etc.',
                importance: 'moyenne'
            });
        }

        return {
            titre: 'Vérifications liées aux modifications détectées',
            icone: '🔍',
            items
        };
    },

    /**
     * Conseils généraux
     */
    getConseilsGeneraux: function () {
        return [
            {
                titre: 'Demandez plus de photos',
                description: 'N\'hésitez pas à demander des photos supplémentaires de zones spécifiques (dessous de caisse, moteur à froid, compteur, etc.)',
                icone: '📸'
            },
            {
                titre: 'Comparez avec des véhicules similaires',
                description: 'Consultez d\'autres annonces du même modèle pour repérer les différences',
                icone: '🔄'
            },
            {
                titre: 'Attention aux photos professionnelles',
                description: 'Des photos trop professionnelles peuvent cacher un véhicule chez un marchand qui se fait passer pour un particulier',
                icone: '⚠️'
            },
            {
                titre: 'Vérifiez la cohérence',
                description: 'Le véhicule sur les photos doit correspondre à la description (couleur, options, kilométrage visible)',
                icone: '✅'
            },
            {
                titre: 'Préférez la visite physique',
                description: 'Les photos ne remplacent jamais une inspection en personne. Prévoyez toujours une visite avant tout engagement.',
                icone: '👁️'
            }
        ];
    },

    /**
     * Évalue les réponses de l'utilisateur à la checklist
     * @param {Array} reponses - Tableau de réponses {itemId, reponse: 'oui'|'non'|'incertain'}
     * @returns {Object} Évaluation des réponses
     */
    evaluerReponses: function (reponses) {
        let alertes = [];
        let positifs = [];
        let aVerifier = [];

        for (const rep of reponses) {
            if (rep.probleme && rep.importance === 'haute') {
                alertes.push({
                    item: rep.question,
                    type: 'alerte'
                });
            } else if (rep.probleme && rep.importance === 'critique') {
                alertes.push({
                    item: rep.question,
                    type: 'critique'
                });
            } else if (rep.reponse === 'incertain') {
                aVerifier.push({
                    item: rep.question
                });
            } else if (!rep.probleme && rep.importance === 'haute') {
                positifs.push({
                    item: rep.question
                });
            }
        }

        return {
            alertes,
            positifs,
            aVerifier,
            recommandation: alertes.length > 2
                ? 'Nombreuses alertes visuelles - visite et expertise fortement recommandées'
                : aVerifier.length > 3
                    ? 'Plusieurs points à vérifier sur place'
                    : 'Photos satisfaisantes - procédez à la visite pour confirmer'
        };
    }
};

// Export pour utilisation dans les autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PhotoAnalysis };
}
