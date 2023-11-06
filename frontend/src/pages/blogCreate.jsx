import { lazy } from 'react';
import { Helmet } from 'react-helmet-async';

const BlogCreate = lazy(() => import('src/sections/blog/blogCreate/blogCreate'));
// ----------------------------------------------------------------------

export default function BlogCreatePage() {
  return (
    <>
      <Helmet>
        <title> Create a Blog | SKT</title>
      </Helmet>
      <BlogCreate />
    </>
  );
}
