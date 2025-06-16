import type React from 'react';
import type { Status } from '../../utils/wordUtils';
import { statusLabels } from '../../utils/wordUtils';

interface StatusFilterProps {
  currentStatus: Status;
  onStatusChange: (status: Status) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  currentStatus,
  onStatusChange
}) => {
  return (
    <div className="flex gap-1 sm:gap-2">
      {(Object.keys(statusLabels) as Status[]).map((status) => (
        <button
          type="button"
          key={status}
          className={`flex-1 sm:flex-initial sm:px-3 py-2 rounded text-xs sm:text-sm font-medium whitespace-nowrap ${
            currentStatus === status
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => onStatusChange(status)}
        >
          {statusLabels[status]}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;
