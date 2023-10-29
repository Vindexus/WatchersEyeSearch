import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import Router from './routes';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App w-full flex flex-col items-center justify-start min-h-screen bg-gray-900 text-gray-400">
        <Router />
        <div style={{display: "none"}} className={'bg-gray-500 bg-gray-800'}></div>
      </div>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
