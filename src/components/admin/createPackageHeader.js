import { useRouter } from 'next/router';

export default function CreatePackageHeader({ onCreate, isSubmitting }) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center bg-white border-gray-400 px-8 py-6">
      <h1 className="text-3xl font-semibold p">Add Package</h1>
      <div className="flex gap-3">
        <button
          onClick={() => router.push('/admin')}
          className="bg-pink-100 hover:bg-pink-200 text-[#c4003b] font-medium px-4 py-2 rounded-full cursor-pointer transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={onCreate}
          disabled={isSubmitting}
          className="bg-[#c4003b] hover:bg-[#a8002f] text-white font-medium px-6 py-2 rounded-full cursor-pointer transition duration-200"
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  );
}
