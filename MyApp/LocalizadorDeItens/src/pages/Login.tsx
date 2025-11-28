// src/pages/Login.tsx

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
  IonText
} from '@ionic/react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const history = useHistory();
  const { login } = useAuth(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      
      await login(email, password);

      history.push('/home'); 

    } catch (err) {
      setError('Falha ao fazer login. Verifique seu e-mail e senha.'); 
    }
    setLoading(false);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Acesso</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Fazer Login</IonCardTitle>
          </IonCardHeader>

          <form onSubmit={handleLogin}>
            <IonList>
              {error && <IonItem><IonText color="danger">{error}</IonText></IonItem>}

              <IonItem>
                <IonLabel position="floating">E-mail</IonLabel>
                <IonInput 
                  type="email" 
                  value={email} 
                  onIonChange={(e) => setEmail(e.detail.value!)} 
                  required 
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Senha</IonLabel>
                <IonInput 
                  type="password" 
                  value={password} 
                  onIonChange={(e) => setPassword(e.detail.value!)} 
                  required 
                />
              </IonItem>
            </IonList>

            <IonButton expand="block" type="submit" className="ion-margin-top" disabled={loading}>
              Entrar
            </IonButton>
            
            <IonButton 
              expand="block" 
              fill="clear" 
              routerLink="/signup" 
              className="ion-margin-bottom"
            >
              Criar Conta
            </IonButton>
          </form>
        </IonCard>
        
        <IonLoading 
          isOpen={loading} 
          message={'Entrando...'}
        />

      </IonContent>
    </IonPage>
  );
};

export default Login;