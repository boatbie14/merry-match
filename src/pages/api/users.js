import { createClient } from "@supabase/supabase-js";

// ตั้งค่า Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const {
      page = 1,
      limit = 5, // เปลี่ยนเป็น 5 ตามที่ต้องการ
      currentUserId = "bfd42907-62fa-44c9-bf18-38ac7478ac35", // Default เป็น ID ของ techguy
      sexual_preference, // รับค่า sexual_preference จาก client
      age_range, // รับค่าช่วงอายุจาก client เช่น "18-80"
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // 1. ดึงข้อมูลของ current user เพื่อใช้ในการกรอง
    const { data: currentUser, error: currentUserError } = await supabase
      .from("users")
      .select("sexual_identity, sexual_preference")
      .eq("id", currentUserId)
      .single();

    if (currentUserError) {
      return res.status(500).json({ error: "Error fetching current user preferences" });
    }

    // ใช้ค่า sexual_preference จาก client ถ้ามี หรือใช้ค่าของ current user เป็น fallback
    let filterSexualPreference = sexual_preference || currentUser.sexual_preference;

    // 2. สร้างเงื่อนไขการกรองตาม sexual preference
    let query = supabase
      .from("users")
      .select(
        "id, name, username, location, city, sexual_identity, sexual_preference, bio, date_of_birth, profile_image_url, image2_url, image3_url, image4_url, image5_url, last_active_at, created_at",
        { count: "exact" }
      )
      .neq("id", currentUserId)
      .eq("status", "active");

    // รองรับการเลือกหลายตัวเลือก โดยแยกด้วย comma
    if (filterSexualPreference) {
      // แยก preferences ถ้ามีการส่งมาหลายค่า (เช่น "men,non-binary")
      const preferences = filterSexualPreference.split(",").map((pref) => pref.trim());

      if (preferences.length > 0) {
        // สร้าง array สำหรับเก็บเงื่อนไข sexual_identity ที่ต้องการ
        const identities = [];

        // กำหนดค่า sexual_identity ตามเงื่อนไข
        preferences.forEach((pref) => {
          if (pref === "women") {
            identities.push("female");
          } else if (pref === "men") {
            identities.push("male");
          } else if (pref === "non-binary") {
            identities.push("non-binary");
          } else if (pref === "everyone") {
            // ถ้าเลือก everyone ให้แสดงทุกเพศ ไม่ต้องกรอง
            identities.push("female", "male", "non-binary");
          }
        });

        // ถ้ามีเงื่อนไขให้กรอง
        if (identities.length > 0) {
          // ตัด duplicate
          const uniqueIdentities = [...new Set(identities)];
          // กำหนดเงื่อนไขการกรอง
          query = query.in("sexual_identity", uniqueIdentities);
        }
      } else {
        // กรณีมี preference เดียว (รูปแบบเดิม)
        if (filterSexualPreference === "women") {
          // ถ้าชอบผู้หญิง แสดงเฉพาะ female
          query = query.eq("sexual_identity", "female");
        } else if (filterSexualPreference === "men") {
          // ถ้าชอบผู้ชาย แสดงเฉพาะ male
          query = query.eq("sexual_identity", "male");
        } else if (filterSexualPreference === "non-binary") {
          // ถ้าเลือกเฉพาะ non-binary
          query = query.eq("sexual_identity", "non-binary");
        }
        // ถ้าเป็น everyone ไม่ต้องกรองเพิ่ม
      }
    }

    // 3. กรองตามช่วงอายุ (ถ้ามีการระบุ)
    if (age_range) {
      const [minAge, maxAge] = age_range.split("-").map((age) => parseInt(age));

      if (!isNaN(minAge) && !isNaN(maxAge)) {
        // คำนวณวันเกิดสูงสุดและต่ำสุดที่ตรงกับช่วงอายุที่ต้องการ
        const now = new Date();

        // ผู้ใช้อายุต่ำสุด (เกิดล่าสุด) = ปีปัจจุบัน - อายุต่ำสุด
        const maxBirthYear = now.getFullYear() - minAge;
        const maxBirthDate = new Date(maxBirthYear, now.getMonth(), now.getDate());

        // ผู้ใช้อายุสูงสุด (เกิดนานสุด) = ปีปัจจุบัน - อายุสูงสุด
        const minBirthYear = now.getFullYear() - maxAge;
        const minBirthDate = new Date(minBirthYear, now.getMonth(), now.getDate());

        // กรองตามช่วงวันเกิด
        query = query
          .lte("date_of_birth", maxBirthDate.toISOString().split("T")[0]) // วันเกิดไม่เกินวันที่ทำให้อายุต่ำสุดตามที่กำหนด
          .gte("date_of_birth", minBirthDate.toISOString().split("T")[0]); // วันเกิดไม่น้อยกว่าวันที่ทำให้อายุสูงสุดตามที่กำหนด
      }
    }

    // 4. ดึงข้อมูลผู้ใช้ตามเงื่อนไข
    const {
      data: users,
      error: usersError,
      count,
    } = await query
      .order("last_active_at", { ascending: false }) // เรียงตาม last_active_at ล่าสุดก่อน
      .range(offset, offset + limitNum - 1);

    if (usersError) {
      return res.status(500).json({ error: "Error fetching users" });
    }

    // ถ้าไม่มีผู้ใช้ ส่งข้อมูลว่างกลับไป
    if (!users.length) {
      return res.status(200).json({
        users: [],
        meta: { totalCount: 0, page: pageNum, limit: limitNum, totalPages: 0 },
      });
    }

    // 5. ตรวจสอบสถานะ Match
    const { data: myMerries, error: myMerriesError } = await supabase
      .from("merry_list")
      .select("to_user_id")
      .eq("from_user_id", currentUserId);

    const { data: theirMerries, error: theirMerriesError } = await supabase
      .from("merry_list")
      .select("from_user_id")
      .eq("to_user_id", currentUserId);

    const myMerrySet = new Set(myMerries?.map((m) => m.to_user_id) || []);
    const theirMerrySet = new Set(theirMerries?.map((m) => m.from_user_id) || []);

    // 6. เตรียมข้อมูลผู้ใช้พร้อมสถานะ Match
    let enrichedUsers = users.map((user) => {
      const isMatch = myMerrySet.has(user.id) && theirMerrySet.has(user.id);
      return { ...user, isMatch };
    });

    // 7. จัดลำดับการแสดงผลตามความชอบของผู้ใช้
    enrichedUsers = sortUsersByPreference(enrichedUsers, currentUser, filterSexualPreference);

    // 8. ส่งข้อมูลกลับไปยัง client
    return res.status(200).json({
      users: enrichedUsers,
      meta: {
        totalCount: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// ฟังก์ชันสำหรับจัดลำดับการแสดงผลตามความชอบของผู้ใช้ (ปรับให้รองรับการกรองจาก client)
function sortUsersByPreference(users, currentUser, filterPreference) {
  // ถ้าไม่มีผู้ใช้ หรือ มีแค่คนเดียว ไม่ต้องเรียงลำดับใหม่
  if (!users || users.length <= 1) return users;

  const { sexual_identity } = currentUser;

  // รองรับกรณีที่มีหลาย preference
  const preferences = Array.isArray(filterPreference)
    ? filterPreference
    : typeof filterPreference === "string"
    ? filterPreference.split(",").map((p) => p.trim())
    : [filterPreference];

  // ถ้ามีหลาย preference ให้ใช้อันแรกเป็นหลัก (อันที่สำคัญที่สุด)
  const primaryPreference = preferences[0] || currentUser.sexual_preference;

  return users.sort((a, b) => {
    // กรณีชอบผู้หญิง (women)
    if (primaryPreference === "women") {
      // เรียงลำดับ female ได้เลย (เพราะเรากรองมาเฉพาะ female แล้ว)
      // แต่ถ้ายังมี non-binary ให้เรียง female ก่อน non-binary
      if (preferences.includes("non-binary")) {
        if (a.sexual_identity === "female" && b.sexual_identity === "non-binary") return -1;
        if (a.sexual_identity === "non-binary" && b.sexual_identity === "female") return 1;
      }
    }

    // กรณีชอบผู้ชาย (men)
    else if (primaryPreference === "men") {
      // เรียงลำดับ male ได้เลย (เพราะเรากรองมาเฉพาะ male แล้ว)
      // แต่ถ้ายังมี non-binary ให้เรียง male ก่อน non-binary
      if (preferences.includes("non-binary")) {
        if (a.sexual_identity === "male" && b.sexual_identity === "non-binary") return -1;
        if (a.sexual_identity === "non-binary" && b.sexual_identity === "male") return 1;
      }
    }

    // กรณีชอบทุกคน (everyone)
    else if (primaryPreference === "everyone") {
      // ถ้าเป็นผู้หญิง ให้แสดง non-binary > female > male
      if (sexual_identity === "female") {
        if (a.sexual_identity === "non-binary" && b.sexual_identity !== "non-binary") return -1;
        if (a.sexual_identity !== "non-binary" && b.sexual_identity === "non-binary") return 1;
        if (a.sexual_identity === "female" && b.sexual_identity === "male") return -1;
        if (a.sexual_identity === "male" && b.sexual_identity === "female") return 1;
      }

      // ถ้าเป็นผู้ชาย ให้แสดง non-binary > male > female
      else if (sexual_identity === "male") {
        if (a.sexual_identity === "non-binary" && b.sexual_identity !== "non-binary") return -1;
        if (a.sexual_identity !== "non-binary" && b.sexual_identity === "non-binary") return 1;
        if (a.sexual_identity === "male" && b.sexual_identity === "female") return -1;
        if (a.sexual_identity === "female" && b.sexual_identity === "male") return 1;
      }

      // ถ้าเป็น non-binary ให้แสดง non-binary ก่อน แล้วค่อยเป็นเพศอื่นๆ
      else if (sexual_identity === "non-binary") {
        if (a.sexual_identity === "non-binary" && b.sexual_identity !== "non-binary") return -1;
        if (a.sexual_identity !== "non-binary" && b.sexual_identity === "non-binary") return 1;
      }
    }

    // กรณีเลือกเฉพาะ non-binary
    else if (primaryPreference === "non-binary") {
      // ทุกเคสเป็น non-binary อยู่แล้ว จึงไม่ต้องกรองเพิ่ม
    }

    // ถ้า sexual identity เหมือนกัน หรือไม่มีการกำหนดลำดับพิเศษ ให้เรียงตาม last_active_at
    return new Date(b.last_active_at || b.created_at) - new Date(a.last_active_at || a.created_at);
  });
}
