export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const formatChilleanPhone = (phone: string) => {
  if (!phone) return "";
  let number = phone.replace(/\D/g, "");
  return number.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, "(+$1) $2 $3-$4");
};

export const checkIfSomePropertyHasAValue = (obj: any) => {
  return Object.values(obj).some((value) => value);
};
