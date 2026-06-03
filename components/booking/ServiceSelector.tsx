import { ServiceType } from '@/types/service';

type Props = {
  services: ServiceType[];

  selectedService: ServiceType | null;

  onSelect: (
    service: ServiceType
  ) => void;
};

export const ServiceSelector = ({
  services,
  selectedService,
  onSelect,
}: Props) => {
  return (
    <div className="space-y-4">
      {services.map((service) => {
        const isSelected =
          selectedService?.name ===
          service.name;

        return (
          <button
            key={service.name}
            onClick={() =>
              onSelect(service)
            }
            className={`
              w-full
              rounded-3xl
              border
              p-5
              text-left
              transition-all
              duration-300

              ${
                isSelected
                  ? 'border-yellow-400 bg-yellow-500/10'
                  : 'border-yellow-500/10 bg-[#111]'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">
                {service.name}
              </h3>

              <span className="text-yellow-400 font-bold">
                {service.price}
              </span>
            </div>

            <p className="text-sm text-gray-400">
              Duración:{' '}
              {service.duration}
            </p>
          </button>
        );
      })}
    </div>
  );
};