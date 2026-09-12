import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


/* =========================================================
   FIREBASE CONFIGURATION
   ========================================================= */

/*
   Paste the Firebase Web App configuration from:
   Firebase Console
   → Project Settings
   → Your Apps
   → Web App
*/

const firebaseConfig = {
    apiKey: "AIzaSyBhoUxK05fxMCOm8wEsynyue8vELF0sDAs",
    authDomain: "teacher-s-day-celebration.firebaseapp.com",
    projectId: "teacher-s-day-celebration",
    storageBucket: "teacher-s-day-celebration.firebasestorage.app",
    messagingSenderId: "435467938211",
    appId: "1:435467938211:web:9f9787eb522e682f3ed216"
};


/* =========================================================
   INITIALISE
   ========================================================= */

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const CARDS_COLLECTION = "teacherDayCards";


/* =========================================================
   CREATE CARD
   ========================================================= */

export async function createStudentCard(cardData) {

    const docRef = await addDoc(
        collection(db, CARDS_COLLECTION),
        {
            name: cardData.name,
            arrivalTime: cardData.arrivalTime,
            present: cardData.present,
            message: cardData.message,

            ownerId: cardData.ownerId,

            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
    );

    return docRef.id;
}


/* =========================================================
   UPDATE CARD
   ========================================================= */

export async function updateStudentCard(cardId, cardData) {

    const cardRef = doc(
        db,
        CARDS_COLLECTION,
        cardId
    );

    await updateDoc(
        cardRef,
        {
            name: cardData.name,
            arrivalTime: cardData.arrivalTime,
            present: cardData.present,
            message: cardData.message,

            updatedAt: serverTimestamp()
        }
    );
}


/* =========================================================
   DELETE CARD
   ========================================================= */

export async function deleteStudentCard(cardId) {

    const cardRef = doc(
        db,
        CARDS_COLLECTION,
        cardId
    );

    await deleteDoc(cardRef);
}


/* =========================================================
   REAL-TIME CARD LISTENER
   ========================================================= */

export function watchStudentCards(callback) {

    return onSnapshot(
        collection(db, CARDS_COLLECTION),
        snapshot => {

            const cards = [];

            snapshot.forEach(snapshotDoc => {

                cards.push({
                    id: snapshotDoc.id,
                    ...snapshotDoc.data()
                });

            });

            callback(cards);
        },

        error => {

            console.error(
                "Could not load Teacher's Day cards:",
                error
            );

            callback([]);
        }
    );
}


/* =========================================================
   GLOBAL FIREBASE BRIDGE
   ========================================================= */

window.teacherDayFirebase = {

    createStudentCard,
    updateStudentCard,
    deleteStudentCard,
    watchStudentCards,

    database: db,

    collectionName: CARDS_COLLECTION
};
