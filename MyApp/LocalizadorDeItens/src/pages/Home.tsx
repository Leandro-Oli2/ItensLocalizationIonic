import React from 'react';
import { useHistory } from 'react-router';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButton,
  IonText,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonSpinner,
  IonNote,
  IonRouterLink,
  useIonRouter
} from '@ionic/react';
import { logOutOutline, addCircleOutline, mapOutline, walkOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { useItems } from '../hooks/useItems';
import { usePushNotifications } from '../hooks/usePushNotifications';

const Home: React.FC = () => {
  const router = useIonRouter();  
  const history = useHistory();
  const { currentUser, logout } = useAuth();
  const { items, loading, userLocation } = useItems();
  usePushNotifications();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload();
    } catch {
      alert('Falha ao sair. Tente novamente.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Localizador Comunitário</IonTitle>
          <IonButton slot="end" onClick={handleLogout} fill="clear" color="light">
            <IonIcon icon={logOutOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        
        <IonCard className="ion-margin">
          <IonCardHeader>
            <IonCardTitle>Bem-vindo, {currentUser?.email}!</IonCardTitle>
            <IonCardSubtitle>
                {userLocation 
                    ? `Localização: Lat ${userLocation.latitude.toFixed(4)}`
                    : 'Obtendo sua localização...'
                }
            </IonCardSubtitle>
          </IonCardHeader>
        </IonCard>

        <IonRouterLink routerLink="/new-item">
          <IonButton expand="block" color="success" className="ion-margin">
            <IonIcon slot="start" icon={addCircleOutline} />
            Registrar Novo Item
          </IonButton>
        </IonRouterLink>

        <h3 className="ion-padding-start">Itens Próximos na Comunidade:</h3>

        {loading && (
          <div className="ion-text-center ion-padding-top">
            <IonSpinner name="crescent" />
            <IonText color="medium"><p>Carregando itens...</p></IonText>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div className="ion-text-center ion-padding-top">
            <IonText color="medium"><p>Nenhum item encontrado na área. Comece registrando um!</p></IonText>
          </div>
        )}

        <IonList>
          {items.map(item => (
            <IonItem 
              key={item.id} 
              detail={true} 
              button 
              routerLink={`/item-details/${item.id}`}
            >
              <IonIcon 
                slot="start" 
                icon={item.tipo === 'Perdido' ? mapOutline : walkOutline} 
                color={item.tipo === 'Perdido' ? 'danger' : 'success'}
              />
              <IonLabel>
                <h2>{item.titulo}</h2>
                <p>Tipo: **{item.tipo}**</p>
                <p>{item.descricao.substring(0, 50)}...</p>
              </IonLabel>
              <IonNote slot="end" color={item.distanciaKm !== undefined ? 'primary' : 'medium'}>
                {item.distanciaKm !== undefined 
                    ? `${item.distanciaKm} km` 
                    : 'Distância N/A'
                }
              </IonNote>
            </IonItem>
          ))}
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default Home;