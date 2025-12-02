// src/pages/Signup.tsx (FINALMENTE CORRIGIDO)

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
 setError(''); // Limpa erros antigos

    // 1. VALIDAÇÃO LOCAL (Usando .trim() para garantir a comparação sem espaços)
 if (password.trim() !== confirmPassword.trim()) {
 return setError('As senhas não coincidem!');
 }
    if (password.trim().length < 6) {
        return setError('A senha deve ter no mínimo 6 caracteres.');
    }


 try {
 setLoading(true);
 
 const userCredential = await signup(email.trim(), password.trim());
 const userId = userCredential.user.uid; 

 // 2. CRIAÇÃO DO PERFIL NO FIRESTORE
 await setDoc(doc(db, 'users', userId), {
  uid: userId,
  email: email.trim(),
  dataCriacao: new Date().toISOString(),
 });
 
 history.push('/home'); 

 } catch (err: any) {
 // 3. CAPTURA DE ERRO DETALHADO DO FIREBASE
 let errorMessage = 'Falha ao criar conta. Verifique o email/senha.';

      if (err.code) {
        switch (err.code) {
          case 'auth/configuration-not-found':
             errorMessage = 'Erro de Configuração. Verifique o console do Firebase.';
             break;
          case 'auth/email-already-in-use':
            errorMessage = 'Este e-mail já está em uso.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'O formato do e-mail é inválido.';
            break;
          case 'auth/weak-password':
            errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
            break;
          default:
            errorMessage = `Erro do Servidor: ${err.code}`;
        }
      }
      setError(errorMessage);
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
    {error && (
      <IonItem>
        <IonText color="danger">{error}</IonText>
      </IonItem>
    )}

    <IonItem>
      <IonLabel position="floating">E-mail</IonLabel>
      <IonInput
        type="email"
        required
        onIonInput={(e: any) => setEmail(e.target.value)}
      />
    </IonItem>

    <IonItem>
      <IonLabel position="floating">Senha</IonLabel>
      <IonInput
        type="password"
        required
        onIonInput={(e: any) => setPassword(e.target.value)}
      />
    </IonItem>

    <IonItem>
      <IonLabel position="floating">Confirmar Senha</IonLabel>
      <IonInput
        type="password"
        required
        onIonInput={(e: any) => setConfirmPassword(e.target.value)}
      />
    </IonItem>
  </IonList>

  <IonButton
    expand="block"
    type="submit"
    className="ion-margin-top"
    disabled={loading}
  >
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