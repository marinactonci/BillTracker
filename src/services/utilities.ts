import axios from "axios";

export async function getUserCountry() {
  try {
    const response = await axios.get("https://ipapi.co/json/");
    return response.data.country_name;
  } catch (error) {
    console.error(error);
  }
}
