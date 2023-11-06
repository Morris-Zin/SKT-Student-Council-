import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import NavLayout from 'src/layouts/dashboard';

import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';

export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const BlogPostView = lazy(() => import('src/pages/blogView'));
export const SigninPage = lazy(() => import('src/pages/signin'));
export const BlogEditPage = lazy(() => import('src/pages/blogEdit'));
export const BlogCreatePage = lazy(() => import('src/pages/blogCreate'));
export const UserProfilePage = lazy(() => import('src/pages/userProfile'));
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: (
        <div>
          <NavLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </NavLayout>
        </div>
      ),
      children: [
        { element: <BlogPage />, index: true },
        { path: '/:sortBy', element: <BlogPage /> },
        { path: '/search/:keyword', element: <BlogPage /> },
        { path: '/page/:pageNumber', element: <BlogPage /> },
        { path: '/search/:keyword/page/:pageNumber', element: <BlogPage /> },
        { path: '/blog/:id', element: <BlogPostView /> },
        { path: '/blogCreate', element: <PrivateRoute component={BlogCreatePage} /> },
        { path: '/blogEdit/:id', element: <PrivateRoute component={BlogEditPage} /> },
        { path: '/users', element: <AdminRoute component={UserPage} /> },
        { path: '/profile', element: <PrivateRoute component={UserProfilePage} /> },
      ],
    },

    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'signup',
      element: <SigninPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
