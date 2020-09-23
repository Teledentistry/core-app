const express = require("express");
const {
  getAppointments,
  createAppointment,
  cancelAppointment,
  updateAppointment,
} = require("../controllers/appointment");
const { protect } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResults");
const Appointment = require("../models/Appointment");

const router = express.Router();

router
  .route("/")
  .get(advancedResults(Appointment), getAppointments)
  .post(protect, createAppointment);

router
  .route("/:id")
  .put(protect, updateAppointment)
  .delete(protect, cancelAppointment);

module.exports = router;
