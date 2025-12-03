import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButton,
  IonIcon,
  IonText,
  IonLoading,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { arrowBackOutline, locationOutline, personOutline } from 'ionicons/icons';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

interface Item {
  id: string;
  titulo: string;
  descricao: string;
  tipo: 'Perdido' | 'Encontrado';
  latitude: number;
  longitude: number;
  dataPostagem: string;
  email: string;
}

const ItemDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchItem() {
      if (!id) {
        setError('ID do item não fornecido.');
        setLoading(false);
        return;
      }

      try {
        const itemRef = doc(db, 'items', id);
        const docSnap = await getDoc(itemRef);

        if (docSnap.exists()) {
          setItem({ id: docSnap.id, ...docSnap.data() } as Item);
        } else {
          setError('Item não encontrado.');
        }
      } catch (err) {
        setError('Falha ao carregar detalhes do item.');
      }
      setLoading(false);
    }
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <IonLoading isOpen={loading} message={'Carregando item...'} />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={item?.tipo === 'Perdido' ? 'danger' : 'success'}>
          <IonButton slot="start" routerLink="/home">
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle>{item ? item.titulo : 'Detalhes'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        
        {error && <IonText color="danger" className="ion-padding">{error}</IonText>}

        {item && (
          <IonCard className="ion-margin">
            <IonCardHeader>
              <IonCardSubtitle>Status: {item.tipo}</IonCardSubtitle>
              <IonCardTitle>{item.titulo}</IonCardTitle>
            </IonCardHeader>

            <IonList lines="full">
              <IonItem>
                <IonLabel>
                  <IonIcon icon={locationOutline} slot="start" />
                  Local:
                </IonLabel>
                <IonText slot="end">{item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}</IonText>
              </IonItem>

              <IonItem>
                <IonLabel>
                  <IonIcon icon={personOutline} slot="start" />
                  Contato:
                </IonLabel>
                <IonText slot="end">{item.email}</IonText>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Descrição:</IonLabel>
                <IonText>{item.descricao}</IonText>
              </IonItem>
              
              <IonItem>
                <IonLabel>
                  Data da Publicação:
                </IonLabel>
                <IonText slot="end">{new Date(item.dataPostagem).toLocaleDateString()}</IonText>
              </IonItem>
            </IonList>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ItemDetails;