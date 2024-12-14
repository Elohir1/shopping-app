import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: 'default' | 'destructive';
  onRetry?: () => void;
}

const ErrorMessage = ({ 
  title = 'Nastala chyba', 
  message, 
  variant = 'destructive',
  onRetry 
}: ErrorMessageProps) => {
  return (
    <div className={`p-4 my-4 rounded-lg border ${
      variant === 'destructive' ? 'bg-red-50 border-red-300 text-red-900' : 'bg-gray-50 border-gray-300 text-gray-900'
    }`}>
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="mt-2">
        <p className="text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium underline hover:text-blue-600"
          >
            Zkusit znovu
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;