import {ColumnsData} from "../DataTableRow.tsx";

export const TRANSFERS_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'date',
        headerName: 'Date',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'equipmentType',
        headerName: 'Type de matériel',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'equipment',
        headerName: 'Matériel',
        objectType: 'string',
        isSortable: true
    },

    {
        fieldName: 'initialStock',
        headerName: 'Stock initial',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'units',
        headerName: 'Unités',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'entryDate',
        headerName: 'Entrée',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'exitDate',
        headerName: 'Sortie',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'currentStock',
        headerName: 'Stock courant',
        objectType: 'string',
        isSortable: true
    },

];


export const CONSUMABLES_GLUES_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'item',
        headerName: 'Article',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'stocks',
        headerName: 'Stock',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'unit',
        headerName: 'Unité',
        objectType: 'string',
        isSortable: true
    },

    {
        fieldName: 'expiryDate',
        headerName: 'Date de péremption',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'reference',
        headerName: 'Référence',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'buyingType',
        headerName: 'Type d\'achat',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'supplier',
        headerName: 'Fournisseur',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'additionalComment',
        headerName: 'Commentaire',
        objectType: 'string',
        isSortable: true
    },

];

export const OTHER_CONSUMABLES_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'item',
        headerName: 'Article',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'stocks',
        headerName: 'Stock',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'unit',
        headerName: 'Unité',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'reference',
        headerName: 'Référence',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'buyingType',
        headerName: 'Type d\'achat',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'supplier',
        headerName: 'Fournisseur',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'additionalComment',
        headerName: 'Commentaire',
        objectType: 'string',
        isSortable: true
    },

];

export const STRUCTURING_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'who',
        headerName: 'Qui',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'fulfillmentDate',
        headerName: 'Date de réalisation',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'structuringNumber',
        headerName: 'N° de Structuration',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'pamsNumber',
        headerName: 'N° PAMS',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'localisation',
        headerName: 'Emplacement',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'fsec',
        headerName: 'Edifice cible',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'usageDate',
        headerName: 'Date d\'utilisation',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'comments',
        headerName: 'Remarques',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'additionalComment',
        headerName: 'Commentaire',
        objectType: 'string',
        isSortable: true
    },

];

export const SPECIAL_STRUCTURING_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'who',
        headerName: 'Qui',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'fulfillmentDate',
        headerName: 'Date de réalisation',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'structuringNumber',
        headerName: 'N° de Structuration',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'pamsNumber',
        headerName: 'N° PAMS',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'localisation',
        headerName: 'Emplacement',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'fsec',
        headerName: 'Edifice cible',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'usageDate',
        headerName: 'Date d\'utilisation',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'materialsMat',
        headerName: 'Matériaux mat',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'comments',
        headerName: 'Remarques',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'additionalComment',
        headerName: 'Commentaire',
        objectType: 'string',
        isSortable: true
    },
];

export const INVENTORY_BASIC_PARTS_CATALOG_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'elementName',
        headerName: 'Nom élement',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'boxNumberOrBoxDescription',
        headerName: 'Numéro boite ou descriptif boite',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'availability',
        headerName: 'Disponibilité',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'deliveryDate',
        headerName: 'Date livraison',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'exitDate',
        headerName: 'Date de sortie',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'usedCampaign',
        headerName: 'Campagne utilisée',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'fsec',
        headerName: 'Edifice cible',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'additionalComment',
        headerName: 'Commentaire',
        objectType: 'string',
        isSortable: true
    },

];

export const INVENTORY_EC_STRUCTURING_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'item',
        headerName: 'Article',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'stocks',
        headerName: 'Stock',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'unit',
        headerName: 'Unité',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'reference',
        headerName: 'Réference',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'buyingType',
        headerName: 'Type d\'achat',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'supplier',
        headerName: 'Fournisseur',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'fsec',
        headerName: 'Edifice cible',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'additionalComment',
        headerName: 'Commentaire',
        objectType: 'string',
        isSortable: true
    },

];

export const INVENTORY_LMJ_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'campaignDtriNumber',
        headerName: 'N° DTRI',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'iec',
        headerName: 'IEC',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'elementsOrTargetDescription',
        headerName: 'Description cible/éléments',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'digitsIfUntaggedElement',
        headerName: 'Nombre si élément non marqué',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'targetsOrElementNumber',
        headerName: 'N° cible/éléments',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'boxNumberOrBoxDescription',
        headerName: 'Numéro/descriptif boite',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'localisation',
        headerName: 'Emplacement',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'deliveryDate',
        headerName: 'Date de livraison',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'exitDate',
        headerName: 'Date de sortie',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'fsec',
        headerName: 'Edifice cible',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'additionalComment',
        headerName: 'Commentaire',
        objectType: 'string',
        isSortable: true
    },

];

export const INVENTORY_OMEGA_COLUMNS: ColumnsData[] = [
    {
        fieldName: 'drmnCampaignNumber',
        headerName: 'N° DRMN',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'iec',
        headerName: 'IEC',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'elementsOrTargetDescription',
        headerName: 'Description cible/éléments',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'digitsIfUntaggedElement',
        headerName: 'Nombre si élément non marqué',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'targetsOrElementNumber',
        headerName: 'N° cible/éléments',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'boxNumberOrBoxDescription',
        headerName: 'Numéro/descriptif boite',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'localisation',
        headerName: 'Emplacement',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'deliveryDate',
        headerName: 'Date de livraison',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'exitDate',
        headerName: 'Date de sortie',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'fsec',
        headerName: 'Edifice cible',
        objectType: 'string',
        isSortable: true
    },
    {
        fieldName: 'additionalComment',
        headerName: 'Commentaire',
        objectType: 'string',
        isSortable: true
    },

];
