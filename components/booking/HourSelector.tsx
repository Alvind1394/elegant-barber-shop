type Props = {
  availableHours: string[];

  selectedHour: string | null;

  onSelect: (
    hour: string
  ) => void;

  onBack: () => void;
};

export const HourSelector = ({
  availableHours,
  selectedHour,
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
        {availableHours.map(
          (hour) => {
            const isSelected =
              selectedHour ===
              hour;

            return (
              <button
                key={hour}
                onClick={() =>
                  onSelect(hour)
                }
                className={`
                  rounded-3xl
                  border
                  p-5
                  font-bold
                  transition-all
                  duration-300

                  ${
                    isSelected
                      ? 'border-yellow-400 bg-yellow-500/10'
                      : 'border-yellow-500/10 bg-[#111]'
                  }
                `}
              >
                {hour}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
};