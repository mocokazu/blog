
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export const getPosts = async (): Promise<Post[]> => {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    title: doc.data().title,
    content: doc.data().content,
    createdAt: doc.data().createdAt.toDate(),
  }));
};
