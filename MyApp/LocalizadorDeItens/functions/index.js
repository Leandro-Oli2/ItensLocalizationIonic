const admin = require("firebase-admin");
admin.initializeApp();

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");

const fcm = admin.messaging();
const db = admin.firestore();

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

exports.sendMatchNotification = onDocumentCreated("items/{itemId}", async (event) => {
    const snap = event.data;
    const newItem = snap.data();

    if (newItem.tipo !== "Encontrado") {
        return;
    }

    const MAX_DISTANCE_KM = 5;

    const lostItemsSnapshot = await db
        .collection("items")
        .where("tipo", "==", "Perdido")
        .where("resolvido", "==", false)
        .get();

    const matches = [];

    lostItemsSnapshot.forEach((doc) => {
        const lostItem = doc.data();

        const distance = calculateDistance(
            newItem.latitude,
            newItem.longitude,
            lostItem.latitude,
            lostItem.longitude
        );

        if (distance <= MAX_DISTANCE_KM) {
            matches.push({
                lostItem: lostItem,
                ownerUid: lostItem.uid,
                distance: distance.toFixed(2),
            });
        }
    });

        if (matches.length === 0) return;

    for (const match of matches) {
        const userDoc = await db.collection("users").doc(match.ownerUid).get();
        const userData = userDoc.data();
        const token = userData?.pushToken;

        if (token) {
            await fcm.send({
                notification: {
                    title: "🚨 POSSÍVEL MATCH ENCONTRADO!",
                    body: `Seu item PERDIDO (${match.lostItem.titulo}) pode ter sido ENCONTRADO a ${match.distance} km de você!`,
                },
                token,
            });
        }
    }

});
