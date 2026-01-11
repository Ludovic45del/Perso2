/**
 * FSEC Zod Schema - Validation & Transformation
 * @module entities/fsec/model
 *
 * Source of Truth: cible/domain/fsec/models/fsec_bean.py
 * API Format: snake_case → Domain Format: camelCase
 *
 * Structure selon rapport FSEC MODALE:
 * - designStep: name, campaign, comments, fsecTeam[3], fsecDocuments[6]
 * - assemblyStep: startDate, endDate, assemblyBench, fsecTeam[1], comments
 * - metrologyStep: date, machine, fsecTeam[1], fsecDocuments[3], comments
 * - sealingStep: interfaceIO, comments
 * - picturesStep: lastUpdated, fsecTeam[1], fsecDocuments[n], comments
 */

import { z } from 'zod';

// ============================================================================
// NESTED SCHEMAS - Team & Documents
// ============================================================================

/** Team member schema */
export const FsecTeamMemberSchema = z.object({
    name: z.string(),
    role: z.object({
        id: z.number(),
        label: z.string(),
    }),
});

export type FsecTeamMember = z.infer<typeof FsecTeamMemberSchema>;

/** Document schema */
export const FsecDocumentSchema = z.object({
    path: z.string(),
    type: z.object({
        id: z.number(),
        label: z.string(),
    }),
    subtype: z.object({
        id: z.number(),
        label: z.string(),
    }),
});

export type FsecDocument = z.infer<typeof FsecDocumentSchema>;

// ============================================================================
// STEP SCHEMAS
// ============================================================================

/** Design Step Schema */
export const FsecDesignStepSchema = z.object({
    name: z.string(),
    campaign: z.object({
        uuid: z.string().uuid(),
        name: z.string(),
    }).nullable(),
    comments: z.string().nullable(),
    fsecTeam: z.array(FsecTeamMemberSchema), // MOE, REC, IEC
    fsecDocuments: z.array(FsecDocumentSchema), // 6 documents DESIGN
});

export type FsecDesignStep = z.infer<typeof FsecDesignStepSchema>;

/** Assembly Step Schema */
export const FsecAssemblyStepSchema = z.object({
    startDate: z.date().nullable(),
    endDate: z.date().nullable(),
    assemblyBench: z.object({
        id: z.number(),
        label: z.string(),
    }).nullable(),
    fsecTeam: z.array(FsecTeamMemberSchema), // Assembleur
    comments: z.string().nullable(),
});

export type FsecAssemblyStep = z.infer<typeof FsecAssemblyStepSchema>;

/** Metrology Step Schema */
export const FsecMetrologyStepSchema = z.object({
    date: z.date().nullable(),
    machine: z.object({
        id: z.number(),
        label: z.string(),
    }).nullable(),
    fsecTeam: z.array(FsecTeamMemberSchema), // Métrologue
    fsecDocuments: z.array(FsecDocumentSchema), // 3 documents métrologie
    comments: z.string().nullable(),
});

export type FsecMetrologyStep = z.infer<typeof FsecMetrologyStepSchema>;

/** Sealing Step Schema */
export const FsecSealingStepSchema = z.object({
    interfaceIO: z.string().nullable(),
    comments: z.string().nullable(),
});

export type FsecSealingStep = z.infer<typeof FsecSealingStepSchema>;

/** Pictures Step Schema */
export const FsecPicturesStepSchema = z.object({
    lastUpdated: z.date().nullable(),
    fsecTeam: z.array(FsecTeamMemberSchema), // Équipe
    fsecDocuments: z.array(FsecDocumentSchema), // Photos dynamiques
    comments: z.string().nullable(),
});

export type FsecPicturesStep = z.infer<typeof FsecPicturesStepSchema>;

/** Usable Step Schema */
export const FsecUsableStepSchema = z.object({
    deliveryDate: z.date().nullable(),
});

export type FsecUsableStep = z.infer<typeof FsecUsableStepSchema>;

/** Installed Step Schema */
export const FsecInstalledStepSchema = z.object({
    shootingDate: z.date().nullable(),
    preshootingPressure: z.number().nullable(),
    experienceSrxx: z.string().nullable(),
    fsecDocuments: z.array(FsecDocumentSchema).optional(), // Documents Tir
});

export type FsecInstalledStep = z.infer<typeof FsecInstalledStepSchema>;

/**
 * Raw API response schema (snake_case from Backend)
 */
export const FsecApiSchema = z.object({
    // Versioning
    version_uuid: z.string().uuid(),
    fsec_uuid: z.string().uuid(),

    // Foreign Keys
    campaign_id: z.string().uuid().nullable(),
    status_id: z.number().int().nullable(),
    category_id: z.number().int().nullable(),
    rack_id: z.number().int().nullable(),

    // Base fields
    name: z.string(),
    comments: z.string().nullable(),
    last_updated: z.string().nullable(),
    is_active: z.boolean(),
    created_at: z.string().nullable(),

    // Workflow fields
    delivery_date: z.string().nullable(),
    shooting_date: z.string().nullable(),
    preshooting_pressure: z.number().nullable(),
    experience_srxx: z.string().nullable(),
    localisation: z.string().nullable(),
    depressurization_failed: z.boolean().nullable(),

    // Legacy fields (optional - may not be present in all API responses)
    embase: z.string().nullable().optional(),
    restitution_date: z.string().nullable().optional(),

    // Nested Data - Typed schemas for API response
    fsec_team: z.array(z.object({
        uuid: z.string().uuid().optional(),
        name: z.string(),
        role_id: z.number().int().optional(),
        step_type: z.string().optional(),
        step_uuid: z.string().uuid().nullable().optional(),
    })).optional().default([]),
    fsec_documents: z.array(z.object({
        uuid: z.string().uuid().optional(),
        name: z.string().optional(),
        path: z.string(),
        subtype_id: z.number().int().optional(),
        step_type: z.string().optional(),
        step_uuid: z.string().uuid().nullable().optional(),
    })).optional().default([]),
});

/**
 * Domain schema with camelCase transformation
 */
export const FsecSchema = FsecApiSchema.transform((api) => ({
    // Versioning
    versionUuid: api.version_uuid,
    fsecUuid: api.fsec_uuid,

    // Foreign Keys
    campaignId: api.campaign_id,
    statusId: api.status_id,
    categoryId: api.category_id,
    rackId: api.rack_id,

    // Base fields
    name: api.name,
    comments: api.comments,
    lastUpdated: api.last_updated ? new Date(api.last_updated) : null,
    isActive: api.is_active,
    createdAt: api.created_at ? new Date(api.created_at) : null,

    // Workflow fields
    deliveryDate: api.delivery_date ? new Date(api.delivery_date) : null,
    shootingDate: api.shooting_date ? new Date(api.shooting_date) : null,
    preshootingPressure: api.preshooting_pressure,
    experienceSrxx: api.experience_srxx,
    localisation: api.localisation,
    depressurizationFailed: api.depressurization_failed,

    // Additional fields for old frontend compatibility
    embase: api.embase,
    restitutionDate: api.restitution_date ? new Date(api.restitution_date) : null,

    // Nested Data
    fsecTeam: api.fsec_team,
    fsecDocuments: api.fsec_documents,
}));

export type Fsec = z.infer<typeof FsecSchema>;
export type FsecApi = z.input<typeof FsecSchema>;

/**
 * Schema for FSEC list response
 */
export const FsecListSchema = z.array(FsecApiSchema).transform((list) =>
    list.map((api) => FsecSchema.parse(api))
);

// ============================================================================
// CREATE SCHEMA - Structure selon rapport FSEC MODALE
// ============================================================================

/**
 * Schema for creating a FSEC (input to API) - Design Step
 * Layout 3 colonnes: Infos | Équipe | Documents
 */
export const FsecCreateSchema = z.object({
    // Colonne 1: Infos de base
    name: z.string().min(1, 'Le nom est requis'),
    campaignId: z.string().uuid({ message: 'La campagne est requise' }).nullable(),
    categoryId: z.number().int({ message: 'La catégorie est requise' }).nullable(),
    comments: z.string().nullable().optional(),

    // Colonne 2: Équipe FSEC (3 rôles prédéfinis)
    moe: z.string().optional(),
    rec: z.string().optional(),
    iec: z.string().optional(),

    // Colonne 3: Documents FSEC (6 types DESIGN prédéfinis)
    docVisradInitial: z.string().optional(),
    docVues: z.string().optional(),
    docStpMetro: z.string().optional(),
    docFichesCar: z.string().optional(),
    docFicheReception: z.string().optional(),
    docGammeAssemblage: z.string().optional(),

    // Legacy fields (kept for compatibility)
    statusId: z.number().int().nullable().optional(),
    rackId: z.number().int().nullable().optional(),
    deliveryDate: z.date().nullable().optional(),
    shootingDate: z.date().nullable().optional(),
    preshootingPressure: z.number().nullable().optional(),
    experienceSrxx: z.string().nullable().optional(),
    localisation: z.string().nullable().optional(),
});

export type FsecCreate = z.infer<typeof FsecCreateSchema>;

// ============================================================================
// UPDATE SCHEMA - Structure 6 Steps selon rapport FSEC MODALE
// ============================================================================

/**
 * Schema for updating a FSEC - All steps combined
 */
export const FsecUpdateSchema = z.object({
    // Global
    categoryId: z.number().int().nullable(),
    statusId: z.number().int().nullable(),
    rackId: z.number().int().nullable(),

    // Step 1: Design
    designStep: z.object({
        name: z.string().min(1, 'Le nom est requis'),
        campaignId: z.string().uuid().nullable(),
        comments: z.string().nullable(),
        fsecTeam: z.array(z.object({
            name: z.string(),
            roleId: z.number(),
        })),
        fsecDocuments: z.array(z.object({
            path: z.string(),
            subtypeId: z.number(),
        })),
    }),

    // Step 2: Assemblage
    assemblyStep: z.object({
        startDate: z.date().nullable(),
        endDate: z.date().nullable(),
        assemblyBenchId: z.number().nullable(),
        assemblerName: z.string().optional(),
        comments: z.string().nullable(),
    }),

    // Step 3: Métrologie
    metrologyStep: z.object({
        date: z.date().nullable(),
        machineId: z.number().nullable(),
        metrologueName: z.string().optional(),
        visradControlePath: z.string().optional(),
        fichierMetroPath: z.string().optional(),
        ecartMetroPath: z.string().optional(),
        comments: z.string().nullable(),
    }),

    // Step 4: Scellement
    sealingStep: z.object({
        interfaceIO: z.string().nullable(),
        comments: z.string().nullable(),
    }),

    // Step 5: Photos
    picturesStep: z.object({
        lastUpdated: z.date().nullable(),
        equipeName: z.string().optional(),
        fsecDocuments: z.array(z.object({
            path: z.string(),
            subtypeId: z.number(),
        })),
        comments: z.string().nullable(),
    }),

    // Step 6: Résultats (Livraison & Tir)
    usableStep: z.object({
        deliveryDate: z.date().nullable(),
    }),

    installedStep: z.object({
        shootingDate: z.date().nullable(),
        preshootingPressure: z.number().nullable(),
        experienceSrxx: z.string().nullable(),
        fsecDocuments: z.array(z.object({
            path: z.string(),
            subtypeId: z.number(),
        })).optional(),
    }),
});

export type FsecUpdate = z.infer<typeof FsecUpdateSchema>;

// ============================================================================
// DEFAULT VALUES - Selon rapport FSEC MODALE
// ============================================================================

/** Default form values for FSEC creation */
export const FSEC_CREATE_DEFAULT: FsecCreate = {
    name: '',
    campaignId: null,
    categoryId: null,
    comments: null,

    // Équipe FSEC (3 rôles prédéfinis)
    moe: '',
    rec: '',
    iec: '',

    // Documents FSEC (6 types DESIGN prédéfinis)
    docVisradInitial: '',
    docVues: '',
    docStpMetro: '',
    docFichesCar: '',
    docFicheReception: '',
    docGammeAssemblage: '',

    // Legacy
    statusId: 0,
    rackId: null,
    deliveryDate: null,
    shootingDate: null,
    preshootingPressure: null,
    experienceSrxx: null,
    localisation: null,
};

// ============================================================================
// API TRANSFORMERS
// ============================================================================

/**
 * Transform FsecCreate to API format (CamelCase + Root Level Fields)
 */
export function fsecCreateToApi(data: FsecCreate): Record<string, unknown> {
    return {
        name: data.name.toUpperCase(),
        comments: data.comments,
        category: data.categoryId ? { id: data.categoryId } : null,
        status: { id: data.statusId || 0 },
        rack: data.rackId ? { id: data.rackId } : null,
        campaign: data.campaignId ? { uuid: data.campaignId } : null,

        // Team members (Root level for create)
        fsecTeam: [
            { name: data.moe ?? '', role: { id: 1 } },
            { name: data.rec ?? '', role: { id: 2 } },
            { name: data.iec ?? '', role: { id: 3 } },
        ].filter(m => m.name),

        // Documents (Root level for create, singular field name "fsecDocument")
        fsecDocument: [
            { path: data.docVisradInitial ?? '', subtype: { id: 1 } },
            { path: data.docVues ?? '', subtype: { id: 2 } },
            { path: data.docStpMetro ?? '', subtype: { id: 3 } },
            { path: data.docFichesCar ?? '', subtype: { id: 4 } },
            { path: data.docFicheReception ?? '', subtype: { id: 5 } },
            { path: data.docGammeAssemblage ?? '', subtype: { id: 6 } },
        ].filter(d => d.path),

        // Legacy dates/fields at root
        deliveryDate: data.deliveryDate?.toISOString() ?? null,
        shootingDate: data.shootingDate?.toISOString() ?? null,
        preshootingPressure: data.preshootingPressure ?? null,
        experienceSrxx: data.experienceSrxx ?? null,
        localisation: data.localisation ?? null,
    };
}
