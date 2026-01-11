export default interface InventoryLmjModel {
    uuid: string
    iec: string
    elementsOrTargetDescription: string
    digitsIfUntaggedElement: string
    targetsOrElementNumber: string
    boxNumberOrBoxDescription: string
    localisation: string
    deliveryDate: string
    exitDate: string
    campaignDtriNumber: string
    additionalComment?: string
    fsec?: string
}