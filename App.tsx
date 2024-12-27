import React, { useCallback, useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View, Text } from 'react-native'
import { Map } from './src/ui/components/MapView/MapView'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { registerModules } from './src/_di/registerModules'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'

export default function App() {
  registerModules()
  const queryClient = new QueryClient()

  return (
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>

        <View style={styles.container}>
          <Map />
          <StatusBar style="auto" />
        </View>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
