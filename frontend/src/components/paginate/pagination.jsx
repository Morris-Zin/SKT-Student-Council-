import * as React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Link } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { Stack } from '@mui/system';

export default function Content({ pages, page, keyword='' }) {
  return (
    <Stack spacing={2} alignItems="center" justifyContent="center" mt={3}>
      <Pagination
        page={page}
        count={pages}
        shape="rounded"
        size="large" 
        renderItem={(item) => (
          <PaginationItem
            component={Link}
            to={keyword ? `/search/${keyword}/page/${item.page}`:   
            `/page/${item.page === 1 ? '1' : `${item.page}`}`}
            {...item}
          />
        )}
      />
    </Stack>
  );
}

Content.propTypes = {
  pages: PropTypes.number.isRequired, // pages should be a number and is required
  page: PropTypes.number.isRequired, // page should be a number and is required
  keyword: PropTypes.string
};
