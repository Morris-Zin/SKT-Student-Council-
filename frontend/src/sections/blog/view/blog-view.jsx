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
import { Card, CardContent, Popover } from '@mui/material';
import PostSort from '../post-sort';
import PostSearch from '../post-search';
import PaginationComponent from '../../../components/paginate/pagination';

const PostCard = lazy(() => import('../post-card'));

export default function BlogView() {
  const { pageNumber, keyword, sortBy, tag } = useParams();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const availableTags = ['All Posts', 'General', 'Announcement', 'Event', 'Help'];
  const [selectedView, setSelectedView] = useState('All Posts');
  const { data, isLoading, error, refetch } = useGetBlogsQuery({
    keyword,
    pageNumber,
    sortBy,
    tag,
  });

  const handleSortChange = (newSortBy) => {
    navigate(`/${pageNumber || '1'}/${keyword || ''}/${newSortBy}`);
  };

  const handleViewOptionClick = async (view) => {
    setSelectedView(view);
    navigate(`/tag/${view}`);
    handleClose();
  };

  const handleViewClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h4">{selectedView && selectedView} </Typography>
            <Button onClick={handleViewClick} color="inherit">
              <Iconify icon="fluent:chevron-down-24-filled" />
            </Button>
          </Stack>

          <Button
            LinkComponent={RouterLink}
            href="/blogCreate"
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Post
          </Button>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Stack p={2}>
              {availableTags.map((t) => (
                <Button
                  color="inherit"
                  key={t}
                  onClick={() => handleViewOptionClick(t)}
                  // Handle the logic for changing the view based on the selected tag
                >
                  {t}
                </Button>
              ))}
            </Stack>
          </Popover>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <PostSearch posts={data?.blogs} />
          <PostSort
            onSortChange={handleSortChange}
            selectedSort={sortBy}
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
