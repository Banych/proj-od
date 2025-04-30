import { Loader2 } from 'lucide-react'

const LoadingComponent = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  )
}

export default LoadingComponent
