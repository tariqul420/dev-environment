import dbConnect from "@/lib/db-connect"; // MongoDB কানেক্ট করার ফাংশন
import PaymentHistoryModel from "@/models/payment.model"; // MongoDB মডেল

// Get Payments API Endpoint
export const getPayments = async ({ page = 1, limit = 20 } = {}) => {
  try {
    await dbConnect(); // MongoDB কানেক্ট

    // Payments ডাটা MongoDB থেকে ফেচ করা হচ্ছে
    const payments = await PaymentHistoryModel.find({})
      .skip((page - 1) * limit)  // পেজিনেশন লজিক
      .limit(limit);  // প্রতি পেইজে কত ডাটা আসবে

    console.log("Fetched Payments:", payments); // লগ করতে পারেন ডাটা চেক করতে

    return payments;
  } catch (error) {
    console.error("Error fetching payments:", error); // যদি কোনো সমস্যা হয়, কনসোলে দেখাবে
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { page, limit } = req.query; // পেইজ এবং লিমিট ক্লায়েন্ট থেকে আনা হচ্ছে
    
    try {
      const data = await getPayments({ page: Number(page), limit: Number(limit) });
      return res.status(200).json(data); // রেসপন্স পাঠানো হচ্ছে ক্লায়েন্টে
    } catch (error) {
      return res.status(500).json({ message: "Error fetching payments", error });
    }
  }
}
