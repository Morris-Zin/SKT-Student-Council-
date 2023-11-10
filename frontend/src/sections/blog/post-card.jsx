import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/routes/components';
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

export default function PostCard({ post, index }) {
  const { _id, title, image, author, createdAt, numComments, tag } = post;

  const latestPostLarge = index === 0;

  const latestPost = index === 1 || index === 2;
  const navigate = useNavigate();

  const renderAvatar = (
    <Avatar
      alt={author?.name}
      src={author?.avatar}
      sx={{
        zIndex: 9,
        width: 32,
        height: 32,
        position: 'absolute',
        left: (theme) => theme.spacing(3),
        bottom: (theme) => theme.spacing(-2),
        ...((latestPostLarge || latestPost) && {
          zIndex: 9,
          top: 24,
          left: 24,
          width: 40,
          height: 40,
        }),
      }}
    />
  );
  const renderTag = (
    <Box
      sx={{
        position: 'absolute',
        backgroundColor: 'black',
        color: 'common.white',
        zIndex: 10,
        left: 0,
        bottom: 0,
        px: 2,
        py: 0.5,
        fontSize: '10px', // Adjust the font size to your preference
        borderRadius: '0px 10px', // Add rounded corners
      }}
    >
      {tag}
    </Box>
  );

  const renderTitle = (
    <Link
      component={RouterLink}
      href={`/blog/${_id}`}
      color="inherit"
      variant="subtitle2"
      underline="hover"
      sx={{
        height: 44,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...(latestPostLarge && { typography: 'h5', height: 60 }),
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
        }),
      }}
    >
      {title}
    </Link>
  );

  const renderInfo = (
    <Stack
      direction="row"
      flexWrap="wrap"
      spacing={1.5}
      justifyContent="flex-end"
      sx={{
        mt: 3,
        color: 'text.disabled',
      }}
    >
      {[{ number: numComments, icon: 'eva:message-circle-fill' }].map((info, _index) => (
        <Stack
          key={_index}
          direction="row"
          sx={{
            ...((latestPostLarge || latestPost) && {
              opacity: 0.48,
              color: 'common.white',
            }),
          }}
        >
          <Iconify width={16} icon={info.icon} sx={{ mr: 0.5 }} />
          <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
        </Stack>
      ))}
    </Stack>
  );

  const renderCover = (
    <Box
      component="img"
      alt={title}
      src={image}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderDate = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        mb: 2,
        color: 'text.disabled',
        ...((latestPostLarge || latestPost) && {
          opacity: 0.48,
          color: 'common.white',
        }),
      }}
    >
      {fDate(createdAt)}
    </Typography>
  );

  const renderShape = (
    <SvgColor
      color="paper"
      src="/assets/icons/shape-avatar.svg"
      sx={{
        width: 80,
        height: 36,
        zIndex: 9,
        bottom: -15,
        position: 'absolute',
        color: 'background.paper',
        ...((latestPostLarge || latestPost) && { display: 'none' }),
      }}
    />
  );

  return (
    <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card onClick={() => navigate(`/blog/${_id}`)} style={{ cursor: 'pointer' }}>
        {renderTag}
        <Box
          sx={{
            position: 'relative',
            pt: 'calc(100% * 3 / 4)',
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
              },
            }),
            ...(latestPostLarge && {
              pt: {
                xs: 'calc(100% * 4 / 3)',
                sm: 'calc(100% * 3 / 4.66)',
              },
            }),
          }}
        >
          {renderShape}

          {renderAvatar}

          {renderCover}
        </Box>

        <Box
          sx={{
            p: (theme) => theme.spacing(4, 3, 3, 3),
            ...((latestPostLarge || latestPost) && {
              width: 1,
              bottom: 0,
              position: 'absolute',
            }),
          }}
        >
          {renderDate}

          {renderTitle}

          {renderInfo}
        </Box>
      </Card>
    </Grid>
  );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};
