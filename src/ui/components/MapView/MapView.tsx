import { useEffect, useRef, useState } from "react"
import { View, Text, Alert, Image, Pressable, ActivityIndicator, Button } from "react-native"
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { LOGO, BIKE } from '../../../assets'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { inject } from "_di/container"
import { useQueryService } from "ui/_hooks/useService"
import { Vehicle } from "core/Vehicle/domain/Vehicle"
import { styles } from "./MapView.styles"
import { VehicleMarker } from "./components/Marker"
import React from "react"
import { useQueryClient } from "@tanstack/react-query"
import BookTimer from "./components/BookTimer"

export const Map = () => {

    const queryClient = useQueryClient()
    const vehicleUseCase = inject('vehicleUseCase')

    const mapRef = useRef<MapView>(null)
    const [location, setLocation] = useState<Location.LocationObject>()
    const [selectedVehicle, setSelectedVehicle] = useState<number>()
    const [bookedVehicle, setBookedVehicle] = useState<number>()
    const [vehicle, setVehicle] = useState<Vehicle>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isPressed, setIsPressed] = useState<boolean>(false)
    const bottomSheetRef = useRef<BottomSheet>(null)

    const { data: vehicles } = useQueryService<Vehicle[]>('vehicles', [bookedVehicle],
        () => bookedVehicle ? vehicleUseCase.getById(bookedVehicle) : vehicleUseCase.all()
    )

    const bookVehicle = React.useCallback(() => {
        if (selectedVehicle !== undefined) {
            setBookedVehicle(selectedVehicle)
        }
    }, [selectedVehicle])

    const cancelBooking = React.useCallback(() => {

        if (bookedVehicle !== undefined) return
        const vehicle = vehicles.find(v => v.id === bookedVehicle)
        if (vehicle) {
            vehicle.lastBookingFinishedAt = new Date().toISOString()
            setBookedVehicle(undefined)
        }

    }, [bookedVehicle])

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied')
                return
            }

            let location = await Location.getCurrentPositionAsync({})
            setLocation(location)
        })();
    }, [])

    useEffect(() => {
        try {
            bottomSheetRef?.current?.expand()
            if (location && mapRef.current) {
                const onCurrentMarkerRegion = mapRef.current as MapView
                onCurrentMarkerRegion.animateToRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                })
            }
        } catch (error: any) {
            console.log(`Error: ${error.message}`)
        }
    }, [location])


    const deselectVehicle = () => {
        setVehicle(undefined)
        setSelectedVehicle(-1)
    }
    const pressToTrue = () => setIsPressed(true)
    const pressToFalse = () => setIsPressed(false)

    return (
        <View style={styles.container}>
            <View>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    showsUserLocation
                    initialRegion={{
                        latitude: 40.457636,
                        longitude: -3.675292,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {vehicles && <VehicleMarker
                        vehicles={vehicles}
                        deselectVehicle={deselectVehicle}
                        selectedVehicle={selectedVehicle}
                        setIsLoading={setIsLoading}
                        setVehicle={setVehicle}
                        setSelectedVehicle={setSelectedVehicle}
                        bottomSheetRef={bottomSheetRef}
                    />}
                    {/* {locationsOfInterest.map((location, index) => (
                        <Marker

                            key={index}
                            coordinate={location.location}
                            title={location.data.title}
                            description={location.data.description}
                        />
                    ))} */}
                </MapView>
            </View>

            <BottomSheet
                // style={styles.containerBottomSheet}
                ref={bottomSheetRef}
                snapPoints={['60%']}
                enablePanDownToClose
                // enableDynamicSizing
                animateOnMount

            >
                <BottomSheetScrollView
                    alwaysBounceVertical={false}
                >
                    <View style={styles.contentBottomSheet}>
                        {isLoading && <ActivityIndicator />}
                        <View style={styles.maxWidth}>
                            {!vehicle && (
                                <View style={styles.brandImageContainer} >
                                    <Image source={LOGO} style={styles.brandImage} />
                                </View>
                            )}
                            {vehicle && (
                                <View style={styles.bikeImageContainer}>
                                    <Image source={BIKE} style={styles.bikeImage} />
                                </View>
                            )}
                        </View>
                        {vehicle && !isLoading && (
                            <>
                                <Text style={{ fontWeight: 'bold', fontSize: 21 }}>{vehicle.customId}</Text>
                                <Text><Text style={{ fontWeight: 'bold' }}>Batería:</Text> {vehicle.batteryLevel}</Text>
                                <Text><Text style={{ fontWeight: 'bold' }}>Autonomía:</Text> {vehicle.autonomy}</Text>
                                <BookTimer />
                                <View style={{ width: '100%', height: 35, }}>
                                </View>

                                {
                                    bookedVehicle ?
                                        <Pressable
                                            onPressIn={pressToTrue}
                                            onPressOut={pressToFalse}
                                            onPress={cancelBooking}
                                            style={[styles.button, { opacity: isPressed ? .5 : 1, backgroundColor: '#4f0e0e' }]}
                                        >
                                            <Text style={styles.buttonText}>Cancelar la reserva</Text>
                                        </Pressable> :
                                        <Pressable
                                            onPressIn={pressToTrue}
                                            onPressOut={pressToFalse}
                                            onPress={bookVehicle}
                                            style={[styles.button, { opacity: isPressed ? .5 : 1 }]}
                                        >
                                            < Text style={styles.buttonText}>Reservar</Text>
                                        </Pressable>
                                }
                            </>
                        )}

                    </View>
                </BottomSheetScrollView >
            </BottomSheet >
            {/* <Button title="Open" onPress={() => bottomSheetRef.current.expand()} />
            <Button title="Close" onPress={() => bottomSheetRef.current.collapse()} /> */}
        </View >
    )
}


