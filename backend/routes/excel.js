import express from 'express';
import ExcelJS from 'exceljs';
import fetch from 'node-fetch';
import Guest from '../models/Guest.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/download-excel', authMiddleware, async (req, res) => {
  try {
    const guests = await Guest.find({ userId: req.user._id });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Guests');

    sheet.columns = [
      { header: 'S.No', key: 'sno', width: 8 },
      { header: 'Arrival Date', key: 'arrivalDate', width: 15 },
      { header: 'Arrival Time', key: 'arrivalTime', width: 15 },
      { header: 'Room No', key: 'roomNumber', width: 10 },
      { header: 'Name', key: 'name', width: 20 },
      { header: "Father's Name", key: 'fatherName', width: 20 },
      { header: 'Age', key: 'age', width: 8 },
      { header: 'Accompanying Names', key: 'accompanyingNames', width: 25 },
      { header: 'Accompanying Relations', key: 'accompanyingRelations', width: 25 },
      { header: 'Nationality', key: 'nationality', width: 15 },
      { header: 'Purpose of Visit', key: 'purposeOfVisit', width: 20 },
      { header: 'Occupation', key: 'occupation', width: 15 },
      { header: 'Coming From', key: 'comingFrom', width: 20 },
      { header: 'Going To', key: 'goingTo', width: 20 },
      { header: 'Full Address', key: 'fullAddress', width: 30 },
      { header: 'Male', key: 'male', width: 8 },
      { header: 'Female', key: 'female', width: 8 },
      { header: 'Boys', key: 'boys', width: 8 },
      { header: 'Girls', key: 'girls', width: 8 },
      { header: 'Departure Date', key: 'departureDate', width: 15 },
      { header: 'Departure Time', key: 'departureTime', width: 15 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Vehicle No', key: 'vehicleNumber', width: 15 },
      { header: 'Aadhaar Image Links', key: 'aadharImages', width: 50 },
    ];

    for (const guest of guests) {
      const row = sheet.addRow({
        sno: guest.sno,
        arrivalDate: guest.arrivalDate,
        arrivalTime: guest.arrivalTime,
        roomNumber: guest.roomNumber,
        name: guest.name,
        fatherName: guest.fatherName,
        age: guest.age,
        accompanyingNames: guest.accompanyingNames,
        accompanyingRelations: guest.accompanyingRelations,
        nationality: guest.nationality,
        purposeOfVisit: guest.purposeOfVisit,
        occupation: guest.occupation,
        comingFrom: guest.comingFrom,
        goingTo: guest.goingTo,
        fullAddress: guest.fullAddress,
        male: guest.numberOfPersons?.male || 0,
        female: guest.numberOfPersons?.female || 0,
        boys: guest.numberOfPersons?.boys || 0,
        girls: guest.numberOfPersons?.girls || 0,
        departureDate: guest.departureDate,
        departureTime: guest.departureTime,
        phone: guest.phone,
        vehicleNumber: guest.vehicleNumber,
        aadharImages: guest.aadharImages?.join(', ') || 'N/A',
      });

      // OPTIONAL: Embed the first Aadhaar image
      if (guest.aadharImages?.[0]) {
        try {
          const imageUrl = guest.aadharImages[0];
          const response = await fetch(imageUrl);
          const buffer = await response.buffer();
          const extension = imageUrl.includes('.png') ? 'png' : 'jpeg';

          const imageId = workbook.addImage({
            buffer,
            extension,
          });

          sheet.addImage(imageId, {
            tl: { col: 24, row: row.number - 1 },
            ext: { width: 100, height: 100 },
          });

          sheet.getRow(row.number).height = 80;
        } catch (error) {
          console.error(`❌ Error embedding image for ${guest.name}:`, error);
        }
      }
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=guest-records.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('❌ Excel export error:', err);
    res.status(500).json({ message: 'Failed to export Excel' });
  }
});

export default router;
