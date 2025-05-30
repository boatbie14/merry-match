import { mergePDFs } from "@/lib/mergePDF";
import Stripe from 'stripe';
import { downloadPDFBuffer } from "@/lib/downloadPDFBuffer";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { invoiceIds } = req.body; // ✅ รับ array ของ invoice IDs ที่ user เลือก

      if (!Array.isArray(invoiceIds) || invoiceIds.length === 0) {
        return res.status(400).json({ message: 'ต้องระบุ invoiceId อย่างน้อย 1 ตัว' });
      }

      const pdfBuffers = [];

for (const invoiceId of invoiceIds) {
  const pdfBuffer = await downloadPDFBuffer(invoiceId);
        pdfBuffers.push(pdfBuffer);
      }

      if (pdfBuffers.length === 0) {
        return res.status(404).json({ message: 'ไม่พบใบแจ้งหนี้' });
      }

      // รวม PDF ทั้งหมด
      const mergedPdf = await mergePDFs(pdfBuffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="merged-invoices.pdf"');
      res.send(mergedPdf);
    } catch (error) {
      console.error('request PDF Error:', error);
      res.status(500).json({ message: 'request PDF Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}