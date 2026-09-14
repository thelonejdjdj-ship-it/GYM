import { useEffect, useState } from 'react'
import {
  Check,
  Clock3,
  Dumbbell,
  Plus,
  Trash2,
} from 'lucide-react'
import { useWorkouts } from '../context/WorkoutContext'
import ExerciseModal from './ExerciseModal'

function WorkoutDetails() {
  const {
    selectedWorkout,
    updateWorkout,
  } = useWorkouts()

  const [completedExercises, setCompletedExercises] =
    useState([])

  const [isExerciseModalOpen, setIsExerciseModalOpen] =
    useState(false)

  const [insertAfterIndex, setInsertAfterIndex] =
    useState(null)

  useEffect(() => {
    setCompletedExercises([])
  }, [selectedWorkout?.id])

  if (!selectedWorkout) {
    return (
      <section className="flex h-[650px] items-center justify-center rounded-2xl bg-black px-6 text-white">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-800 text-neutral-600">
            <Dumbbell size={25} />
          </div>

          <p className="mt-4 text-sm font-medium text-neutral-400">
            Выберите тренировку
          </p>

          <p className="mt-1 text-xs text-neutral-600">
            Нажмите на тренировку в расписании
          </p>
        </div>
      </section>
    )
  }

  const exercises =
    selectedWorkout.exercises ?? []

  const toggleExercise = (exerciseId) => {
    setCompletedExercises((current) =>
      current.includes(exerciseId)
        ? current.filter(
            (id) => id !== exerciseId,
          )
        : [...current, exerciseId],
    )
  }

  const handleCompleteAll = () => {
    if (
      completedExercises.length ===
      exercises.length
    ) {
      setCompletedExercises([])
      return
    }

    setCompletedExercises(
      exercises.map((exercise) => exercise.id),
    )
  }

  // ВАЖНО:
  // "+" НЕ добавляет упражнение автоматически.
  // Он открывает модальное окно.
  const handleAddExerciseAfter = (index) => {
    setInsertAfterIndex(index)
    setIsExerciseModalOpen(true)
  }

  // Сохранение упражнения из модального окна
  const handleSaveExercise = (newExercise) => {
    if (insertAfterIndex === null) {
      return
    }

    const newExercises = [
      ...exercises.slice(0, insertAfterIndex + 1),
      {
        ...newExercise,
        id: `exercise-${Date.now()}`,
      },
      ...exercises.slice(insertAfterIndex + 1),
    ].map((exercise, index) => ({
      ...exercise,
      id: index + 1,
    }))

    updateWorkout(selectedWorkout.id, {
      exercises: newExercises,
    })

    setInsertAfterIndex(null)
    setIsExerciseModalOpen(false)
  }

  // Обычная нижняя кнопка остаётся без изменений
  const handleAddExercise = () => {
    const newExercise = {
      id: exercises.length + 1,
      name: 'Новое упражнение',
      sets: '',
      repetitions: '',
    }

    updateWorkout(selectedWorkout.id, {
      exercises: [
        ...exercises,
        newExercise,
      ],
    })
  }

  // Удаляет выбранные упражнения
  const handleDeleteSelected = () => {
    const remainingExercises =
      exercises
        .filter(
          (exercise) =>
            !completedExercises.includes(
              exercise.id,
            ),
        )
        .map((exercise, index) => ({
          ...exercise,
          id: index + 1,
        }))

    updateWorkout(selectedWorkout.id, {
      exercises: remainingExercises,
    })

    setCompletedExercises([])
  }

  const completedCount =
    completedExercises.length

  return (
    <>
      <section className="flex h-[650px] flex-col overflow-hidden rounded-2xl bg-black text-white">
        {/* HEADER */}
        <div className="shrink-0 border-b border-neutral-800 px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-xs font-bold uppercase tracking-wide text-orange-500">
            Тренировка
          </p>

          <h2 className="mt-2 truncate text-2xl font-bold tracking-tight sm:text-3xl">
            {selectedWorkout.title}
          </h2>

          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-300">
            <span className="inline-flex items-center gap-2">
              <Clock3
                size={19}
                strokeWidth={1.8}
              />

              {selectedWorkout.duration} мин
            </span>

            <span className="h-5 w-px bg-neutral-700" />

            <span className="inline-flex items-center gap-2">
              <Dumbbell
                size={19}
                strokeWidth={1.8}
              />

              {exercises.length} упражнений
            </span>

            {exercises.length > 0 && (
              <>
                <span className="h-5 w-px bg-neutral-700" />

                <span className="text-orange-500">
                  {completedCount}/
                  {exercises.length} выполнено
                </span>
              </>
            )}
          </div>
        </div>

        {/* СПИСОК УПРАЖНЕНИЙ */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {exercises.length > 0 ? (
            exercises.map((exercise, index) => {
              const isCompleted =
                completedExercises.includes(
                  exercise.id,
                )

              const sets =
                exercise.sets ?? ''

              const repetitions =
                exercise.repetitions ?? ''

              const setsAndRepetitions =
                sets || repetitions
                  ? `${sets || '—'} × ${repetitions || '—'}`
                  : '— × —'

              return (
                <div
                  key={`${exercise.id}-${index}`}
                  className={[
                    'border-b border-neutral-800 transition-colors',
                    isCompleted
                      ? 'bg-neutral-950'
                      : 'hover:bg-neutral-950',
                  ].join(' ')}
                >
                  {/* ПОЛОСА УПРАЖНЕНИЯ */}
                  <div className="grid grid-cols-[38px_minmax(0,1fr)_auto_30px_30px] items-center gap-3 px-5 py-4 sm:grid-cols-[42px_minmax(0,1fr)_auto_34px_34px] sm:px-7">
                    {/* НОМЕР */}
                    <div
                      className={[
                        'flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition',
                        isCompleted
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-neutral-700 text-neutral-200',
                      ].join(' ')}
                    >
                      {exercise.id}
                    </div>

                    {/* НАЗВАНИЕ */}
                    <span
                      className={[
                        'min-w-0 truncate text-sm font-medium transition sm:text-base',
                        isCompleted
                          ? 'text-neutral-500 line-through'
                          : 'text-neutral-100',
                      ].join(' ')}
                    >
                      {exercise.name}
                    </span>

                    {/* ПОДХОДЫ × ПОВТОРЕНИЯ */}
                    <span
                      className={[
                        'whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-medium transition sm:px-4 sm:text-sm',
                        isCompleted
                          ? 'border-neutral-800 text-neutral-600'
                          : 'border-neutral-700 text-neutral-200',
                      ].join(' ')}
                    >
                      {setsAndRepetitions}
                    </span>

                    {/* PLUS — ТОЛЬКО ОТКРЫВАЕТ МОДАЛЬНОЕ ОКНО */}
                    <button
                      type="button"
                      onClick={() =>
                        handleAddExerciseAfter(index)
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-700 opacity-50 transition hover:bg-neutral-900 hover:text-neutral-400 hover:opacity-100"
                      aria-label={`Добавить упражнение после ${exercise.name}`}
                      title="Добавить упражнение после этого"
                    >
                      <Plus
                        size={15}
                        strokeWidth={2}
                      />
                    </button>

                    {/* ВЫПОЛНЕНО */}
                    <button
                      type="button"
                      onClick={() =>
                        toggleExercise(
                          exercise.id,
                        )
                      }
                      className={[
                        'flex h-7 w-7 items-center justify-center rounded-md border-2 transition',
                        isCompleted
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white',
                      ].join(' ')}
                      aria-label={
                        isCompleted
                          ? `Снять отметку: ${exercise.name}`
                          : `Отметить: ${exercise.name}`
                      }
                    >
                      <Check
                        size={17}
                        strokeWidth={2.5}
                        className={
                          isCompleted
                            ? 'opacity-100'
                            : 'opacity-0'
                        }
                      />
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="flex min-h-[300px] items-center justify-center px-6 text-center">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-800 text-neutral-600">
                  <Dumbbell size={22} />
                </div>

                <p className="mt-3 text-sm font-medium text-neutral-400">
                  Упражнения пока не добавлены
                </p>
              </div>
            </div>
          )}
        </div>

        {/* КНОПКА ДОБАВИТЬ УПРАЖНЕНИЕ — НЕ ТРОГАЕМ */}
        <div className="shrink-0 border-t border-neutral-800 px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={handleAddExercise}
            className="mx-auto flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-neutral-600 transition hover:bg-neutral-900 hover:text-neutral-300"
          >
            <Plus size={14} />
            Добавить упражнение
          </button>
        </div>

        {/* НИЖНИЕ КНОПКИ */}
        {exercises.length > 0 && (
          <div className="shrink-0 border-t border-neutral-800 p-5 sm:p-6">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleCompleteAll}
                className={[
                  'flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition active:scale-[0.99] sm:text-base',
                  completedCount ===
                  exercises.length
                    ? 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
                    : 'bg-orange-500 text-white hover:bg-orange-600',
                ].join(' ')}
              >
                {completedCount ===
                exercises.length ? (
                  <>
                    <Check size={18} />
                    Снять все отметки
                  </>
                ) : (
                  'Отметить все как выполненные'
                )}
              </button>

              {completedCount > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteSelected}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/20 hover:text-red-300 active:scale-[0.99]"
                >
                  <Trash2 size={17} />
                  Удалить выбранные
                </button>
              )}
            </div>
          </div>
        )}
      </section>

      {/* МОДАЛЬНОЕ ОКНО ДЛЯ "+" */}
      <ExerciseModal
        isOpen={isExerciseModalOpen}
        workout={selectedWorkout}
        onClose={() => {
          setIsExerciseModalOpen(false)
          setInsertAfterIndex(null)
        }}
        isAddingExercise
        onSave={handleSaveExercise}
      />
    </>
  )
}

export default WorkoutDetails