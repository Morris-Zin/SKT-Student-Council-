// CommentList.js
import React, { lazy } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { fDateTime } from 'src/utils/format-time';

const Comment = lazy(() => import('./Comment'));

const Comments = ({
  comments,
  onEditComment,
  onDeleteComment,
  isEditCommentLoading,
  isDeleteCommentLoading,
  signedInUser,
}) => {
  const renderContent = comments.map((comment, index) => (
    <Comment
      key={comment._id}
      comment={comment.comment}
      onEditComment={(editedComment) => onEditComment(comment._id, editedComment)}
      userName={comment.author.name}
      avatar={comment.author.avatar}
      commentDate={fDateTime(comment.createdAt)}
      onDeleteComment={(deleteComment) => onDeleteComment(comment._id)}
      isEditCommentLoading={isEditCommentLoading}
      isDeleteCommentLoading={isDeleteCommentLoading}
      author={comment.author._id}
      signedInUser={signedInUser}
    />
  ));
  return <>{renderContent}</>;
};
Comments.propTypes = {
  comments: PropTypes.array.isRequired, // comments should be an array and is required
  onEditComment: PropTypes.func.isRequired, // onEditComment should be a function and is required
  onDeleteComment: PropTypes.func.isRequired, // onDeleteComment should be a function and is required
  isEditCommentLoading: PropTypes.bool, //
  isDeleteCommentLoading: PropTypes.bool, //
  signedInUser: PropTypes.string, // signedInUser should be a string and is required
};

export default Comments;
