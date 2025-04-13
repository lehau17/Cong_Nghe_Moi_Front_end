import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { SocketContext } from './context/SocketContext.tsx'
import './index.css'
import { socket } from './socket.ts'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <SocketContext.Provider value={socket}>
        <QueryClientProvider client={queryClient}>
            <App />

        </QueryClientProvider>
    </SocketContext.Provider>
)
