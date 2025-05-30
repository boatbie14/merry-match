import { requireUser } from "@/middleware/requireUser";
import { getPaymentsByUserId } from "@/utils/query/paymentHistoryByUserId";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
       const result = await requireUser(req, res);
      if (!result) return result;
      
      const {userId} = result
      const { limit } = req.query;
      const limitValue = parseInt(limit) || 10; 
      const payments = await getPaymentsByUserId(userId, limitValue);
      return res.status(200).json(payments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}