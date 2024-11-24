import * as React from 'react';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

export default function IconLabelButtons() {
  const { t, i18n } = useTranslation();

  return (
    <Stack direction="row" spacing={2}>
      {/* <Button variant="outlined" startIcon={<DeleteIcon />}>
        Delete
      </Button> */}
      <Button variant="contained" endIcon={<SendIcon />}>
      {t('Review.SEND', { defaultValue: 'ОК' })}
      </Button>
    </Stack>
  );
}