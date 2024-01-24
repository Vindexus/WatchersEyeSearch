import { ToastContainer } from 'react-toastify';
import Router from './routes';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
  	<div>
      <div className="App w-full flex flex-col items-center justify-start min-h-screen bg-gray-900 text-gray-400">
        <Router />
        <div style={{display: "none"}} className={'bg-gray-500 bg-gray-800'}></div>
      </div>
      <ToastContainer />
		</div>
  );
}

export default App;
