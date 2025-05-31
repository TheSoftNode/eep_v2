import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

// Define alert types
type AlertType = 'warning' | 'error' | 'info' | 'success';

// Define style configuration for each alert type
interface AlertStyleConfig {
  bg: string;
  border: string;
  text: string;
  darkBg: string;
  darkBorder: string;
  darkText: string;
  icon: React.FC<{ className?: string }>;
}

// Define props for the Alert component
interface AlertProps {
  type?: AlertType;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

// Alert types with their corresponding colors
const ALERT_TYPES: Record<AlertType, AlertStyleConfig> = {
  warning: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
    darkBg: "dark:bg-yellow-900/30",
    darkBorder: "dark:border-yellow-800",
    darkText: "dark:text-yellow-400",
    icon: AlertTriangle
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    darkBg: "dark:bg-red-900/30",
    darkBorder: "dark:border-red-800",
    darkText: "dark:text-red-400",
    icon: AlertCircle
  },
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    darkBg: "dark:bg-blue-900/30",
    darkBorder: "dark:border-blue-800",
    darkText: "dark:text-blue-400",
    icon: Info
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    darkBg: "dark:bg-green-900/30",
    darkBorder: "dark:border-green-800",
    darkText: "dark:text-green-400",
    icon: CheckCircle
  }
};

const StandardAlert: React.FC<AlertProps> = ({ 
  type = "warning", 
  title, 
  children, 
  dismissible = false,
  onDismiss,
  className = ""
}) => {
  // Get the correct styling for the specified type
  const alertStyle = ALERT_TYPES[type] || ALERT_TYPES.warning;
  const IconComponent = alertStyle.icon;
  
  return (
    <div className={`mb-4 p-4 flex items-start rounded-md border ${alertStyle.bg} ${alertStyle.text} ${alertStyle.border} ${alertStyle.darkBg} ${alertStyle.darkBorder} ${alertStyle.darkText} ${className}`}>
      <IconComponent className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
      
      <div className="flex-1">
        {title && <h4 className="font-medium mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      
      {dismissible && (
        <button 
          onClick={onDismiss} 
          className={`ml-3 p-1 rounded-md hover:${alertStyle.bg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:${alertStyle.border}`}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default StandardAlert;

// Example usage component
// const AlertExamples: React.FC = () => {
//   return (
//     <div className="space-y-4">
//       <StandardAlert type="warning">
//         Please note: The appearance settings feature is currently under development. Changes made here will not be saved until the feature is fully implemented.
//       </StandardAlert>
      
//       <StandardAlert type="error" title="Connection Error">
//         Unable to connect to the server. Please check your internet connection and try again.
//       </StandardAlert>
      
//       <StandardAlert type="info">
//         Your session will expire in 5 minutes. Please save your work.
//       </StandardAlert>
      
//       <StandardAlert type="success">
//         Your changes have been successfully saved.
//       </StandardAlert>
      
//       <StandardAlert type="warning" dismissible onDismiss={() => console.log('dismissed')}>
//         This is a dismissible StandardAlert with a close button.
//       </StandardAlert>
//     </div>
//   );
// };

// export default StandardExamples;
// You can also export the StandardAlert component separately