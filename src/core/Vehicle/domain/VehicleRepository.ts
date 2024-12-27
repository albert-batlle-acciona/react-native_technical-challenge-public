import { Vehicle } from 'core/Vehicle/domain/Vehicle'

export interface VehicleRepository {
  all: () => Promise<Vehicle[]>
  getById: (id: number) => Promise<Vehicle[]>
}
