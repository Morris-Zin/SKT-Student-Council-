import { useState } from 'react';
import PropTypes from 'prop-types';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

PostSort.propTypes = {
  options: PropTypes.array.isRequired,
  onSortChange: PropTypes.func.isRequired,
  selectedSort: PropTypes.string, // Add selectedSort prop
};

export default function PostSort({ options, onSortChange, selectedSort }) {
  const navigate = useNavigate();
  const [currentSort, setCurrentSort] = useState(selectedSort);

  const handleSortChange = (event, newValue) => {
    if (newValue) {
      onSortChange(newValue.value);
      navigate(`/${newValue.value}`);
    }
  };

  return (
    <Autocomplete
      style={{ width: '300px' }}
      options={options}
      getOptionLabel={(option) => option.label}
      value={options.find((option) => option.value === currentSort)}
      onChange={handleSortChange}
      renderInput={(params) => <TextField {...params} label="Sort by" />}
    />
  );
}
