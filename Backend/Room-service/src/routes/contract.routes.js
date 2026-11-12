import expesss from "express";
import { generateContractImage } from "../modules/contract.service.js";
const router = expesss.Router();
router.post("/", generateContractImage);
export default router;
