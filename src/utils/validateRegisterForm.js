// 🔤 แปลงชื่อฟิลด์ให้แสดงผลอ่านง่าย
function formatFieldName(field) {
  return field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

// ✅ ใช้ตอน Submit จริง — ตรวจสอบฟิลด์ทั้งหมด
function validateRegisterForm(values, setError) {
  const errorFields = [];

  const requiredFields = [
    "name",
    "username",
    "email",
    "password",
    "confirmPassword",
    "date_of_birth",
    "location",
    "city",
    "sexual_identity",
    "sexual_preference",
    "racial_preference",
    "meeting_interest",
    "hobbies",
  ];

  for (const field of requiredFields) {
    const value = values[field];
    if (
      !value ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    ) {
      setError(field, {
        type: "manual",
        message: `${formatFieldName(field)} is required`,
      });
      errorFields.push(field);
    }
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (values.username && !usernameRegex.test(values.username)) {
    setError("username", {
      type: "manual",
      message:
        "Username must be 3–20 characters and contain only letters, numbers, or underscores",
    });
    errorFields.push("username");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (values.email && !emailRegex.test(values.email)) {
    setError("email", {
      type: "manual",
      message: "Invalid email format",
    });
    errorFields.push("email");
  }

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (values.password && !strongPasswordRegex.test(values.password)) {
    setError("password", {
      type: "manual",
      message:
        "Password must include uppercase, lowercase, and a number (at least 8 characters)",
    });
    errorFields.push("password");
  }

  if (values.password !== values.confirmPassword) {
    setError("confirmPassword", {
      type: "manual",
      message: "Passwords do not match",
    });
    errorFields.push("confirmPassword");
  }

  const dob = new Date(values.date_of_birth);
  const today = new Date();
  const age =
    today.getFullYear() -
    dob.getFullYear() -
    (today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
      ? 1
      : 0);
  if (age < 18 || age > 120) {
    setError("date_of_birth", {
      type: "manual",
      message: "You must be between 18 and 120 years old",
    });
    errorFields.push("date_of_birth");
  }

  if (values.name?.length > 100) {
    setError("name", {
      type: "manual",
      message: "Name must be under 100 characters",
    });
    errorFields.push("name");
  }

  if (values.city?.length > 100) {
    setError("city", {
      type: "manual",
      message: "City must be under 100 characters",
    });
    errorFields.push("city");
  }

  if (Array.isArray(values.hobbies)) {
    if (values.hobbies.length > 10) {
      setError("hobbies", {
        type: "manual",
        message: "You can select up to 10 hobbies",
      });
      errorFields.push("hobbies");
    }

    const hasDuplicate =
      new Set(values.hobbies.map((h) => h.trim())).size !==
      values.hobbies.length;
    if (hasDuplicate) {
      setError("hobbies", {
        type: "manual",
        message: "Duplicate hobbies are not allowed",
      });
      errorFields.push("hobbies");
    }

    const tooLong = values.hobbies.find((h) => h.length > 30);
    if (tooLong) {
      setError("hobbies", {
        type: "manual",
        message: "Each hobby must be under 30 characters",
      });
      errorFields.push("hobbies");
    }
  }

  const imageList = values.images || [];
  const filledImages = imageList.filter((img) => img?.src);
  const hasFirstImage = !!imageList[0]?.src;
  if (filledImages.length < 2 || !hasFirstImage) {
    setError("images", {
      type: "manual",
      message:
        "Please upload at least 2 photos, and the first one must be your profile picture",
    });
    errorFields.push("images");
  }

  return errorFields;
}

// ✅ ใช้ validate รายหน้า (step-by-step)
function validateRegisterFormStep(step, values, setError) {
  const errorFields = [];

  const stepFields = {
    1: [
      "name",
      "username",
      "email",
      "password",
      "confirmPassword",
      "date_of_birth",
      "location",
      "city",
    ],
    2: [
      "sexual_identity",
      "sexual_preference",
      "racial_preference",
      "meeting_interest",
      "hobbies",
    ],
    3: ["images"],
  };

  const currentFields = stepFields[step] || [];

  for (const field of currentFields) {
    const value = values[field];
    if (
      !value ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    ) {
      setError(field, {
        type: "manual",
        message: `${formatFieldName(field)} is required`,
      });
      errorFields.push(field);
    }
  }

  if (step === 1) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (values.username && !usernameRegex.test(values.username)) {
      setError("username", {
        type: "manual",
        message:
          "Username must be 3–20 characters and contain only letters, numbers, or underscores",
      });
      errorFields.push("username");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (values.email && !emailRegex.test(values.email)) {
      setError("email", {
        type: "manual",
        message: "Invalid email format",
      });
      errorFields.push("email");
    }

    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (values.password && !strongPasswordRegex.test(values.password)) {
      setError("password", {
        type: "manual",
        message:
          "Password must include uppercase, lowercase, and a number (at least 8 characters)",
      });
      errorFields.push("password");
    }

    if (values.password !== values.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      errorFields.push("confirmPassword");
    }

    const dob = new Date(values.date_of_birth);
    const today = new Date();
    const age =
      today.getFullYear() -
      dob.getFullYear() -
      (today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
        ? 1
        : 0);
    if (age < 18 || age > 120) {
      setError("date_of_birth", {
        type: "manual",
        message: "You must be between 18 and 120 years old",
      });
      errorFields.push("date_of_birth");
    }

    if (values.name?.length > 100) {
      setError("name", {
        type: "manual",
        message: "Name must be under 100 characters",
      });
      errorFields.push("name");
    }

    if (values.city?.length > 100) {
      setError("city", {
        type: "manual",
        message: "City must be under 100 characters",
      });
      errorFields.push("city");
    }
  }

  if (step === 2) {
    if (Array.isArray(values.hobbies)) {
      if (values.hobbies.length > 10) {
        setError("hobbies", {
          type: "manual",
          message: "You can select up to 10 hobbies",
        });
        errorFields.push("hobbies");
      }

      const hasDuplicate =
        new Set(values.hobbies.map((h) => h.trim())).size !==
        values.hobbies.length;
      if (hasDuplicate) {
        setError("hobbies", {
          type: "manual",
          message: "Duplicate hobbies are not allowed",
        });
        errorFields.push("hobbies");
      }

      const tooLong = values.hobbies.find((h) => h.length > 30);
      if (tooLong) {
        setError("hobbies", {
          type: "manual",
          message: "Each hobby must be under 30 characters",
        });
        errorFields.push("hobbies");
      }
    }
  }

  if (step === 3) {
    const imageList = values.images || [];
    const filledImages = imageList.filter((img) => img?.src);
    const hasFirstImage = !!imageList[0]?.src;

    if (filledImages.length < 2 || !hasFirstImage) {
      setError("images", {
        type: "manual",
        message:
          "Please upload at least 2 photos, and the first one must be your profile picture",
      });
      errorFields.push("images");
    }
  }

  return errorFields;
}

// ✅ Export ฟังก์ชันทั้งหมดให้ RegisterPage ใช้ได้
export { validateRegisterForm, validateRegisterFormStep, formatFieldName };
