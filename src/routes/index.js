import express from "express";
import auth from "../middlewares/auth.js";
import controller from "../controllers/index.js";

export default async(expressApp) => {
    const router = expressApp.Router();
    router.all("/view");
    router.all("/add");
    router.all("/calc");
    router.all("/pdf");
    router.all("/edit");
    router.all("/cµontact");
    router.all("/invoice");
    router.all("/stock");
    router.all("/chart");
    router.all("/upload");
    router.all("/search");
    router.all("/vat");
    router.all("/settings");
}