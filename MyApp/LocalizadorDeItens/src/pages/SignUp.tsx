// src/pages/Signup.tsx

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
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore'; 

const Signup: React.FC = () => {
  const history = useHistory();
  const { signup } = useAuth(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('As senhas não coincidem!');
    }

    try {
      setError('');
      setLoading(true);
      
      const userCredential = await signup(email, password);
      const userId = userCredential.user.uid; 

      await setDoc(doc(db, 'users', userId), {
          uid: userId,
          email: email,
          dataCriacao: new Date().toISOString(),
      });
      
      history.push('/home'); 

    } catch (err) {
      setError('Falha ao criar conta. Verifique o email/senha.'); 
    }
    setLoading(false);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Registro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Crie sua Conta</IonCardTitle>
          </IonCardHeader>

          <form onSubmit={handleSignup}>
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

              <IonItem>
                <IonLabel position="floating">Confirmar Senha</IonLabel>
                <IonInput 
                  type="password" 
                  value={confirmPassword} 
                  onIonChange={(e) => setConfirmPassword(e.detail.value!)} 
                  required 
                />
              </IonItem>
            </IonList>

            <IonButton expand="block" type="submit" className="ion-margin-top" disabled={loading}>
              Registrar
            </IonButton>
            
            <IonButton 
              expand="block" 
              fill="clear" 
              routerLink="/login" 
              className="ion-margin-bottom"
            >
              Já tenho conta
            </IonButton>
          </form>
        </IonCard>
        
        <IonLoading 
          isOpen={loading} 
          message={'Criando conta...'}
        />

      </IonContent>
    </IonPage>
  );
};

export default Signup;