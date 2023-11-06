import { lazy } from 'react';
import { Helmet } from 'react-helmet-async';

const BlogPostView = lazy(() => import('src/sections/blog/postview/blogPostView'));
// ----------------------------------------------------------------------

export default function BlogPage() {
  return (
    <>
      <Helmet>
        <title> Blog Page | SKT</title>
      </Helmet>
      <BlogPostView />
    </>
  );
}
