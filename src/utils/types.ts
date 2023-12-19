export type Message = {
    target: string
    type: string
    data: any
    forContentScript?: boolean
}

export type Popup = {
    name: string
    request: string
    origin: string
    action: string
    tabId: number
  }