import {
  AlertCircle,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  CornerUpLeft,
  Slash,
} from 'lucide-react';

export const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: {
      icon: AlertCircle,
      color: 'bg-yellow-100 text-yellow-800',
    },
    Processing: {
      icon: Package,
      color: 'bg-blue-100 text-blue-800',
    },
    Shipped: {
      icon: Truck,
      color: 'bg-purple-100 text-purple-800',
    },
    Delivered: {
      icon: CheckCircle,
      color: 'bg-green-100 text-green-800',
    },
    Cancelled: {
      icon: XCircle,
      color: 'bg-gray-100 text-gray-800',
    },
    Returned: {
      icon: RotateCcw,
      color: 'bg-orange-100 text-orange-800',
    },
    'Return Requested': {
      icon: CornerUpLeft,
      color: 'bg-indigo-100 text-indigo-800',
    },
    'Return Rejected': {
      icon: Slash,
      color: 'bg-red-100 text-red-800',
    },
    Default: {
      icon: AlertCircle,
      color: 'bg-red-100 text-red-800',
    },
  };

  const { icon: Icon, color } = statusConfig[status] || statusConfig.Default;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      <Icon className='w-4 h-4' />
      <span>{status}</span>
    </div>
  );
};
