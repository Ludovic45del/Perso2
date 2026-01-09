# Modélisation des Données - Application CIBLE

## Vue d'ensemble des domaines

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION CIBLE                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐                  │
│   │   CAMPAIGN   │      │     FSEC     │      │    STOCK     │                  │
│   │  (Campagne)  │◄────►│(Édifice Cible)│     │  (Inventaire)│                  │
│   └──────────────┘      └──────────────┘      └──────────────┘                  │
│                                │                      │                          │
│                                │                      │                          │
│                                ▼                      │                          │
│                         ┌──────────────┐              │                          │
│                         │    STEPS     │              │                          │
│                         │  (Étapes)    │◄─────────────┘                          │
│                         └──────────────┘                                         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. DOMAINE CAMPAIGN (Campagne)

### 1.1 Entité principale : CampaignEntity

```
┌─────────────────────────────────────────────────────────────────┐
│                      CAMPAIGN (Table: CAMPAIGN)                  │
├─────────────────────────────────────────────────────────────────┤
│  PK  │ uuid            │ UUID       │ Identifiant unique        │
├──────┼─────────────────┼────────────┼───────────────────────────┤
│  FK  │ type_id         │ INT        │ → CAMPAIGN_TYPES          │
│  FK  │ status_id       │ INT        │ → CAMPAIGN_STATUS         │
│  FK  │ installation_id │ INT        │ → CAMPAIGN_INSTALLATIONS  │
├──────┼─────────────────┼────────────┼───────────────────────────┤
│      │ name            │ VARCHAR(50)│ Nom de la campagne        │
│      │ year            │ INT        │ Année                     │
│      │ semester        │ VARCHAR(2) │ S1 ou S2                  │
│      │ last_updated    │ DATETIME   │ Date mise à jour          │
│      │ start_date      │ DATE       │ Date début (optionnel)    │
│      │ end_date        │ DATE       │ Date fin (optionnel)      │
│      │ dtri_number     │ INT        │ Numéro DTRI (optionnel)   │
│      │ description     │ TEXT(4000) │ Description (optionnel)   │
├─────────────────────────────────────────────────────────────────┤
│  UNIQUE: (name, year, semester)                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Relations Campaign

```
                                    ┌─────────────────────────┐
                                    │   CAMPAIGN_TYPES        │
                                    ├─────────────────────────┤
                                    │ PK id      │ INT        │
                                    │    label   │ VARCHAR(40)│
                                    │    color   │ VARCHAR(40)│
                                    └──────────┬──────────────┘
                                               │
                                               │ 1
                                               │
                                               ▼ *
┌─────────────────────────┐         ┌─────────────────────────┐         ┌─────────────────────────┐
│   CAMPAIGN_STATUS       │         │       CAMPAIGN          │         │ CAMPAIGN_INSTALLATIONS  │
├─────────────────────────┤         ├─────────────────────────┤         ├─────────────────────────┤
│ PK id      │ INT        │ 1     * │ PK uuid                 │ *     1 │ PK id      │ INT        │
│    label   │ VARCHAR(40)│◄────────┤ FK type_id              ├────────►│    label   │ VARCHAR(40)│
│    color   │ VARCHAR(40)│         │ FK status_id            │         │    color   │ VARCHAR(40)│
└─────────────────────────┘         │ FK installation_id      │         └─────────────────────────┘
                                    │    name, year, semester │
                                    │    ...                  │
                                    └───────────┬─────────────┘
                                                │
                                                │ 1
                          ┌─────────────────────┴─────────────────────┐
                          │                                           │
                          ▼ *                                         ▼ *
           ┌──────────────────────────┐               ┌──────────────────────────┐
           │     CAMPAIGN_TEAMS       │               │   CAMPAIGN_DOCUMENTS     │
           ├──────────────────────────┤               ├──────────────────────────┤
           │ PK uuid                  │               │ PK uuid                  │
           │ FK campaign_uuid         │               │ FK campaign_uuid         │
           │ FK role_id               │               │ FK subtype_id            │
           │    name                  │               │    name, path, date      │
           └───────────┬──────────────┘               └───────────┬──────────────┘
                       │                                          │
                       │ *                                        │ *
                       ▼ 1                                        ▼ 1
           ┌──────────────────────────┐               ┌──────────────────────────┐
           │     CAMPAIGN_ROLES       │               │CAMPAIGN_DOCUMENT_SUBTYPES│
           ├──────────────────────────┤               ├──────────────────────────┤
           │ PK id      │ INT         │               │ PK id                    │
           │    label   │ VARCHAR(40) │               │ FK type_id               │
           └──────────────────────────┘               │    label                 │
                                                      └───────────┬──────────────┘
                                                                  │ *
                                                                  ▼ 1
                                                      ┌──────────────────────────┐
                                                      │ CAMPAIGN_DOCUMENT_TYPES  │
                                                      ├──────────────────────────┤
                                                      │ PK id      │ INT         │
                                                      │    label   │ VARCHAR(40) │
                                                      └──────────────────────────┘
```

### 1.3 Détail des référentiels Campaign

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                         RÉFÉRENTIELS CAMPAIGN                                   │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  CAMPAIGN_TYPES          CAMPAIGN_STATUS         CAMPAIGN_INSTALLATIONS         │
│  ┌────────────────┐      ┌────────────────┐      ┌────────────────┐            │
│  │ id (PK)        │      │ id (PK)        │      │ id (PK)        │            │
│  │ label          │      │ label          │      │ label          │            │
│  │ color          │      │ color          │      │ color          │            │
│  └────────────────┘      └────────────────┘      └────────────────┘            │
│                                                                                 │
│  CAMPAIGN_ROLES          CAMPAIGN_DOCUMENT_TYPES                               │
│  ┌────────────────┐      ┌────────────────────────────────┐                    │
│  │ id (PK)        │      │ id (PK)                        │                    │
│  │ label          │      │ label                          │                    │
│  └────────────────┘      │     ↓                          │                    │
│                          │ CAMPAIGN_DOCUMENT_SUBTYPES     │                    │
│                          │ ┌────────────────────────────┐ │                    │
│                          │ │ id (PK)                    │ │                    │
│                          │ │ type_id (FK)               │ │                    │
│                          │ │ label                      │ │                    │
│                          │ └────────────────────────────┘ │                    │
│                          └────────────────────────────────┘                    │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DOMAINE FSEC (Édifice Cible)

### 2.1 Entité principale : FsecEntity

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           FSEC (Table: FSEC)                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ version_uuid             │ UUID        │ ID version (unique)              │
├──────┼──────────────────────────┼─────────────┼──────────────────────────────────┤
│      │ fsec_uuid                │ UUID        │ ID FSEC (partagé entre versions) │
├──────┼──────────────────────────┼─────────────┼──────────────────────────────────┤
│  FK  │ campaign_id              │ UUID        │ → CAMPAIGN (nullable)            │
│  FK  │ status_id                │ INT         │ → FSEC_STATUS                    │
│  FK  │ category_id              │ INT         │ → FSEC_CATEGORY                  │
│  FK  │ rack_id                  │ INT         │ → FSEC_RACK (nullable)           │
├──────┼──────────────────────────┼─────────────┼──────────────────────────────────┤
│      │ name                     │ VARCHAR(50) │ Nom du FSEC                      │
│      │ comments                 │ TEXT(4000)  │ Commentaires (Design Step)       │
│      │ last_updated             │ DATETIME    │ Date mise à jour                 │
│      │ is_active                │ BOOLEAN     │ Version active (défaut: true)    │
│      │ created_at               │ DATETIME    │ Date création                    │
├──────┼──────────────────────────┼─────────────┼──────────────────────────────────┤
│      │ delivery_date            │ DATE        │ Date livraison (Usable Step)     │
│      │ shooting_date            │ DATE        │ Date tir (Installed Step)        │
│      │ preshooting_pressure     │ FLOAT       │ Pression pré-tir                 │
│      │ experience_srxx          │ VARCHAR(50) │ Expérience SRxx                  │
│      │ localisation             │ VARCHAR(20) │ Localisation (Shot Step)         │
│      │ depressurization_failed  │ BOOLEAN     │ Échec dépressurisation           │
├─────────────────────────────────────────────────────────────────────────────────┤
│  UNIQUE: (campaign_id, name)                                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Relations principales FSEC

```
                                      ┌─────────────────────────┐
                                      │     CAMPAIGN            │
                                      ├─────────────────────────┤
                                      │ PK uuid                 │
                                      │    ...                  │
                                      └──────────┬──────────────┘
                                                 │ 1
                                                 │
                                                 ▼ *
┌─────────────────────────┐           ┌─────────────────────────┐           ┌─────────────────────────┐
│     FSEC_CATEGORY       │           │         FSEC            │           │     FSEC_STATUS         │
├─────────────────────────┤           ├─────────────────────────┤           ├─────────────────────────┤
│ PK id      │ INT        │ 1       * │ PK version_uuid         │ *       1 │ PK id      │ INT        │
│    label   │ VARCHAR(40)│◄──────────┤    fsec_uuid            ├──────────►│    label   │ VARCHAR(40)│
│    color   │ VARCHAR(40)│           │ FK campaign_id          │           │    color   │ VARCHAR(40)│
└─────────────────────────┘           │ FK status_id            │           └─────────────────────────┘
                                      │ FK category_id          │
┌─────────────────────────┐           │ FK rack_id              │
│      FSEC_RACK          │           │    name, comments, ...  │
├─────────────────────────┤           └───────────┬─────────────┘
│ PK id      │ INT        │ 1       *             │
│    label   │ VARCHAR(40)│◄──────────────────────┤
│    color   │ VARCHAR(40)│                       │
│    is_full │ BOOLEAN    │                       │
└─────────────────────────┘                       │
                                                  │ 1
                            ┌─────────────────────┴─────────────────────┐
                            │                                           │
                            ▼ *                                         ▼ *
             ┌──────────────────────────┐               ┌──────────────────────────┐
             │       FSEC_TEAMS         │               │     FSEC_DOCUMENTS       │
             ├──────────────────────────┤               ├──────────────────────────┤
             │ PK uuid                  │               │ PK uuid                  │
             │ FK fsec_id (version_uuid)│               │ FK fsec_id (version_uuid)│
             │ FK role_id               │               │ FK subtype_id            │
             │    name                  │               │    name, path, date      │
             └───────────┬──────────────┘               └───────────┬──────────────┘
                         │                                          │
                         │ *                                        │ *
                         ▼ 1                                        ▼ 1
             ┌──────────────────────────┐               ┌──────────────────────────┐
             │       FSEC_ROLES         │               │  FSEC_DOCUMENT_SUBTYPES  │
             ├──────────────────────────┤               ├──────────────────────────┤
             │ PK id      │ INT         │               │ PK id                    │
             │    label   │ VARCHAR(40) │               │ FK type_id               │
             └──────────────────────────┘               │    label                 │
                                                        └───────────┬──────────────┘
                                                                    │ *
                                                                    ▼ 1
                                                        ┌──────────────────────────┐
                                                        │   FSEC_DOCUMENT_TYPES    │
                                                        ├──────────────────────────┤
                                                        │ PK id      │ INT         │
                                                        │    label   │ VARCHAR(40) │
                                                        └──────────────────────────┘
```

### 2.3 Catégories FSEC et Workflows

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        CATÉGORIES FSEC (FSEC_CATEGORY)                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │    Sans Gaz     │  │   Avec Gaz HP   │  │   Avec Gaz BP   │                  │
│  │   (Gasless)     │  │ (High Pressure) │  │ (Low Pressure)  │                  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘                  │
│           │                    │                    │                            │
│           ▼                    ▼                    ▼                            │
│  ┌─────────────────────────────────────────────────────────────┐                │
│  │                    WORKFLOW COMMUN                          │                │
│  │  Design → Assembly → Metrology → Sealing → Pictures         │                │
│  │           → [GAS STEPS] → Usable → Installed → Shot         │                │
│  └─────────────────────────────────────────────────────────────┘                │
│                                                                                  │
│  ┌───────────────────────┐  ┌────────────────────────────────┐                  │
│  │  Avec Gaz BP + HP     │  │  Avec Gaz Perméation + BP      │                  │
│  │ (Low + High Pressure) │  │ (Permeation + Low Pressure)    │                  │
│  └───────────┬───────────┘  └───────────────┬────────────────┘                  │
│              │                              │                                    │
│              ▼                              ▼                                    │
│   Steps: Airtightness +            Steps: Airtightness +                        │
│   Gas Filling LP + HP              Permeation + Depressurization +              │
│                                    Gas Filling LP + Repressurization            │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. ÉTAPES FSEC (STEPS)

### 3.1 Vue d'ensemble des Steps

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FSEC STEPS                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│                              ┌──────────────┐                                   │
│                              │     FSEC     │                                   │
│                              │ (version_uuid)│                                   │
│                              └──────┬───────┘                                   │
│                                     │                                            │
│         ┌───────────────────────────┼───────────────────────────┐               │
│         │                           │                           │               │
│         ▼                           ▼                           ▼               │
│  ┌──────────────┐          ┌──────────────┐          ┌──────────────┐          │
│  │ ASSEMBLY_STEP│          │METROLOGY_STEP│          │ SEALING_STEP │          │
│  │  (Multiple)  │          │  (Multiple)  │          │   (Single)   │          │
│  └──────────────┘          └──────────────┘          └──────────────┘          │
│                                                                                  │
│  ┌──────────────┐          ┌──────────────┐                                     │
│  │PICTURES_STEP │          │   BASE_STEP  │◄──── Classe abstraite               │
│  │  (Multiple)  │          │    (uuid,    │                                     │
│  └──────────────┘          │ fsec_version)│                                     │
│                            └──────────────┘                                     │
│                                                                                  │
│  ╔════════════════════════════════════════════════════════════════════════════╗ │
│  ║                         STEPS GAZ (Optionnels)                             ║ │
│  ╠════════════════════════════════════════════════════════════════════════════╣ │
│  ║                                                                            ║ │
│  ║  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐║ │
│  ║  │AIRTIGHTNESS_TEST_LP │  │ GAS_FILLING_LP_STEP │  │ GAS_FILLING_HP_STEP │║ │
│  ║  │     (Single)        │  │     (Single)        │  │     (Single)        │║ │
│  ║  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘║ │
│  ║                                                                            ║ │
│  ║  ┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐║ │
│  ║  │  PERMEATION_STEP    │  │DEPRESSURIZATION_STEP│  │REPRESSURIZATION_STEP│║ │
│  ║  │     (Single)        │  │     (Single)        │  │     (Single)        │║ │
│  ║  └─────────────────────┘  └─────────────────────┘  └─────────────────────┘║ │
│  ║                                                                            ║ │
│  ╚════════════════════════════════════════════════════════════════════════════╝ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Détail des Steps principales

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                          ASSEMBLY_STEP (Table: ASSEMBLY_STEP)                   │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                     │ UUID        │ Identifiant unique             │
│  FK  │ fsec_version_id          │ UUID        │ → FSEC.version_uuid            │
├──────┼──────────────────────────┼─────────────┼────────────────────────────────┤
│      │ hydrometric_temperature  │ FLOAT       │ Température hydrométrique      │
│      │ start_date               │ DATE        │ Date début                     │
│      │ end_date                 │ DATE        │ Date fin                       │
│      │ comments                 │ TEXT(4000)  │ Commentaires                   │
├──────┼──────────────────────────┼─────────────┼────────────────────────────────┤
│  M2M │ assembly_bench           │             │ → ASSEMBLY_BENCH (Many-to-Many)│
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│                        METROLOGY_STEP (Table: METROLOGY_STEP)                   │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                     │ UUID        │ Identifiant unique             │
│  FK  │ fsec_version_id          │ UUID        │ → FSEC.version_uuid            │
│  FK  │ machine_id               │ INT         │ → METROLOGY_MACHINE (nullable) │
├──────┼──────────────────────────┼─────────────┼────────────────────────────────┤
│      │ date                     │ DATE        │ Date métrologie                │
│      │ comments                 │ TEXT(4000)  │ Commentaires                   │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│                          SEALING_STEP (Table: SEALING_STEP)                     │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                     │ UUID        │ Identifiant unique             │
│  FK  │ fsec_version_id          │ UUID        │ → FSEC.version_uuid            │
├──────┼──────────────────────────┼─────────────┼────────────────────────────────┤
│      │ interface_io             │ TEXT(50)    │ Interface IO                   │
│      │ comments                 │ TEXT(4000)  │ Commentaires                   │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│                        PICTURES_STEP (Table: PICTURES_STEP)                     │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                     │ UUID        │ Identifiant unique             │
│  FK  │ fsec_version_id          │ UUID        │ → FSEC.version_uuid            │
├──────┼──────────────────────────┼─────────────┼────────────────────────────────┤
│      │ last_updated             │ DATE        │ Dernière mise à jour           │
│      │ comments                 │ TEXT(4000)  │ Commentaires                   │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Détail des Steps Gaz

```
┌────────────────────────────────────────────────────────────────────────────────┐
│               AIRTIGHTNESS_TEST_LP_STEP (Table: AIRTIGHTNESS_TEST_LP_STEP)     │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                        │ UUID        │ Identifiant unique          │
│  FK  │ fsec_version_id             │ UUID        │ → FSEC.version_uuid         │
├──────┼─────────────────────────────┼─────────────┼─────────────────────────────┤
│      │ leak_rate_dtri              │ TEXT(200)   │ Taux de fuite DTRI          │
│      │ gas_type                    │ TEXT(200)   │ Type de gaz                 │
│      │ experiment_pressure         │ FLOAT       │ Pression expérimentale      │
│      │ airtightness_test_duration  │ FLOAT       │ Durée du test               │
│      │ operator                    │ TEXT(200)   │ Opérateur                   │
│      │ date_of_fulfilment          │ DATE        │ Date de réalisation         │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│                 GAS_FILLING_BP_STEP (Table: GAS_FILLING_BP_STEP)               │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                     │ UUID        │ Identifiant unique             │
│  FK  │ fsec_version_id          │ UUID        │ → FSEC.version_uuid            │
├──────┼──────────────────────────┼─────────────┼────────────────────────────────┤
│      │ leak_rate_dtri           │ TEXT(200)   │ Taux de fuite DTRI             │
│      │ gas_type                 │ TEXT(200)   │ Type de gaz                    │
│      │ experiment_pressure      │ FLOAT       │ Pression expérimentale         │
│      │ leak_test_duration       │ FLOAT       │ Durée test fuite               │
│      │ operator                 │ TEXT(200)   │ Opérateur                      │
│      │ date_of_fulfilment       │ DATE        │ Date de réalisation            │
│      │ gas_base                 │ INT         │ Base gaz                       │
│      │ gas_container            │ INT         │ Conteneur gaz                  │
│      │ observations             │ TEXT(4000)  │ Observations                   │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│                 GAS_FILLING_HP_STEP (Table: GAS_FILLING_HP_STEP)               │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                     │ UUID        │ Identifiant unique             │
│  FK  │ fsec_version_id          │ UUID        │ → FSEC.version_uuid            │
├──────┼──────────────────────────┼─────────────┼────────────────────────────────┤
│      │ leak_rate_dtri           │ TEXT(200)   │ Taux de fuite DTRI             │
│      │ gas_type                 │ TEXT(200)   │ Type de gaz                    │
│      │ experiment_pressure      │ FLOAT       │ Pression expérimentale         │
│      │ operator                 │ TEXT(200)   │ Opérateur                      │
│      │ date_of_fulfilment       │ DATE        │ Date de réalisation            │
│      │ gas_base                 │ INT         │ Base gaz                       │
│      │ gas_container            │ INT         │ Conteneur gaz                  │
│      │ observations             │ TEXT(4000)  │ Observations                   │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│                    PERMEATION_STEP (Table: PERMEATION_STEP)                     │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                     │ UUID        │ Identifiant unique             │
│  FK  │ fsec_version_id          │ UUID        │ → FSEC.version_uuid            │
├──────┼──────────────────────────┼─────────────┼────────────────────────────────┤
│      │ gas_type                 │ TEXT(200)   │ Type de gaz                    │
│      │ target_pressure          │ FLOAT       │ Pression cible                 │
│      │ operator                 │ TEXT(200)   │ Opérateur                      │
│      │ start_date               │ DATETIME    │ Date début                     │
│      │ estimated_end_date       │ DATETIME    │ Date fin estimée               │
│      │ sensor_pressure          │ FLOAT       │ Pression capteur               │
│      │ computed_shot_pressure   │ FLOAT       │ Pression tir calculée          │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│               DEPRESSURIZATION_STEP (Table: DEPRESSURIZATION_STEP)             │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                              │ UUID     │ Identifiant unique       │
│  FK  │ fsec_version_id                   │ UUID     │ → FSEC.version_uuid      │
├──────┼───────────────────────────────────┼──────────┼──────────────────────────┤
│      │ operator                          │ TEXT(200)│ Opérateur                │
│      │ date_of_fulfilment                │ DATE     │ Date de réalisation      │
│      │ pressure_gauge                    │ FLOAT    │ Jauge de pression        │
│      │ enclosure_pressure_measured       │ FLOAT    │ Pression enceinte mesurée│
│      │ start_time                        │ DATETIME │ Heure début              │
│      │ end_time                          │ DATETIME │ Heure fin                │
│      │ observations                      │ TEXT(4000)│ Observations            │
│      │ depressurization_time_before_firing│ FLOAT   │ Temps avant tir          │
│      │ computed_pressure_before_firing   │ FLOAT    │ Pression calculée        │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│              REPRESSURIZATION_STEP (Table: REPRESSURIZATION_STEP)              │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                     │ UUID        │ Identifiant unique             │
│  FK  │ fsec_version_id          │ UUID        │ → FSEC.version_uuid            │
├──────┼──────────────────────────┼─────────────┼────────────────────────────────┤
│      │ operator                 │ TEXT(200)   │ Opérateur                      │
│      │ gas_type                 │ TEXT(200)   │ Type de gaz                    │
│      │ start_date               │ DATETIME    │ Date début                     │
│      │ estimated_end_date       │ DATETIME    │ Date fin estimée               │
│      │ sensor_pressure          │ FLOAT       │ Pression capteur               │
│      │ computed_pressure        │ FLOAT       │ Pression calculée              │
└────────────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Référentiels des Steps

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           RÉFÉRENTIELS STEPS                                    │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ASSEMBLY_BENCH                        METROLOGY_MACHINE                        │
│  (Table: ASSEMBLY_BENCH)               (Table: METROLOGY_MACHINE)               │
│  ┌────────────────────────┐            ┌────────────────────────┐              │
│  │ PK id      │ INT       │            │ PK id      │ INT       │              │
│  │    label   │ VARCHAR(40)│           │    label   │ VARCHAR(40)│             │
│  │    color   │ VARCHAR(40)│           │    color   │ VARCHAR(40)│             │
│  └────────────────────────┘            └────────────────────────┘              │
│           │                                     │                               │
│           │ M2M                                 │ FK                            │
│           ▼                                     ▼                               │
│  ┌────────────────────────┐            ┌────────────────────────┐              │
│  │    ASSEMBLY_STEP       │            │    METROLOGY_STEP      │              │
│  └────────────────────────┘            └────────────────────────┘              │
│                                                                                 │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. RELATION CAMPAIGN ↔ FSEC

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        RELATION CAMPAIGN - FSEC                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────┐                                            │
│  │           CAMPAIGN              │                                            │
│  │  ┌─────────────────────────┐   │                                            │
│  │  │ uuid (PK)               │   │                                            │
│  │  │ name                    │   │                                            │
│  │  │ year                    │   │                                            │
│  │  │ installation            │   │    Représentation: {year}-{installation}_{name}
│  │  └─────────────────────────┘   │    Exemple: 2024-LMJ_CAMPAGNE1             │
│  └──────────────┬──────────────────┘                                            │
│                 │                                                                │
│                 │ 1                                                              │
│                 │                                                                │
│                 │ Une campagne peut avoir                                        │
│                 │ plusieurs FSECs                                                │
│                 │                                                                │
│                 ▼ *                                                              │
│  ┌─────────────────────────────────┐                                            │
│  │             FSEC                │                                            │
│  │  ┌─────────────────────────┐   │                                            │
│  │  │ version_uuid (PK)       │   │                                            │
│  │  │ fsec_uuid               │   │    Plusieurs versions peuvent              │
│  │  │ campaign_id (FK)        │───┼──► exister pour un même FSEC               │
│  │  │ name                    │   │    (gestion du versioning)                 │
│  │  │ is_active               │   │                                            │
│  │  └─────────────────────────┘   │                                            │
│  └─────────────────────────────────┘                                            │
│                                                                                  │
│  ══════════════════════════════════════════════════════════════════════════════ │
│                                                                                  │
│  CONTRAINTES:                                                                   │
│  • Un FSEC appartient à une seule campagne (mais campaign peut être NULL)       │
│  • Le couple (campaign_id, name) doit être unique pour les FSECs actifs         │
│  • Quand une campagne est supprimée, les FSECs sont orphelins (SET_NULL)        │
│                                                                                  │
│  VERSIONING FSEC:                                                               │
│  • fsec_uuid: identifiant partagé entre toutes les versions                     │
│  • version_uuid: identifiant unique de chaque version                           │
│  • is_active: seule une version est active à la fois                            │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. DOMAINE STOCK (Inventaire)

### 5.1 Vue d'ensemble Stock

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DOMAINE STOCK                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌──────────────────────────────────────────────────────────────────────────┐  │
│   │                          CONSUMABLES (Consommables)                      │  │
│   │  ┌─────────────────────────┐  ┌─────────────────────────┐               │  │
│   │  │  CONSUMABLES_GLUES      │  │  OTHER_CONSUMABLES      │               │  │
│   │  │  (Colles consommables)  │  │  (Autres consommables)  │               │  │
│   │  └─────────────────────────┘  └─────────────────────────┘               │  │
│   └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│   ┌──────────────────────────────────────────────────────────────────────────┐  │
│   │                          INVENTORY (Inventaire)                          │  │
│   │  ┌──────────────────────┐  ┌──────────────────────┐                     │  │
│   │  │ BASIC_PARTS_CATALOG  │  │   EC_STRUCTURING     │                     │  │
│   │  │ (Pièces élémentaires)│  │ (Structuration EC)   │                     │  │
│   │  └──────────────────────┘  └──────────────────────┘                     │  │
│   │  ┌──────────────────────┐  ┌──────────────────────┐                     │  │
│   │  │   INVENTORY_LMJ      │  │   INVENTORY_OMEGA    │                     │  │
│   │  │  (Inventaire LMJ)    │  │  (Inventaire Omega)  │                     │  │
│   │  └──────────────────────┘  └──────────────────────┘                     │  │
│   └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│   ┌──────────────────────────────────────────────────────────────────────────┐  │
│   │                        STRUCTURING (Structuration)                       │  │
│   │  ┌─────────────────────────┐  ┌─────────────────────────┐               │  │
│   │  │     STRUCTURING         │  │  SPECIAL_STRUCTURING    │               │  │
│   │  │   (Structuration)       │  │(Structuration spéciale) │               │  │
│   │  └─────────────────────────┘  └─────────────────────────┘               │  │
│   └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│   ┌──────────────────────────────────────────────────────────────────────────┐  │
│   │                          TRANSFERS (Mouvements)                          │  │
│   │  ┌─────────────────────────────────────────────────────────────────────┐│  │
│   │  │                        TRANSFERS                                    ││  │
│   │  │                    (Mouvements de stock)                            ││  │
│   │  └─────────────────────────────────────────────────────────────────────┘│  │
│   └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Détail entités Stock

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                 CONSUMABLES_GLUES (Table: STOCKS_CONSUMABLES_GLUES)            │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                │ UUID         │ Identifiant unique                 │
├──────┼─────────────────────┼──────────────┼────────────────────────────────────┤
│      │ item                │ VARCHAR(100) │ Article                            │
│      │ stocks              │ VARCHAR(100) │ Stock                              │
│      │ unit                │ VARCHAR(100) │ Unité                              │
│      │ reference           │ VARCHAR(100) │ Référence                          │
│      │ buying_type         │ VARCHAR(100) │ Type d'achat                       │
│      │ supplier            │ VARCHAR(100) │ Fournisseur                        │
│      │ expiry_date         │ DATE         │ Date de péremption                 │
│      │ additional_comment  │ VARCHAR(400) │ Commentaire additionnel            │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│                    INVENTORY_LMJ (Table: STOCKS_INVENTORY_LMJ)                 │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                          │ UUID         │ Identifiant unique       │
├──────┼───────────────────────────────┼──────────────┼──────────────────────────┤
│      │ iec                           │ VARCHAR(100) │ IEC                      │
│      │ elements_or_target_description│ VARCHAR(100) │ Description éléments     │
│      │ digits_if_untagged_element    │ VARCHAR(100) │ Nombre si non marqué     │
│      │ targets_or_element_number     │ VARCHAR(100) │ Numéro cible/élément     │
│      │ box_number_or_box_description │ VARCHAR(100) │ N° boîte / description   │
│      │ localisation                  │ VARCHAR(100) │ Emplacement              │
│      │ delivery_date                 │ DATE         │ Date de livraison        │
│      │ exit_date                     │ DATE         │ Date de sortie           │
│      │ campaign_dtri_number          │ VARCHAR(100) │ Numéro campagne DTRI     │
│      │ additional_comment            │ VARCHAR(400) │ Commentaire additionnel  │
│      │ fsec                          │ VARCHAR(100) │ FSEC associé (nom)       │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│                       TRANSFERS (Table: STOCKS_TRANSFERS)                       │
├────────────────────────────────────────────────────────────────────────────────┤
│  PK  │ uuid                │ UUID         │ Identifiant unique                 │
├──────┼─────────────────────┼──────────────┼────────────────────────────────────┤
│      │ equipment           │ VARCHAR(100) │ Équipement                         │
│      │ equipment_type      │ VARCHAR(100) │ Type d'équipement                  │
│      │ initial_stock       │ VARCHAR(100) │ Stock initial                      │
│      │ units               │ VARCHAR(100) │ Unités                             │
│      │ current_stock       │ VARCHAR(100) │ Stock actuel                       │
│      │ entry_date          │ DATE         │ Date d'entrée                      │
│      │ exit_date           │ DATE         │ Date de sortie                     │
│      │ date                │ DATE         │ Date                               │
│      │ additional_comment  │ VARCHAR(400) │ Commentaire additionnel            │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. DIAGRAMME COMPLET DES RELATIONS

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    SCHÉMA GLOBAL APPLICATION CIBLE                                   │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│  RÉFÉRENTIELS CAMPAIGN                           RÉFÉRENTIELS FSEC                                  │
│  ═══════════════════                             ════════════════                                   │
│  ┌──────────────────┐                            ┌──────────────────┐                               │
│  │ CAMPAIGN_TYPES   │                            │ FSEC_CATEGORY    │                               │
│  │ CAMPAIGN_STATUS  │                            │ FSEC_STATUS      │                               │
│  │ CAMPAIGN_INSTALL.│                            │ FSEC_RACK        │                               │
│  │ CAMPAIGN_ROLES   │                            │ FSEC_ROLES       │                               │
│  │ DOC_TYPES/SUBTYPES                            │ DOC_TYPES/SUBTYPES                              │
│  └────────┬─────────┘                            └────────┬─────────┘                               │
│           │                                               │                                          │
│           ▼                                               ▼                                          │
│  ┌──────────────────┐                            ┌──────────────────┐                               │
│  │                  │                            │                  │                               │
│  │    CAMPAIGN      │ 1 ─────────────────────► * │      FSEC        │                               │
│  │                  │                            │                  │                               │
│  └────────┬─────────┘                            └────────┬─────────┘                               │
│           │                                               │                                          │
│           │ 1                                             │ 1                                        │
│           │                                               │                                          │
│  ┌────────┴────────┐                            ┌────────┴────────────────────┐                     │
│  │        │        │                            │        │        │          │                     │
│  ▼ *      ▼ *      │                            ▼ *      ▼ *      ▼ *        ▼ *                   │
│ ┌────┐  ┌────┐     │                          ┌────┐  ┌────┐  ┌─────────┐  ┌─────────┐             │
│ │TEAM│  │DOCS│     │                          │TEAM│  │DOCS│  │  STEPS  │  │GAS STEPS│             │
│ └────┘  └────┘     │                          └────┘  └────┘  └─────────┘  └─────────┘             │
│                    │                                                                                │
│                    │                                           RÉFÉRENTIELS STEPS                   │
│                    │                                           ══════════════════                   │
│                    │                                           ┌──────────────────┐                 │
│                    │                                           │ ASSEMBLY_BENCH   │                 │
│                    │                                           │ METROLOGY_MACHINE│                 │
│                    │                                           └──────────────────┘                 │
│                    │                                                                                │
│  ══════════════════╪════════════════════════════════════════════════════════════════════════════   │
│                    │                                                                                │
│                    │                          STOCK (Liaison optionnelle par nom FSEC)              │
│                    │                          ════════════════════════════════════════              │
│                    │                                                                                │
│                    │         ┌─────────────────────────────────────────────────────────┐            │
│                    │         │                                                         │            │
│                    │         │  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │            │
│                    │         │  │ CONSUMABLES   │  │  INVENTORY    │  │ STRUCTURING │ │            │
│                    │         │  │ ┌───────────┐ │  │ ┌───────────┐ │  │ ┌─────────┐ │ │            │
│                    │         │  │ │Glues      │ │  │ │Basic Parts│ │  │ │Standard │ │ │            │
│                    │         │  │ │Others     │ │  │ │EC Struct. │ │  │ │Special  │ │ │            │
│                    │         │  │ └───────────┘ │  │ │LMJ        │ │  │ └─────────┘ │ │            │
│                    │         │  └───────────────┘  │ │Omega      │ │  └─────────────┘ │            │
│                    │         │                     │ └───────────┘ │                  │            │
│                    │         │                     └───────────────┘                  │            │
│                    │         │                                                         │            │
│                    │         │  ┌─────────────────────────────────────────────────┐   │            │
│                    │         │  │                  TRANSFERS                      │   │            │
│                    │         │  │              (Mouvements de stock)              │   │            │
│                    │         │  └─────────────────────────────────────────────────┘   │            │
│                    │         └─────────────────────────────────────────────────────────┘            │
│                    │                                                                                │
└────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. LÉGENDE

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  LÉGENDE                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  SYMBOLES:                                                                       │
│  ─────────                                                                       │
│  PK       = Primary Key (Clé primaire)                                          │
│  FK       = Foreign Key (Clé étrangère)                                         │
│  M2M      = Many-to-Many (Relation plusieurs à plusieurs)                       │
│                                                                                  │
│  CARDINALITÉS:                                                                   │
│  ─────────────                                                                   │
│  1 ────► *    = Un vers plusieurs (One-to-Many)                                 │
│  1 ◄───► 1    = Un vers un (One-to-One)                                         │
│  * ◄───► *    = Plusieurs vers plusieurs (Many-to-Many)                         │
│                                                                                  │
│  TYPES DE DONNÉES:                                                              │
│  ─────────────────                                                               │
│  UUID          = Identifiant universel unique                                   │
│  INT           = Entier                                                         │
│  VARCHAR(n)    = Chaîne de caractères (max n)                                   │
│  TEXT(n)       = Texte long (max n)                                             │
│  DATE          = Date                                                           │
│  DATETIME      = Date et heure                                                  │
│  FLOAT         = Nombre décimal                                                 │
│  BOOLEAN       = Vrai/Faux                                                      │
│                                                                                  │
│  NOTATION TABLES:                                                               │
│  ────────────────                                                                │
│  ┌─────────────┐                                                                │
│  │ NOM_TABLE   │  Table principale                                              │
│  └─────────────┘                                                                │
│                                                                                  │
│  ╔═════════════╗                                                                │
│  ║ GROUPE      ║  Groupe de tables liées                                        │
│  ╚═════════════╝                                                                │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. RÉSUMÉ DES TABLES

| Domaine | Table | Description |
|---------|-------|-------------|
| **CAMPAIGN** | CAMPAIGN | Campagnes principales |
| | CAMPAIGN_TYPES | Types de campagne |
| | CAMPAIGN_STATUS | Statuts de campagne |
| | CAMPAIGN_INSTALLATIONS | Installations (LMJ, Omega) |
| | CAMPAIGN_TEAMS | Équipes de campagne |
| | CAMPAIGN_ROLES | Rôles dans les équipes |
| | CAMPAIGN_DOCUMENTS | Documents de campagne |
| | CAMPAIGN_DOCUMENT_TYPES | Types de documents |
| | CAMPAIGN_DOCUMENT_SUBTYPES | Sous-types de documents |
| **FSEC** | FSEC | Édifices cibles |
| | FSEC_CATEGORY | Catégories (Sans Gaz, Avec Gaz...) |
| | FSEC_STATUS | Statuts de workflow |
| | FSEC_RACK | Racks de stockage |
| | FSEC_TEAMS | Équipes FSEC |
| | FSEC_ROLES | Rôles FSEC |
| | FSEC_DOCUMENTS | Documents FSEC |
| | FSEC_DOCUMENT_TYPES | Types de documents |
| | FSEC_DOCUMENT_SUBTYPES | Sous-types de documents |
| **STEPS** | ASSEMBLY_STEP | Étape assemblage |
| | METROLOGY_STEP | Étape métrologie |
| | SEALING_STEP | Étape scellement |
| | PICTURES_STEP | Étape photos |
| | AIRTIGHTNESS_TEST_LP_STEP | Test étanchéité BP |
| | GAS_FILLING_BP_STEP | Remplissage gaz BP |
| | GAS_FILLING_HP_STEP | Remplissage gaz HP |
| | PERMEATION_STEP | Étape perméation |
| | DEPRESSURIZATION_STEP | Étape dépressurisation |
| | REPRESSURIZATION_STEP | Étape repressurisation |
| | ASSEMBLY_BENCH | Bancs d'assemblage |
| | METROLOGY_MACHINE | Machines métrologie |
| **STOCK** | STOCKS_CONSUMABLES_GLUES | Colles consommables |
| | STOCKS_OTHER_CONSUMABLES | Autres consommables |
| | STOCKS_INVENTORY_BASIC_PARTS | Pièces élémentaires |
| | STOCKS_INVENTORY_EC_STRUCTURING | Structuration EC |
| | STOCKS_INVENTORY_LMJ | Inventaire LMJ |
| | STOCKS_INVENTORY_OMEGA | Inventaire Omega |
| | STOCKS_STRUCTURING | Structuration |
| | STOCKS_SPECIAL_STRUCTURING | Structuration spéciale |
| | STOCKS_TRANSFERS | Mouvements de stock |
