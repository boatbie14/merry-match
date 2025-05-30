// // pages/api/create-portal-session.js
// import stripe from '../../lib/stripe'; // นำเข้า Stripe instance
// import { getSession } from 'next-auth/react'; // ถ้าคุณใช้ NextAuth.js
// // หรือนำเข้าฟังก์ชัน/โมดูลที่คุณใช้ในการดึง user ID และ Stripe Customer ID จาก DB

export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   // --- 1. ตรวจสอบสิทธิ์ผู้ใช้และดึงข้อมูลผู้ใช้ ---
//   // ตัวอย่าง (ถ้าใช้ NextAuth.js):
//   const session = await getSession({ req });
//   if (!session || !session.user) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   // สมมติว่า session.user.id คือ ID ผู้ใช้ในฐานข้อมูลของคุณ
//   const userId = session.user.id;

//   // --- 2. ดึง Stripe Customer ID ของผู้ใช้คนนี้จากฐานข้อมูลของคุณ ---
//   // **สำคัญ**: คุณต้องมีฟังก์ชันที่ไปดึง `stripeCustomerId`
//   // ที่คุณเก็บไว้ในฐานข้อมูลตอนที่ผู้ใช้สมัครหรือทำธุรกรรมครั้งแรก
//   let stripeCustomerId = await getStripeCustomerIdFromYourDb(userId);

//   // ถ้ายังไม่มี Stripe Customer ID สำหรับผู้ใช้คนนี้ (ไม่ควรเกิดขึ้นบ่อยถ้าจัดการดี)
//   // ให้สร้าง Customer ใหม่ใน Stripe และบันทึก ID ลงใน DB
//   if (!stripeCustomerId) {
//     try {
//       const customer = await stripe.customers.create({
//         email: session.user.email, // หรือข้อมูลอีเมลของผู้ใช้
//         name: session.user.name,   // หรือชื่อของผู้ใช้
//         metadata: {
//           your_app_user_id: userId,
//         },
//       });
//       stripeCustomerId = customer.id;
//       // **บันทึก stripeCustomerId นี้ลงในฐานข้อมูลของคุณสำหรับ userId นี้**
//       await saveStripeCustomerIdToYourDb(userId, stripeCustomerId);
//     } catch (error) {
//       console.error('Error creating Stripe Customer:', error);
//       return res.status(500).json({ message: 'Failed to create Stripe customer.' });
//     }
//   }

//   // --- 3. สร้าง Stripe Customer Portal Session ---
//   try {
//     const portalSession = await stripe.billing.portal.sessions.create({
//       customer: stripeCustomerId,
//       return_url: `${process.env.YOUR_APP_BASE_URL}/settings/payment?status=success`, // URL ที่จะกลับมาหลังจัดการเสร็จ
//     });

//     // --- 4. ส่ง URL ของ Portal กลับไปให้ Frontend ---
//     res.status(200).json({ portalUrl: portalSession.url });

//   } catch (error) {
//     console.error('Error creating Stripe Customer Portal session:', error);
//     res.status(500).json({ message: 'Failed to create portal session.' });
//   }
// }

// // --- ฟังก์ชันจำลองสำหรับการดึง/บันทึก Stripe Customer ID ---
// // คุณต้องแทนที่ด้วยการเชื่อมต่อกับฐานข้อมูลจริงของคุณ (เช่น Prisma, Mongoose, Knex, etc.)
// async function getStripeCustomerIdFromYourDb(userId) {
//   // ตัวอย่าง: ดึงจากฐานข้อมูล
//   // const user = await db.user.findUnique({ where: { id: userId } });
//   // return user?.stripeCustomerId;
//   return "cus_P3n9eFvFkZlO8Z"; // <-- REPLACE WITH REAL DB FETCH
// }

// async function saveStripeCustomerIdToYourDb(userId, stripeCustomerId) {
//   // ตัวอย่าง: บันทึกลงฐานข้อมูล
//   // await db.user.update({ where: { id: userId }, data: { stripeCustomerId } });
//   console.log(`Saved Stripe Customer ID ${stripeCustomerId} for user ${userId} to DB.`);
}