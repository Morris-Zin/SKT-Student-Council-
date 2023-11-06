/* eslint-disable perfectionist/sort-imports */
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'src/global.css';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { ConfirmProvider } from 'material-ui-confirm';
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <ConfirmProvider>
        <Router />
        <ToastContainer />
      </ConfirmProvider>
    </ThemeProvider>
  );
}
