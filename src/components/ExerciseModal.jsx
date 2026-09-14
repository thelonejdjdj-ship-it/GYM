import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  Plus,
  Trash2,
  X,
  Dumbbell,
  Clock3,
} from 'lucide-react'
import { useWorkouts } from '../context/WorkoutContext'

function ExerciseModal({
  isOpen,
  workout,
  onClose,
}) {
  const { addExercises } = useWorkouts()

  const [duration, setDuration] = useState('')
  const [exercises, setExercises] = useState([])

  useEffect(() => {
    if (!isOpen || !workout) {
      return
    }

    setDuration(
      workout.duration
        ? String(workout.duration)
        : '',
    )

    if (
      Array.isArray(workout.exercises) &&
      workout.exercises.length > 0
    ) {
      setExercises(
        workout.exercises.map(
          (exercise, index) => ({
            id:
              exercise.id ??
              `exercise-${index + 1}`,
            name: exercise.name ?? '',
            sets:
              exercise.sets ??
              exercise.approaches ??
              '',
            repetitions:
              exercise.repetitions ??
              '',
          }),
        ),
      )
    } else {
      setExercises([
        {
          id: `exercise-${Date.now()}`,
          name: '',
          sets: '',
          repetitions: '',
        },
      ])
    }
  }, [isOpen, workout])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener(
      'keydown',
      handleEscape,
    )

    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape,
      )

      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen || !workout) {
    return null
  }

  const handleExerciseChange = (
    id,
    field,
    value,
  ) => {
    setExercises((current) =>
      current.map((exercise) =>
        exercise.id === id
          ? {
              ...exercise,
              [field]: value,
            }
          : exercise,
      ),
    )
  }

  const handleAddExercise = () => {
    setExercises((current) => [
      ...current,
      {
        id: `exercise-${Date.now()}-${current.length}`,
        name: '',
        sets: '',
        repetitions: '',
      },
    ])
  }

  const handleRemoveExercise = (id) => {
    setExercises((current) => {
      if (current.length <= 1) {
        return current
      }

      return current.filter(
        (exercise) =>
          exercise.id !== id,
      )
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const cleanedExercises = exercises
      .filter(
        (exercise) =>
          exercise.name.trim() !== '',
      )
      .map((exercise, index) => ({
        id: index + 1,
        name: exercise.name.trim(),

        sets:
          exercise.sets.trim() ||
          'Без указания',

        repetitions:
          exercise.repetitions.trim() ||
          'Без указания',
      }))

    addExercises(
      workout.id,
      cleanedExercises,
      Number(duration) || 0,
    )

    onClose()
  }

  const handleOverlayClick = (
    event,
  ) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* HEADER */}

        <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Упражнения
            </p>

            <h2 className="mt-1 truncate text-xl font-bold text-black sm:text-2xl">
              {workout.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-neutral-500 transition hover:bg-neutral-100 hover:text-black"
            aria-label="Закрыть"
          >
            <X size={22} />
          </button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
            {/* DURATION */}

            <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Clock3
                  size={19}
                  className="text-orange-500"
                />

                <h3 className="text-sm font-bold text-black">
                  Длительность тренировки
                </h3>
              </div>

              <input
                type="number"
                min="1"
                value={duration}
                onChange={(event) =>
                  setDuration(
                    event.target.value,
                  )
                }
                placeholder="Например, 60"
                className="h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
              />
            </div>

            {/* EXERCISES */}

            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dumbbell
                    size={19}
                    className="text-orange-500"
                  />

                  <h3 className="text-base font-bold text-black">
                    Упражнения
                  </h3>
                </div>

                <span className="text-xs font-medium text-neutral-400">
                  {exercises.length}
                </span>
              </div>

              <div className="space-y-3">
                {exercises.map(
                  (exercise, index) => (
                    <div
                      key={exercise.id}
                      className="rounded-xl border border-neutral-200 bg-white p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
                          {index + 1}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveExercise(
                              exercise.id,
                            )
                          }
                          disabled={
                            exercises.length ===
                            1
                          }
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-30"
                          aria-label="Удалить упражнение"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="grid gap-3">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
                            Название упражнения
                          </label>

                          <input
                            type="text"
                            value={exercise.name}
                            onChange={(event) =>
                              handleExerciseChange(
                                exercise.id,
                                'name',
                                event.target.value,
                              )
                            }
                            placeholder="Например, Жим лёжа"
                            className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
                              Подходы
                            </label>

                            <input
                              type="number"
                              min="1"
                              value={exercise.sets}
                              onChange={(event) =>
                                handleExerciseChange(
                                  exercise.id,
                                  'sets',
                                  event.target.value,
                                )
                              }
                              placeholder="3"
                              className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-semibold text-neutral-500">
                              Повторения
                            </label>

                            <input
                              type="number"
                              min="1"
                              value={
                                exercise.repetitions
                              }
                              onChange={(event) =>
                                handleExerciseChange(
                                  exercise.id,
                                  'repetitions',
                                  event.target.value,
                                )
                              }
                              placeholder="12"
                              className="h-11 w-full rounded-lg border border-neutral-300 px-3 text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                            />
                          </div>
                        </div>

                        <div className="rounded-lg bg-neutral-50 px-3 py-2">
                          <span className="text-xs font-medium text-neutral-400">
                            Всего
                          </span>

                          <div className="text-sm font-bold text-black">
                            {exercise.sets ||
                            exercise.repetitions
                              ? `${exercise.sets || '—'} × ${exercise.repetitions || '—'}`
                              : '— × —'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* ADD EXERCISE */}

              <button
                type="button"
                onClick={handleAddExercise}
                className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 text-sm font-semibold text-neutral-600 transition hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
              >
                <Plus size={18} />

                Добавить упражнение
              </button>
            </div>
          </div>

          {/* FOOTER */}

          <div className="shrink-0 border-t border-neutral-200 bg-white px-5 py-4 sm:px-6">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-xl border border-neutral-300 px-5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50"
              >
                Отмена
              </button>

              <button
                type="submit"
                className="h-11 rounded-xl bg-orange-500 px-6 text-sm font-bold text-white transition hover:bg-orange-600 active:scale-[0.99]"
              >
                Сохранить
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}

export default ExerciseModal