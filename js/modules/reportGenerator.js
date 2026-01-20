/**
 * Générateur de rapports
 * Produit un rapport HTML complet et lisible
 */

const ReportGenerator = {
    genererRapport: function (resultats) {
        const { analyseGenerale, analyseModifications, scores, checklistPhotos, predictionRevente } = resultats;

        return `
            <div class="rapport">
                ${this.genererResume(scores)}
                ${this.genererScores(scores)}
                ${this.genererAlertes(analyseGenerale, analyseModifications)}
                ${this.genererAnalyseGenerale(analyseGenerale)}
                ${this.genererPredictionRevente(predictionRevente)}
                ${this.genererAnalyseModifications(analyseModifications)}
                ${this.genererRecommandations(analyseModifications, scores)}
                ${this.genererAvertissementExpertise(scores)}
            </div>
        `;
    },

    genererResume: function (scores) {
        const { global } = scores;
        return `
            <section class="resume">
                <h2>Résumé de l'analyse</h2>
                <div class="score-principal" style="border-color: ${global.classification.couleur}">
                    <span class="score-icone">${global.classification.icone}</span>
                    <span class="score-valeur" style="color: ${global.classification.couleur}">${global.score}/100</span>
                    <span class="score-label">${global.classification.label}</span>
                </div>
                <p class="score-description">${global.description}</p>
            </section>
        `;
    },

    genererScores: function (scores) {
        const { details } = scores;
        return `
            <section class="scores-details">
                <h3>Détail des scores</h3>
                <div class="scores-grid">
                    ${this.genererJauge('Mécanique', details.mecanique)}
                    ${this.genererJauge('Légalité', details.legalite)}
                    ${this.genererJauge('Revente', details.revente)}
                </div>
            </section>
        `;
    },

    genererJauge: function (label, data) {
        const couleur = data.score >= 70 ? '#22c55e' : data.score >= 50 ? '#f59e0b' : '#ef4444';
        return `
            <div class="jauge-container">
                <div class="jauge-label">${label} <small>(${data.poids})</small></div>
                <div class="jauge-bar">
                    <div class="jauge-fill" style="width: ${data.score}%; background-color: ${couleur}"></div>
                </div>
                <div class="jauge-valeur">${data.score}/100</div>
                <div class="jauge-desc">${data.description}</div>
            </div>
        `;
    },

    genererAlertes: function (analyseGenerale, analyseModifications) {
        const alertes = [];

        if (analyseGenerale.alertes) {
            alertes.push(...analyseGenerale.alertes.filter(a => a.type === 'eleve' || a.type === 'critique'));
        }

        if (analyseModifications.combinaisonsDangereuses) {
            for (const combo of analyseModifications.combinaisonsDangereuses) {
                alertes.push({ type: 'critique', message: combo.message, risques: combo.risques });
            }
        }

        if (alertes.length === 0) return '';

        return `
            <section class="alertes">
                <h3>⚠️ Alertes importantes</h3>
                <ul class="liste-alertes">
                    ${alertes.map(a => `
                        <li class="alerte alerte-${a.type}">
                            <strong>${a.message}</strong>
                            ${a.risques ? `<ul>${a.risques.map(r => `<li>${r}</li>`).join('')}</ul>` : ''}
                        </li>
                    `).join('')}
                </ul>
            </section>
        `;
    },

    genererAnalyseGenerale: function (analyseGenerale) {
        return `
            <section class="analyse-generale">
                <h3>📋 Analyse de l'annonce</h3>
                <div class="analyse-items">
                    ${this.genererItemAnalyse('Prix', analyseGenerale.prix)}
                    ${this.genererItemAnalyse('Kilométrage', analyseGenerale.kilometrage)}
                    ${this.genererItemAnalyse('Description', analyseGenerale.description)}
                    ${this.genererItemAnalyse('Urgence', analyseGenerale.urgence)}
                    ${analyseGenerale.modele?.analysable ? this.genererItemModele(analyseGenerale.modele) : ''}
                </div>
            </section>
        `;
    },

    genererItemAnalyse: function (titre, data) {
        if (!data) return '';
        const icone = data.score > 0 ? '✅' : data.score < -10 ? '❌' : data.score < 0 ? '⚠️' : 'ℹ️';
        return `
            <div class="analyse-item">
                <h4>${icone} ${titre}</h4>
                <p>${data.message || 'Non analysé'}</p>
                ${data.hypothese ? `<p class="hypothese"><em>Hypothèse : ${data.hypothese}</em></p>` : ''}
            </div>
        `;
    },

    genererItemModele: function (modele) {
        return `
            <div class="analyse-item">
                <h4>🚗 ${modele.marque} ${modele.modele}</h4>
                <p>Fiabilité marque : ${modele.fiabiliteMarque}</p>
                ${modele.pointsVigilance?.length ? `<p><strong>Points de vigilance :</strong> ${modele.pointsVigilance.join(', ')}</p>` : ''}
                ${modele.alerteMotorisation ? `<p class="alerte">⚠️ ${modele.alerteMotorisation.message}</p>` : ''}
            </div>
        `;
    },

    genererAnalyseModifications: function (analyseModifications) {
        if (analyseModifications.vehiculeOrigine) {
            return `
                <section class="modifications">
                    <h3>🔧 Modifications</h3>
                    <div class="vehicule-origine">
                        <span class="icone">✅</span>
                        <p>Aucune modification détectée. Véhicule probablement d'origine.</p>
                    </div>
                </section>
            `;
        }

        return `
            <section class="modifications">
                <h3>🔧 Modifications détectées (${analyseModifications.nombreModifications})</h3>
                <div class="modifications-liste">
                    ${analyseModifications.modifications.map(mod => this.genererCardModification(mod)).join('')}
                </div>
            </section>
        `;
    },

    genererCardModification: function (mod) {
        return `
            <div class="modification-card verdict-${mod.verdict}">
                <div class="modification-header">
                    <span class="verdict-icon">${mod.verdictIcon}</span>
                    <h4>${mod.nom}</h4>
                </div>
                <div class="modification-body">
                    <p><strong>Objectif :</strong> ${mod.objectif}</p>
                    <p><strong>Avantages :</strong> ${mod.benefices?.slice(0, 2).join(', ') || 'N/A'}</p>
                    <p><strong>Risques :</strong> ${mod.risques?.slice(0, 2).join(', ') || 'N/A'}</p>
                    <p><strong>Légalité :</strong> ${mod.impactLegal?.description || 'À vérifier'}</p>
                    <p><strong>Revente :</strong> ${mod.impactRevente?.description || 'Impact non évalué'}</p>
                </div>
                <div class="modification-footer">
                    <p class="explication">${mod.explication}</p>
                </div>
            </div>
        `;
    },

    genererRecommandations: function (analyseModifications, scores) {
        const reco = analyseModifications.recommandations || [];
        if (reco.length === 0) return '';

        return `
            <section class="recommandations">
                <h3>💡 Recommandations</h3>
                <ul>
                    ${reco.map(r => `<li class="reco reco-${r.type}">${r.message}</li>`).join('')}
                </ul>
            </section>
        `;
    },

    genererAvertissementExpertise: function (scores) {
        if (!scores.avertissement) return '';

        return `
            <section class="avertissement-expertise">
                <h3>⚠️ ${scores.avertissement.recommandation}</h3>
                <p>${scores.avertissement.message}</p>
                <p><strong>Raisons :</strong></p>
                <ul>${scores.avertissement.raisons.map(r => `<li>${r}</li>`).join('')}</ul>
                <p><strong>Points à vérifier :</strong></p>
                <ul>${scores.avertissement.pointsAVerifier.map(p => `<li>${p}</li>`).join('')}</ul>
            </section>
        `;
    },

    genererPredictionRevente: function (prediction) {
        if (!prediction || !prediction.analysable) {
            return '';
        }

        const verdictIcons = {
            'apprecie': '📈',
            'tres_stable': '✅',
            'stable': '👍',
            'normal': '➡️',
            'forte_decote': '⚠️'
        };

        const verdictColors = {
            'apprecie': '#22c55e',
            'tres_stable': '#22c55e',
            'stable': '#84cc16',
            'normal': '#f59e0b',
            'forte_decote': '#ef4444'
        };

        const icon = verdictIcons[prediction.verdict] || '💰';
        const color = verdictColors[prediction.verdict] || '#6366f1';

        return `
            <section class="revente-prediction">
                <h3>💰 Prédiction de revente (${prediction.anneesRevente} ans)</h3>
                <div class="revente-grid">
                    <div class="revente-card">
                        <span class="revente-label">Prix actuel estimé</span>
                        <span class="revente-valeur">${prediction.prixActuelEstime?.toLocaleString() || '?'}€</span>
                    </div>
                    <div class="revente-card">
                        <span class="revente-icon">${icon}</span>
                    </div>
                    <div class="revente-card">
                        <span class="revente-label">Prix dans ${prediction.anneesRevente} ans</span>
                        <span class="revente-valeur" style="color: ${color}">${prediction.prixRevente?.toLocaleString() || '?'}€</span>
                    </div>
                </div>
                <div class="revente-details">
                    <p><strong>Décote annuelle :</strong> ${prediction.decoteAnnuelle}</p>
                    <p><strong>Perte estimée :</strong> ${prediction.perteTotale?.toLocaleString() || 0}€ (${prediction.pertePourcent}%)</p>
                    <p><strong>Soit par an :</strong> ~${prediction.perteAnnuelle?.toLocaleString() || 0}€/an</p>
                    ${prediction.isCollection ? '<p class="collection-badge">⭐ Véhicule de collection potentiel</p>' : ''}
                </div>
                <div class="revente-conseil" style="border-left-color: ${color}">
                    ${prediction.conseil}
                </div>
            </section>
        `;
    }
};

if (typeof module !== 'undefined' && module.exports) { module.exports = { ReportGenerator }; }
