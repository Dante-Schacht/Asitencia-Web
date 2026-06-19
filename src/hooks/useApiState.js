import { useState } from 'react';

const formatErrorDetails = (details) => {
  if (!details) {
    return '';
  }

  if (typeof details === 'string') {
    return details;
  }

  if (details?.response) {
    const status = details.response.status;
    const data = details.response.data;
    return JSON.stringify({ status, data }, null, 2);
  }

  try {
    return JSON.stringify(details, null, 2);
  } catch {
    return String(details);
  }
};

const useApiState = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [success, setSuccess] = useState('');

  const clearMessages = () => {
    setError('');
    setErrorDetails('');
    setSuccess('');
  };

  const showError = (message, details = null) => {
    const formattedDetails = formatErrorDetails(details);

    console.groupCollapsed('[API ERROR] ' + message);
    if (formattedDetails) {
      console.log(formattedDetails);
    }
    console.groupEnd();

    setError(message);
    setErrorDetails(formattedDetails);
    setSuccess('');
  };

  const showSuccess = (message) => {
    setSuccess(message);
    setError('');
    setErrorDetails('');
  };

  return {
    loading,
    setLoading,
    submitting,
    setSubmitting,
    error,
    errorDetails,
    success,
    setError,
    setErrorDetails,
    setSuccess,
    clearMessages,
    showError,
    showSuccess,
  };
};

export default useApiState;
