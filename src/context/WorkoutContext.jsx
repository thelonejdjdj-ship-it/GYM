import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { workouts as initialWorkouts } from '../data/workouts'

const WorkoutContext = createContext(null)

const WORKOUTS_STORAGE_KEY =
  'workout-tracker-workouts'

function getSavedWorkouts() {
  try {
    const savedWorkouts = localStorage.getItem(
      WORKOUTS_STORAGE_KEY,
    )

    if (!savedWorkouts) {
      return initialWorkouts
    }

    const parsedWorkouts =
      JSON.parse(savedWorkouts)

    return Array.isArray(parsedWorkouts)
      ? parsedWorkouts
      : initialWorkouts
  } catch {
    return initialWorkouts
  }
}

export function WorkoutProvider({ children }) {
  const [workouts, setWorkouts] = useState(
    getSavedWorkouts,
  )

  // Сохраняем расписание после каждого изменения
  useEffect(() => {
    try {
      localStorage.setItem(
        WORKOUTS_STORAGE_KEY,
        JSON.stringify(workouts),
      )
    } catch {
      // Ничего не делаем, если localStorage недоступен
    }
  }, [workouts])

  // Единая дата для Header и WeekSchedule
  const [weekDate, setWeekDate] = useState(
    () => new Date(),
  )

  const [selectedWorkoutId, setSelectedWorkoutId] =
    useState(
      () => getSavedWorkouts()[0]?.id ?? null,
    )

  const addWorkout = (workout) => {
    const newWorkout = {
      id: workout.id ?? Date.now(),

      title:
        workout.title ??
        workout.name ??
        'Новая тренировка',

      name:
        workout.name ??
        workout.title ??
        'Новая тренировка',

      date: workout.date ?? '',
      time: workout.time ?? '',
      duration: workout.duration ?? 0,
      exercises: workout.exercises ?? [],
      type: workout.type ?? 'functional',
      completed: workout.completed ?? false,
    }

    setWorkouts((currentWorkouts) => [
      ...currentWorkouts,
      newWorkout,
    ])

    setSelectedWorkoutId(newWorkout.id)
  }

  const updateWorkout = (
    workoutId,
    updates,
  ) => {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.map((workout) =>
        workout.id === workoutId
          ? {
              ...workout,
              ...updates,
            }
          : workout,
      ),
    )
  }

  const deleteWorkout = (workoutId) => {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.filter(
        (workout) => workout.id !== workoutId,
      ),
    )

    setSelectedWorkoutId((currentSelectedId) =>
      currentSelectedId === workoutId
        ? null
        : currentSelectedId,
    )
  }

  const addExercises = (
    workoutId,
    exercises,
    duration,
  ) => {
    updateWorkout(workoutId, {
      exercises,
      duration,
    })
  }

  const selectWorkout = (workoutId) => {
    setSelectedWorkoutId(workoutId)
  }

  const selectedWorkout = workouts.find(
    (workout) =>
      workout.id === selectedWorkoutId,
  )

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        selectedWorkout,
        selectedWorkoutId,

        weekDate,
        setWeekDate,

        addWorkout,
        updateWorkout,
        deleteWorkout,
        addExercises,
        selectWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkouts() {
  const context = useContext(WorkoutContext)

  if (!context) {
    throw new Error(
      'useWorkouts должен использоваться внутри WorkoutProvider',
    )
  }

  return context
}