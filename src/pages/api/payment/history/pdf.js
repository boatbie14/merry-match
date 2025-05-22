export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    
    const pdfBuffer = await generatePDF(data);

    // ส่งกลับเป็นไฟล์ PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="billing.pdf"');
    res.send(pdfBuffer);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}