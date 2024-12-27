export interface VehicleDTO {
  id: number
  customId: string
  regionId: number
  type: string
  model: string
  plate: string
  batteryLevel: number
  autonomy: number
  position: Position
  hasSpecialTrunk: boolean
  hasPromo: boolean
  hasHelmetSensor: boolean
}

export interface Position {
  lat: number
  lng: number
}

export interface Vehicle {
  id: number
  customId: string
  batteryLevel: number
  autonomy: number
  position: Position
  booked: boolean
  lastBookingFinishedAt?: string

}

