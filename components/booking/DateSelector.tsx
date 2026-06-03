import { DayType } from '@/types/day';

type Props = {
  availableDays: DayType[];

  selectedDate: DayType | null;

  onSelect: (
    day: DayType
  ) => void;

  onBack: () => void;
};

export const DateSelector = ({
  availableDays,
  selectedDate,
  onSelect,
  onBack,
}: Props) => {
  return (
    <div>
      <button
        onClick={onBack}
        className="mb-6 text-sm text-yellow-400"
      >
        ← Volver
      </button>

      <div className="grid grid-cols-2 gap-4">
        {availableDays.map((day) => {
          const isSelected =
            selectedDate?.id ===
            day.id;

          return (
            <button
              key={day.id}
              onClick={() =>
                onSelect(day)
              }
              className={`
                rounded-3xl
                border
                p-5
                transition-all
                duration-300

                ${
                  isSelected
                    ? 'border-yellow-400 bg-yellow-500/10'
                    : 'border-yellow-500/10 bg-[#111]'
                }
              `}
            >
              <div className="text-lg font-bold">
                {day.day}
              </div>

              <div className="text-sm text-gray-400">
                {day.date}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};