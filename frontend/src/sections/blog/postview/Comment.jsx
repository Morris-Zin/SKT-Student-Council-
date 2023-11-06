import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useConfirm } from 'material-ui-confirm';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Typography,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/system'; // Import styled from @mui/system
import { toast } from 'react-toastify';

const useStyles = {
  card: {
    marginBottom: 2,
  },
  commentText: {
    whiteSpace: 'pre-line',
    marginTop: '20px',
  },
  editButton: {
    marginRight: 1,
  },
  saveButton: {
    color: 'inherit',
  },
  userInfoContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 1,
  },
  userName: {
    marginLeft: 1,
  },
  commentDate: {
    fontSize: '0.85rem',
    marginLeft: 'auto',
  },
  profile: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    marginRight: '10px',
    marginBottom: '4px',
  },
};

const CardStyled = styled(Card)(useStyles.card);

const CommentText = styled(Typography)(useStyles.commentText);

const EditButton = styled(Button)(useStyles.editButton);

const SaveButton = styled(Button)(useStyles.saveButton);

const UserInfoContainer = styled('div')(useStyles.userInfoContainer);

const UserName = styled(Typography)(useStyles.userName);

const CommentDate = styled(Typography)(useStyles.commentDate);

const AvatarStyled = styled(Avatar)(useStyles.profile);

const Comment = ({
  comment,
  onEditComment,
  userName,
  avatar,
  commentDate,
  onDeleteComment,
  isEditCommentLoading,
  isDeleteCommentLoading,
  signedInUser,
  author,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment);
  const confirm = useConfirm();

  const authorOfTheComment = author === signedInUser;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    onEditComment(editedComment);
    setIsEditing(false);
  };
  const handleDelete = () => {
    confirm({ description: 'Sir it will be a permannt action' })
      .then(async () => {
        try {
          onDeleteComment(editedComment._id);
          toast.success('Comment deleted successfully 🫡');
        } catch (error) {
          toast.error(error?.data?.message || 'Something went wrong');
        }
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  return (
    <CardStyled variant="outlined">
      <CardContent>
        <UserInfoContainer>
          <AvatarStyled alt={userName} src={avatar} />
          <UserName variant="subtitle1">{userName}</UserName>
          <CommentDate variant="body2">{commentDate}</CommentDate>
        </UserInfoContainer>
        {isEditing ? (
          <TextField
            fullWidth
            multiline
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
          />
        ) : (
          <CommentText variant="body1">{comment}</CommentText>
        )}
      </CardContent>
      <CardActions>
        {isEditing ? (
          <>
            <SaveButton disabled={!authorOfTheComment} onClick={handleSave} size="small">
              Save
            </SaveButton>
            <EditButton disabled={!authorOfTheComment} color="inherit" onClick={() => setIsEditing(false)} size="small">
              Cancel
            </EditButton>
          </>
        ) : (
          <>
            <EditButton
              disabled={!authorOfTheComment || isEditCommentLoading}
              color="warning"
              variant="outlined"
              onClick={handleEdit}
              size="small"
            >
              Edit
            </EditButton>
            <EditButton
              disabled={!authorOfTheComment || isDeleteCommentLoading}
              color="error"
              variant="outlined"
              onClick={handleDelete}
              size="small"
            >
              Delete
            </EditButton>
          </>
        )}
      </CardActions>
    </CardStyled>
  );
};

Comment.propTypes = {
  comment: PropTypes.string.isRequired,
  onEditComment: PropTypes.func.isRequired,
  userName: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  commentDate: PropTypes.string.isRequired,
  onDeleteComment: PropTypes.func.isRequired,
  isEditCommentLoading: PropTypes.bool,
  isDeleteCommentLoading: PropTypes.bool,
  signedInUser: PropTypes.string,
  author: PropTypes.string.isRequired,
};

export default Comment;
