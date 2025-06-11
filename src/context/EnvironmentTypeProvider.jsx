import { createContext, useEffect, useState } from "react";

export const EnvironmentTypeContext = createContext(undefined);

export default function EnvironmentTypeProvider(props) {
  const { envType, children } = props;
  const [environmentType, setEnvironmentType] = useState(envType);

  useEffect(() => {
    setEnvironmentType(envType);
  }, [envType]);

  return <EnvironmentTypeContext.Provider value={environmentType}>{children}</EnvironmentTypeContext.Provider>;
}
