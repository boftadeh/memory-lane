import { CubeIcon } from '@heroicons/react/20/solid'

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className='mx-auto max-w-7xl sm:px-6 lg:px-8 mt-32'>
        <div className='card bg-base-200 shadow-xl'>
          <div className='card-body'>
            <div className='flex items-center'>
              <CubeIcon className='h-16 w-16 text-primary' />
              <h1 className='text-4xl font-bold text-base-content mb-4 ml-4 mt-4'>
                Memory lane
              </h1>
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 