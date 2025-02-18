import '../styles/globals.css';
import { CandidateProvider } from '../components/ressources-humaines/CandidateContext';

function MyApp({ Component, pageProps }) {
  return (
    <CandidateProvider>
      <Component {...pageProps} />
    </CandidateProvider>
  );
}

export default MyApp;
