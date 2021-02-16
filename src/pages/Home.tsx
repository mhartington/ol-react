import { Plugins } from '@capacitor/core';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  useIonViewDidEnter,
} from '@ionic/react';
import { location, navigate } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import { MapWrapper, MapProps } from '../components/Map/Map';

import './Home.css';

const Home: React.FC = () => {
  const locationTrack = useRef<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [state, setState] = useState<MapProps>({
    lng: -71.418884,
    lat: 41.825226,
    zoom: 10,
    heading: 0,

  });
  useEffect(() => {
    return () => {
      if (locationTrack.current) {
        const { Geolocation } = Plugins;
        Geolocation.clearWatch({ id: locationTrack.current });
      }
    };
  }, []);
  const getLocation = async () => {
    const { Geolocation } = Plugins;
    const loc = await Geolocation.getCurrentPosition();
    setState({
      lng: loc.coords.longitude,
      lat: loc.coords.latitude,
      zoom: 10,
      heading: loc.coords.heading ?? 0,
    });
  };
  const trackLocation = () => {
    const { Geolocation } = Plugins;
    locationTrack.current = Geolocation.watchPosition({}, (loc, _err) => {
      setState({
        lng: loc.coords.longitude,
        lat: loc.coords.latitude,
        zoom: 10,
        heading: loc.coords.heading ?? 0,
      });
    });
  };
  useIonViewDidEnter(() => {
    setIsLoaded(true);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={getLocation}>
              <IonIcon icon={location} />
            </IonButton>
            <IonButton onClick={trackLocation}>
              <IonIcon icon={navigate} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {isLoaded ? <MapWrapper {...state} /> : null}
      </IonContent>
    </IonPage>
  );
};

export default Home;
