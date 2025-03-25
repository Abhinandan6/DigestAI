// Remove the React import since it's not being used directly
import nhost from '../utils/nhost';

const Debug = () => {
  return (
    <div className="p-8 bg-gray-800 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      <p className="mb-2">Application is rendering correctly</p>
      <p className="mb-2">Current route: {window.location.pathname}</p>
      <p className="mb-2">Nhost client initialized: {nhost ? 'Yes' : 'No'}</p>
      
      <div className="mt-6 p-4 bg-gray-700 rounded">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <p className="mb-1">VITE_NHOST_SUBDOMAIN: {import.meta.env.VITE_NHOST_SUBDOMAIN || 'Not set'}</p>
        <p className="mb-1">VITE_NHOST_REGION: {import.meta.env.VITE_NHOST_REGION || 'Not set'}</p>
      </div>
      
      <div className="mt-6">
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded mr-4"
          onClick={() => console.log('Nhost client:', nhost)}
        >
          Log Nhost Client
        </button>
        
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => window.location.href = '/login'}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Debug;