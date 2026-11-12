import axios from "axios";
import { cloneElement } from "react";
const BASE_URL = "http://localhost:3000"; // URL của Landlord-service backend
export const registerLandLord = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/landlords/register`, data);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: "Server error" };
  }
};
export const getLandLordById = async(Id) =>
{
  try{
    const res = await axios.get(`${BASE_URL}/landlord/search/${id}`);
    console.log("Dữ liệu chủ trọ: ",res.data);
    return res.data;
  }
  catch(error){
    console.error("loi:",error)
    throw error;
  }
}