import express from 'express';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import Guest from '../models/Guest.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      { header: 'Aadhar', key: 'aadharImage', width: 20 },
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

      if (guest.aadharImage) {
        const imagePath = path.join(__dirname, '../', guest.aadharImage);
        if (fs.existsSync(imagePath)) {
          const imageId = workbook.addImage({
            filename: imagePath,
            extension: path.extname(imagePath).slice(1),
          });

          sheet.addImage(imageId, {
            tl: { col: 8, row: row.number - 1 },
            ext: { width: 100, height: 100 },
          });
        }
      }
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=guest-records.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Excel export error:', err);
    res.status(500).json({ message: 'Failed to export Excel' });
  }
});

export default router;
