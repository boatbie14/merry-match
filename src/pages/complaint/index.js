import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import loginImage from "../../../public/assets/login-complaint.jpg";
import FormInput from "@/components/complaint/FormInput";
import FormTextarea from "@/components/complaint/FormTextarea";
import StatusModal from "@/components/popup/StatusModal";

export default function ComplaintPage() {
  const router = useRouter();
  const { isLoggedIn, checkingLogin, userInfo } = useAuth();
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success"); // "success" หรือ "error"
  const [modalMessage, setModalMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const newErrors = {};

    // Client-side validation
    if (!issue.trim()) {
      newErrors.issue = "Please enter the subject of the issue.";
    } else if (issue.trim().length < 5) {
      newErrors.issue = "Issue subject must be at least 5 characters long.";
    }

    if (!description.trim()) {
      newErrors.description = "Please enter the details of the issue.";
    } else if (description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // ส่งไป API Route
      const response = await fetch("/api/complaint/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issue: issue.trim(),
          description: description.trim(),
          user_id: userInfo.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit complaint");
      }

      // Success - แสดง success modal
      setIssue("");
      setDescription("");
      setModalType("success");
      setModalMessage(
        "Your complaint has been submitted successfully. We will review it and get back to you as soon as possible. Thank you for your feedback!"
      );
      setShowModal(true);
    } catch (err) {
      console.error("Submit error:", err);

      // Error - แสดง error modal
      setModalType("error");
      setModalMessage(
        err.message || "There was an error submitting the complaint. Please try again or contact support if the problem persists."
      );
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  // แสดง loading ขณะเช็ค auth
  if (checkingLogin) {
    return (
      <div className="row pt-[92px] lg:pt-[148px] pb-20 bg-[#FCFCFE]">
        <div className="container flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A62D82] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="row pt-[92px] lg:pt-[148px] pb-20 bg-[#FCFCFE]">
        <div className="container flex flex-row flex-wrap">
          <div className="form-container w-full lg:w-1/2 order-2 lg:order-1">
            <p className="text-sm text-[#a76300] uppercase font-medium mb-1">Complaint</p>
            <h1 className="text-3xl lg:text-5xl font-bold lg:font-extrabold text-[#941772] leading-snug">
              If you have any trouble
              <br />
              Don&apos;t be afraid to tell us!
            </h1>

            {isLoggedIn ? (
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <FormInput
                  id="issue"
                  label="Issue"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  placeholder="Enter your issue (minimum 5 characters)"
                  maxLength={100}
                  error={errors.issue}
                />
                <p className="w-full text-right text-xs text-gray-500 mt-2">{issue.length}/100 characters</p>

                <FormTextarea
                  id="description"
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your problem in detail (minimum 20 characters)"
                  maxLength={1000}
                  error={errors.description}
                />
                <p className="w-full text-right text-xs text-gray-500 mt-2">{description.length}/1000 characters</p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="primary-btn min-w-full lg:min-w-[84px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            ) : (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Please log in to submit a complaint</h3>
                  <p className="text-gray-600 mb-6">
                    You need to be logged in to your account to submit a complaint. This helps us track and respond to your issues
                    effectively.
                  </p>

                  <button onClick={() => router.push("/login")} className="primary-btn px-6 py-3">
                    Log In
                  </button>
                </div>

            )}
          </div>

          <div className="w-full lg:w-1/2 pb-20 lg:pb-0 flex justify-center lg:justify-end order-1 lg:order-2">
            <div
              className="h-[266px] w-[177px] lg:h-[677px] lg:w-[450px] bg-cover bg-right bg-no-repeat rounded-full"
              style={{ backgroundImage: `url(${loginImage.src})` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Status Modal (Success/Error) */}
      <StatusModal isOpen={showModal} onClose={handleCloseModal} type={modalType} message={modalMessage} />
    </>
  );
}
