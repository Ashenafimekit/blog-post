import { getCookie } from "./get-cookies";

export const getUser = () => {
  const encoded = getCookie("user");
  const decoded = decodeURIComponent(encoded ?? "");
  const user = JSON.parse(decoded);
  return user;
};
