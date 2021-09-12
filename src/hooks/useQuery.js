import { useLocation } from "react-router-dom";

function paramsToObject(entries) {
  const result = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

export default function useQuery() {
  let params = paramsToObject(
    new URLSearchParams(useLocation().search).entries()
  );

  return params;
}
