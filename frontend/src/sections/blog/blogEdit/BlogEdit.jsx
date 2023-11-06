import React, { useState, useEffect, lazy } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, Button, TextField } from '@mui/material';
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

const Loader = lazy(() => import('src/components/loader/Loader'));

const Message = lazy(() => import('src/components/message/Message'));

const BlogEdit = () => {
  const { id: blogId } = useParams();
  const { data: blog, isLoading, error } = useGetBlogByIdQuery(blogId);
  const [editBlog, { isError }] = useEditBlogMutation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const { userInfo } = useSelector((state) => state.auth);

  const [uploadImage] = useUploadBlogImageMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [prevSelectedImage, setPrevSelectedImage] = useState(
    blog?.image.split('/uploads/')[1] || null
  );

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

  const uploadFileHandler = async (e) => {
    console.log(prevSelectedImage);
    if (prevSelectedImage) {
      console.log('HI');
      try {
        await deleteImage(prevSelectedImage.split('/uploads/')[1]);
      } catch (errorHappened) {
        console.log(errorHappened);
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

  const handleInputChange = (name, value) => {
    if (name === 'title') {
      setTitle(value); // Update the "title" state directly
    } else if (name === 'image') {
      setImage(value); // Update the "image" state directly
    } else {
      setBlogData({ ...blogData, [name]: value }); // Update other fields as before
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
      console.log(data);
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
          <TextField
            type="file"
            name="uploadImage"
            onChange={(e) => uploadFileHandler(e)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} style={{ marginTop: '10px' }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default BlogEdit;
