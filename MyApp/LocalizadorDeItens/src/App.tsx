// src/App.tsx

import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { 
IonApp, 
IonRouterOutlet, 
setupIonicReact 
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// --- IMPORTS DAS PÁGINAS ---
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Home from './pages/Home';
import NewItem from './pages/NewItem';
import ItemDetails from './pages/ItemDetails'; // NOVO IMPORT

// --- CORREÇÃO DE ESTILOS CSS (Removemos os imports problemáticos e adicionamos o tema) ---
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
// import '@ionic/react/css/text-transformation.css'; // REMOVIDO PARA EVITAR ERRO DE BUILD
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

setupIonicReact();

const App: React.FC = () => (
<IonApp>
 <IonReactRouter>
 <AuthProvider>
  <IonRouterOutlet id="main-content">
   
  {/* ROTAS PÚBLICAS */}
  <Route path="/signup" component={Signup} exact={true} />
  <Route path="/login" component={Login} exact={true} />
   
  {/* ROTAS PROTEGIDAS */}
  <PrivateRoute path="/home" component={Home} exact={true} />
  <PrivateRoute path="/new-item" component={NewItem} exact={true} />
          {/* ROTA DE DETALHES (USANDO PARÂMETRO) */}
          <PrivateRoute path="/item-details/:id" component={ItemDetails} exact={true} />
  
  {/* REDIRECIONAMENTO PADRÃO */}
  <Route exact path="/" render={() => <Redirect to="/home" />} />
   
  </IonRouterOutlet>
 </AuthProvider>
 </IonReactRouter>
</IonApp>
);

export default App;