import { useState } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from 'lucide-react'
import { useWorkouts } from '../context/WorkoutContext'

function Header() {
  const {
    weekDate,
    setWeekDate,
    addWorkout,
  } = useWorkouts()

  // Все useState должны находиться здесь,
  // до любого другого вычисления
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] =
    useState(false)

  const [isCalendarOpen, setIsCalendarOpen] =
    useState(false)

  const [workoutDate, setWorkoutDate] =
    useState('')

  const [workoutTime, setWorkoutTime] =
    useState('')

  const [workoutName, setWorkoutName] =
    useState('')

  const [selectedDate, setSelectedDate] =
    useState(() => new Date())

  const [calendarMonth, setCalendarMonth] =
    useState(() => new Date())

  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ]

  const weekDays = [
    'Пн',
    'Вт',
    'Ср',
    'Чт',
    'Пт',
    'Сб',
    'Вс',
  ]

  // Получить понедельник недели
  const getMonday = (date) => {
    const result = new Date(date)

    if (Number.isNaN(result.getTime())) {
      return new Date()
    }

    const day = result.getDay()

    const difference =
      day === 0 ? -6 : 1 - day

    result.setDate(
      result.getDate() + difference,
    )

    result.setHours(0, 0, 0, 0)

    return result
  }

  // Получить воскресенье недели
  const getSunday = (date) => {
    const monday = getMonday(date)
    const result = new Date(monday)

    result.setDate(
      result.getDate() + 6,
    )

    return result
  }

  const weekStart = getMonday(weekDate)
  const weekEnd = getSunday(weekDate)

  // Предыдущая неделя
  const handlePreviousWeek = () => {
    const newDate = new Date(weekDate)

    newDate.setDate(
      newDate.getDate() - 7,
    )

    setWeekDate(newDate)

    setSelectedDate(newDate)

    setCalendarMonth(newDate)
  }

  // Следующая неделя
  const handleNextWeek = () => {
    const newDate = new Date(weekDate)

    newDate.setDate(
      newDate.getDate() + 7,
    )

    setWeekDate(newDate)

    setSelectedDate(newDate)

    setCalendarMonth(newDate)
  }

  // Форматирование диапазона недели
  const formatWeekRange = () => {
    const startDay =
      weekStart.getDate()

    const endDay =
      weekEnd.getDate()

    const startMonth =
      months[weekStart.getMonth()] ?? ''

    const endMonth =
      months[weekEnd.getMonth()] ?? ''

    const startYear =
      weekStart.getFullYear()

    const endYear =
      weekEnd.getFullYear()

    // Например:
    // 7–13 сентября 2026
    if (
      weekStart.getMonth() ===
        weekEnd.getMonth() &&
      startYear === endYear
    ) {
      return `${startDay}–${endDay} ${startMonth.toLowerCase()} ${startYear}`
    }

    // Например:
    // 28 сентября – 4 октября 2026
    if (startYear === endYear) {
      return `${startDay} ${startMonth.toLowerCase()} – ${endDay} ${endMonth.toLowerCase()} ${startYear}`
    }

    // Например:
    // 29 декабря 2025 – 4 января 2026
    return `${startDay} ${startMonth.toLowerCase()} ${startYear} – ${endDay} ${endMonth.toLowerCase()} ${endYear}`
  }

  // Добавление тренировки
  const handleAddWorkout = () => {
    if (
      !workoutDate ||
      !workoutTime ||
      !workoutName.trim()
    ) {
      return
    }

    const dateParts =
      workoutDate.split('-')

    const timeParts =
      workoutTime.split(':')

    if (
      dateParts.length !== 3 ||
      timeParts.length !== 2
    ) {
      return
    }

    const year = Number(dateParts[0])
    const month = Number(dateParts[1])
    const day = Number(dateParts[2])

    const hours = Number(timeParts[0])
    const minutes = Number(timeParts[1])

    if (
      year < 1 ||
      year > 9999 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31 ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return
    }

    const workout = {
      id: Date.now(),

      name: workoutName.trim(),

      title: workoutName.trim(),

      date: workoutDate,

      time: workoutTime,

      duration: 0,

      exercises: [],

      type: 'functional',

      completed: false,
    }

    addWorkout(workout)

    setIsWorkoutModalOpen(false)

    setWorkoutDate('')

    setWorkoutTime('')

    setWorkoutName('')
  }

  // Форматирование времени 0000 -> 00:00
  const handleTimeChange = (event) => {
    const digits =
      event.target.value
        .replace(/\D/g, '')
        .slice(0, 4)

    if (!digits) {
      setWorkoutTime('')
      return
    }

    let hours =
      digits.slice(0, 2)

    let minutes =
      digits.slice(2, 4)

    if (
      hours.length === 2 &&
      Number(hours) > 23
    ) {
      hours = '23'
    }

    if (
      minutes.length === 2 &&
      Number(minutes) > 59
    ) {
      minutes = '59'
    }

    const formattedTime =
      digits.length <= 2
        ? hours
        : `${hours}:${minutes}`

    setWorkoutTime(formattedTime)
  }

  // Количество дней в месяце
  const getDaysInMonth = (
    year,
    month,
  ) => {
    return new Date(
      year,
      month + 1,
      0,
    ).getDate()
  }

  // Первый день месяца
  const getFirstDayOfMonth = (
    year,
    month,
  ) => {
    const day = new Date(
      year,
      month,
      1,
    ).getDay()

    // Понедельник = 0
    return day === 0 ? 6 : day - 1
  }

  // Предыдущий месяц
  const handlePreviousMonth = () => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() - 1,
        1,
      ),
    )
  }

  // Следующий месяц
  const handleNextMonth = () => {
    setCalendarMonth(
      new Date(
        calendarMonth.getFullYear(),
        calendarMonth.getMonth() + 1,
        1,
      ),
    )
  }

  // Выбор дня в календаре
  const handleSelectDay = (day) => {
    const newDate = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      day,
      selectedDate.getHours(),
      selectedDate.getMinutes(),
    )

    setSelectedDate(newDate)

    setWeekDate(newDate)
  }

  // Проверка выбранного дня
  const isSelectedDay = (day) => {
    return (
      selectedDate.getFullYear() ===
        calendarMonth.getFullYear() &&
      selectedDate.getMonth() ===
        calendarMonth.getMonth() &&
      selectedDate.getDate() === day
    )
  }

  // Изменение времени календаря
  const handleCalendarTimeChange = (
    event,
  ) => {
    const [hours, minutes] =
      event.target.value
        .split(':')
        .map(Number)

    const newDate =
      new Date(selectedDate)

    newDate.setHours(hours)

    newDate.setMinutes(minutes)

    setSelectedDate(newDate)

    setWeekDate(newDate)
  }

  const daysInMonth =
    getDaysInMonth(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
    )

  const firstDay =
    getFirstDayOfMonth(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
    )

  const calendarDays = []

  // Пустые ячейки перед первым днем
  for (
    let i = 0;
    i < firstDay;
    i++
  ) {
    calendarDays.push(null)
  }

  // Дни месяца
  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    calendarDays.push(day)
  }

  const selectedTime =
    `${String(
      selectedDate.getHours(),
    ).padStart(2, '0')}:${String(
      selectedDate.getMinutes(),
    ).padStart(2, '0')}`

  return (
    <>
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-neutral-800 bg-black text-white">
        <div className="mx-auto flex min-h-[104px] max-w-[1440px] items-center justify-between gap-6 px-6 py-5 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[42px]">
            Мои тренировки
          </h1>

          {/* DESKTOP CONTROLS */}
          <div className="hidden items-center gap-3 md:flex">
            {/* Calendar */}
            <button
              type="button"
              onClick={() => {
                setCalendarMonth(
                  new Date(weekDate),
                )

                setSelectedDate(
                  new Date(weekDate),
                )

                setIsCalendarOpen(true)
              }}
              className="flex h-14 w-14 items-center justify-center rounded-xl border border-neutral-700 transition hover:border-neutral-500 hover:bg-neutral-900"
              aria-label="Выбрать дату"
            >
              <CalendarDays
                size={22}
                strokeWidth={1.8}
              />
            </button>

            {/* Week navigation */}
            <div className="flex h-14 items-center overflow-hidden rounded-xl border border-neutral-700">
              <button
                type="button"
                onClick={handlePreviousWeek}
                className="flex h-full w-14 items-center justify-center transition hover:bg-neutral-900"
                aria-label="Предыдущая неделя"
              >
                <ChevronLeft size={22} />
              </button>

              <div className="flex h-full min-w-[230px] items-center justify-center border-x border-neutral-700 px-5 text-lg font-semibold">
                {formatWeekRange()}
              </div>

              <button
                type="button"
                onClick={handleNextWeek}
                className="flex h-full w-14 items-center justify-center transition hover:bg-neutral-900"
                aria-label="Следующая неделя"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>

          {/* ADD WORKOUT */}
          <button
            type="button"
            onClick={() =>
              setIsWorkoutModalOpen(true)
            }
            className="flex h-14 items-center gap-2 rounded-xl bg-orange-500 px-5 text-base font-semibold text-white transition hover:bg-orange-600 active:scale-[0.98]"
          >
            <Plus
              size={22}
              strokeWidth={2.2}
            />

            <span className="hidden sm:inline">
              Тренировка
            </span>
          </button>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="border-t border-neutral-800 px-4 py-3 md:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCalendarMonth(
                  new Date(weekDate),
                )

                setSelectedDate(
                  new Date(weekDate),
                )

                setIsCalendarOpen(true)
              }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-700"
              aria-label="Выбрать дату"
            >
              <CalendarDays size={20} />
            </button>

            <button
              type="button"
              onClick={handlePreviousWeek}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-700"
              aria-label="Предыдущая неделя"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex h-11 flex-1 items-center justify-center rounded-lg border border-neutral-700 text-sm font-semibold">
              {formatWeekRange()}
            </div>

            <button
              type="button"
              onClick={handleNextWeek}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-neutral-700"
              aria-label="Следующая неделя"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* CALENDAR MODAL */}
      {isCalendarOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setIsCalendarOpen(false)
            }
          }}
        >
          <div
            className="w-full max-w-[430px] rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  Календарь
                </h2>

                <p className="mt-1 text-sm text-neutral-500">
                  Григорианский календарь
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsCalendarOpen(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
                aria-label="Закрыть календарь"
              >
                <X size={22} />
              </button>
            </div>

            {/* MONTH NAVIGATION */}
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 transition hover:bg-neutral-900"
                aria-label="Предыдущий месяц"
              >
                <ChevronLeft size={20} />
              </button>

              <div className="text-lg font-bold">
                {months[
                  calendarMonth.getMonth()
                ]}{' '}
                {calendarMonth.getFullYear()}
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-800 transition hover:bg-neutral-900"
                aria-label="Следующий месяц"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* WEEK DAYS */}
            <div className="mb-2 grid grid-cols-7">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="py-2 text-center text-xs font-semibold text-neutral-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* CALENDAR DAYS */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(
                (day, index) => {
                  if (day === null) {
                    return (
                      <div
                        key={`empty-${index}`}
                      />
                    )
                  }

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() =>
                        handleSelectDay(day)
                      }
                      className={[
                        'flex h-11 items-center justify-center rounded-lg text-sm font-medium transition',
                        isSelectedDay(day)
                          ? 'bg-orange-500 text-white'
                          : 'text-neutral-300 hover:bg-neutral-900',
                      ].join(' ')}
                    >
                      {day}
                    </button>
                  )
                },
              )}
            </div>

            {/* SELECTED DATE */}
            <div className="mt-5 rounded-xl border border-neutral-800 bg-black p-4">
              <p className="text-xs text-neutral-500">
                Выбрано
              </p>

              <p className="mt-1 text-lg font-semibold">
                {selectedDate.toLocaleDateString(
                  'ru-RU',
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  },
                )}
              </p>
            </div>

            {/* TIME */}
            <div className="mt-4">
              <label
                htmlFor="calendar-time"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Время
              </label>

              <input
                id="calendar-time"
                type="time"
                value={selectedTime}
                onChange={
                  handleCalendarTimeChange
                }
                className="h-12 w-full rounded-xl border border-neutral-700 bg-black px-4 text-white outline-none transition focus:border-orange-500"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setIsCalendarOpen(false)
              }
              className="mt-5 h-12 w-full rounded-xl bg-orange-500 font-semibold text-white transition hover:bg-orange-600"
            >
              Готово
            </button>
          </div>
        </div>
      )}

      {/* ADD WORKOUT MODAL */}
      {isWorkoutModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setIsWorkoutModalOpen(false)
            }
          }}
        >
          <div
            className="w-full max-w-[480px] rounded-2xl border border-neutral-800 bg-neutral-950 p-6 text-white shadow-2xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Добавить тренировку
              </h2>

              <button
                type="button"
                onClick={() =>
                  setIsWorkoutModalOpen(false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
                aria-label="Закрыть"
              >
                <X size={22} />
              </button>
            </div>

            {/* NAME */}
            <div className="mb-5">
              <label
                htmlFor="workout-name"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Название тренировки
              </label>

              <input
                id="workout-name"
                type="text"
                value={workoutName}
                onChange={(event) =>
                  setWorkoutName(
                    event.target.value,
                  )
                }
                placeholder="Например: Грудь + трицепс"
                className="h-12 w-full rounded-xl border border-neutral-700 bg-black px-4 text-white outline-none placeholder:text-neutral-600 transition focus:border-orange-500"
              />
            </div>

            {/* DATE */}
            <div className="mb-5">
              <label
                htmlFor="workout-date"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Дата
              </label>

              <input
                id="workout-date"
                type="date"
                min="0001-01-01"
                max="9999-12-31"
                value={workoutDate}
                onChange={(event) =>
                  setWorkoutDate(
                    event.target.value,
                  )
                }
                className="h-12 w-full rounded-xl border border-neutral-700 bg-black px-4 text-white outline-none transition focus:border-orange-500"
              />
            </div>

            {/* TIME */}
            <div className="mb-6">
              <label
                htmlFor="workout-time"
                className="mb-2 block text-sm font-medium text-neutral-300"
              >
                Время
              </label>

              <input
                id="workout-time"
                type="text"
                inputMode="numeric"
                placeholder="00:00"
                maxLength={5}
                value={workoutTime}
                onChange={handleTimeChange}
                className="h-12 w-full rounded-xl border border-neutral-700 bg-black px-4 text-white outline-none placeholder:text-neutral-600 transition focus:border-orange-500"
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setIsWorkoutModalOpen(false)
                }
                className="h-12 flex-1 rounded-xl border border-neutral-700 px-4 font-semibold text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
              >
                Отмена
              </button>

              <button
                type="button"
                onClick={handleAddWorkout}
                disabled={
                  !workoutDate ||
                  !workoutTime ||
                  !workoutName.trim()
                }
                className="h-12 flex-1 rounded-xl bg-orange-500 px-4 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header