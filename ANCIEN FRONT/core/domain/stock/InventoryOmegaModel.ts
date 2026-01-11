export default interface InventoryOmegaModel {
    uuid: string
    iec: string
    elementsOrTargetDescription: string
    digitsIfUntaggedElement: string
    targetsOrElementNumber: string
    boxNumberOrBoxDescription: string
    localisation: string
    deliveryDate: string
    exitDate: string
    drmnCampaignNumber: string
    additionalComment?: string
    fsec?: string
}