import { createClient } from "@supabase/supabase-js";

// ตั้งค่า Supabase client
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { page = 1, limit = 10, currentUserId, sexual_preference, age_range } = req.query;

    if (!currentUserId) {
      return res.status(400).json({ error: "currentUserId is required" });
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // 1. ดึงข้อมูลของผู้ใช้ปัจจุบัน
    const { data: currentUser, error: currentUserError } = await supabase
      .from("users")
      .select("sexual_identity, sexual_preference")
      .eq("id", currentUserId)
      .single();

    if (currentUserError) {
      console.error("Error fetching current user:", currentUserError);
      return res.status(500).json({ error: "Error fetching current user preferences" });
    }

    // 2. ดึง merry_list ที่ผู้ใช้ปัจจุบันได้ swipe ไปแล้ว
    const { data: merriedUsers, error: merriedUsersError } = await supabase
      .from("merry_list")
      .select("to_user_id")
      .eq("from_user_id", currentUserId);

    if (merriedUsersError) {
      console.error("Error fetching merried users:", merriedUsersError);
      return res.status(500).json({ error: "Error fetching merried users" });
    }

    // 3. ดึง merry_list ที่คนอื่นได้ swipe เรามา
    const { data: theirMerries, error: theirMerriesError } = await supabase
      .from("merry_list")
      .select("from_user_id")
      .eq("to_user_id", currentUserId);

    if (theirMerriesError) {
      console.error("Error fetching their merries:", theirMerriesError);
      return res.status(500).json({ error: "Error fetching their merries" });
    }

    // 4. สร้าง Set สำหรับการเช็ค
    const ourSwipedSet = new Set(merriedUsers?.map((m) => m.to_user_id) || []);
    const theirSwipedSet = new Set(theirMerries?.map((m) => m.from_user_id) || []);

    // 5. หา matched users (คนที่ swipe กัน 2 ทาง)
    const matchedUsers = [...ourSwipedSet].filter((userId) => theirSwipedSet.has(userId));

    // 6. รวบรวม IDs ของผู้ใช้ที่ไม่ควรแสดง
    // (ผู้ใช้ปัจจุบัน + คนที่เรา swipe ไปแล้ว + คนที่เป็น match แล้ว)
    const excludedUserIds = [currentUserId, ...ourSwipedSet, ...matchedUsers];

    // 7. กำหนด sexual preference ที่จะใช้กรอง
    let filterSexualPreference = sexual_preference || currentUser.sexual_preference;

    // 8. สร้างคำสั่ง SQL สำหรับ Supabase
    let query = supabase
      .from("users")
      .select(
        "id, name, username, location, city, sexual_identity, sexual_preference,racial_preference,meeting_interest, bio, date_of_birth, profile_image_url, image2_url, image3_url, image4_url, image5_url, last_active_at, created_at",
        { count: "exact" }
      );

    // เพิ่ม filter ทีละเงื่อนไข
    if (excludedUserIds.length === 1) {
      // ถ้ามีแค่ ID เดียว ใช้ neq
      query = query.neq("id", excludedUserIds[0]);
    } else if (excludedUserIds.length > 1) {
      // ถ้ามีหลาย IDs ใช้ not โดยใช้ filter function
      const uniqueExcludedIds = [...new Set(excludedUserIds)];
      query = query.filter("id", "not.in", `(${uniqueExcludedIds.join(",")})`);
    }

    // เพิ่ม filter สถานะ
    query = query.eq("status", "active");

    // 9. กรองตาม sexual preference
    let identitiesForLog = [];

    if (filterSexualPreference) {
      const preferences = filterSexualPreference.split(",").map((pref) => pref.trim());

      if (preferences.length > 0) {
        const identities = [];

        preferences.forEach((pref) => {
          if (pref === "women") {
            identities.push("female");
            identitiesForLog.push("female from women");
          } else if (pref === "men") {
            identities.push("male");
            identitiesForLog.push("male from men");
          } else if (pref === "non-binary") {
            identities.push("non-binary");
            identitiesForLog.push("non-binary");
          } else if (pref === "everyone") {
            identities.push("female", "male", "non-binary");
            identitiesForLog.push("all from everyone");
          }
        });

        if (identities.length > 0) {
          const uniqueIdentities = [...new Set(identities)];
          query = query.in("sexual_identity", uniqueIdentities);
        }
      } else {
        if (filterSexualPreference === "women") {
          query = query.eq("sexual_identity", "female");
        } else if (filterSexualPreference === "men") {
          query = query.eq("sexual_identity", "male");
        } else if (filterSexualPreference === "non-binary") {
          query = query.eq("sexual_identity", "non-binary");
        }
      }
    }

    // 10. กรองตามช่วงอายุ
    if (age_range) {
      const [minAge, maxAge] = age_range.split("-").map((age) => parseInt(age));

      if (!isNaN(minAge) && !isNaN(maxAge)) {
        const now = new Date();
        const maxBirthYear = now.getFullYear() - minAge;
        const maxBirthDate = new Date(maxBirthYear, now.getMonth(), now.getDate());
        const minBirthYear = now.getFullYear() - maxAge;
        const minBirthDate = new Date(minBirthYear, now.getMonth(), now.getDate());

        query = query
          .lte("date_of_birth", maxBirthDate.toISOString().split("T")[0])
          .gte("date_of_birth", minBirthDate.toISOString().split("T")[0]);
      }
    }

    // 11. ดึงข้อมูลผู้ใช้ตามเงื่อนไข
    const {
      data: users,
      error: usersError,
      count,
    } = await query.order("last_active_at", { ascending: false }).range(offset, offset + limitNum - 1);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return res.status(500).json({ error: "Error fetching users" });
    }

    // 12. หากไม่มีผู้ใช้ที่ตรงเงื่อนไข
    if (!users || users.length === 0) {
      return res.status(200).json({
        users: [],
        meta: {
          totalCount: 0,
          page: pageNum,
          limit: limitNum,
          totalPages: 0,
          userSexualPreference: currentUser.sexual_preference || null,
          matchedCount: matchedUsers.length,
        },
      });
    }

    // 13. เพิ่มข้อมูล isMatch (ซึ่งควรจะเป็น false ทั้งหมดเพราะ match แล้วถูก exclude ไปแล้ว)
    const enrichedUsers = users.map((user) => {
      // เช็คว่าเป็น match หรือไม่ (ควรจะเป็น false ทั้งหมด)
      const isMatch = ourSwipedSet.has(user.id) && theirSwipedSet.has(user.id);
      return { ...user, isMatch };
    });

    // 14. จัดลำดับตามความชอบของผู้ใช้
    const sortedUsers = sortUsersByPreference(enrichedUsers, currentUser, filterSexualPreference);

    // 15. ส่งข้อมูลกลับ
    return res.status(200).json({
      users: sortedUsers,
      meta: {
        totalCount: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
        userSexualPreference: currentUser.sexual_preference || null,
        matchedCount: matchedUsers.length,
      },
    });
  } catch (error) {
    console.error("Unexpected error details:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// ฟังก์ชันจัดเรียงผู้ใช้ตามความชอบ
function sortUsersByPreference(users, currentUser, filterPreference) {
  if (!users || users.length <= 1) return users;

  const { sexual_identity } = currentUser;

  const preferences = Array.isArray(filterPreference)
    ? filterPreference
    : typeof filterPreference === "string"
    ? filterPreference.split(",").map((p) => p.trim())
    : [filterPreference];

  const primaryPreference = preferences[0] || currentUser.sexual_preference;

  return users.sort((a, b) => {
    // กรณีชอบผู้หญิง (women)
    if (primaryPreference === "women") {
      if (preferences.includes("non-binary")) {
        if (a.sexual_identity === "female" && b.sexual_identity === "non-binary") return -1;
        if (a.sexual_identity === "non-binary" && b.sexual_identity === "female") return 1;
      }
    }
    // กรณีชอบผู้ชาย (men)
    else if (primaryPreference === "men") {
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

    // ถ้า sexual identity เหมือนกัน หรือไม่มีการกำหนดลำดับพิเศษ ให้เรียงตาม last_active_at
    return new Date(b.last_active_at || b.created_at) - new Date(a.last_active_at || a.created_at);
  });
}
