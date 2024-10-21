import { initializeApp } from 'firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBDi-LwDBDBkCYYd6VXa1o1BrNmx06dg34",
  authDomain: "nextjs-firebase-chat-app.firebaseapp.com",
  projectId: "nextjs-firebase-chat-app",
  storageBucket: "nextjs-firebase-chat-app.appspot.com",
  messagingSenderId: "38372124480",
  appId: "1:38372124480:web:857463cf204b298f7a3ca5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth, Firestore, and Storage
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };





// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// // Your Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBDi-LwDBDBkCYYd6VXa1o1BrNmx06dg34",
//   authDomain: "nextjs-firebase-chat-app.firebaseapp.com",
//   projectId: "nextjs-firebase-chat-app",
//   storageBucket: "nextjs-firebase-chat-app.appspot.com",
//   messagingSenderId: "38372124480",
//   appId: "1:38372124480:web:857463cf204b298f7a3ca5"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db };






// ==================================
// firebase database code
// ==================================
// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {

//     // Conversations collection rules
//     match /conversations/{conversationId} {

//       // Allow the owner of the conversation (user) to read and update their own conversation
//       allow read, update: if request.auth != null && request.auth.uid == conversationId;

//       // Allow admins to read and update any conversation
//       allow read, update: if request.auth != null && get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == "admin";

//       // Allow authenticated users to create new conversations (tied to their user ID)
//       allow create: if request.auth != null && request.auth.uid == conversationId;

//       // Allow only admins to delete conversations
//       allow delete: if get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == "admin";
//     }

//     // Roles collection rules for managing user roles
//     match /roles/{userId} {
//       // Allow users to read their own role document (for checking admin status)
//       allow read: if request.auth != null && request.auth.uid == userId;

//       // Only allow admins to write/update roles (e.g., assign admin role)
//       allow write: if get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == "admin";
//     }
//   }
// }
