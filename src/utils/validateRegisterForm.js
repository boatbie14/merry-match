export function validateRegisterForm(values, setError) {
    let hasError = false;
  
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
  
      if (!value || (Array.isArray(value) && value.length === 0)) {
        setError(field, {
          type: "manual",
          message: `${formatFieldName(field)} is required`,
        });
        hasError = true;
      }
    }
  
    // Password match
    if (values.password !== values.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      hasError = true;
    }
  
    // Validate date of birth age
    if (values.date_of_birth) {
      const dob = new Date(values.date_of_birth);
      if (!isNaN(dob.getTime())) {
        const today = new Date();
        const age =
          today.getFullYear() - dob.getFullYear() -
          (today.getMonth() < dob.getMonth() ||
          (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
            ? 1
            : 0);
        if (age < 18) {
          setError("date_of_birth", {
            type: "manual",
            message: "You must be at least 18 years old",
          });
          hasError = true;
        }
      }
    }
  
    // Validate images
    const imageList = values.images || [];
    const filledImages = imageList.filter((img) => img?.src);
    const hasFirstImage = !!imageList[0]?.src;
  
    if (filledImages.length < 2 || !hasFirstImage) {
      setError("images", {
        type: "manual",
        message:
          "Please upload at least 2 photos, and the first one must be your profile picture",
      });
      hasError = true;
    }
  
    return !hasError;
  }
  
  function formatFieldName(field) {
    return field
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  }
  