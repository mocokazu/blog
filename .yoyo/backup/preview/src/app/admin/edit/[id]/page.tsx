
import EditPostForm from '@/components/blog/EditPostForm';
import PrivateRoute from '@/components/auth/PrivateRoute';

const EditPostPage = ({ params }: { params: { id: string } }) => {
  return (
    <PrivateRoute>
      <h1>Edit Post</h1>
      <EditPostForm postId={params.id} />
    </PrivateRoute>
  );
};

export default EditPostPage;
