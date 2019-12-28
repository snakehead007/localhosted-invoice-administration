import express from "express";
import auth from "../middlewares/auth.js";
import {controlLogin} from "../controllers/login.js"

export const router = express.Router();

router.all("/login",controlLogin);
/*router.all("/view");
router.all("/add");
router.all("/calc");
router.all("/pdf");
router.all("/edit");
router.all("/contact");
router.all("/invoice");
router.all("/stock");
router.all("/chart");
router.all("/upload");
router.all("/search");
router.all("/vat");
router.all("/settings");*/
