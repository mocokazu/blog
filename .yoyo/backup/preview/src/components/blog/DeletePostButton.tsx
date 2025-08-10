
'use client';

import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface DeletePostButtonProps {
  postId: string;
}

const DeletePostButton = ({ postId }: DeletePostButtonProps) => {
  const router = useRouter();

  const handleClick = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        router.push('/admin');
      } catch (error) {
        console.error('Error deleting post: ', error);
      }
    }
  };

  return <button onClick={handleClick}>Delete Post</button>;
};

export default DeletePostButton;
