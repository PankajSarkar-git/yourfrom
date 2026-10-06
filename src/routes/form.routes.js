import { Router } from "express";
import {
  createForm,
  getForms,
  getFormById,
  updateForm,
  deleteForm,
} from "../Controllers/forms/form.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/").post(createForm).get(getForms);

router
  .route("/:id")
  .get(getFormById)
  .put(updateForm)
  .delete(deleteForm);

export default router;