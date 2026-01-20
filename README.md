# 🚗 AutoAnalyseur - Analyseur d'annonces automobiles

Outil 100% local pour analyser les annonces de voitures d'occasion. Évalue les risques, détecte les modifications, et prédit la revente.

## ✨ Fonctionnalités

### 📊 Analyse complète
- **Score de confiance** (0-100) avec sous-scores : mécanique, légalité, revente
- **Détection automatique** des modifications (reprog, échappement, suspension...)
- **Alertes** sur les combinaisons dangereuses (reprog + décata, etc.)
- **Analyse du prix** par rapport au marché

### 💰 Prédiction de revente
- Estimation du prix actuel basée sur le marché français
- **Prédiction à 3 ans** avec calcul de la décote
- Identification des **véhicules de collection** qui prennent de la valeur
- Perte annuelle estimée en euros

### �️ Base de données auto-apprenante
- **20+ marques** et **100+ modèles** pré-enregistrés
- Chaque annonce analysée est **sauvegardée automatiquement**
- La base s'enrichit avec votre utilisation

### 📸 Gestion des photos
- Glisser-déposer pour ajouter les photos
- Checklist visuelle pour l'inspection

---

## 🚀 Utilisation

1. Ouvrir `index.html` dans un navigateur
2. Coller le texte de l'annonce
3. Renseigner : marque, modèle, année, km, prix
4. (Optionnel) Ajouter les photos
5. Cliquer "Analyser"

---

## 📦 Marques et modèles supportés

### 🇩🇪 Allemandes
| Marque | Modèles |
|--------|---------|
| **Volkswagen** | Golf (7, 8), Polo, Scirocco |
| **BMW** | Série 1 (F20), Série 3 (E90, F30), Série 5, M2 |
| **Audi** | A3, A4, TT, R8 |
| **Mercedes** | Classe A, Classe C, Classe E |
| **Porsche** | 911 (991, 992), Cayman, Boxster |

### 🇯🇵 Japonaises (JDM)
| Marque | Modèles | Collection |
|--------|---------|------------|
| **Toyota** | Supra A80 📈, Supra A90, GT86, GR86, GR Yaris, Celica, MR2 | ✅ |
| **Honda** | Civic Type R (FK2/FK8/FL5), S2000 📈, NSX 📈, Integra DC2, Prelude | ✅ |
| **Nissan** | 350Z, 370Z, GT-R R35, Skyline R32/R33/R34 📈, Silvia S15, 200SX | ✅ |
| **Mazda** | MX-5 (NA/NB/NC/ND), RX-7 FD 📈, RX-8, Mazda 3 | ✅ |
| **Subaru** | Impreza WRX (GC8, GDB), WRX VA, BRZ | ✅ |
| **Mitsubishi** | Lancer Evo 9/10 📈, 3000GT, Eclipse | ✅ |

📈 = Véhicule qui **prend de la valeur** (décote négative)

### 🇫🇷 Françaises
| Marque | Modèles |
|--------|---------|
| **Peugeot** | 208, 308 (2, 3), 508 |
| **Renault** | Clio (4, 5), Megane RS |
| **Citroën** | C3, C4 |

### 🌍 Autres
| Marque | Modèles |
|--------|---------|
| **Ford** | Fiesta ST, Focus RS/ST, Mustang |
| **Hyundai** | i30 N, i20 N |
| **Kia** | Stinger |
| **Alfa Romeo** | Giulia QV, 4C |
| **Seat/Cupra** | Leon Cupra, Formentor |

---

## 🔧 Modifications détectées

### ❌ Classées "risque"
- Reprogrammation (Stage 1/2/3)
- Boîtier additionnel
- Décatalyseur / Suppression FAP
- Embrayage renforcé (indice de reprog)

### ⚠️ Classées "surveiller"
- Échappement sport
- Suspension abaissée
- Intercooler (indice de reprog cachée)
- Admission directe
- Dump valve

### ✅ Classées "sain"
- Jantes aftermarket
- Vitres teintées
- Covering

---

## 💾 Commandes console

```javascript
// Voir les statistiques de votre base locale
UserAdsDatabase.getStats()

// Exporter les annonces en JSON
UserAdsDatabase.export()

// Importer une base
UserAdsDatabase.import('{"annonces": [...]}')

// Vider la base
UserAdsDatabase.clear()

// Rechercher des annonces similaires
UserAdsDatabase.findSimilar('bmw', 'm3', 2018)

// Liste des marques disponibles
MarketPriceDatabase.getMarques()

// Liste des modèles d'une marque
MarketPriceDatabase.getModeles('honda')
```

---

## ⚠️ Limitations

- **Analyse indicative uniquement** - Ne remplace pas une inspection physique
- Pas de connexion aux APIs Leboncoin (interdit par leurs CGU)
- Prix basés sur moyennes 2024, ajuster si nécessaire
- Les photos ne sont pas analysées automatiquement (checklist manuelle)

---

## 📁 Structure du projet

```
Analyse leboncoin/
├── index.html              # Interface principale
├── css/style.css           # Styles
└── js/
    ├── app.js              # Logique principale
    ├── data/
    │   ├── marketPrices.js # Base de prix + auto-save
    │   ├── modifications.js # Base des modifications
    │   ├── rules.js        # Règles d'analyse
    │   └── vehicleDatabase.js
    └── modules/
        ├── generalAnalysis.js
        ├── modificationAnalysis.js
        ├── photoAnalysis.js
        ├── reportGenerator.js
        └── scoringEngine.js
```

---

## 🔒 Confidentialité

- **100% local** - Aucune donnée envoyée sur internet
- Les annonces sont stockées dans le localStorage du navigateur
- Vous pouvez exporter/supprimer vos données à tout moment

---

## ⚖️ Avertissement

Cet outil fournit des **estimations indicatives** basées sur des règles générales. Il ne remplace en aucun cas :
- L'expertise d'un mécanicien professionnel
- Un contrôle technique officiel
- L'avis d'un expert automobile

**Toujours faire vérifier un véhicule avant achat.**
