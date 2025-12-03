🔎 Localizador Comunitário de Itens Perdidos e Encontrados

Um aplicativo móvel híbrido para ajudar pessoas a reencontrarem itens perdidos através de geolocalização, notificações push e armazenamento em nuvem.
Quando um usuário registra um item perdido ou encontrado, o app verifica automaticamente a proximidade com outros registros e envia alertas em tempo real.

📱 Visão Geral
O app permite:

Registrar itens perdidos ou encontrados, com foto e descrição.

Capturar automaticamente a localização do usuário via GPS.

Mostrar itens próximos no mapa ou lista.

Comparar distância entre registros usando coordenadas.

Enviar notificações push quando um possível match é detectado.

Realizar login, registro e gerenciamento de conta.

🎯 Requisitos Acadêmicos Atendidos
Autenticação de usuários via Firebase Authentication

CRUD completo usando Firestore (itens + perfis)

Uso de recurso nativo (Geolocation com Capacitor)

Notificações push via FCM

Back-end em nuvem usando Cloud Functions

Aplicativo mobile híbrido com build Android

🏗️ Arquitetura e Tecnologias Utilizadas
Ionic Framework – UI e estrutura mobile híbrida

React + TypeScript – desenvolvimento front-end

Capacitor – integração com APIs nativas (GPS e push)

Firebase Authentication – login e registro

Cloud Firestore – banco de dados em tempo real

Firebase Cloud Functions – lógica de servidor para detecção de matches

Firebase Cloud Messaging (FCM) – envio de notificações

Android Studio – build, debug e publicação Android

🗂️ Estrutura do Projeto

MyApp/

  
  LocalizadorDeItens/
  
    src/
      pages/
      components/
      hooks/
      context/
      App.tsx
    android/
    functions/
      index.js
    firebase.ts
    capacitor.config.ts
    package.json

🚀 Como Executar o Projeto
1. Pré-requisitos

Antes de iniciar, você precisa ter:

Node.js versão 18+

Firebase CLI instalado e logado

Android Studio configurado

Um projeto criado no Firebase

Emulador Android ou celular físico

⚙️ Instalação e Setup

1) Instalar dependências

Na raiz do projeto:

cd LocalizadorDeItens

npm install

2) Gerar build web (React)
3) npm run build

🔥 Configuração do Firebase
Você precisa ajustar duas partes:

1) Firebase do front (src/firebase.ts)

Edite o arquivo e coloque as chaves do seu projeto (apiKey, authDomain, etc.).

2) Firebase Functions (functions/index.js)

Código do servidor responsável por:

ler novos itens cadastrados

comparar coordenadas

enviar notificações push via FCM

Certifique-se de que seu código está atualizado com o SDK oficial.

☁️ Deploy das Cloud Functions
O deployment exige plano Blaze.

Dentro da pasta functions/:


cd functions

npm install

firebase deploy --only functions

📱 Rodando no Android
Na raiz do projeto:

npx cap sync android
npx cap open android

Depois é só rodar pelo Android Studio.

🧪 Testes Recomendados
Cadastro de item com localização habilitada

Registro de item similar para verificar envio de push

Testar login e logout

Testar navegação e exibição de itens no mapa

📌 Melhorias Futuras (Roadmap)
Sistema de chat entre quem achou e perdeu

Filtros avançados por categoria do item

Modo offline com sincronização posterior

Histórico completo dos itens cadastrados
