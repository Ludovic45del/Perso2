/**
 * FSEC Referential Constants
 * @module entities/fsec/lib
 * 
 * Hardcoded values matching database initialization
 * Pattern: Same as entities/campaign/lib/referential.ts
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface FsecStatus {
    id: number;
    label: string;
    color: string;
}

export interface FsecCategory {
    id: number;
    label: string;
    color: string;
}

export interface FsecRack {
    id: number;
    label: string;
}

export interface FsecRole {
    id: number;
    label: string;
}

export interface FsecDocumentSubtype {
    id: number;
    label: string;
}

// ============================================================================
// STATUSES
// ============================================================================

export const FSEC_STATUSES: Record<number, FsecStatus> = {
    0: { id: 0, label: 'Brouillon', color: '#c3c3c3' },
    1: { id: 1, label: 'Validé', color: '#a2d82b' },
    2: { id: 2, label: 'En assemblage', color: '#7a8ce0' },
    3: { id: 3, label: 'Livré', color: '#ecce18' },
    4: { id: 4, label: 'Installé', color: '#b6c9fd' },
    5: { id: 5, label: 'Tiré', color: '#fdb9e3' },
};

// ============================================================================
// CATEGORIES - Types de configuration gaz
// ============================================================================

export const FSEC_CATEGORIES: Record<number, FsecCategory> = {
    1: { id: 1, label: 'Sans Gaz', color: '#7ac7f5' },
    2: { id: 2, label: 'Avec Gaz HP', color: '#c9a0dc' },
    3: { id: 3, label: 'Avec Gaz BP', color: '#fcc6b6' },
    4: { id: 4, label: 'Avec Gaz BP + HP', color: '#a2d82b' },
    5: { id: 5, label: 'Avec Gaz Permeation + BP', color: '#ecce18' },
};

// ============================================================================
// RACKS
// ============================================================================

export const FSEC_RACKS: Record<number, FsecRack> = {
    0: { id: 0, label: 'Rack 1' },
    1: { id: 1, label: 'Rack 2' },
    2: { id: 2, label: 'Rack 3' },
    3: { id: 3, label: 'Rack 4' },
};

// ============================================================================
// ROLES (Team members) - Par étape
// ============================================================================

/** Design Step Roles */
export const FSEC_DESIGN_ROLES: Record<number, FsecRole> = {
    0: { id: 0, label: 'MOE' },
    1: { id: 1, label: 'REC' },
    2: { id: 2, label: 'IEC' },
};

/** Assembly Step Roles */
export const FSEC_ASSEMBLY_ROLES: Record<number, FsecRole> = {
    0: { id: 0, label: 'Assembleur' },
};

/** Metrology Step Roles */
export const FSEC_METROLOGY_ROLES: Record<number, FsecRole> = {
    0: { id: 0, label: 'Métrologue' },
};

/** Pictures Step Roles */
export const FSEC_PICTURES_ROLES: Record<number, FsecRole> = {
    0: { id: 0, label: 'Équipe' },
};

/** All roles (legacy compatibility) */
export const FSEC_ROLES: Record<number, FsecRole> = {
    ...FSEC_DESIGN_ROLES,
    3: { id: 3, label: 'Assembleur' },
    4: { id: 4, label: 'Métrologue' },
    5: { id: 5, label: 'Équipe' },
};

// ============================================================================
// DOCUMENT TYPES & SUBTYPES - Par étape
// ============================================================================

export interface FsecDocumentType {
    id: number;
    label: string;
}

/** Document Types */
export const FSEC_DOCUMENT_TYPES: Record<number, FsecDocumentType> = {
    0: { id: 0, label: 'DESIGN' },
    1: { id: 1, label: 'METROLOGIE' },
    2: { id: 2, label: 'PHOTOS' },
};

/** Design Step Documents (6 types prédéfinis) */
export const FSEC_DESIGN_DOCUMENTS: Record<number, FsecDocumentSubtype> = {
    0: { id: 0, label: 'Visrad initial' },
    1: { id: 1, label: 'Vues' },
    2: { id: 2, label: '.STP Métro' },
    3: { id: 3, label: 'Fiches Car' },
    4: { id: 4, label: 'Fiche de réception' },
    5: { id: 5, label: "Gamme d'assemblage" },
};

/** Metrology Step Documents (3 types) */
export const FSEC_METROLOGY_DOCUMENTS: Record<number, FsecDocumentSubtype> = {
    0: { id: 0, label: 'Visrad contrôle' },
    1: { id: 1, label: 'Fichier métro' },
    2: { id: 2, label: 'Écart métro' },
};

/** Legacy compatibility */
export const FSEC_DOCUMENT_SUBTYPES: Record<number, FsecDocumentSubtype> = {
    ...FSEC_DESIGN_DOCUMENTS,
    6: { id: 6, label: 'Visrad contrôle' },
    7: { id: 7, label: 'Fichier métro' },
    8: { id: 8, label: 'Écart métro' },
    9: { id: 9, label: 'Photos' },
};

// ============================================================================
// ASSEMBLY BENCHES
// ============================================================================

export interface FsecAssemblyBench {
    id: number;
    label: string;
    color: string;
}

export const FSEC_ASSEMBLY_BENCHES: Record<number, FsecAssemblyBench> = {
    0: { id: 0, label: 'Banc 1', color: '#7ac7f5' },
    1: { id: 1, label: 'Banc 2', color: '#c9a0dc' },
    2: { id: 2, label: 'Banc 3', color: '#fcc6b6' },
    3: { id: 3, label: 'Banc 4', color: '#a2d82b' },
};

// ============================================================================
// METROLOGY MACHINES
// ============================================================================

export interface FsecMetrologyMachine {
    id: number;
    label: string;
    color: string;
}

export const FSEC_METROLOGY_MACHINES: Record<number, FsecMetrologyMachine> = {
    0: { id: 0, label: 'Machine A', color: '#7a8ce0' },
    1: { id: 1, label: 'Machine B', color: '#ecce18' },
    2: { id: 2, label: 'Machine C', color: '#fdb9e3' },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getFsecStatus(id: number | null | undefined): FsecStatus | null {
    if (id === null || id === undefined) return null;
    return FSEC_STATUSES[id] ?? { id, label: `Status ${id}`, color: '#999' };
}

export function getFsecCategory(id: number | null | undefined): FsecCategory | null {
    if (id === null || id === undefined) return null;
    return FSEC_CATEGORIES[id] ?? { id, label: `Category ${id}`, color: '#999' };
}

export function getFsecRack(id: number | null | undefined): FsecRack | null {
    if (id === null || id === undefined) return null;
    return FSEC_RACKS[id] ?? { id, label: `Rack ${id}` };
}

export function getFsecRole(id: number | null | undefined): FsecRole | null {
    if (id === null || id === undefined) return null;
    return FSEC_ROLES[id] ?? { id, label: `Role ${id}` };
}

export function getFsecDocumentSubtype(id: number | null | undefined): FsecDocumentSubtype | null {
    if (id === null || id === undefined) return null;
    return FSEC_DOCUMENT_SUBTYPES[id] ?? { id, label: `Subtype ${id}` };
}

export function getFsecAssemblyBench(id: number | null | undefined): FsecAssemblyBench | null {
    if (id === null || id === undefined) return null;
    return FSEC_ASSEMBLY_BENCHES[id] ?? { id, label: `Banc ${id}`, color: '#999' };
}

export function getFsecMetrologyMachine(id: number | null | undefined): FsecMetrologyMachine | null {
    if (id === null || id === undefined) return null;
    return FSEC_METROLOGY_MACHINES[id] ?? { id, label: `Machine ${id}`, color: '#999' };
}

// ============================================================================
// OPTIONS FOR SELECTS (ChipSelect compatible)
// ============================================================================

export const FSEC_STATUS_OPTIONS = Object.values(FSEC_STATUSES).map((s) => ({
    value: s.id,
    label: s.label,
    color: s.color,
}));

export const FSEC_CATEGORY_OPTIONS = Object.values(FSEC_CATEGORIES).map((c) => ({
    value: c.id,
    label: c.label,
    color: c.color,
}));

export const FSEC_RACK_OPTIONS = Object.values(FSEC_RACKS).map((r) => ({
    value: r.id,
    label: r.label,
    color: '#c3c3c3', // Neutral color for racks
}));


export const FSEC_ROLE_OPTIONS = Object.values(FSEC_ROLES).map((r) => ({
    value: r.id,
    label: r.label,
}));

export const FSEC_ASSEMBLY_BENCH_OPTIONS = Object.values(FSEC_ASSEMBLY_BENCHES).map((b) => ({
    value: b.id,
    label: b.label,
    color: b.color,
}));

export const FSEC_METROLOGY_MACHINE_OPTIONS = Object.values(FSEC_METROLOGY_MACHINES).map((m) => ({
    value: m.id,
    label: m.label,
    color: m.color,
}));

export const FSEC_DESIGN_DOCUMENT_OPTIONS = Object.values(FSEC_DESIGN_DOCUMENTS).map((d) => ({
    value: d.id,
    label: d.label,
}));

export const FSEC_METROLOGY_DOCUMENT_OPTIONS = Object.values(FSEC_METROLOGY_DOCUMENTS).map((d) => ({
    value: d.id,
    label: d.label,
}));
