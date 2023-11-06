import { lazy } from 'react';
import { Helmet } from 'react-helmet-async';

const BlogView = lazy(() => import('src/sections/blog/view/blog-view'));

// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> SKT Student Council</title>
      </Helmet>

      <BlogView />
    </>
  );
}
