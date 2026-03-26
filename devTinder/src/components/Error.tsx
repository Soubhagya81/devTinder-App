import { useEffect, useState } from "react";

interface ErrorProps {
    errorMessage: string;
}

export const Error: React.FC<ErrorProps> = ({ errorMessage }) => {
  const [errorMessageState, setErrorMessageState] = useState<string>("");
  console.log("Error component rendered with message:", errorMessage);

  useEffect(() => {
    if (!errorMessage) return;
    console.log("Error message updated:", errorMessage);
    setErrorMessageState(errorMessage);

    const timer = setTimeout(() => {
      setErrorMessageState("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  return <>
    {errorMessageState && (
      <div className="alert alert-error absolute top-4">
        {errorMessageState}
      </div>
    )}
  </>;
};
