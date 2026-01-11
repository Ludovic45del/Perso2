


export interface TabData {
    label: string,
    path: string
    subpath?: string,
    isDisabled?: boolean,
    stepToRedirectInModal?: number
}


export const getActiveTab = (tabsArray: TabData[]) => {
    const currentPath: string = window.location.pathname;
    const index = tabsArray.map(tab => tab.path).findIndex(path => currentPath?.includes(path));
    return index >= 0 ? index : false
}