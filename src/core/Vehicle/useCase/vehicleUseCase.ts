import { Vehicle } from "core/Vehicle/domain/Vehicle"
import { VehicleRepository } from "core/Vehicle/domain/VehicleRepository"

export interface VehicleUseCase {
  all: () => Promise<Vehicle[]>,
  getById: (id: number) => Promise<Vehicle[]>
}

export const vehicleUseCase = ({ vehicleRepository }: { vehicleRepository: VehicleRepository }): VehicleUseCase => ({
  all: () => vehicleRepository.all(),
  async getById(id: number) {
    return vehicleRepository.all().then(vehicles => vehicles.filter(vehicle => vehicle.id === id))
  }
})
