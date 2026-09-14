import Header from './components/Header'
import Stats from './components/Stats'
import WeekSchedule from './components/WeekSchedule'
import WorkoutDetails from './components/WorkoutDetails'
import { WorkoutProvider } from './context/WorkoutContext'

function App() {
  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-white text-neutral-900">
        <Header />

        <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
            <WeekSchedule />

            <div className="flex min-w-0 flex-col gap-5">
              <WorkoutDetails />
              <Stats />
            </div>
          </div>
        </main>
      </div>
    </WorkoutProvider>
  )
}

export default App