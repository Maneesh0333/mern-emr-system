import { asyncHandler } from "../middleware/async.middleware";
import DoctorAvailability from "../models/DoctorAvailability.model";

export const saveAvailability = asyncHandler(async (req, res) => {

  const { unavailableDates } = req.body;
  const doctorId = req.user.id;

  let availability = await DoctorAvailability.findOne({
    doctor: doctorId
  });

  if (!availability) {
    availability = await DoctorAvailability.create({
      doctor: doctorId,
      unavailableDates
    });
  } else {
    availability.unavailableDates = unavailableDates;
    await availability.save();
  }

  res.status(200).json({
    success: true,
    message: "Availability updated",
  });
});


export const getAvailability = asyncHandler(async (req, res) => {
  const doctorId = req.user.id;
  const availability = await DoctorAvailability.findOne({
    doctor: doctorId
  });

  res.status(200).json({
    success: true,
    data: availability?.unavailableDates || []
  });
});


export const getDoctorSlots = asyncHandler(async (req,res)=>{

 const {doctorId,date} = req.query;

 const allSlots = generateSlots("09:00","17:00",30);

 const booked = await Appointment.find({
  doctor:doctorId,
  date,
  status:"Booked"
 }).select("time");

 const bookedTimes = booked.map(b=>b.time);

 const slots = allSlots.map(slot=>({
  time:slot,
  status: bookedTimes.includes(slot) ? "Booked" : "Available"
 }));

 res.json({
  success:true,
  slots
 });

});

export const bookAppointment = asyncHandler(async(req,res)=>{

 const {doctorId,date,time,patientName,department} = req.body;

 const exists = await Appointment.findOne({
  doctor:doctorId,
  date,
  time,
  status:"Booked"
 });

 if(exists){
  throw new AppError("Slot already booked",400);
 }

 await Appointment.create({
  doctor:doctorId,
  patientName,
  department,
  date,
  time
 });

 res.json({
  success:true,
  message:"Appointment booked"
 });

});

export const getDoctorAppointments = asyncHandler(async(req,res)=>{

 const appointments = await Appointment.find({
  doctor:req.user.id
 }).sort({date:1,time:1});

 res.json({
  success:true,
  data:appointments
 });

});