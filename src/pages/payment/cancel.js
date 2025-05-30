export default function CancelPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FCFCFE] px-6 py-12">
      <div className="bg-white border border-[#E3E6EF] shadow-md rounded-2xl max-w-md w-full px-8 py-10 text-center">
        <div className="text-4xl mb-4">❌</div>
        <h1 className="text-2xl font-bold text-[#A62D82] mb-4">Payment Canceled</h1>
        <p className="text-[#424C6B] mb-6 text-sm leading-relaxed">
          Your transaction was canceled or an error occurred during payment.<br />
          Please try again later.
        </p>
        <a
          href="/merry-membership"
          className="inline-block bg-[#A62D82] hover:bg-[#922672] text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Go back to choose a plan
        </a>
      </div>
    </div>
  );
}
