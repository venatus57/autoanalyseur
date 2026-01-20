/**
 * Base de données des prix du marché automobile - VERSION ÉTENDUE
 * Inclut : Marques européennes, japonaises (JDM), américaines
 * + Système d'apprentissage automatique des annonces analysées
 * 
 * Décote typique par segment :
 * - Citadines : 12-15% par an
 * - Compactes : 10-12% par an
 * - SUV : 9-11% par an
 * - Premium : 8-10% par an
 * - Sportives communes : 8-10% par an
 * - JDM cultes : 0-5% (certaines prennent de la valeur)
 */

const MARKET_PRICES = {
    // ═══════════════════════════════════════════════════════════════
    // VOLKSWAGEN
    // ═══════════════════════════════════════════════════════════════
    volkswagen: {
        golf: {
            "7": {
                annees: [2012, 2019], kmMoyenAn: 15000, motorisations: {
                    "1.4 TSI 125": { neuf: 25000, decoteAn: 0.11 },
                    "2.0 TSI GTI 230": { neuf: 38000, decoteAn: 0.09 },
                    "2.0 TSI GTI 245": { neuf: 42000, decoteAn: 0.08 },
                    "2.0 TSI R 300": { neuf: 45000, decoteAn: 0.07, collection: true },
                    "2.0 TDI 150": { neuf: 30000, decoteAn: 0.10 },
                    "2.0 TDI GTD 184": { neuf: 38000, decoteAn: 0.09 }
                }
            },
            "8": {
                annees: [2019, 2025], kmMoyenAn: 12000, motorisations: {
                    "1.5 TSI 130": { neuf: 33000, decoteAn: 0.11 },
                    "2.0 TSI GTI 245": { neuf: 48000, decoteAn: 0.09 },
                    "2.0 TSI R 320": { neuf: 55000, decoteAn: 0.07 },
                    "2.0 TDI 150": { neuf: 38000, decoteAn: 0.10 }
                }
            }
        },
        polo: {
            "6": {
                annees: [2017, 2025], kmMoyenAn: 12000, motorisations: {
                    "1.0 TSI 95": { neuf: 20000, decoteAn: 0.13 },
                    "2.0 TSI GTI 200": { neuf: 32000, decoteAn: 0.10 }
                }
            }
        },
        scirocco: {
            "3": {
                annees: [2008, 2017], kmMoyenAn: 12000, motorisations: {
                    "1.4 TSI 160": { neuf: 28000, decoteAn: 0.10 },
                    "2.0 TSI 200": { neuf: 35000, decoteAn: 0.09 },
                    "2.0 TSI R 265": { neuf: 42000, decoteAn: 0.07, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // BMW
    // ═══════════════════════════════════════════════════════════════
    bmw: {
        "serie 1": {
            "f20": {
                annees: [2011, 2019], kmMoyenAn: 15000, motorisations: {
                    "118i 136": { neuf: 32000, decoteAn: 0.11 },
                    "M135i 326": { neuf: 48000, decoteAn: 0.08 },
                    "M140i 340": { neuf: 52000, decoteAn: 0.07, collection: true },
                    "118d 150": { neuf: 34000, decoteAn: 0.10 }
                }
            }
        },
        "serie 3": {
            "e90": {
                annees: [2005, 2012], kmMoyenAn: 18000, motorisations: {
                    "320i 170": { neuf: 35000, decoteAn: 0.10 },
                    "325i 218": { neuf: 42000, decoteAn: 0.09 },
                    "335i 306": { neuf: 52000, decoteAn: 0.08 },
                    "M3 420": { neuf: 75000, decoteAn: 0.05, collection: true },
                    "320d 177": { neuf: 38000, decoteAn: 0.10 }
                }
            },
            "f30": {
                annees: [2012, 2019], kmMoyenAn: 18000, motorisations: {
                    "320i 184": { neuf: 40000, decoteAn: 0.10 },
                    "340i 326": { neuf: 55000, decoteAn: 0.08 },
                    "M3 431": { neuf: 80000, decoteAn: 0.06, collection: true },
                    "320d 190": { neuf: 42000, decoteAn: 0.10 }
                }
            }
        },
        "serie 5": {
            "f10": {
                annees: [2010, 2017], kmMoyenAn: 25000, motorisations: {
                    "520i 184": { neuf: 48000, decoteAn: 0.11 },
                    "535i 306": { neuf: 62000, decoteAn: 0.10 },
                    "M5 560": { neuf: 110000, decoteAn: 0.08, collection: true },
                    "520d 184": { neuf: 50000, decoteAn: 0.10 }
                }
            }
        },
        "m2": {
            "f87": {
                annees: [2016, 2021], kmMoyenAn: 8000, motorisations: {
                    "M2 370": { neuf: 62000, decoteAn: 0.06, collection: true },
                    "M2 Competition 410": { neuf: 68000, decoteAn: 0.05, collection: true },
                    "M2 CS 450": { neuf: 95000, decoteAn: 0.03, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // AUDI
    // ═══════════════════════════════════════════════════════════════
    audi: {
        a3: {
            "8v": {
                annees: [2012, 2020], kmMoyenAn: 15000, motorisations: {
                    "1.4 TFSI 150": { neuf: 32000, decoteAn: 0.11 },
                    "S3 310": { neuf: 48000, decoteAn: 0.08 },
                    "RS3 400": { neuf: 62000, decoteAn: 0.06, collection: true },
                    "2.0 TDI 150": { neuf: 35000, decoteAn: 0.10 }
                }
            }
        },
        a4: {
            "b9": {
                annees: [2015, 2025], kmMoyenAn: 20000, motorisations: {
                    "2.0 TFSI 190": { neuf: 45000, decoteAn: 0.10 },
                    "S4 354": { neuf: 68000, decoteAn: 0.08 },
                    "RS4 450": { neuf: 85000, decoteAn: 0.06, collection: true },
                    "2.0 TDI 190": { neuf: 48000, decoteAn: 0.10 }
                }
            }
        },
        tt: {
            "8s": {
                annees: [2014, 2023], kmMoyenAn: 10000, motorisations: {
                    "2.0 TFSI 230": { neuf: 45000, decoteAn: 0.09 },
                    "TTS 310": { neuf: 55000, decoteAn: 0.08 },
                    "TTRS 400": { neuf: 72000, decoteAn: 0.06, collection: true }
                }
            }
        },
        r8: {
            "1": {
                annees: [2007, 2015], kmMoyenAn: 5000, motorisations: {
                    "4.2 V8 420": { neuf: 130000, decoteAn: 0.05, collection: true },
                    "5.2 V10 525": { neuf: 170000, decoteAn: 0.04, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // MERCEDES
    // ═══════════════════════════════════════════════════════════════
    mercedes: {
        "classe a": {
            "w177": {
                annees: [2018, 2025], kmMoyenAn: 15000, motorisations: {
                    "A200 163": { neuf: 40000, decoteAn: 0.11 },
                    "A35 AMG 306": { neuf: 55000, decoteAn: 0.09 },
                    "A45 AMG 421": { neuf: 68000, decoteAn: 0.07, collection: true }
                }
            }
        },
        "classe c": {
            "w205": {
                annees: [2014, 2021], kmMoyenAn: 20000, motorisations: {
                    "C200 184": { neuf: 45000, decoteAn: 0.10 },
                    "C43 AMG 390": { neuf: 70000, decoteAn: 0.08 },
                    "C63 AMG 476": { neuf: 90000, decoteAn: 0.06, collection: true }
                }
            }
        },
        "classe e": {
            "w213": {
                annees: [2016, 2023], kmMoyenAn: 25000, motorisations: {
                    "E200 184": { neuf: 55000, decoteAn: 0.10 },
                    "E53 AMG 435": { neuf: 85000, decoteAn: 0.08 },
                    "E63 AMG 612": { neuf: 120000, decoteAn: 0.06, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // PEUGEOT
    // ═══════════════════════════════════════════════════════════════
    peugeot: {
        "208": {
            "2": {
                annees: [2019, 2025], kmMoyenAn: 12000, motorisations: {
                    "1.2 PureTech 100": { neuf: 22000, decoteAn: 0.13 },
                    "1.2 PureTech 130": { neuf: 26000, decoteAn: 0.12 }
                }
            }
        },
        "308": {
            "2": {
                annees: [2013, 2021], kmMoyenAn: 15000, motorisations: {
                    "1.2 PureTech 130": { neuf: 27000, decoteAn: 0.11 },
                    "1.6 THP GTi 270": { neuf: 40000, decoteAn: 0.09 }
                }
            },
            "3": {
                annees: [2021, 2025], kmMoyenAn: 12000, motorisations: {
                    "1.2 PureTech 130": { neuf: 32000, decoteAn: 0.11 },
                    "1.6 Hybrid 225 PSE": { neuf: 52000, decoteAn: 0.09 }
                }
            }
        },
        "508": {
            "2": {
                annees: [2018, 2025], kmMoyenAn: 20000, motorisations: {
                    "1.6 PureTech 180": { neuf: 42000, decoteAn: 0.11 },
                    "1.6 Hybrid 360 PSE": { neuf: 65000, decoteAn: 0.09 }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // RENAULT
    // ═══════════════════════════════════════════════════════════════
    renault: {
        clio: {
            "4": {
                annees: [2012, 2019], kmMoyenAn: 12000, motorisations: {
                    "1.2 TCe 120": { neuf: 20000, decoteAn: 0.13 },
                    "1.6 RS 200": { neuf: 28000, decoteAn: 0.09 },
                    "1.6 RS 220 Trophy": { neuf: 32000, decoteAn: 0.07, collection: true }
                }
            },
            "5": {
                annees: [2019, 2025], kmMoyenAn: 12000, motorisations: {
                    "1.0 TCe 100": { neuf: 22000, decoteAn: 0.12 },
                    "1.3 TCe 130": { neuf: 26000, decoteAn: 0.11 }
                }
            }
        },
        megane: {
            "4": {
                annees: [2015, 2024], kmMoyenAn: 15000, motorisations: {
                    "1.3 TCe 140": { neuf: 29000, decoteAn: 0.11 },
                    "1.8 RS 280": { neuf: 42000, decoteAn: 0.08 },
                    "1.8 RS Trophy 300": { neuf: 48000, decoteAn: 0.06, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // TOYOTA (JDM + Standard)
    // ═══════════════════════════════════════════════════════════════
    toyota: {
        yaris: {
            "4": {
                annees: [2020, 2025], kmMoyenAn: 12000, motorisations: {
                    "1.5 Hybrid 116": { neuf: 24000, decoteAn: 0.10 },
                    "1.6 GR 261": { neuf: 42000, decoteAn: 0.05, collection: true }
                }
            }
        },
        gt86: {
            "1": {
                annees: [2012, 2021], kmMoyenAn: 8000, motorisations: {
                    "2.0 200": { neuf: 32000, decoteAn: 0.06, collection: true }
                }
            }
        },
        gr86: {
            "1": {
                annees: [2021, 2025], kmMoyenAn: 6000, motorisations: {
                    "2.4 234": { neuf: 35000, decoteAn: 0.05, collection: true }
                }
            }
        },
        supra: {
            "a80": {
                annees: [1993, 2002], kmMoyenAn: 3000, motorisations: {
                    "3.0 Twin Turbo 330": { neuf: 55000, decoteAn: -0.08, collection: true } // PREND DE LA VALEUR
                }
            },
            "a90": {
                annees: [2019, 2025], kmMoyenAn: 6000, motorisations: {
                    "2.0 258": { neuf: 52000, decoteAn: 0.07 },
                    "3.0 340": { neuf: 62000, decoteAn: 0.05, collection: true },
                    "3.0 GRMN 500": { neuf: 85000, decoteAn: 0.02, collection: true }
                }
            }
        },
        celica: {
            "t23": {
                annees: [1999, 2006], kmMoyenAn: 8000, motorisations: {
                    "1.8 143": { neuf: 25000, decoteAn: 0.08 },
                    "1.8 TS 192": { neuf: 30000, decoteAn: 0.06, collection: true }
                }
            }
        },
        mr2: {
            "w30": {
                annees: [1999, 2007], kmMoyenAn: 5000, motorisations: {
                    "1.8 140": { neuf: 28000, decoteAn: 0.04, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // HONDA (JDM)
    // ═══════════════════════════════════════════════════════════════
    honda: {
        civic: {
            "fk2": {
                annees: [2015, 2017], kmMoyenAn: 10000, motorisations: {
                    "2.0 Type R 310": { neuf: 42000, decoteAn: 0.04, collection: true }
                }
            },
            "fk8": {
                annees: [2017, 2022], kmMoyenAn: 10000, motorisations: {
                    "2.0 Type R 320": { neuf: 45000, decoteAn: 0.04, collection: true }
                }
            },
            "fl5": {
                annees: [2022, 2025], kmMoyenAn: 8000, motorisations: {
                    "2.0 Type R 329": { neuf: 52000, decoteAn: 0.03, collection: true }
                }
            },
            "10": {
                annees: [2017, 2022], kmMoyenAn: 12000, motorisations: {
                    "1.0 VTEC 126": { neuf: 25000, decoteAn: 0.11 },
                    "1.5 VTEC 182": { neuf: 30000, decoteAn: 0.10 }
                }
            }
        },
        s2000: {
            "ap1": {
                annees: [1999, 2009], kmMoyenAn: 5000, motorisations: {
                    "2.0 VTEC 240": { neuf: 38000, decoteAn: -0.05, collection: true } // PREND DE LA VALEUR
                }
            }
        },
        nsx: {
            "na1": {
                annees: [1990, 2005], kmMoyenAn: 3000, motorisations: {
                    "3.0 VTEC 274": { neuf: 85000, decoteAn: -0.10, collection: true }, // PREND DE LA VALEUR
                    "3.2 VTEC 290": { neuf: 95000, decoteAn: -0.10, collection: true }
                }
            }
        },
        integra: {
            "dc2": {
                annees: [1994, 2001], kmMoyenAn: 5000, motorisations: {
                    "1.8 Type R 190": { neuf: 28000, decoteAn: -0.03, collection: true } // PREND DE LA VALEUR
                }
            }
        },
        prelude: {
            "bb": {
                annees: [1996, 2001], kmMoyenAn: 6000, motorisations: {
                    "2.2 VTEC 185": { neuf: 30000, decoteAn: 0.02, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // NISSAN (JDM)
    // ═══════════════════════════════════════════════════════════════
    nissan: {
        "370z": {
            "z34": {
                annees: [2009, 2020], kmMoyenAn: 8000, motorisations: {
                    "3.7 V6 328": { neuf: 42000, decoteAn: 0.06, collection: true },
                    "3.7 V6 Nismo 344": { neuf: 55000, decoteAn: 0.04, collection: true }
                }
            }
        },
        "350z": {
            "z33": {
                annees: [2003, 2009], kmMoyenAn: 8000, motorisations: {
                    "3.5 V6 280": { neuf: 38000, decoteAn: 0.05, collection: true },
                    "3.5 V6 313": { neuf: 45000, decoteAn: 0.04, collection: true }
                }
            }
        },
        "gtr": {
            "r35": {
                annees: [2009, 2024], kmMoyenAn: 5000, motorisations: {
                    "3.8 V6 BiTurbo 485": { neuf: 95000, decoteAn: 0.05, collection: true },
                    "3.8 V6 Nismo 600": { neuf: 180000, decoteAn: 0.03, collection: true }
                }
            }
        },
        skyline: {
            "r32": {
                annees: [1989, 1994], kmMoyenAn: 2000, motorisations: {
                    "2.6 GTR 280": { neuf: 45000, decoteAn: -0.15, collection: true } // PREND FORTEMENT
                }
            },
            "r33": {
                annees: [1995, 1998], kmMoyenAn: 2000, motorisations: {
                    "2.6 GTR 280": { neuf: 50000, decoteAn: -0.12, collection: true }
                }
            },
            "r34": {
                annees: [1999, 2002], kmMoyenAn: 2000, motorisations: {
                    "2.6 GTR 280": { neuf: 55000, decoteAn: -0.20, collection: true } // TRÈS RECHERCHÉ
                }
            }
        },
        silvia: {
            "s15": {
                annees: [1999, 2002], kmMoyenAn: 5000, motorisations: {
                    "2.0 Turbo 250": { neuf: 32000, decoteAn: -0.10, collection: true }
                }
            }
        },
        "200sx": {
            "s14": {
                annees: [1994, 2000], kmMoyenAn: 6000, motorisations: {
                    "2.0 Turbo 200": { neuf: 28000, decoteAn: -0.05, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // MAZDA (JDM)
    // ═══════════════════════════════════════════════════════════════
    mazda: {
        mx5: {
            "na": {
                annees: [1989, 1998], kmMoyenAn: 5000, motorisations: {
                    "1.6 115": { neuf: 20000, decoteAn: -0.02, collection: true },
                    "1.8 131": { neuf: 22000, decoteAn: -0.03, collection: true }
                }
            },
            "nb": {
                annees: [1998, 2005], kmMoyenAn: 6000, motorisations: {
                    "1.6 110": { neuf: 22000, decoteAn: 0.02, collection: true },
                    "1.8 146": { neuf: 25000, decoteAn: 0.01, collection: true }
                }
            },
            "nc": {
                annees: [2005, 2015], kmMoyenAn: 8000, motorisations: {
                    "1.8 126": { neuf: 26000, decoteAn: 0.05 },
                    "2.0 160": { neuf: 30000, decoteAn: 0.04, collection: true }
                }
            },
            "nd": {
                annees: [2015, 2025], kmMoyenAn: 6000, motorisations: {
                    "1.5 132": { neuf: 30000, decoteAn: 0.06 },
                    "2.0 184": { neuf: 35000, decoteAn: 0.05, collection: true }
                }
            }
        },
        rx7: {
            "fd": {
                annees: [1992, 2002], kmMoyenAn: 3000, motorisations: {
                    "1.3 Biturbo 255": { neuf: 45000, decoteAn: -0.10, collection: true }
                }
            }
        },
        rx8: {
            "1": {
                annees: [2003, 2012], kmMoyenAn: 8000, motorisations: {
                    "1.3 Renesis 192": { neuf: 35000, decoteAn: 0.08 },
                    "1.3 Renesis 231": { neuf: 40000, decoteAn: 0.07 }
                }
            }
        },
        "3": {
            "4": {
                annees: [2019, 2025], kmMoyenAn: 12000, motorisations: {
                    "2.0 SkyActiv-G 122": { neuf: 26000, decoteAn: 0.10 },
                    "2.0 SkyActiv-X 180": { neuf: 32000, decoteAn: 0.09 }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // SUBARU (JDM)
    // ═══════════════════════════════════════════════════════════════
    subaru: {
        impreza: {
            "gc8": {
                annees: [1993, 2000], kmMoyenAn: 5000, motorisations: {
                    "2.0 Turbo WRX 218": { neuf: 32000, decoteAn: -0.02, collection: true },
                    "2.0 Turbo STI 280": { neuf: 42000, decoteAn: -0.05, collection: true }
                }
            },
            "gdb": {
                annees: [2000, 2007], kmMoyenAn: 8000, motorisations: {
                    "2.0 Turbo WRX 225": { neuf: 35000, decoteAn: 0.03, collection: true },
                    "2.0 Turbo STI 280": { neuf: 45000, decoteAn: 0.02, collection: true }
                }
            }
        },
        wrx: {
            "va": {
                annees: [2014, 2021], kmMoyenAn: 10000, motorisations: {
                    "2.0 Turbo WRX 268": { neuf: 42000, decoteAn: 0.06 },
                    "2.5 Turbo STI 300": { neuf: 52000, decoteAn: 0.04, collection: true }
                }
            }
        },
        brz: {
            "1": {
                annees: [2012, 2021], kmMoyenAn: 8000, motorisations: {
                    "2.0 200": { neuf: 32000, decoteAn: 0.06, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // MITSUBISHI (JDM)
    // ═══════════════════════════════════════════════════════════════
    mitsubishi: {
        "lancer evolution": {
            "9": {
                annees: [2005, 2007], kmMoyenAn: 5000, motorisations: {
                    "2.0 Turbo 280": { neuf: 45000, decoteAn: -0.03, collection: true }
                }
            },
            "10": {
                annees: [2007, 2016], kmMoyenAn: 6000, motorisations: {
                    "2.0 Turbo 295": { neuf: 50000, decoteAn: 0.02, collection: true },
                    "2.0 Turbo FQ400 409": { neuf: 65000, decoteAn: -0.02, collection: true }
                }
            }
        },
        "3000gt": {
            "1": {
                annees: [1990, 2000], kmMoyenAn: 4000, motorisations: {
                    "3.0 V6 BiTurbo 320": { neuf: 55000, decoteAn: -0.05, collection: true }
                }
            }
        },
        eclipse: {
            "2g": {
                annees: [1995, 1999], kmMoyenAn: 6000, motorisations: {
                    "2.0 Turbo GSX 210": { neuf: 32000, decoteAn: 0.03, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // FORD
    // ═══════════════════════════════════════════════════════════════
    ford: {
        fiesta: {
            "7": {
                annees: [2017, 2023], kmMoyenAn: 12000, motorisations: {
                    "1.0 EcoBoost 125": { neuf: 23000, decoteAn: 0.11 },
                    "1.5 EcoBoost ST 200": { neuf: 32000, decoteAn: 0.08 }
                }
            }
        },
        focus: {
            "3": {
                annees: [2011, 2018], kmMoyenAn: 15000, motorisations: {
                    "1.0 EcoBoost 125": { neuf: 25000, decoteAn: 0.11 },
                    "2.0 EcoBoost ST 250": { neuf: 35000, decoteAn: 0.08 },
                    "2.3 EcoBoost RS 350": { neuf: 45000, decoteAn: 0.05, collection: true }
                }
            },
            "4": {
                annees: [2018, 2025], kmMoyenAn: 15000, motorisations: {
                    "1.0 EcoBoost 125": { neuf: 28000, decoteAn: 0.11 },
                    "2.3 EcoBoost ST 280": { neuf: 42000, decoteAn: 0.08 }
                }
            }
        },
        mustang: {
            "s550": {
                annees: [2015, 2024], kmMoyenAn: 8000, motorisations: {
                    "2.3 EcoBoost 317": { neuf: 48000, decoteAn: 0.08 },
                    "5.0 V8 GT 450": { neuf: 58000, decoteAn: 0.06, collection: true },
                    "5.2 V8 Shelby GT350 526": { neuf: 85000, decoteAn: 0.04, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // HYUNDAI / KIA
    // ═══════════════════════════════════════════════════════════════
    hyundai: {
        i30: {
            "3": {
                annees: [2017, 2025], kmMoyenAn: 15000, motorisations: {
                    "1.0 T-GDi 120": { neuf: 25000, decoteAn: 0.12 },
                    "2.0 T-GDi N 275": { neuf: 42000, decoteAn: 0.08, collection: true }
                }
            }
        },
        i20: {
            "n": {
                annees: [2021, 2025], kmMoyenAn: 10000, motorisations: {
                    "1.6 T-GDi N 204": { neuf: 35000, decoteAn: 0.08, collection: true }
                }
            }
        }
    },
    kia: {
        stinger: {
            "1": {
                annees: [2017, 2023], kmMoyenAn: 15000, motorisations: {
                    "2.0 T-GDi 255": { neuf: 48000, decoteAn: 0.10 },
                    "3.3 V6 BiTurbo 370": { neuf: 58000, decoteAn: 0.08 }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // ALFA ROMEO
    // ═══════════════════════════════════════════════════════════════
    "alfa romeo": {
        giulia: {
            "952": {
                annees: [2016, 2025], kmMoyenAn: 15000, motorisations: {
                    "2.0 Turbo 200": { neuf: 42000, decoteAn: 0.11 },
                    "2.0 Turbo Veloce 280": { neuf: 55000, decoteAn: 0.09 },
                    "2.9 V6 Quadrifoglio 510": { neuf: 85000, decoteAn: 0.07, collection: true }
                }
            }
        },
        "4c": {
            "1": {
                annees: [2013, 2020], kmMoyenAn: 4000, motorisations: {
                    "1.75 TBi 240": { neuf: 60000, decoteAn: 0.06, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // PORSCHE
    // ═══════════════════════════════════════════════════════════════
    porsche: {
        "911": {
            "991": {
                annees: [2011, 2019], kmMoyenAn: 8000, motorisations: {
                    "3.0 Carrera 370": { neuf: 105000, decoteAn: 0.05 },
                    "3.0 Carrera S 420": { neuf: 125000, decoteAn: 0.04, collection: true },
                    "3.8 GT3 500": { neuf: 180000, decoteAn: 0.02, collection: true },
                    "4.0 GT3 RS 520": { neuf: 220000, decoteAn: -0.02, collection: true }
                }
            },
            "992": {
                annees: [2019, 2025], kmMoyenAn: 6000, motorisations: {
                    "3.0 Carrera 385": { neuf: 115000, decoteAn: 0.05 },
                    "3.0 Carrera S 450": { neuf: 140000, decoteAn: 0.04, collection: true },
                    "4.0 GT3 510": { neuf: 195000, decoteAn: 0.01, collection: true }
                }
            }
        },
        cayman: {
            "982": {
                annees: [2016, 2024], kmMoyenAn: 8000, motorisations: {
                    "2.0 300": { neuf: 58000, decoteAn: 0.06 },
                    "2.5 GTS 365": { neuf: 78000, decoteAn: 0.05 },
                    "4.0 GT4 420": { neuf: 105000, decoteAn: 0.03, collection: true }
                }
            }
        },
        boxster: {
            "982": {
                annees: [2016, 2024], kmMoyenAn: 8000, motorisations: {
                    "2.0 300": { neuf: 55000, decoteAn: 0.06 },
                    "2.5 GTS 365": { neuf: 75000, decoteAn: 0.05 },
                    "4.0 Spyder 420": { neuf: 105000, decoteAn: 0.03, collection: true }
                }
            }
        }
    },

    // ═══════════════════════════════════════════════════════════════
    // SEAT / CUPRA
    // ═══════════════════════════════════════════════════════════════
    seat: {
        leon: {
            "3": {
                annees: [2012, 2020], kmMoyenAn: 15000, motorisations: {
                    "1.4 TSI 150": { neuf: 26000, decoteAn: 0.11 },
                    "2.0 TSI Cupra 290": { neuf: 40000, decoteAn: 0.08 },
                    "2.0 TSI Cupra R 310": { neuf: 48000, decoteAn: 0.06, collection: true }
                }
            }
        },
        ibiza: {
            "5": {
                annees: [2017, 2025], kmMoyenAn: 12000, motorisations: {
                    "1.0 TSI 95": { neuf: 18000, decoteAn: 0.13 },
                    "1.0 TSI 115": { neuf: 22000, decoteAn: 0.12 }
                }
            }
        }
    },
    cupra: {
        formentor: {
            "1": {
                annees: [2020, 2025], kmMoyenAn: 15000, motorisations: {
                    "1.5 TSI 150": { neuf: 38000, decoteAn: 0.10 },
                    "2.0 TSI 310": { neuf: 52000, decoteAn: 0.08 },
                    "2.5 TSI VZ5 390": { neuf: 65000, decoteAn: 0.06, collection: true }
                }
            }
        }
    }
};

/**
 * Base de données des annonces analysées (stockage local)
 */
const UserAdsDatabase = {
    STORAGE_KEY: 'autoanalyseur_ads_db',

    /**
     * Récupère toutes les annonces sauvegardées
     */
    getAll: function () {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Erreur lecture base:', e);
            return [];
        }
    },

    /**
     * Sauvegarde une nouvelle annonce
     */
    save: function (annonce) {
        const ads = this.getAll();
        const entry = {
            id: Date.now(),
            date: new Date().toISOString(),
            marque: annonce.marque?.toLowerCase() || '',
            modele: annonce.modele?.toLowerCase() || '',
            annee: annonce.annee || 0,
            kilometrage: annonce.kilometrage || 0,
            prix: annonce.prix || 0,
            motorisation: annonce.motorisation || '',
            description: annonce.description?.substring(0, 200) || ''
        };

        // Éviter les doublons exacts
        const exists = ads.some(a =>
            a.marque === entry.marque &&
            a.modele === entry.modele &&
            a.annee === entry.annee &&
            a.prix === entry.prix &&
            a.kilometrage === entry.kilometrage
        );

        if (!exists && entry.marque && entry.prix) {
            ads.push(entry);
            // Garder max 500 annonces
            if (ads.length > 500) ads.shift();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ads));
            console.log(`Annonce sauvegardée: ${entry.marque} ${entry.modele} ${entry.annee}`);
        }

        return entry;
    },

    /**
     * Recherche annonces similaires
     */
    findSimilar: function (marque, modele, annee = null) {
        const ads = this.getAll();
        const marqueNorm = marque?.toLowerCase() || '';
        const modeleNorm = modele?.toLowerCase() || '';

        return ads.filter(a => {
            const matchMarque = a.marque.includes(marqueNorm) || marqueNorm.includes(a.marque);
            const matchModele = a.modele.includes(modeleNorm) || modeleNorm.includes(a.modele);
            const matchAnnee = !annee || Math.abs(a.annee - annee) <= 2;
            return matchMarque && matchModele && matchAnnee;
        });
    },

    /**
     * Calcule le prix moyen des annonces similaires
     */
    getPrixMoyenSimilaires: function (marque, modele, annee) {
        const similaires = this.findSimilar(marque, modele, annee);
        if (similaires.length === 0) return null;

        const total = similaires.reduce((sum, a) => sum + a.prix, 0);
        return {
            prixMoyen: Math.round(total / similaires.length),
            nombreAnnonces: similaires.length,
            prixMin: Math.min(...similaires.map(a => a.prix)),
            prixMax: Math.max(...similaires.map(a => a.prix))
        };
    },

    /**
     * Exporte la base en JSON
     */
    export: function () {
        return JSON.stringify(this.getAll(), null, 2);
    },

    /**
     * Importe une base JSON
     */
    import: function (jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (Array.isArray(data)) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
                return true;
            }
        } catch (e) {
            console.error('Erreur import:', e);
        }
        return false;
    },

    /**
     * Vide la base
     */
    clear: function () {
        localStorage.removeItem(this.STORAGE_KEY);
    },

    /**
     * Stats de la base
     */
    getStats: function () {
        const ads = this.getAll();
        const marques = [...new Set(ads.map(a => a.marque))];
        return {
            total: ads.length,
            marques: marques.length,
            topMarques: marques.map(m => ({
                marque: m,
                count: ads.filter(a => a.marque === m).length
            })).sort((a, b) => b.count - a.count).slice(0, 5)
        };
    }
};

/**
 * Recherche et estimation de prix
 */
const MarketPriceDatabase = {
    estimer: function (vehicule) {
        const { marque, modele, annee, kilometrage, motorisation } = vehicule;
        const anneeActuelle = new Date().getFullYear();
        const marqueNorm = this.normaliser(marque);
        const modeleNorm = this.normaliser(modele);

        // Chercher dans la base statique
        const dataMarque = MARKET_PRICES[marqueNorm];
        if (!dataMarque) {
            return this.estimerDepuisUserDB(vehicule);
        }

        let dataModele = null;
        for (const [key, value] of Object.entries(dataMarque)) {
            if (modeleNorm.includes(this.normaliser(key)) || this.normaliser(key).includes(modeleNorm)) {
                dataModele = value;
                break;
            }
        }

        if (!dataModele) {
            return this.estimerDepuisUserDB(vehicule);
        }

        let generation = null;
        for (const [genKey, genData] of Object.entries(dataModele)) {
            if (genData.annees && annee >= genData.annees[0] && annee <= genData.annees[1]) {
                generation = genData;
                break;
            }
        }

        if (!generation) {
            return this.estimerDepuisUserDB(vehicule);
        }

        const age = anneeActuelle - annee;
        const kmMoyen = generation.kmMoyenAn * age;
        const ecartKm = kilometrage ? (kilometrage - kmMoyen) / Math.max(kmMoyen, 1) : 0;

        let prixNeuf, decoteAn, isCollection = false;
        const motorNorm = this.normaliser(motorisation || '');

        for (const [key, data] of Object.entries(generation.motorisations)) {
            if (motorNorm && (this.normaliser(key).includes(motorNorm) || motorNorm.includes(this.normaliser(key)))) {
                prixNeuf = data.neuf;
                decoteAn = data.decoteAn;
                isCollection = data.collection || false;
                break;
            }
        }

        if (!prixNeuf) {
            const motors = Object.values(generation.motorisations);
            prixNeuf = motors.reduce((sum, m) => sum + m.neuf, 0) / motors.length;
            decoteAn = motors.reduce((sum, m) => sum + m.decoteAn, 0) / motors.length;
            isCollection = motors.some(m => m.collection);
        }

        // Calculer prix avec décote (peut être négative = prise de valeur)
        let prixEstime = prixNeuf;
        for (let i = 0; i < age; i++) {
            prixEstime *= (1 - decoteAn);
        }

        const ajustementKm = 1 - (ecartKm * 0.12);
        prixEstime = Math.round(prixEstime * Math.max(0.7, Math.min(1.3, ajustementKm)));
        prixEstime = Math.max(prixEstime, 1500);

        return {
            trouve: true,
            prixEstime,
            prixNeuf: Math.round(prixNeuf),
            decoteAnnuelle: Math.round(decoteAn * 100) + '%',
            isCollection,
            confiance: 'haute',
            source: 'base_marche',
            details: { age, kmMoyenAttendu: kmMoyen, kmReel: kilometrage, ecartKm: Math.round(ecartKm * 100) + '%' }
        };
    },

    estimerDepuisUserDB: function (vehicule) {
        const stats = UserAdsDatabase.getPrixMoyenSimilaires(vehicule.marque, vehicule.modele, vehicule.annee);

        if (stats && stats.nombreAnnonces >= 2) {
            return {
                trouve: true,
                prixEstime: stats.prixMoyen,
                confiance: 'moyenne',
                source: 'annonces_similaires',
                details: stats
            };
        }

        return this.estimationGenerique(vehicule);
    },

    estimationGenerique: function (vehicule) {
        const age = new Date().getFullYear() - (vehicule.annee || 2015);
        const prixEstime = Math.max(2000, 25000 * Math.pow(0.88, age) * (1 - (vehicule.kilometrage || 100000) / 500000));

        return {
            trouve: false,
            prixEstime: Math.round(prixEstime),
            confiance: 'faible',
            source: 'estimation_generique',
            message: 'Modèle non référencé. Estimation approximative.'
        };
    },

    /**
     * Prédiction de revente future
     */
    predireRevente: function (vehicule, anneesRevente = 3) {
        const estimation = this.estimer(vehicule);
        if (!estimation.trouve) {
            return { analysable: false, message: 'Impossible de prédire sans données de référence.' };
        }

        const prixActuel = estimation.prixEstime;
        const decoteAn = parseFloat(estimation.decoteAnnuelle) / 100 || 0.10;

        let prixFutur = prixActuel;
        for (let i = 0; i < anneesRevente; i++) {
            prixFutur *= (1 - decoteAn);
        }
        prixFutur = Math.round(Math.max(prixFutur, 1000));

        const perteTotale = prixActuel - prixFutur;
        const perteAnnuelle = Math.round(perteTotale / anneesRevente);
        const pertePourcent = Math.round((perteTotale / prixActuel) * 100);

        let verdict, conseil;
        if (decoteAn <= 0) {
            verdict = 'apprecie';
            conseil = '📈 Ce véhicule prend de la valeur ! Excellent investissement.';
        } else if (decoteAn <= 0.05) {
            verdict = 'tres_stable';
            conseil = '✅ Décote très faible. Revente favorable.';
        } else if (decoteAn <= 0.08) {
            verdict = 'stable';
            conseil = '👍 Décote modérée. Bonne conservation de valeur.';
        } else if (decoteAn <= 0.11) {
            verdict = 'normal';
            conseil = '➡️ Décote standard pour ce type de véhicule.';
        } else {
            verdict = 'forte_decote';
            conseil = '⚠️ Décote importante. Prévoir une perte significative à la revente.';
        }

        return {
            analysable: true,
            prixActuelEstime: prixActuel,
            prixRevente: prixFutur,
            anneesRevente,
            perteTotale,
            perteAnnuelle,
            pertePourcent,
            decoteAnnuelle: estimation.decoteAnnuelle,
            isCollection: estimation.isCollection,
            verdict,
            conseil
        };
    },

    normaliser: function (str) {
        if (!str) return '';
        return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
    },

    getMarques: function () {
        return Object.keys(MARKET_PRICES);
    },

    getModeles: function (marque) {
        const marqueNorm = this.normaliser(marque);
        return MARKET_PRICES[marqueNorm] ? Object.keys(MARKET_PRICES[marqueNorm]) : [];
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MARKET_PRICES, MarketPriceDatabase, UserAdsDatabase };
}
