import { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useConfirm } from 'material-ui-confirm';
import Iconify from 'src/components/iconify';
import { fDateTime } from 'src/utils/format-time';
import { useDeleteUserMutation, useEditUserMutation } from 'src/slices/userApiSlice';
import { toast } from 'react-toastify';
import { InputLabel, Select, TextField } from '@mui/material';

export default function UserTableRow({
  selected,
  name,
  avatar,
  email,
  isAdmin,
  handleClick,
  yearClass,
  joinedDate,
  userId,
}) {
  const [open, setOpen] = useState(null);
  const confirm = useConfirm();
  const [deleteUser, { isError }] = useDeleteUserMutation();
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editedUserData, setEditedUserData] = useState({ name, email, isAdmin, yearClass });
  const [editUser] = useEditUserMutation();
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleEditUser = () => {
    // Open the edit form dialog
    setEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    // Close the edit form dialog
    setEditFormOpen(false);
  };

  const handleSaveChanges = async () => {
    // You can submit editedUserData to an API or update it locally
    try {
      console.log(editedUserData);
      const data = { id: userId, data: editedUserData };
      await editUser(data);
      toast.success('User updated successfully');
      handleCloseEditForm();
    } catch (error) {
      toast.error(error?.data?.message || error.error || 'Something went wrong');
    }
  };
  const handleDeleteUser = async () => {
    // Call the deleteUser function with the user ID
    confirm({ description: 'Sir it will be a permannt action' })
      .then(async () => {
        try {
          await deleteUser(userId);
          toast.success('User deleted successfully');
          handleCloseMenu(); // Close the menu
        } catch (error) {
          toast.error(error?.data?.message || 'Something went wrong');
        }
      })
      .catch((e) => {
        toast.error(e.message);
      });
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatar} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>
        <TableCell>{yearClass}</TableCell>

        <TableCell align="center">{isAdmin ? 'Admin' : 'Normal User'}</TableCell>
        <TableCell align="center">{fDateTime(joinedDate)}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleEditUser}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
        <Dialog
          open={editFormOpen}
          onClose={handleCloseEditForm}
          aria-labelledby="edit-dialog-title"
        >
          <DialogTitle id="edit-dialog-title">Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={editedUserData.name}
              onChange={(e) => setEditedUserData({ ...editedUserData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={editedUserData.email}
              onChange={(e) => setEditedUserData({ ...editedUserData, email: e.target.value })}
              margin="normal"
            />
            <TextField
              label="Year Class"
              variant="outlined"
              fullWidth
              value={editedUserData.yearClass}
              onChange={(e) =>
                setEditedUserData((prev) => ({ ...prev, yearClass: e.target.value }))
              }
              margin="normal"
            />
            <InputLabel htmlFor="admin-select">Admin</InputLabel>
            <Select
              value={editedUserData.isAdmin}
              onChange={(e) => setEditedUserData({ ...editedUserData, isAdmin: e.target.value })}
              label="Admin"
              inputProps={{
                name: 'admin',
                id: 'admin-select',
              }}
            >
              <MenuItem value="True">True</MenuItem>
              <MenuItem value="False">False</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditForm} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
UserTableRow.propTypes = {
  selected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  yearClass: PropTypes.string.isRequired,
  joinedDate: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};
