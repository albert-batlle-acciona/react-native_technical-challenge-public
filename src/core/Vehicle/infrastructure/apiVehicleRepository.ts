import { Vehicle, VehicleDTO } from 'core/Vehicle/domain/Vehicle'
import { vehiclesSerializer } from 'core/Vehicle/infrastructure/vehicleSerializer'
import vehiclesData from 'core/Vehicle/infrastructure/_demo_vehicles.json'
import { VehicleRepository } from 'core/Vehicle/domain/VehicleRepository'

vehiclesData
export const apiVehicleRepository = ({}: {}): VehicleRepository => {
  const simulateFetchResponse = (data: VehicleDTO[]): Promise<VehicleDTO[]> => {
    return new Promise<VehicleDTO[]>((resolve) => {
      setTimeout(() => resolve(data), 200)
    })
  }
  return {
    all: async (): Promise<Vehicle[]> => {
      try {
        const response: Promise<VehicleDTO[]> = new Promise((resolve, reject) => {
          const data = simulateFetchResponse(vehiclesData)
          resolve(data)
        })
        return vehiclesSerializer.parse(await response)
      } catch (error: any) {
        throw { code: error.code, message: error.message }
      }
    },
    getById: async (id: number): Promise<Vehicle[]> => {
      try {
        const response: Promise<VehicleDTO[]> = new Promise((resolve, reject) => {
          const data = simulateFetchResponse(vehiclesData)
          resolve(data)
        })
        return vehiclesSerializer.parse(await response).filter(vehicle => vehicle.id === id)
      } catch (error: any) {
        throw { code: error.code, message: error.message }
      }
    }
  }
}
