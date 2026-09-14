export const workouts = [
  {
    id: 1,
    day: 'ПН',
    date: '19',
    title: 'Сила: Верх тела',
    duration: 45,
    type: 'strength',
    completed: false,
    exercises: [
      {
        id: 1,
        name: 'Жим штанги лёжа',
        sets: '4 × 8–10',
        completed: false,
      },
      {
        id: 2,
        name: 'Тяга штанги в наклоне',
        sets: '4 × 8–10',
        completed: false,
      },
      {
        id: 3,
        name: 'Жим гантелей сидя',
        sets: '3 × 10–12',
        completed: false,
      },
      {
        id: 4,
        name: 'Подтягивания',
        sets: '3 × 6–10',
        completed: false,
      },
      {
        id: 5,
        name: 'Разведение гантелей в стороны',
        sets: '3 × 12–15',
        completed: false,
      },
    ],
  },

  {
    id: 2,
    day: 'ВТ',
    date: '20',
    title: 'Кардио: Интервалы',
    duration: 30,
    type: 'cardio',
    completed: false,
    exercises: [
      {
        id: 1,
        name: 'Разминка',
        sets: '5 мин',
        completed: false,
      },
      {
        id: 2,
        name: 'Бег',
        sets: '10 мин',
        completed: false,
      },
      {
        id: 3,
        name: 'Интервалы',
        sets: '10 мин',
        completed: false,
      },
      {
        id: 4,
        name: 'Заминка',
        sets: '5 мин',
        completed: false,
      },
    ],
  },

  {
    id: 3,
    day: 'СР',
    date: '21',
    rest: true,
  },

  {
    id: 4,
    day: 'ЧТ',
    date: '22',
    title: 'Ноги и ягодицы',
    duration: 50,
    type: 'legs',
    completed: false,
    exercises: [
      {
        id: 1,
        name: 'Приседания со штангой',
        sets: '4 × 8–10',
        completed: false,
      },
      {
        id: 2,
        name: 'Румынская тяга',
        sets: '4 × 8–12',
        completed: false,
      },
      {
        id: 3,
        name: 'Жим ногами',
        sets: '3 × 10–12',
        completed: false,
      },
      {
        id: 4,
        name: 'Выпады',
        sets: '3 × 10',
        completed: false,
      },
      {
        id: 5,
        name: 'Подъёмы на носки',
        sets: '4 × 15',
        completed: false,
      },
    ],
  },

  {
    id: 5,
    day: 'ПТ',
    date: '23',
    title: 'Функциональная тренировка',
    duration: 20,
    type: 'functional',
    completed: false,
    exercises: [
      {
        id: 1,
        name: 'Берпи',
        sets: '3 × 10',
        completed: false,
      },
      {
        id: 2,
        name: 'Планка',
        sets: '3 × 45 сек',
        completed: false,
      },
      {
        id: 3,
        name: 'Mountain Climbers',
        sets: '3 × 30 сек',
        completed: false,
      },
    ],
  },

  {
    id: 6,
    day: 'СБ',
    date: '24',
    rest: true,
  },

  {
    id: 7,
    day: 'ВС',
    date: '25',
    rest: true,
  },
]