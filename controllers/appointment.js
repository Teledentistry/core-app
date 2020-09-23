const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

exports.getAppointments = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.createAppointment = asyncHandler(async (req, res, next) => {
  if (req.body.doctor !== req.user.id && req.body.patient !== req.user.id) {
    return next(
      new ErrorResponse(
        "The logged in user and the person creating the appointment are different",
        401
      )
    );
  }

  const appointment = await Appointment.create(req.body);

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

// route - API/appoinments/:id
exports.updateAppointment = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorResponse("Appointment not found", 404));
  }

  // Match the appointment's doctor/patient with logged in user

  console.log(appointment.doctor);
  console.log(req.user.id);
  console.log(String(req.user.id) === String(appointment.doctor));

  if (
    String(req.user.id) !== String(appointment.doctor) &&
    String(req.user.id) !== String(appointment.patient)
  ) {
    return next(
      new ErrorResponse(
        "The logged in user and the person updating the appointment are different",
        401
      )
    );
  }

  appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  appointment.save();

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

exports.cancelAppointment = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(new ErrorResponse("Appointment not found", 404));
  }

  // Match the appointment's doctor/patient with logged in user

  if (
    String(req.user.id) !== String(appointment.doctor) &&
    String(req.user.id) !== String(appointment.patient)
  ) {
    return next(
      new ErrorResponse(
        "The logged in user and the person updating the appointment are different",
        401
      )
    );
  }

  await appointment.remove();
  res.status(200).json({
    success: true,
    data: {},
  });
});
