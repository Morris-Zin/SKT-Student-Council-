import React, { useState } from 'react';
import {
  Grid,
  TextField,
  Typography,
  Button,
  Paper,
  Box,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import {
  useCreateBlogMutation,
  useDeleteImageMutation,
  useUploadBlogImageMutation,
} from 'src/slices/blogsApiSlice';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { RouterLink } from 'src/routes/components';
import { Icon } from '@iconify/react';

const BlogCreate = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
  });
  const [selectedTag, setSelectedTag] = useState('General');
  const availableTags = ['General', 'Announcement', 'Help', 'Event'];
  const [uploadedImage, setImage] = useState('/assets/images/covers/cover_1.jpg');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadImage] = useUploadBlogImageMutation();
  const [imageSrc, setImageSrc] = useState('');
  const navigate = useNavigate();
  const [createBlog] = useCreateBlogMutation();
  const [deleteImage] = useDeleteImageMutation();

  const quillModules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { header: [3, 4, 5, 6] }], // Headers with different sizes
      [{ font: [] }], // Font selection
      [{ list: 'ordered' }, { list: 'bullet' }], // Ordered and unordered lists
      ['bold', 'italic', 'underline', 'strike'], // Text formatting
      ['link', 'code-block'], // Links and images
      [{ align: [] }], // Text alignment
      ['clean'], // Remove formatting
    ],
  };

  const handleSelectFile = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const imageURL = URL.createObjectURL(selectedFile);
      setImageSrc(imageURL);
    }
  };
  const handleTagChange = (e) => {
    setSelectedTag(e.target.value);
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      if (uploadedImage !== '/assets/images/covers/cover_1.jpg') {
        // Extract public ID from the image URL
        const publicId = uploadedImage.split('/').pop().split('.')[0];
        await deleteImage(publicId);
      }

      const data = new FormData();
      data.append('image', file);
      const response = await uploadImage(data);
      setImage(response.data.secure_url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setBlogData({ ...blogData, [field]: value });
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
        tag: selectedTag,
      });
      toast.success('Blog created successfully');
      navigate('/');
    } catch (error) {
      toast.error(error?.data.message || 'Something went wrong');
    }
  };

  return (
    <Box p={2}>
      <Button
        style={{ marginBottom: '20px' }}
        href="/"
        LinkComponent={RouterLink}
        variant="outlined"
      >
        Go back
      </Button>
      <Typography variant="h5" gutterBottom>
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
        <Grid item xs={12} style={{ marginTop: '10px' }}>
          <RadioGroup row value={selectedTag} onChange={handleTagChange}>
            {availableTags.map((tag) => (
              <FormControlLabel
                key={tag}
                value={tag}
                control={<Radio color="primary" />}
                label={tag}
              />
            ))}
          </RadioGroup>
        </Grid>
        <Grid item xs={12} style={{ margin: '10px 0px 30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle1" style={{ marginBottom: '8px' }}>
              Content
            </Typography>
            <ReactQuill
              modules={quillModules}
              style={{ height: '300px' }}
              value={blogData.content}
              onChange={(value) => handleInputChange('content', value)}
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
          <Button disabled={loading} variant="contained" color="primary" onClick={handleSubmit}>
            Create Post
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlogCreate;
