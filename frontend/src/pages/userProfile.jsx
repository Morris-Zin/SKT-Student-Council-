import { lazy } from 'react';
import { Helmet } from 'react-helmet-async';

const UserProfileView = lazy(() => import('src/sections/userProfile/userProfileView'));

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> User Profile | SKT </title>
      </Helmet>

      <UserProfileView />
    </>
  );
}
