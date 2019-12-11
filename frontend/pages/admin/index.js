import Link from "next/link";
import Layout from "../../components/Layout";
import Admin from "../../components/auth/Admin";

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12 pt-5 pb-5'>
              <h2>Admin Dashboard</h2>
            </div>
            <div className='col-md-4'>
              <ul className='list-group'>
                <li className='list-group-item'>
                  <Link href='/admin/crud/category-tag'>
                    <a>Create a category</a>
                  </Link>
                </li>
                <li className='list-group-item'>
                  <Link href='/admin/crud/category-tag'>
                    <a>Create a tag</a>
                  </Link>
                </li>
                <li className='list-group-item'>
                  <a href='/user/update'>Update your profile</a>
                </li>
                <li className='list-group-item'>
                  <a href='/admin/crud/blogs'>Update/Delete a post</a>
                </li>
                <li className='list-group-item'>
                  <a href='/auth/password/change'>Change your password</a>
                </li>
              </ul>
            </div>
            <div className='col-md-8'></div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default AdminIndex;
