import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  Dumbbell,
  MoreVertical,
  PersonStanding,
  Timer,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react'
import { useWorkouts } from '../context/WorkoutContext'
import ExerciseModal from './ExerciseModal'

function WorkoutIcon({ type }) {
  if (
    type === 'cardio' ||
    type === 'functional'
  ) {
    return (
      <PersonStanding
        size={24}
        strokeWidth={1.8}
      />
    )
  }

  return (
    <Dumbbell
      size={24}
      strokeWidth={1.8}
    />
  )
}

function WorkoutCard({
  workout,
  selected,
  onSelect,
  onOpenExerciseModal,
  onDeleteWorkout,
}) {
  const [
    isMenuOpen,
    setIsMenuOpen,
  ] = useState(false)

  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  const handleOpenExerciseModal = () => {
    setIsMenuOpen(false)
    onOpenExerciseModal(workout)
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    onDeleteWorkout(workout.id)
  }

  return (
    <div
      className={[
        'group relative flex w-full items-center gap-4 rounded-xl border px-4 py-4 text-left transition',
        selected
          ? 'border-black bg-black text-white shadow-sm'
          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation()
          onSelect(workout.id)
        }}
        className="flex min-w-0 flex-1 items-center gap-4 text-left"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
          <WorkoutIcon type={workout.type} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold sm:text-lg">
            {workout.title}
          </h3>

          <div
            className={[
              'mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm',
              selected
                ? 'text-neutral-300'
                : 'text-neutral-500',
            ].join(' ')}
          >
            <span className="inline-flex items-center gap-1.5">
              <Timer
                size={17}
                strokeWidth={1.8}
              />
              {workout.duration} мин
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Dumbbell
                size={17}
                strokeWidth={1.8}
              />
              {workout.exercises?.length ?? 0}{' '}
              упражнений
            </span>

            {workout.time && (
              <span className="inline-flex items-center gap-1.5">
                {workout.time}
              </span>
            )}
          </div>
        </div>
      </button>

      <div
        ref={menuRef}
        className="relative shrink-0"
      >
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()

            setIsMenuOpen(
              (current) => !current,
            )
          }}
          className={[
            'flex h-9 w-9 items-center justify-center rounded-lg transition',
            selected
              ? 'text-white hover:bg-neutral-800'
              : 'text-neutral-700 hover:bg-neutral-100',
          ].join(' ')}
          aria-label={`Действия: ${workout.title}`}
          aria-expanded={isMenuOpen}
        >
          <MoreVertical size={21} />
        </button>

        {isMenuOpen && (
          <div
            className="absolute right-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white p-1.5 shadow-xl"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            <button
              type="button"
              onClick={handleOpenExerciseModal}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-neutral-800 transition hover:bg-neutral-100"
            >
              <Plus
                size={18}
                strokeWidth={1.8}
              />

              <span>
                Добавление тренировок
              </span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              <Trash2
                size={18}
                strokeWidth={1.8}
              />

              <span>
                Удалить
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function DayRow({
  item,
  selectedWorkoutId,
  selectedDayKey,
  onSelectDay,
  onSelectWorkout,
  onOpenExerciseModal,
  onDeleteWorkout,
}) {
  const isWorkoutSelected =
    item.workout?.id === selectedWorkoutId

  const isDaySelected =
    item.dateKey === selectedDayKey

  return (
    <div
      onClick={() =>
        onSelectDay(item.dateKey)
      }
      onKeyDown={(event) => {
        if (
          event.key === 'Enter' ||
          event.key === ' '
        ) {
          event.preventDefault()
          onSelectDay(item.dateKey)
        }
      }}
      role="button"
      tabIndex={0}
      className={[
        'group relative grid min-h-[130px] cursor-pointer grid-cols-[94px_1fr] transition-all duration-200 sm:grid-cols-[110px_1fr]',
        item.isToday
          ? 'bg-orange-50/40'
          : 'bg-white',
        isDaySelected
          ? 'bg-orange-50'
          : 'hover:bg-neutral-50',
      ].join(' ')}
    >
      <div
        className={[
          'relative flex flex-col items-center justify-center border-r border-neutral-300 transition-all duration-200',
          item.isToday
            ? 'bg-orange-50/60'
            : '',
          isDaySelected
            ? 'bg-orange-100'
            : 'group-hover:bg-neutral-100',
        ].join(' ')}
      >
        {isDaySelected && (
          <span className="absolute left-0 top-0 z-30 h-full w-1 bg-orange-500" />
        )}

        {item.isToday && (
          <span className="mb-1 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Сегодня
          </span>
        )}

        <span
          className={[
            'text-sm font-medium',
            item.isToday || isDaySelected
              ? 'text-orange-600'
              : 'text-neutral-600',
          ].join(' ')}
        >
          {item.day}
        </span>

        <span
          className={[
            'mt-1 text-3xl font-semibold tracking-tight',
            item.isToday || isDaySelected
              ? 'text-orange-500'
              : 'text-black',
          ].join(' ')}
        >
          {item.date}
        </span>

        <span className="mt-0.5 text-[11px] font-medium uppercase text-neutral-400">
          {item.month}
        </span>
      </div>

      <div
        className={[
          'flex items-center px-4 py-4 transition-all duration-200 sm:px-5',
          isDaySelected
            ? 'bg-orange-50'
            : 'group-hover:bg-neutral-50',
        ].join(' ')}
      >
        {item.workout ? (
          <div className="w-full">
            <WorkoutCard
              workout={item.workout}
              selected={isWorkoutSelected}
              onSelect={onSelectWorkout}
              onOpenExerciseModal={
                onOpenExerciseModal
              }
              onDeleteWorkout={
                onDeleteWorkout
              }
            />
          </div>
        ) : (
          <div className="w-full">
            <div className="h-[82px] w-full rounded-xl border border-transparent" />
          </div>
        )}
      </div>
    </div>
  )
}

function formatDateKey(date) {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getMonday(date) {
  const result = new Date(date)

  const day = result.getDay()

  const difference =
    day === 0 ? -6 : 1 - day

  result.setDate(
    result.getDate() + difference,
  )

  result.setHours(0, 0, 0, 0)

  return result
}

function getMonthName(date) {
  return date.toLocaleDateString('ru-RU', {
    month: 'long',
  })
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() ===
      date2.getFullYear() &&
    date1.getMonth() ===
      date2.getMonth() &&
    date1.getDate() ===
      date2.getDate()
  )
}

function WeekSchedule() {
  const {
    workouts,
    selectedWorkoutId,
    selectWorkout,
    deleteWorkout,
    weekDate,
    setWeekDate,
  } = useWorkouts()

  const [
    isExerciseModalOpen,
    setIsExerciseModalOpen,
  ] = useState(false)

  const [
    exerciseWorkout,
    setExerciseWorkout,
  ] = useState(null)

  const [
    selectedDayKey,
    setSelectedDayKey,
  ] = useState(null)

  const today = new Date()

  const monday = getMonday(weekDate)

  const weekDays = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date(monday)

      date.setDate(
        monday.getDate() + index,
      )

      return date
    },
  )

  const workoutMap = new Map()

  workouts.forEach((workout) => {
    if (!workout.date) {
      return
    }

    workoutMap.set(workout.date, workout)
  })

  const weekSchedule = weekDays.map(
    (date) => {
      const dateKey =
        formatDateKey(date)

      return {
        id: `day-${dateKey}`,
        dateObject: date,
        date: date.getDate(),
        dateKey,

        day: date.toLocaleDateString(
          'ru-RU',
          {
            weekday: 'short',
          },
        ),

        month: date.toLocaleDateString(
          'ru-RU',
          {
            month: 'short',
          },
        ),

        isToday: isSameDay(
          date,
          today,
        ),

        workout:
          workoutMap.get(dateKey) ?? null,
      }
    },
  )

  const handleSelectDay = (dateKey) => {
    setSelectedDayKey(dateKey)
  }

  const goToPreviousWeek = () => {
    const newDate = new Date(weekDate)

    newDate.setDate(
      newDate.getDate() - 7,
    )

    setWeekDate(newDate)

    const newMonday = getMonday(newDate)

    setSelectedDayKey(
      formatDateKey(newMonday),
    )
  }

  const goToNextWeek = () => {
    const newDate = new Date(weekDate)

    newDate.setDate(
      newDate.getDate() + 7,
    )

    setWeekDate(newDate)

    const newMonday = getMonday(newDate)

    setSelectedDayKey(
      formatDateKey(newMonday),
    )
  }

  const handleOpenExerciseModal = (
    workout,
  ) => {
    setExerciseWorkout(workout)
    setIsExerciseModalOpen(true)
  }

  const handleCloseExerciseModal = () => {
    setIsExerciseModalOpen(false)
    setExerciseWorkout(null)
  }

  const handleDeleteWorkout = (
    workoutId,
  ) => {
    deleteWorkout(workoutId)

    if (
      selectedWorkoutId === workoutId
    ) {
      setSelectedDayKey(null)
    }

    if (
      exerciseWorkout?.id === workoutId
    ) {
      handleCloseExerciseModal()
    }
  }

  return (
    <>
      <section className="relative overflow-hidden rounded-2xl border border-neutral-300 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-300 bg-white px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Расписание
            </p>

            <h2 className="mt-0.5 text-lg font-bold capitalize text-black">
              {getMonthName(monday)}{' '}
              {monday.getFullYear()}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={goToPreviousWeek}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
              aria-label="Предыдущая неделя"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={goToNextWeek}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50"
              aria-label="Следующая неделя"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-2 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-neutral-500">
              Выбранная неделя
            </span>

            <span className="text-right text-xs font-semibold text-neutral-700">
              {monday.toLocaleDateString(
                'ru-RU',
                {
                  day: 'numeric',
                  month: 'long',
                },
              )}{' '}
              —{' '}
              {weekDays[6].toLocaleDateString(
                'ru-RU',
                {
                  day: 'numeric',
                  month: 'long',
                },
              )}
            </span>
          </div>
        </div>

        <div>
          {weekSchedule.map(
            (day, index) => (
              <div
                key={day.id}
                className="relative"
              >
                <DayRow
                  item={day}
                  selectedWorkoutId={
                    selectedWorkoutId
                  }
                  selectedDayKey={
                    selectedDayKey
                  }
                  onSelectDay={
                    handleSelectDay
                  }
                  onSelectWorkout={
                    selectWorkout
                  }
                  onOpenExerciseModal={
                    handleOpenExerciseModal
                  }
                  onDeleteWorkout={
                    handleDeleteWorkout
                  }
                />

                {index <
                  weekSchedule.length - 1 && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 h-px bg-neutral-300" />
                )}

                <div className="pointer-events-none absolute bottom-0 left-[94px] top-0 z-20 w-px bg-neutral-300 sm:left-[110px]" />
              </div>
            ),
          )}
        </div>
      </section>

      <ExerciseModal
        isOpen={isExerciseModalOpen}
        workout={exerciseWorkout}
        onClose={handleCloseExerciseModal}
      />
    </>
  )
}

export default WeekSchedule