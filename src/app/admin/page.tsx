
import PrivateRoute from '@/components/auth/PrivateRoute';
import CreatePostForm from '@/components/blog/CreatePostForm';

const AdminPage = () => {
  return (
    <PrivateRoute>
      <h1>Admin Dashboard</h1>
      <CreatePostForm />
    </PrivateRoute>
  );
};

export default AdminPage;
