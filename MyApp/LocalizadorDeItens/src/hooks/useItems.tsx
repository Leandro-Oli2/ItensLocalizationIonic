// src/hooks/useItems.tsx

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Geolocation, Position } from '@capacitor/geolocation';

interface Item {
  id: string;
  uid: string;
  email: string;
  titulo: string;
  descricao: string;
  tipo: 'Perdido' | 'Encontrado';
  latitude: number;
  longitude: number;
  dataPostagem: string;
  resolvido: boolean;
  distanciaKm?: number;
}

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Position['coords'] | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      try {
        const position = await Geolocation.getCurrentPosition();
        setUserLocation(position.coords);
      } catch (e) {
        setUserLocation({ latitude: 0, longitude: 0 } as Position['coords']);
      }
    };
    getLocation();
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const itemsQuery = query(collection(db, 'items'), orderBy('dataPostagem', 'desc'));

    const unsubscribe = onSnapshot(itemsQuery, (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => {
        const data = doc.data() as Omit<Item, 'id'>;
        let distanciaKm;
        
        if (userLocation && data.latitude && data.longitude) {
          distanciaKm = calculateDistance(
            userLocation.latitude, 
            userLocation.longitude, 
            data.latitude, 
            data.longitude
          );
        }

        return {
          id: doc.id,
          ...data,
          distanciaKm: distanciaKm ? parseFloat(distanciaKm.toFixed(2)) : undefined,
        } as Item;
      }).filter(item => !item.resolvido);

      fetchedItems.sort((a, b) => (a.distanciaKm || Infinity) - (b.distanciaKm || Infinity));
      
      setItems(fetchedItems);
      setLoading(false);
    }, (error) => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userLocation]);

  return { items, loading, userLocation };
};