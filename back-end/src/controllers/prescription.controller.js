import Prescription from "../models/prescription.model.js";

export const createPrescription = async (
  req,
  res,
) => {

  const { id } = req.user;

  const {
    appointment,
    patientName,
    patientPhone,
    notes,
    medicines,
  } = req.body;


  // Add endDate automatically

  const updatedMedicines =
    medicines.map((medicine) => {

      const startDate =
        new Date(medicine.startDate);

      const endDate =
        new Date(startDate);

      endDate.setDate(
        endDate.getDate() +
          medicine.durationDays,
      );

      return {
        ...medicine,
        startDate,
        endDate,
      };
    });


  const prescription =
    await Prescription.create({
      appointment,

      doctor: id,

      patientName,

      patientPhone,

      notes,

      medicines: updatedMedicines,
    });


  res.json({
    success: true,

    message:
      "Prescription created",

    data: prescription,
  });
};


export const getAppointmentPrescription =
  async (req, res) => {

    const { appointmentId } =
      req.params;

    const prescription =
      await Prescription.findOne({
        appointment:
          appointmentId,
      });

    res.json({
      success: true,

      data: prescription,
    });
  };