/**
 * Cas de test pour l'analyseur d'annonces
 * Annonces fictives pour valider le bon fonctionnement
 */

const TEST_CASES = [
    {
        id: 1,
        nom: 'Véhicule sain - Stock complet',
        description: 'Annonce classique d\'un véhicule non modifié',
        attendu: { scoreMin: 75, modificationsDetectees: 0 },
        donnees: {
            marque: 'Toyota',
            modele: 'Yaris',
            annee: 2020,
            kilometrage: 45000,
            prix: 14000,
            prixEstime: 14500,
            description: `Toyota Yaris Hybrid 116h Dynamic
                Première main, véhicule suivi chez Toyota.
                Révisions à jour, carnet d'entretien complet.
                Contrôle technique OK sans observation.
                4 pneus neufs, aucun frais à prévoir.
                Factures disponibles sur demande.`
        }
    },
    {
        id: 2,
        nom: 'Véhicule légèrement modifié',
        description: 'Modifications légères et tolérées',
        attendu: { scoreMin: 60, scoreMax: 80, modificationsDetectees: 2 },
        donnees: {
            marque: 'Peugeot',
            modele: '308',
            annee: 2018,
            kilometrage: 78000,
            prix: 12000,
            prixEstime: 13000,
            description: `Peugeot 308 GT Line 130ch
                Très bon état, entretien suivi.
                Équipée de jantes OZ Racing 18 pouces.
                Vitres teintées à l'arrière.
                CT OK. Carnet d'entretien disponible.`
        }
    },
    {
        id: 3,
        nom: 'Véhicule préparé - Stage 1',
        description: 'Reprogrammation moteur déclarée',
        attendu: { scoreMax: 55, modificationsDetectees: 3, alertesMin: 1 },
        donnees: {
            marque: 'Volkswagen',
            modele: 'Golf',
            annee: 2017,
            kilometrage: 92000,
            prix: 15500,
            prixEstime: 18000,
            description: `Golf 7 GTD 184ch DSG
                Préparation Stage 1 - environ 210ch.
                Ligne Milltek catback homologuée.
                Admission BMC.
                Embrayage remplacé à 75000km.
                Entretien suivi hors réseau VW.
                Véhicule sain mais préparé.`
        }
    },
    {
        id: 4,
        nom: 'Véhicule à risque - Combinaison dangereuse',
        description: 'Reprog + Upgrade turbo = combinaison critique',
        attendu: { scoreMax: 40, combinaisonsDangereuses: 1 },
        donnees: {
            marque: 'Audi',
            modele: 'S3',
            annee: 2016,
            kilometrage: 110000,
            prix: 22000,
            prixEstime: 28000,
            description: `Audi S3 8V 300ch origine, maintenant 400ch+
                Reprogrammation complète Stage 2+
                Turbo hybride monté
                Ligne complète inox décata
                Intercooler renforcé
                Embrayage renforcé Sachs
                Véhicule circuit occasionnellement.
                Pas sérieux s'abstenir.`
        }
    },
    {
        id: 5,
        nom: 'Annonce suspecte - Red flags',
        description: 'Nombreux signaux d\'alerte',
        attendu: { scoreMax: 45, alertesMin: 3 },
        donnees: {
            marque: 'BMW',
            modele: 'Série 3',
            annee: 2014,
            kilometrage: 38000,
            prix: 11000,
            prixEstime: 20000,
            description: `URGENT BMW 320d F30 parfait état
                Vente rapide cause départ étranger
                38000km seulement !!!
                Jamais eu de problème
                Aucun frais à prévoir
                Premier qui vient l'emmène
                Cette semaine uniquement
                Prix non négociable`
        }
    },
    {
        id: 6,
        nom: 'Modifications illégales',
        description: 'Suppression FAP détectée',
        attendu: { scoreMax: 30, alertesLegales: true },
        donnees: {
            marque: 'Renault',
            modele: 'Megane',
            annee: 2015,
            kilometrage: 145000,
            prix: 6500,
            prixEstime: 9000,
            description: `Megane 3 1.5 dCi 110ch
                Moteur nickel, roule parfaitement.
                FAP supprimé pour meilleure fiabilité.
                EGR off, plus de problème d'encrassement.
                Consommation réduite.
                CT à refaire (échec test opacité).`
        }
    }
];

/**
 * Exécute tous les tests et affiche les résultats
 */
function runTests() {
    console.log('═══════════════════════════════════════════════════');
    console.log('   TESTS DE L\'ANALYSEUR D\'ANNONCES AUTOMOBILES');
    console.log('═══════════════════════════════════════════════════\n');

    let passed = 0;
    let failed = 0;

    for (const test of TEST_CASES) {
        console.log(`\n▶ Test ${test.id}: ${test.nom}`);
        console.log(`  ${test.description}`);

        try {
            // Exécuter l'analyse
            const analyseGenerale = GeneralAnalysis.analyser(test.donnees);
            const analyseModifications = ModificationAnalysis.analyser(test.donnees.description);
            const scores = ScoringEngine.calculerScoreFinal(analyseGenerale, analyseModifications);

            // Vérifications
            const results = [];

            // Score minimum
            if (test.attendu.scoreMin !== undefined) {
                const ok = scores.global.score >= test.attendu.scoreMin;
                results.push({
                    test: `Score >= ${test.attendu.scoreMin}`,
                    ok,
                    valeur: scores.global.score
                });
            }

            // Score maximum
            if (test.attendu.scoreMax !== undefined) {
                const ok = scores.global.score <= test.attendu.scoreMax;
                results.push({
                    test: `Score <= ${test.attendu.scoreMax}`,
                    ok,
                    valeur: scores.global.score
                });
            }

            // Nombre de modifications
            if (test.attendu.modificationsDetectees !== undefined) {
                const nbMods = analyseModifications.nombreModifications;
                const ok = nbMods >= test.attendu.modificationsDetectees;
                results.push({
                    test: `Modifications >= ${test.attendu.modificationsDetectees}`,
                    ok,
                    valeur: nbMods
                });
            }

            // Combinaisons dangereuses
            if (test.attendu.combinaisonsDangereuses !== undefined) {
                const nbCombos = analyseModifications.combinaisonsDangereuses?.length || 0;
                const ok = nbCombos >= test.attendu.combinaisonsDangereuses;
                results.push({
                    test: `Combinaisons dangereuses >= ${test.attendu.combinaisonsDangereuses}`,
                    ok,
                    valeur: nbCombos
                });
            }

            // Alertes
            if (test.attendu.alertesMin !== undefined) {
                const nbAlertes = analyseGenerale.alertes?.length || 0;
                const ok = nbAlertes >= test.attendu.alertesMin;
                results.push({
                    test: `Alertes >= ${test.attendu.alertesMin}`,
                    ok,
                    valeur: nbAlertes
                });
            }

            // Afficher les résultats
            let allPassed = true;
            for (const r of results) {
                const icon = r.ok ? '✅' : '❌';
                console.log(`    ${icon} ${r.test} (obtenu: ${r.valeur})`);
                if (!r.ok) allPassed = false;
            }

            if (allPassed) {
                passed++;
                console.log(`  ✅ TEST RÉUSSI`);
            } else {
                failed++;
                console.log(`  ❌ TEST ÉCHOUÉ`);
            }

        } catch (error) {
            failed++;
            console.log(`  ❌ ERREUR: ${error.message}`);
        }
    }

    console.log('\n═══════════════════════════════════════════════════');
    console.log(`   RÉSULTATS: ${passed} réussis, ${failed} échoués`);
    console.log('═══════════════════════════════════════════════════\n');

    return { passed, failed, total: TEST_CASES.length };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TEST_CASES, runTests };
}
