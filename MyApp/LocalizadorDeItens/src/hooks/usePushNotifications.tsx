import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const usePushNotifications = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser || !currentUser.uid) return;

    const registerPush = async () => {
      let permStatus = await PushNotifications.requestPermissions();

      if (permStatus.receive === 'granted') {
        await PushNotifications.register();
      } else {
        return;
      }

      PushNotifications.addListener('registration', async (token) => {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          await updateDoc(userRef, {
            pushToken: token.value,
          });
        } catch (e) {
          console.error('Erro ao salvar push token: ', e);
        }
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        alert(`NOVO ALERTA: ${notification.title} - ${notification.body}`);
      });
      
    };

    registerPush();

  }, [currentUser]);
};