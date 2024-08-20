// api.js
export const getPatientData = async () => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/Appointments/api/data`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
};
