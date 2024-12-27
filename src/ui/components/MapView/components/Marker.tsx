import { isEmpty, isUndefined } from 'core/shared/domain/utils'
import { Vehicle } from 'core/Vehicle/domain/Vehicle'

import { Pressable, Image, Button } from 'react-native'
import { Callout, Marker } from 'react-native-maps'
import { styles } from '../MapView.styles'
import { MOTORBIKE, SELECTED_MOTORBIKE } from 'src/assets'
import { MutableRefObject } from 'react'
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types'
import { Text } from 'react-native'
import React from 'react'

interface Props {
    vehicles: Vehicle[],
    deselectVehicle: () => void,
    setIsLoading: (value: boolean) => void,
    selectedVehicle: number | undefined,
    setVehicle: (value: Vehicle) => void
    setSelectedVehicle: (value: number) => void
    bottomSheetRef: MutableRefObject<BottomSheetMethods | null>
}

export const VehicleMarker = ({
    vehicles,
    deselectVehicle,
    selectedVehicle,
    setIsLoading,
    setVehicle,
    setSelectedVehicle,
    bottomSheetRef
}: Props) => {
    const loadVehicle = (vehicleIndex: number, event: any) => {
        event.stopPropagation()

        setIsLoading(true)
        setVehicle(vehicles![vehicleIndex])
        setSelectedVehicle(vehicleIndex)
        console.log('selectedVehicle', selectedVehicle)
        console.log('bottomSheetRef', bottomSheetRef.current)
        bottomSheetRef.current.expand()
        setTimeout(() => setIsLoading(false), 400)
    }

    return (
        <>
            {!isEmpty(vehicles) && !isUndefined(vehicles) && vehicles?.filter(v => !v.lastBookingFinishedAt).map((vehicle: Vehicle, index: number) => {
                return (
                    <Marker
                        title={vehicle.customId}
                        onSelect={(event) => loadVehicle(index, event)}
                        onDeselect={deselectVehicle}
                        key={index}
                        coordinate={{ latitude: vehicle.position.lat, longitude: vehicle.position.lng }} >
                        <Image
                            source={selectedVehicle === index ? SELECTED_MOTORBIKE : MOTORBIKE}
                            style={styles.markerIcon}
                        />
                        <Callout tooltip />
                    </Marker>
                )
            }
            )}
        </>
    )
}
