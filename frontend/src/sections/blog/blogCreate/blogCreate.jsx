import React, { useState } from 'react';
import { Grid, TextField, Typography, Button } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import styles
import { useNavigate } from 'react-router-dom';
import {
  useCreateBlogMutation,
  useUploadBlogImageMutation,
  useDeleteImageMutation,
} from 'src/slices/blogsApiSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RouterLink } from 'src/routes/components';

const BlogCreate = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
  });
  const [uploadedImage, setImage] = useState('/assets/images/covers/cover_1.jpg');
  const [uploadImage] = useUploadBlogImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [prevSelectedImage, setPrevSelectedImage] = useState(null);

  const navigate = useNavigate();
  const [createBlog] = useCreateBlogMutation();

  const handleInputChange = (field, value) => {
    setBlogData({ ...blogData, [field]: value });
  };

  const uploadFileHandler = async (e) => {
    if (prevSelectedImage) {
      try {
        await deleteImage(prevSelectedImage.split('/uploads/')[1]);
      } catch (error) {
        console.log(error);
      }
    }
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadImage(formData).unwrap();
      setPrevSelectedImage(res.img);
      toast.success(res.message);
      setImage(res.img);
    } catch (er) {
      toast.error(er?.data?.message || 'Something went wrong');
    }
  };
  const handleSubmit = async (e) => {
    const { title, content } = blogData;
    if (title === '' || content === '') {
      toast.error('Please fill all the fields');
      return;
    }
    try {
      await createBlog({
        title,
        content,
        author: userInfo._id,
        image: uploadedImage,
      });
      toast.success('Blog created successfully');
      navigate('/');
    } catch (error) {
      toast.error(error?.data.message || 'Something went wrong');
    }
  };

  return (
    <div style={{ padding: '10px' }}>
      <Button
        style={{ margin: '0 0 20px 0px' }}
        href="/"
        LinkComponent={RouterLink}
        variant="outlined"
      >
        Go back
      </Button>
      <Typography variant="h5" gutterBottom style={{ marginBottom: '20px' }}>
        Create Post
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            name="title"
            value={blogData.title}
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
              style={{ height: '300px' }}
              value={blogData.content}
              onChange={(value) => handleInputChange('content', value)}
            />
          </div>
        </Grid>
        <Grid item xs={12} style={{ marginTop: '20px' }}>
          <TextField
            type="file"
            name="uploadImage"
            onChange={(e) => uploadFileHandler(e)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} style={{ marginTop: '10px' }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Create Blog
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default BlogCreate;
