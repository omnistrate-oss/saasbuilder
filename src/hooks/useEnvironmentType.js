import { useContext } from "react";

import { EnvironmentTypeContext } from "src/context/EnvironmentTypeProvider";

function useEnvironmentType() {
  const environmentType = useContext(EnvironmentTypeContext);

  return environmentType;
}

export default useEnvironmentType;
