// frontend/src/theme.ts

import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'teal',
      },
    },
    Tag: {
      defaultProps: {
        colorScheme: 'teal',
      },
    },
  },
});

export default theme;
