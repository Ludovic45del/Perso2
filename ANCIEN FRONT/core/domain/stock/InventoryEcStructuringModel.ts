export default interface InventoryEcStructuringModel {
    uuid: string
    item: string
    stocks: string
    unit: string
    reference: string
    buyingType: string
    supplier: string
    additionalComment?: string
    fsec?: string
}