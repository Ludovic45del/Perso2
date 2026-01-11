export default interface InventoryBasicPartsCatalogModel {
    uuid: string
    elementName: string
    availability: string
    boxNumberOrBoxDescription: string
    deliveryDate: string
    exitDate: string
    usedCampaign: string
    additionalComment?: string
    fsec?: string
}