import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, getDocs, query, where, limit, orderBy } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function getPageContent(pageId: string) {
  if (firebaseConfig.projectId === "YOUR_PROJECT_ID") return null;

  try {
    const docRef = doc(db, "pages", pageId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch Firebase content for page ${pageId}:`, err);
    return null;
  }
}

export async function getArticles() {
  if (firebaseConfig.projectId === "YOUR_PROJECT_ID") return [];

  try {
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, orderBy("publishedAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Failed to fetch articles:", err);
    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  if (firebaseConfig.projectId === "YOUR_PROJECT_ID") return null;

  try {
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, where("slug", "==", slug), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch article with slug ${slug}:`, err);
    return null;
  }
}
