import axios from "axios";

const PAYMENT_URL = "http://localhost:4000/bank-config";

export const upsertBankConfig = async (data) => {
  const res = await axios.post(`${PAYMENT_URL}/upsert`, data);
  return res.data;
};

export const getBankConfig = async (landlordId) => {
  const res = await axios.get(`${PAYMENT_URL}/${landlordId}`);
  return res.data;
};
