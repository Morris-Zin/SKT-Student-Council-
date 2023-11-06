import { Suspense, lazy, useState } from 'react';
import { RouterLink } from 'src/routes/components';
import { useGetBlogsQuery } from 'src/slices/blogsApiSlice';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Message from 'src/components/message/Message';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@mui/material';
import PostSort from '../post-sort';
import PostSearch from '../post-search';
import PaginationComponent from '../../../components/paginate/pagination';

const PostCard = lazy(() => import('../post-card'));

export default function BlogView() {
  const { pageNumber, keyword, sortBy } = useParams();
  const { data, isLoading, error, refetch } = useGetBlogsQuery({ keyword, pageNumber, sortBy });
  const navigate = useNavigate();

  const handleSortChange = (newSortBy) => {
    // Update the URL with the selected sorting criteria
    navigate(`/${pageNumber || '1'}/${keyword || ''}/${newSortBy}`);
  };

  let renderContent;

  if (isLoading) {
    // Loading state
    renderContent = (
      <Skeleton variant="rectangular" width="100%">
        <div style={{ paddingTop: '57%' }} />
      </Skeleton>
    );
  } else if (error) {
    // Error state
    renderContent = (
      <Message variant="outlined" severity="error">
        {error?.data?.message || error.error}
      </Message>
    );
  } else {
    // Data is available, render the content
    renderContent = (
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Posts</Typography>

          <Button
            LinkComponent={RouterLink}
            href="/blogCreate"
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Post
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <PostSearch posts={data?.blogs} />
          <PostSort
            onSortChange={handleSortChange}
            selectedSort={sortBy} // Pass the sortBy prop

            options={[
              { value: 'newest', label: 'Newest' },
              { value: 'mostPopular', label: 'Most Popular' }, // Update label
              { value: 'oldest', label: 'Oldest' },
            ]}
          />
        </Stack>

        <Grid container spacing={3}>
          {data?.blogs.map((blog, index) => (
            <Suspense key={blog._id} fallback={<p>Loading...</p>}>
              <PostCard key={blog._id} post={blog} index={index} />
            </Suspense>
          ))}
        </Grid>
        <Card style={{ marginTop: '30px' }}>
          <CardContent>
            <PaginationComponent
              keyword={keyword && keyword}
              pages={data?.pages}
              page={data?.page}
            />
          </CardContent>
        </Card>
      </Container>
    );
  }

  return <>{renderContent}</>;
}
