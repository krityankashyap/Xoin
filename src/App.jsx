import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HarvestingProvider } from '@/context/HarvestingContext'
import { Routes } from '@/Routes'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HarvestingProvider>
        <Routes />
      </HarvestingProvider>
    </QueryClientProvider>
  )
}
