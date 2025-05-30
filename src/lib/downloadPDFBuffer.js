import axios from 'axios';

export async function downloadPDFBuffer(pdfUrl){
  const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
}