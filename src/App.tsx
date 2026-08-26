import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { ScrollToTop } from './components/navigation/ScrollToTop';
import { Skeleton } from './components/ui/Skeleton';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ToastContainer } from './components/ui/Toast';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Explorer = lazy(() => import('./pages/Explorer').then(m => ({ default: m.Explorer })));
const Analysis = lazy(() => import('./pages/Analysis').then(m => ({ default: m.Analysis })));

function App() {
  return (
    <ErrorBoundary fallbackMessage="Application critical failure. Please reload the subsystem.">
      <ScrollToTop />
      <ToastContainer />
      <Suspense fallback={<Skeleton />}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="explorer" element={<Explorer />} />
            <Route path="analysis" element={<Analysis />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
