import { Box } from '@mui/material';
import React, { ReactNode } from 'react';

export default function BorderWithTitle({ title, children }: {title: string,children: ReactNode}) {
  return (
    <Box
      sx={{
        position: 'relative',
        border: '1px solid',
        borderRadius: '10px',
        margin: '30px',
        padding: '10px', // Adjust padding as needed
        overflow: 'visible',
        '&::before': {
          content: `"${title}"`, // Replace with your title text
          position: 'absolute',
          top: '-15px', // Adjust to place the title on the border
          left: '20px', // Adjust to align the title horizontally
          background: '#fff', // Background color to cover border
          padding: '0 10px', // Adjust padding to your preference
          fontWeight: 'bold',
        },
      }}
    >
      {children}
    </Box>
  );
}
