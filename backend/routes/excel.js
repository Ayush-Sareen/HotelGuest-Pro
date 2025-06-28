import express from 'express';
import ExcelJS from 'exceljs';
import fetch from 'node-fetch'; // ✅ ADD THIS
import Guest from '../models/Guest.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/download-excel', authMiddleware, async (req, res) => {
  try {
    const guests = await Guest.find({ userId: req.user._id });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Guests');

    sheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Guests', key: 'numberOfGuests', width: 10 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'City', key: 'city', width: 15 },
      { header: 'State', key: 'state', width: 15 },
      { header: 'Price', key: 'price', width: 10 },
      { header: 'Check-In', key: 'checkIn', width: 15 },
      { header: 'Check-Out', key: 'checkOut', width: 15 },
      { header: 'Aadhar Image', key: 'aadharImage', width: 30 },
    ];

    for (const guest of guests) {
      const row = sheet.addRow({
        name: guest.name,
        numberOfGuests: guest.numberOfGuests,
        phone: guest.phone,
        city: guest.city,
        state: guest.state,
        price: guest.price,
        checkIn: guest.checkIn?.toLocaleDateString() || '',
        checkOut: guest.checkOut?.toLocaleDateString() || '',
      });

      // ✅ Handle image fetch and insertion
      if (guest.aadharImage?.startsWith('http')) {
        try {
          const response = await fetch(guest.aadharImage);
          const buffer = await response.buffer(); // ✅ Directly get buffer

          const imageId = workbook.addImage({
            buffer,
            extension: 'png', // or 'jpg' based on Cloudinary file
          });

          sheet.addImage(imageId, {
            tl: { col: 8, row: row.number - 1 },
            ext: { width: 100, height: 100 },
          });

          sheet.getRow(row.number).height = 80;
        } catch (error) {
          console.error("❌ Failed to fetch image from Cloudinary:", error);
          sheet.getCell(`I${row.number}`).value = guest.aadharImage;
        }
      } else {
        // fallback if image is not a valid URL
        sheet.getCell(`I${row.number}`).value = guest.aadharImage;
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
