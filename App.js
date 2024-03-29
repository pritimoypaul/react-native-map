import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [markerLoc, setMarkerLoc] = useState({
    latitude: location?.coords?.latitude || 23.65116,
    longitude: location?.coords?.longitude || 90.4886321,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View style={{ display: "flex", flex: 1 }}>
      <View style={{ marginVertical: 40 }}>
        <Text>FInd your location in map</Text>
        <Text>
          Longitude: {markerLoc?.longitude} Latitude: {markerLoc?.latitude}
        </Text>
      </View>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          zoomControlEnabled={true}
          showsCompass={true}
          showsUserLocation={true}
          showsMyLocationButton={true}
          initialRegion={{
            latitude: location?.coords?.latitude || 23.65116,
            longitude: location?.coords?.longitude || 90.4886321,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
          onPress={(e) => {
            setMarkerLoc({
              latitude: e.nativeEvent?.coordinate?.latitude,
              longitude: e.nativeEvent?.coordinate?.longitude,
            });
          }}
        >
          <Marker
            coordinate={{
              latitude: markerLoc.latitude,
              longitude: markerLoc.longitude,
            }}
          />
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "70%",
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
