/**
 * Base de données des modifications automobiles connues
 * Chaque modification est documentée avec ses impacts sur la mécanique, la légalité et la revente
 */

const MODIFICATIONS_DATABASE = {
    // ═══════════════════════════════════════════════════════════════
    // MODIFICATIONS MOTEUR
    // ═══════════════════════════════════════════════════════════════
    moteur: {
        reprogrammation: {
            keywords: ['reprog', 'reprogrammation', 'stage 1', 'stage 2', 'stage 3', 'chip tuning', 'chiptuning', 'remap', 'flash', 'préparation moteur', 'optimisation moteur', 'boitier additionnel'],
            nom: 'Reprogrammation moteur',
            objectif: 'Augmentation des performances (puissance et couple)',
            benefices: [
                'Gain de puissance (10-40% selon stage)',
                'Couple accru sur toute la plage de régime',
                'Meilleure réponse à l\'accélérateur',
                'Potentielle amélioration de la consommation (stage 1 léger)'
            ],
            risques: [
                'Usure prématurée de l\'embrayage',
                'Sollicitation accrue du turbo',
                'Contraintes supplémentaires sur la boîte de vitesses',
                'Risque de casse moteur si mal réalisée',
                'Annulation de la garantie constructeur'
            ],
            impactLegal: {
                niveau: 'non_conforme',
                description: 'Non conforme sans homologation DREAL. Le véhicule doit être réceptionné à titre isolé pour être légal.',
                risquesCT: 'Refus possible si détection de modifications non déclarées'
            },
            impactRevente: {
                niveau: 'negatif',
                description: 'Réduit significativement le bassin d\'acheteurs potentiels. Certains amateurs recherchent ce type de véhicule.',
                facteur: 0.85
            },
            impactAssurance: 'Non déclarée = nullité du contrat en cas de sinistre',
            verdict: 'risque',
            scoreImpact: { mecanique: -25, legalite: -35, revente: -15 }
        },

        turbo_upgrade: {
            keywords: ['gros turbo', 'turbo hybride', 'upgrade turbo', 'turbo préparé', 'bigger turbo', 'turbo garrett', 'turbo borgwarner'],
            nom: 'Upgrade turbo',
            objectif: 'Augmentation significative de la puissance',
            benefices: [
                'Gains de puissance importants (50-100%+)',
                'Potentiel performance élevé'
            ],
            risques: [
                'Fiabilité moteur compromise',
                'Nécessite renforcement de nombreux composants',
                'Temps de réponse turbo potentiellement dégradé',
                'Surchauffe possible',
                'Usure accélérée de tous les organes mécaniques'
            ],
            impactLegal: {
                niveau: 'non_conforme',
                description: 'Modification majeure nécessitant homologation complète',
                risquesCT: 'Refus si détecté'
            },
            impactRevente: {
                niveau: 'tres_negatif',
                description: 'Marché très restreint, méfiance des acheteurs classiques',
                facteur: 0.70
            },
            impactAssurance: 'Obligation de déclaration, surprime importante ou refus',
            verdict: 'risque',
            scoreImpact: { mecanique: -40, legalite: -40, revente: -25 }
        },

        admission: {
            keywords: ['admission directe', 'filtre à air sport', 'boite à air', 'kit admission', 'cold air intake', 'bmc', 'k&n', 'pipercross', 'green'],
            nom: 'Kit d\'admission sport',
            objectif: 'Amélioration du flux d\'air moteur',
            benefices: [
                'Sonorité moteur plus sportive',
                'Léger gain de puissance possible (2-5%)',
                'Meilleure respiration moteur'
            ],
            risques: [
                'Risque d\'aspiration d\'eau si mal positionné',
                'Filtration parfois moins efficace (particules fines)',
                'ATTENTION DIESEL TURBO : perturbation débitmètre fréquente',
                'Usure moteur accélérée si filtration insuffisante'
            ],
            impactLegal: {
                niveau: 'tolere',
                description: 'Généralement toléré si homologué',
                risquesCT: 'Faible risque'
            },
            impactRevente: {
                niveau: 'neutre',
                description: 'Impact minime, facilement réversible',
                facteur: 0.98
            },
            impactAssurance: 'Rarement problématique si seule modification',
            verdict: 'surveiller',
            alerteMecanicien: 'Sur diesel turbo, vérifier le bon fonctionnement du débitmètre (codes défaut, fumées).',
            scoreImpact: { mecanique: -8, legalite: -5, revente: -2 }
        },

        echappement: {
            keywords: ['échappement sport', 'ligne inox', 'downpipe', 'décata', 'decat', 'silencieux sport', 'akrapovic', 'milltek', 'scorpion', 'supersprint', 'catback', 'cat-back'],
            nom: 'Échappement sport',
            objectif: 'Performance et sonorité',
            benefices: [
                'Gain de puissance modéré (3-15% selon configuration)',
                'Sonorité sportive',
                'Parfois allègement du véhicule'
            ],
            risques: [
                'Faibles si qualité correcte',
                'Drone à certains régimes possible',
                'Corrosion si matériaux bas de gamme'
            ],
            impactLegal: {
                niveau: 'conditionnel',
                description: 'Légal si normes sonores respectées (<82dB). Décatalyseur strictement interdit.',
                risquesCT: 'Refus si décatalyseur ou bruit excessif'
            },
            impactRevente: {
                niveau: 'neutre_negatif',
                description: 'Dépend du type d\'acheteur',
                facteur: 0.95
            },
            impactAssurance: 'Peu problématique si homologué',
            verdict: 'surveiller',
            scoreImpact: { mecanique: -3, legalite: -15, revente: -5 }
        },

        decatalyseur: {
            keywords: ['décata', 'decat', 'suppression catalyseur', 'sans catalyseur', 'no cat'],
            nom: 'Suppression catalyseur',
            objectif: 'Gain de puissance et sonorité',
            benefices: [
                'Gain de puissance (5-15%)',
                'Réduction des contre-pressions d\'échappement'
            ],
            risques: [
                'Pollution accrue',
                'Odeurs désagréables',
                'Dégradation de la sonde lambda possible'
            ],
            impactLegal: {
                niveau: 'illegal',
                description: 'STRICTEMENT INTERDIT. Infraction pénale (délit). Amende jusqu\'à 7500€.',
                risquesCT: 'Refus systématique du contrôle technique'
            },
            impactRevente: {
                niveau: 'tres_negatif',
                description: 'Véhicule non vendable en l\'état légalement',
                facteur: 0.60
            },
            impactAssurance: 'Nullité du contrat',
            verdict: 'risque',
            scoreImpact: { mecanique: -10, legalite: -50, revente: -35 }
        },

        intercooler: {
            keywords: ['intercooler', 'échangeur', 'fmic', 'front mount intercooler', 'gros échangeur'],
            nom: 'Intercooler renforcé',
            objectif: 'Meilleur refroidissement de l\'air d\'admission',
            benefices: [
                'Températures d\'admission réduites',
                'Performances plus stables à chaud'
            ],
            risques: [
                'INDICE FORT de préparation moteur associée',
                'Rarement monté seul : généralement accompagné de reprog',
                'Temps de réponse turbo allongé',
                'Risques de fuites si mal installé'
            ],
            impactLegal: {
                niveau: 'conditionnel',
                description: 'Toléré isolément mais souvent signe d\'autres modifications',
                risquesCT: 'Faible risque direct'
            },
            impactRevente: {
                niveau: 'neutre_negatif',
                description: 'Suggère une préparation - méfiance des acheteurs',
                facteur: 0.93
            },
            impactAssurance: 'À déclarer car modification structurelle',
            verdict: 'surveiller',
            alerteMecanicien: 'Un intercooler seul est rare. Chercher des indices de reprogrammation non déclarée.',
            scoreImpact: { mecanique: -8, legalite: -5, revente: -5 }
        },

        // ===== INDICES DE PRÉPARATION CACHÉE =====
        embrayage_renforce: {
            keywords: ['embrayage renforcé', 'embrayage sachs', 'clutch masters', 'embrayage sport', 'embrayage racing', 'kit embrayage'],
            nom: 'Embrayage renforcé',
            objectif: 'Supporter une puissance accrue',
            benefices: [
                'Meilleure tenue à la puissance',
                'Durabilité accrue sous contrainte'
            ],
            risques: [
                'INDICE MAJEUR de reprogrammation passée ou présente',
                'Personne ne monte un embrayage renforcé sur un moteur stock',
                'Confort de conduite dégradé (point dur)',
                'Volant moteur potentiellement modifié aussi'
            ],
            impactLegal: {
                niveau: 'tolere',
                description: 'Pièce légale mais révélatrice',
                risquesCT: 'Aucun risque direct'
            },
            impactRevente: {
                niveau: 'negatif',
                description: 'Suggère fortement une préparation moteur',
                facteur: 0.85
            },
            impactAssurance: 'La question est : pourquoi un embrayage renforcé ? = reprog probable',
            verdict: 'risque',
            alerteMecanicien: 'Un embrayage renforcé sans reprog déclarée = reprog cachée à 99%. Véhicule sollicité.',
            alerteAssureur: 'Indice fort de modification puissance non déclarée.',
            scoreImpact: { mecanique: -20, legalite: -15, revente: -15 }
        },

        dump_valve: {
            keywords: ['dump valve', 'blow off', 'bov', 'soupape de décharge', 'pshhh'],
            nom: 'Dump valve / Blow-off valve',
            objectif: 'Sonorité et/ou performance turbo',
            benefices: [
                'Sonorité caractéristique',
                'Protection turbo sur véhicules préparés'
            ],
            risques: [
                'INDICE de mentalité performance du propriétaire',
                'Souvent associée à une reprogrammation',
                'Peut perturber la gestion moteur sur certains véhicules'
            ],
            impactLegal: {
                niveau: 'tolere',
                description: 'Légal mais révélateur',
                risquesCT: 'Aucun risque'
            },
            impactRevente: {
                niveau: 'negatif',
                description: 'Image "tuning" qui rebute certains acheteurs',
                facteur: 0.92
            },
            impactAssurance: 'Peut suggérer d\'autres modifications non déclarées',
            verdict: 'surveiller',
            alerteMecanicien: 'Généralement accompagnée d\'autres modifications. Vérifier si reprog.',
            scoreImpact: { mecanique: -5, legalite: -3, revente: -8 }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // MODIFICATIONS CHÂSSIS
    // ═══════════════════════════════════════════════════════════════
    chassis: {
        suspension_sport: {
            keywords: ['suspension sport', 'amortisseurs sport', 'bilstein', 'koni', 'öhlins', 'kw', 'h&r', 'eibach', 'combinés filetés', 'coilovers'],
            nom: 'Suspension sport',
            objectif: 'Amélioration de la tenue de route',
            benefices: [
                'Tenue de route améliorée',
                'Réduction du roulis',
                'Comportement plus sportif'
            ],
            risques: [
                'Confort dégradé',
                'Usure pneus potentiellement accélérée',
                'Fatigue de la caisse à long terme'
            ],
            impactLegal: {
                niveau: 'conditionnel',
                description: 'Légal si homologué et garde au sol respectée (>10cm)',
                risquesCT: 'Contrôle de la garde au sol'
            },
            impactRevente: {
                niveau: 'neutre',
                description: 'Dépend du marché cible',
                facteur: 0.95
            },
            impactAssurance: 'À déclarer mais généralement accepté',
            verdict: 'surveiller',
            scoreImpact: { mecanique: -5, legalite: -5, revente: -3 }
        },

        rabaissement: {
            keywords: ['rabaissé', 'rabaissement', 'lowered', 'slammed', 'ressorts courts', 'châssis sport', '-30mm', '-40mm', '-50mm', '-60mm'],
            nom: 'Rabaissement du châssis',
            objectif: 'Esthétique et tenue de route',
            benefices: [
                'Centre de gravité abaissé',
                'Look plus sportif',
                'Tenue de route potentiellement améliorée'
            ],
            risques: [
                'Usure prématurée des amortisseurs',
                'Risque de toucher sur ralentisseurs',
                'Géométrie compromise si excessif',
                'Confort très dégradé'
            ],
            impactLegal: {
                niveau: 'conditionnel',
                description: 'Interdit si garde au sol < 10cm. Nécessite homologation pour rabaissement important.',
                risquesCT: 'Refus si garde au sol insuffisante'
            },
            impactRevente: {
                niveau: 'negatif',
                description: 'Réduit le bassin d\'acheteurs',
                facteur: 0.88
            },
            impactAssurance: 'Doit être déclaré',
            verdict: 'surveiller',
            scoreImpact: { mecanique: -12, legalite: -15, revente: -10 }
        },

        barre_antirapteur: {
            keywords: ['barre anti-rapprochement', 'barre de renfort', 'strut bar', 'domstrebe', 'tower bar'],
            nom: 'Barre anti-rapprochement',
            objectif: 'Rigidification du châssis',
            benefices: [
                'Rigidité accrue de la caisse',
                'Précision de direction améliorée'
            ],
            risques: [
                'Très faibles',
                'Possible gêne pour maintenance'
            ],
            impactLegal: {
                niveau: 'tolere',
                description: 'Aucun problème légal',
                risquesCT: 'Aucun risque'
            },
            impactRevente: {
                niveau: 'neutre',
                description: 'Généralement apprécié',
                facteur: 1.00
            },
            impactAssurance: 'Aucun impact',
            verdict: 'sain',
            scoreImpact: { mecanique: 0, legalite: 0, revente: 0 }
        },

        freins: {
            keywords: ['gros freins', 'kit freins', 'disques percés', 'disques rainurés', 'brembo', 'ap racing', 'stoptech', 'étriers 4 pistons', 'étriers 6 pistons'],
            nom: 'Kit freinage renforcé',
            objectif: 'Amélioration du freinage',
            benefices: [
                'Distances de freinage réduites',
                'Meilleure résistance au fading',
                'Sécurité accrue'
            ],
            risques: [
                'Nécessite jantes compatibles',
                'Maintenance plus coûteuse'
            ],
            impactLegal: {
                niveau: 'tolere',
                description: 'Légal si performance maintenue ou améliorée',
                risquesCT: 'Aucun risque si bien installé'
            },
            impactRevente: {
                niveau: 'positif',
                description: 'Généralement valorisé',
                facteur: 1.02
            },
            impactAssurance: 'Aucun impact négatif',
            verdict: 'sain',
            scoreImpact: { mecanique: 2, legalite: 0, revente: 2 }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // MODIFICATIONS ROUES
    // ═══════════════════════════════════════════════════════════════
    roues: {
        jantes_non_oem: {
            keywords: ['jantes alu', 'jantes 17', 'jantes 18', 'jantes 19', 'jantes 20', 'jantes 21', 'bbs', 'oz racing', 'sparco', 'work', 'rotiform', 'vossen'],
            nom: 'Jantes non OEM',
            objectif: 'Esthétique et performance',
            benefices: [
                'Look personnalisé',
                'Potentiel allègement (jantes forgées)',
                'Meilleure dissipation thermique freins'
            ],
            risques: [
                'Pneus plus chers si dimensions non standard',
                'Confort réduit si profil plus bas',
                'Risque de dommages sur mauvais revêtement'
            ],
            impactLegal: {
                niveau: 'conditionnel',
                description: 'Légal si dimensions compatibles avec le certificat de conformité ou homologuées',
                risquesCT: 'Vérification des dimensions'
            },
            impactRevente: {
                niveau: 'neutre',
                description: 'Dépend du goût de l\'acheteur',
                facteur: 0.97
            },
            impactAssurance: 'À déclarer si valeur importante',
            verdict: 'surveiller',
            scoreImpact: { mecanique: -2, legalite: -5, revente: -3 }
        },

        elargisseurs: {
            keywords: ['élargisseurs', 'cales de voie', 'spacers', 'wheel spacers'],
            nom: 'Élargisseurs de voie',
            objectif: 'Élargir la voie pour look ou tenue de route',
            benefices: [
                'Look plus large',
                'Stabilité potentiellement améliorée'
            ],
            risques: [
                'Contraintes sur roulements',
                'Risque de dépassement des ailes',
                'Usure prématurée des cardans et rotules'
            ],
            impactLegal: {
                niveau: 'conditionnel',
                description: 'Interdit si roues dépassent de la carrosserie',
                risquesCT: 'Refus si roues débordantes'
            },
            impactRevente: {
                niveau: 'negatif',
                description: 'Souvent mal perçu',
                facteur: 0.90
            },
            impactAssurance: 'Doit être déclaré',
            verdict: 'surveiller',
            scoreImpact: { mecanique: -10, legalite: -10, revente: -8 }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // MODIFICATIONS ESTHÉTIQUES
    // ═══════════════════════════════════════════════════════════════
    esthetique: {
        covering: {
            keywords: ['covering', 'wrap', 'film', 'total covering', 'car wrap'],
            nom: 'Covering / Car Wrap',
            objectif: 'Changement esthétique temporaire',
            benefices: [
                'Protection de la peinture d\'origine',
                'Look personnalisé réversible',
                'Coût inférieur à une peinture'
            ],
            risques: [
                'Qualité variable selon le poseur',
                'Dégradation si mal entretenu',
                'Peut masquer des défauts de carrosserie'
            ],
            impactLegal: {
                niveau: 'conditionnel',
                description: 'Légal mais doit être déclaré sur la carte grise si changement de couleur apparent',
                risquesCT: 'Aucun problème'
            },
            impactRevente: {
                niveau: 'neutre',
                description: 'Peut cacher l\'état réel de la carrosserie',
                facteur: 0.95
            },
            impactAssurance: 'À déclarer si changement de couleur',
            verdict: 'surveiller',
            scoreImpact: { mecanique: 0, legalite: -3, revente: -5 }
        },

        vitres_teintees: {
            keywords: ['vitres teintées', 'film teinté', 'vitres fumées', 'tinted windows', 'sur-teintage'],
            nom: 'Vitres teintées',
            objectif: 'Esthétique et intimité',
            benefices: [
                'Protection thermique',
                'Intimité accrue',
                'Protection UV'
            ],
            risques: [
                'Visibilité réduite de nuit',
                'Gêne potentielle pour conduite'
            ],
            impactLegal: {
                niveau: 'conditionnel',
                description: 'INTERDIT sur pare-brise et vitres avant (TLV min 70%). Toléré à l\'arrière.',
                risquesCT: 'Refus si vitres avant teintées'
            },
            impactRevente: {
                niveau: 'neutre',
                description: 'Généralement apprécié si légal',
                facteur: 0.98
            },
            impactAssurance: 'Aucun impact si conforme',
            verdict: 'surveiller',
            scoreImpact: { mecanique: 0, legalite: -8, revente: 0 }
        },

        feux_modifies: {
            keywords: ['feux led', 'phares xenon', 'angel eyes', 'feux aftermarket', 'phares tuning', 'feux fumés'],
            nom: 'Phares/feux modifiés',
            objectif: 'Esthétique ou éclairage amélioré',
            benefices: [
                'Look personnalisé',
                'Potentiel meilleur éclairage (LED/Xénon)'
            ],
            risques: [
                'Éblouissement des autres usagers',
                'Qualité variable des produits aftermarket',
                'Étanchéité parfois compromise'
            ],
            impactLegal: {
                niveau: 'conditionnel',
                description: 'Interdit si non homologué. Xénon aftermarket sans lave-phares = interdit.',
                risquesCT: 'Refus si non conforme'
            },
            impactRevente: {
                niveau: 'negatif',
                description: 'Souvent mal perçu par acheteurs classiques',
                facteur: 0.92
            },
            impactAssurance: 'Problématique si non homologué',
            verdict: 'surveiller',
            scoreImpact: { mecanique: 0, legalite: -15, revente: -8 }
        },

        body_kit: {
            keywords: ['body kit', 'kit carrosserie', 'pare-chocs sport', 'aileron', 'spoiler', 'diffuseur', 'bas de caisse', 'lame avant'],
            nom: 'Kit carrosserie / Body kit',
            objectif: 'Look sportif',
            benefices: [
                'Esthétique personnalisée',
                'Potentiel aérodynamique (si bien conçu)'
            ],
            risques: [
                'Qualité très variable',
                'Ajustement souvent approximatif',
                'Masque potentiellement des dégâts'
            ],
            impactLegal: {
                niveau: 'conditionnel',
                description: 'Doit être homologué et ne pas créer de danger pour piétons',
                risquesCT: 'Contrôle des éléments saillants'
            },
            impactRevente: {
                niveau: 'negatif',
                description: 'Réduit le bassin d\'acheteurs',
                facteur: 0.88
            },
            impactAssurance: 'À déclarer',
            verdict: 'surveiller',
            scoreImpact: { mecanique: -2, legalite: -10, revente: -10 }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // MODIFICATIONS ÉLECTRONIQUE
    // ═══════════════════════════════════════════════════════════════
    electronique: {
        boitier_additionnel: {
            keywords: ['boitier additionnel', 'piggyback', 'powerbox', 'tuning box', 'dtuk', 'racechip'],
            nom: 'Boîtier additionnel',
            objectif: 'Gain de puissance (présenté comme réversible)',
            benefices: [
                'Installation présentée comme réversible',
                'Gain de puissance (10-25%)',
                'ECU d\'origine non flashé'
            ],
            risques: [
                'MÊMES CONTRAINTES MÉCANIQUES qu\'une reprogrammation',
                'Usure accélérée embrayage, turbo, boîte',
                'Qualité très variable selon marque',
                'Codes défaut fréquents',
                'Souvent retiré avant vente = historique caché'
            ],
            impactLegal: {
                niveau: 'non_conforme',
                description: 'Légalement équivalent à une reprog : modification de puissance non déclarée',
                risquesCT: 'Non détecté mais véhicule non conforme'
            },
            impactRevente: {
                niveau: 'negatif',
                description: 'Même impact qu\'une reprog sur la mécanique',
                facteur: 0.88
            },
            impactAssurance: 'OBLIGATOIREMENT déclaré = surprime ou refus. Non déclaré = nullité contrat.',
            verdict: 'risque',
            alerteMecanicien: 'Un boîtier additionnel sollicite autant la mécanique qu\'une reprog. Vérifier embrayage/turbo.',
            scoreImpact: { mecanique: -22, legalite: -30, revente: -12 }
        },

        suppression_fap: {
            keywords: ['suppression fap', 'fap off', 'egr off', 'dpf delete', 'fap supprimé', 'sans fap'],
            nom: 'Suppression FAP/EGR',
            objectif: 'Fiabilité perçue et performances',
            benefices: [
                'Élimination des problèmes liés au FAP',
                'Potentiel gain de puissance'
            ],
            risques: [
                'Pollution massive',
                'Modification irréversible de l\'ECU'
            ],
            impactLegal: {
                niveau: 'illegal',
                description: 'STRICTEMENT INTERDIT. Infraction pénale. Amende jusqu\'à 7500€.',
                risquesCT: 'Refus systématique (test opacité)'
            },
            impactRevente: {
                niveau: 'tres_negatif',
                description: 'Véhicule invendable légalement',
                facteur: 0.50
            },
            impactAssurance: 'Nullité du contrat',
            verdict: 'risque',
            scoreImpact: { mecanique: -5, legalite: -50, revente: -40 }
        },

        suppression_assistance: {
            keywords: ['esp off', 'suppression esp', 'désactivation abs', 'kill switch', 'anti-lag'],
            nom: 'Suppression/modification assistances',
            objectif: 'Conduite sportive pure',
            benefices: [
                'Contrôle total du véhicule',
                'Usage circuit'
            ],
            risques: [
                'Sécurité gravement compromise',
                'Dangereux sur route ouverte'
            ],
            impactLegal: {
                niveau: 'illegal',
                description: 'Interdit de supprimer définitivement les aides à la conduite',
                risquesCT: 'Refus si détecté'
            },
            impactRevente: {
                niveau: 'tres_negatif',
                description: 'Véhicule difficile à vendre',
                facteur: 0.65
            },
            impactAssurance: 'Nullité probable du contrat',
            verdict: 'risque',
            scoreImpact: { mecanique: 0, legalite: -45, revente: -30 }
        },

        sono: {
            keywords: ['sono', 'subwoofer', 'ampli', 'installation sono', 'car audio', 'système audio'],
            nom: 'Installation sono aftermarket',
            objectif: 'Qualité audio améliorée',
            benefices: [
                'Qualité sonore supérieure',
                'Personnalisation'
            ],
            risques: [
                'Ajout de poids',
                'Risque court-circuit si mal installé',
                'Sollicitation batterie/alternateur'
            ],
            impactLegal: {
                niveau: 'tolere',
                description: 'Aucun problème légal',
                risquesCT: 'Aucun risque'
            },
            impactRevente: {
                niveau: 'neutre',
                description: 'Dépend de l\'installation',
                facteur: 0.98
            },
            impactAssurance: 'À déclarer si valeur importante',
            verdict: 'sain',
            scoreImpact: { mecanique: -2, legalite: 0, revente: -2 }
        }
    }
};

// Export pour utilisation dans les autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MODIFICATIONS_DATABASE };
}
