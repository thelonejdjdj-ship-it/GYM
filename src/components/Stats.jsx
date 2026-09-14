import {
  Activity,
  CalendarDays,
  Flame,
  Target,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { useWorkouts } from '../context/WorkoutContext'

function StatsCard({
  icon: Icon,
  label,
  value,
  suffix,
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          <Icon size={21} strokeWidth={1.9} />
        </div>

        <TrendingUp
          size={17}
          className="text-neutral-300"
        />
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
          {label}
        </p>

        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
            {value}
          </span>

          {suffix && (
            <span className="text-sm font-medium text-neutral-400">
              {suffix}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function Stats() {
  const {
    workouts,
    weekDate,
  } = useWorkouts()

  const [period, setPeriod] = useState('week')

  const currentDate =
    weekDate instanceof Date
      ? weekDate
      : new Date()

  const dayNames = [
    'ВС',
    'ПН',
    'ВТ',
    'СР',
    'ЧТ',
    'ПТ',
    'СБ',
  ]

  const currentDay =
    dayNames[currentDate.getDay()]

  const currentMonth =
    currentDate.getMonth()

  const currentYear =
    currentDate.getFullYear()

  const getWorkoutDate = (workout) => {
    if (!workout.date) {
      return null
    }

    const dateString =
      String(workout.date)

    if (
      /^\d{4}-\d{2}-\d{2}$/.test(
        dateString,
      )
    ) {
      const date = new Date(
        `${dateString}T00:00:00`,
      )

      if (
        !Number.isNaN(
          date.getTime(),
        )
      ) {
        return date
      }
    }

    const day = Number(
      dateString,
    )

    if (
      Number.isInteger(day) &&
      day >= 1 &&
      day <= 31
    ) {
      return new Date(
        currentYear,
        currentMonth,
        day,
      )
    }

    return null
  }

  const startOfWeek =
    new Date(currentDate)

  const currentWeekDay =
    startOfWeek.getDay()

  const mondayOffset =
    currentWeekDay === 0
      ? 6
      : currentWeekDay - 1

  startOfWeek.setDate(
    startOfWeek.getDate() -
      mondayOffset,
  )

  startOfWeek.setHours(
    0,
    0,
    0,
    0,
  )

  const endOfWeek =
    new Date(startOfWeek)

  endOfWeek.setDate(
    endOfWeek.getDate() + 6,
  )

  endOfWeek.setHours(
    23,
    59,
    59,
    999,
  )

  const isWorkoutInCurrentWeek =
    (workout) => {
      if (workout.day) {
        return dayNames.includes(
          String(
            workout.day,
          ).toUpperCase(),
        )
      }

      const workoutDate =
        getWorkoutDate(workout)

      if (!workoutDate) {
        return false
      }

      return (
        workoutDate >=
          startOfWeek &&
        workoutDate <=
          endOfWeek
      )
    }

  const isWorkoutToday =
    (workout) => {
      if (workout.day) {
        return (
          String(
            workout.day,
          ).toUpperCase() ===
          currentDay
        )
      }

      const workoutDate =
        getWorkoutDate(workout)

      if (!workoutDate) {
        return false
      }

      return (
        workoutDate.getFullYear() ===
          currentYear &&
        workoutDate.getMonth() ===
          currentMonth &&
        workoutDate.getDate() ===
          currentDate.getDate()
      )
    }

  const isWorkoutInCurrentMonth =
    (workout) => {
      const workoutDate =
        getWorkoutDate(workout)

      if (!workoutDate) {
        return false
      }

      return (
        workoutDate.getFullYear() ===
          currentYear &&
        workoutDate.getMonth() ===
          currentMonth
      )
    }

  const isWorkoutInCurrentYear =
    (workout) => {
      const workoutDate =
        getWorkoutDate(workout)

      if (!workoutDate) {
        return false
      }

      return (
        workoutDate.getFullYear() ===
        currentYear
      )
    }

  const filteredWorkouts =
    workouts.filter((workout) => {
      if (workout.rest) {
        return false
      }

      if (period === 'day') {
        return isWorkoutToday(
          workout,
        )
      }

      if (period === 'week') {
        return isWorkoutInCurrentWeek(
          workout,
        )
      }

      if (period === 'month') {
        return isWorkoutInCurrentMonth(
          workout,
        )
      }

      if (period === 'year') {
        return isWorkoutInCurrentYear(
          workout,
        )
      }

      return false
    })

  const totalWorkouts =
    filteredWorkouts.length

  const completedWorkouts =
    filteredWorkouts.filter(
      (workout) =>
        workout.completed === true,
    ).length

  const totalExercises =
    filteredWorkouts.reduce(
      (total, workout) =>
        total +
        (Array.isArray(
          workout.exercises,
        )
          ? workout.exercises.length
          : 0),
      0,
    )

  const totalDuration =
    filteredWorkouts.reduce(
      (total, workout) =>
        total +
        (Number(
          workout.duration,
        ) || 0),
      0,
    )

  const completionRate =
    totalWorkouts > 0
      ? Math.round(
          (completedWorkouts /
            totalWorkouts) *
            100,
        )
      : 0

  const periods = [
    {
      id: 'day',
      label: 'День',
    },
    {
      id: 'week',
      label: 'Неделя',
    },
    {
      id: 'month',
      label: 'Месяц',
    },
    {
      id: 'year',
      label: 'Год',
    },
  ]

  return (
    <section>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-orange-500">
            Статистика
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight text-black sm:text-2xl">
            Твои результаты
          </h2>
        </div>

        <Activity
          size={24}
          className="text-neutral-300"
        />
      </div>

      <div className="mb-4 flex w-full overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 sm:w-fit">
        {periods.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              setPeriod(item.id)
            }
            className={[
              'flex-1 rounded-lg px-4 py-2 text-xs font-semibold transition sm:flex-none sm:text-sm',
              period === item.id
                ? 'bg-black text-white'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-black',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatsCard
          icon={Flame}
          label="Тренировки"
          value={totalWorkouts}
          suffix="шт."
        />

        <StatsCard
          icon={Target}
          label="Выполнено"
          value={completionRate}
          suffix="%"
        />

        <StatsCard
          icon={CalendarDays}
          label="Упражнения"
          value={totalExercises}
          suffix="шт."
        />

        <StatsCard
          icon={TrendingUp}
          label="Время"
          value={totalDuration}
          suffix="мин"
        />
      </div>
    </section>
  )
}

export default Stats