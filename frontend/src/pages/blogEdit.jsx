import { lazy } from 'react';
import { Helmet } from 'react-helmet-async';

const BlogEdit = lazy(() => import('src/sections/blog/blogEdit/BlogEdit'));
// ----------------------------------------------------------------------

export default function BlogCreatePage() {
  return (
    <>
      <Helmet>
        <title> Edit a Blog | SKT</title>
      </Helmet>
      <BlogEdit />
    </>
  );
}
