import React, { useState, useEffect, lazy } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, Button, TextField, Paper, InputLabel } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import { useNavigate, useParams } from 'react-router-dom';
import {
  useEditBlogMutation,
  useGetBlogByIdQuery,
  useUploadBlogImageMutation,
  useDeleteImageMutation,
} from 'src/slices/blogsApiSlice';
import { toast } from 'react-toastify';
import { Box } from '@mui/system';
import { Icon } from '@iconify/react';

const Loader = lazy(() => import('src/components/loader/Loader'));

const Message = lazy(() => import('src/components/message/Message'));

const BlogEdit = () => {
  const [file, setFile] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const { id: blogId } = useParams();
  const { data: blog, isLoading, error } = useGetBlogByIdQuery(blogId);
  const [editBlog, { isError }] = useEditBlogMutation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const [uploadImage] = useUploadBlogImageMutation();
  const [deleteImage] = useDeleteImageMutation();

  const [blogData, setBlogData] = useState({
    content: '',
  });

  const isAuthor = userInfo?._id === blog?.author._id;

  useEffect(() => {
    if (!isAuthor) {
      navigate('/');
    }
  }, [isAuthor, navigate]);

  useEffect(() => {
    if (blog) {
      setTitle(blog.title);
      setImage(blog.image);
      setBlogData({
        content: blog.content,
      });
    }
  }, [blog]);

  const handleUpload = async () => {
    try {
      setLoading(true);
      if (image !== '/assets/images/covers/cover_1.jpg') {
        // Extract public ID from the image URL
        const publicId = image.split('/').pop().split('.')[0];
        await deleteImage(publicId);
      }

      const data = new FormData();
      data.append('image', file);
      const response = await uploadImage(data);
      setImage(response.data.secure_url);
      toast.success('Image uploaded successfully');
    } catch (es) {
      alert(es.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    if (name === 'title') {
      setTitle(value); // Update the "title" state directly
    } else {
      setBlogData({ ...blogData, [name]: value }); // Update other fields as before
    }
  };

  const handleSelectFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const imageURL = URL.createObjectURL(selectedFile);
      setImageSrc(imageURL);
    }
  };

  const stripHtmlTags = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleSubmit = async () => {
    if (title === '' || stripHtmlTags(blogData.content) === '' || image === '') {
      toast.error('Please dont leave blank 🫡');
      return;
    }
    try {
      const data = { title, image, content: blogData.content, author: userInfo._id };
      await editBlog({ blogId, data });
      toast.success('Updated successfully');
      navigate(`/blog/${blogId}`);
    } catch (err) {
      toast.error(err?.data.message || 'Something went wrong');
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }], // Headers with different sizes
      [{ font: [] }], // Font selection
      [{ list: 'ordered' }, { list: 'bullet' }], // Ordered and unordered lists
      ['bold', 'italic', 'underline', 'strike'], // Text formatting
      ['link', 'image'], // Links and images
      [{ align: [] }], // Text alignment
      ['clean'], // Remove formatting
    ],
  };

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="outlined" severity="error">
        {error?.data?.message || error}
      </Message>
    );

  return (
    <div style={{ padding: '10px' }}>
      <Button style={{ margin: '0 0 20px 0px' }} href={`/blog/${blogId}`} variant="outlined">
        Go back
      </Button>
      <Typography variant="h5" gutterBottom style={{ marginBottom: '20px' }}>
        Edit Post
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            name="title"
            value={title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} style={{ margin: '10px 0px 30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
              Content
            </Typography>
            <ReactQuill
              theme="snow"
              style={{ height: '300px' }}
              value={blogData.content}
              onChange={(value) => handleInputChange('content', value)}
              modules={quillModules}
            />
          </div>
        </Grid>
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          <input
            name="file"
            id="file"
            type="file"
            onChange={handleSelectFile}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <InputLabel htmlFor="file">
            <Button
              variant="contained"
              component="span"
              startIcon={<Icon icon="material-symbols:upload" />}
            >
              Select File
            </Button>
          </InputLabel>
          {file && (
            <Typography style={{ marginTop: '20px' }} variant="body1">
              Your file name - {file.name}
            </Typography>
          )}
          {file && (
            <Box mt={2}>
              <Paper elevation={3}>
                <img
                  src={imageSrc}
                  alt="Showing preview"
                  style={{ maxWidth: '100%', maxHeight: '200px' }}
                />
              </Paper>
            </Box>
          )}
          {file && (
            <div>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                style={{ marginTop: '20px' }}
              >
                {loading ? 'Uploading...' : 'Upload the image'}
              </Button>
            </div>
          )}
        </Grid>

        <Grid item xs={12} style={{ marginTop: '10px' }}>
          <Button variant="contained" disabled={loading} color="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default BlogEdit;
