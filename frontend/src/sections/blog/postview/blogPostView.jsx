import {
  useGetBlogByIdQuery,
  useDeleteBlogMutation,
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useDeleteImageMutation,
} from 'src/slices/blogsApiSlice';
import { Suspense, lazy, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import Message from 'src/components/message/Message';
import {
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Button,
  TextField,
} from '@mui/material';
import { RouterLink } from 'src/routes/components';
import { fDateTime } from 'src/utils/format-time';
import Loader from 'src/components/loader/Loader';
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';

const Comments = lazy(() => import('./Comments'));

function BlogPostDetail() {
  const { id: blogId } = useParams();
  const { data: blog, isLoading, error, refetch } = useGetBlogByIdQuery(blogId);
  const { userInfo } = useSelector((state) => state.auth);
  const [deletePost] = useDeleteBlogMutation();
  const [createComment, { isLoading: isCreateCommentLoading, isError: isErrorComment }] =
    useCreateCommentMutation();
  const [commentText, setCommentText] = useState('');
  const [deleteImage] = useDeleteImageMutation();

  const handleCommentTextChange = (e) => {
    setCommentText(e.target.value);
  };

  const navigate = useNavigate();
  const confirm = useConfirm();
  const [editComment, { isError: editCommentError, isLoading: isEditCommentLoading }] =
    useEditCommentMutation();
  const [deleteComment, { isLoading: isDeleteCommentLoading, isError: commentError }] =
    useDeleteCommentMutation();

  const handleEditComment = async (commentId, editedComment) => {
    const data = { blogId, commentId, data: editedComment };
    try {
      await editComment(data);

      toast.success('Comment updated successfully');
    } catch (err) {
      toast.error(err?.message || 'Something went wrong, cannot update comment');
    }
  };

  const handleAddComment = async () => {
    try {
      const data = { blogId, data: commentText };
      await createComment(data).unwrap();
      refetch();
      setCommentText('');
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add comment');
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      const data = { blogId, commentId };
      await deleteComment(data).unwrap();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to delete comment');
    }
  };

  const handleDelete = async () => {
    confirm({ description: 'Sir it cannot be recovered' })
      .then(async () => {
        try {
          await deleteImage(blog?.image.split('/uploads/')[1]);
          await deletePost(blogId);
          toast.success('Blog deleted successfully');
          navigate('/');
        } catch (err) {
          toast.error(err?.data.message || 'Something went wrong');
        }
      })
      .catch(() => {
        toast.info('Delete Cancelled');
      });
  };
  if (isErrorComment) return <Message variant="error">{error?.data?.message}</Message>;

  let renderContent;
  if (isLoading) {
    renderContent = <Loader />;
  } else if (error) {
    renderContent = (
      <Message variant="outlined" severity="error">
        {error?.data?.message || error.error}
      </Message>
    );
  } else {
    const { numComments, author, title, image, content, createdAt, comments: userComments } = blog;
    renderContent = (
      <Container>
        <Button
          style={{ margin: '0 0 20px 0px' }}
          href="/"
          LinkComponent={RouterLink}
          variant="outlined"
        >
          Go back
        </Button>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Card>
            <CardMedia component="img" alt="Blog Post Image" height="300" image={`${image}`} />
            <CardHeader
              title={title}
              subheader={`By ${author?.name} | Published on ${fDateTime(createdAt)} `}
            />
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </CardContent>
            <CardContent>
              <Button
                style={{ width: '70px', marginRight: '20px' }}
                href={`/blogEdit/${blogId}`}
                LinkComponent={RouterLink}
                variant="outlined"
                color="warning"
                disabled={userInfo?._id !== author._id}
              >
                Edit
              </Button>

              <Button
                style={{ width: '70px' }}
                LinkComponent={RouterLink}
                variant="outlined"
                disabled={userInfo?._id !== author._id}
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </CardContent>
            <CardContent>
              <Typography variant="body1">{numComments} Comments</Typography>
            </CardContent>
            {!userInfo && (
              <Card style={{ marginTop: '20px' }}>
                <CardContent>
                  <Typography variant="body1">
                    You need to authenticate to create comments
                  </Typography>
                </CardContent>
              </Card>
            )}
            <CardContent style={{ marginTop: '20px' }}>
              <TextField
                fullWidth
                label="Add a comment"
                variant="outlined"
                value={commentText}
                onChange={handleCommentTextChange}
                style={{ marginBottom: '20px' }}
              />
              <Button
                variant="contained"
                size="small"
                disabled={!userInfo || isCreateCommentLoading}
                color="inherit"
                onClick={handleAddComment}
              >
                Post Comment
              </Button>
            </CardContent>
          </Card>
        </Paper>
        <Card style={{ marginTop: '20px' }}>
          <CardContent>
            <Typography variant="body1">Comment sections</Typography>
          </CardContent>
        </Card>
        {userComments.length ? (
          <div style={{ marginTop: '20px' }}>
            <Suspense fallback={<p>Loading ... 😔</p>}>
              <Comments
                signedInUser={userInfo?._id}
                comments={userComments}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                isEditCommentLoading={isEditCommentLoading}
                isDeleteCommentLoading={isDeleteCommentLoading}
              />
            </Suspense>
          </div>
        ) : (
          <Card style={{ marginTop: '20px' }}>
            <CardContent>
              <Typography variant="body1">No Comments yet comment now!!!</Typography>
            </CardContent>
          </Card>
        )}
      </Container>
    );
  }
  return <>{renderContent} </>;
}

export default BlogPostDetail;
