// src/pages/NewItem.tsx

import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonInput, 
  IonButton, 
  IonItem, 
  IonLabel,
  IonLoading,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonAlert
} from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const NewItem: React.FC = () => {
  const history = useHistory();
  const { currentUser } = useAuth();
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState<'Perdido' | 'Encontrado' | undefined>(undefined);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  async function handlePostItem(e: React.FormEvent) {
    e.preventDefault();

    if (!currentUser || !tipo) {
      setError('Tipo de item não selecionado ou usuário não autenticado.');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      const newItem = {
        uid: currentUser.uid,
        email: currentUser.email,
        titulo,
        descricao,
        tipo,
        latitude,
        longitude,
        dataPostagem: new Date().toISOString(),
        resolvido: false,
      };

      await addDoc(collection(db, 'items'), newItem);

      setLoading(false);
      history.push('/home'); 

    } catch (err) {
      setError('Falha ao postar item. Verifique a permissão de localização.');
      setShowAlert(true);
      setLoading(false);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButton slot="start" onClick={() => history.goBack()}>Voltar</IonButton>
          <IonTitle>Novo Item</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Registrar Item Perdido ou Encontrado</IonCardTitle>
          </IonCardHeader>

          <form onSubmit={handlePostItem}>
            <IonList>
              <IonItem>
                <IonLabel position="floating">Título (Ex: Chaves, Carteira)</IonLabel>
                <IonInput 
                  value={titulo} 
                  onIonChange={(e) => setTitulo(e.detail.value!)} 
                  required 
                />
              </IonItem>

              <IonItem>
                <IonLabel>Tipo de Postagem</IonLabel>
                <IonSelect 
                    value={tipo} 
                    onIonChange={e => setTipo(e.detail.value)}
                    placeholder="Selecione"
                    required
                >
                  <IonSelectOption value="Perdido">Item Perdido</IonSelectOption>
                  <IonSelectOption value="Encontrado">Item Encontrado</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Descrição Detalhada</IonLabel>
                <IonTextarea 
                    value={descricao} 
                    onIonChange={(e) => setDescricao(e.detail.value!)} 
                    rows={4}
                    required 
                />
              </IonItem>

            </IonList>

            <IonButton expand="block" type="submit" className="ion-margin" disabled={loading}>
              Postar Item e Localizar
            </IonButton>
          </form>
        </IonCard>
        
        <IonLoading 
          isOpen={loading} 
          message={'Obtendo localização e enviando dados...'}
        />

        <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'Erro'}
            message={error}
            buttons={['OK']}
        />

      </IonContent>
    </IonPage>
  );
};

export default NewItem;