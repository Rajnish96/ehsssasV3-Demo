export const number = (e, sliceValue) => {
  return (e.target.value = e.target.value.slice(0, sliceValue));
};
