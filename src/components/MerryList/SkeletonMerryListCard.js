import { Skeleton} from "@mui/material";

const SkeletonMerryListCard = () => {
  return (
    <div className="flex flex-col border-b border-gray-200 pb-8 md:pb-12 md:max-w-[933px] md:flex-row gap-4 md:gap-1.5 pt-4 w-full animate-pulse">
      <div className="flex flex-row justify-between w-full md:w-auto">
        <div className="relative w-[114px] h-[114px] sm:w-[164px] sm:h-[164px] md:w-[200px] md:h-[200px] mb-4 rounded-2xl md:rounded-3xl overflow-hidden">
          <Skeleton variant="rectangular"width={800} height={800} />
        </div>

        <div className="md:hidden flex flex-col items-end w-auto mt-2">
          <Skeleton variant="rounded" width={140} height={30} className="mb-2" />
          <div className="flex flex-row gap-2">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </div>
        </div>
      </div>

      <div className="flex-1 text-sm text-[#2A2E3F] md:ml-4 md:mt-1">
        <div className="flex items-center gap-3 md:gap-6 mb-2">
          <Skeleton variant="text" width="30%" height={44} className="font-bold" />
          <Skeleton variant="text" width="40%" height={44} />
        </div>

        <div className="mt-2 md:mt-5 lg:mt-7 text-[#646D89] w-full">
          <table className="w-full text-[17px] md:text-[16px] md:w-[320px] lg:w-[400px] lg:text-[18px] table-fixed">
            <tbody>
              <tr>
                <td className="w-1/2 py-1.5 md:py-1 text-[#2A2E3F]">
                  <Skeleton variant="text" width="90%" height={20} />
                </td>
                <td className="w-1/2">
                  <Skeleton variant="text" width="70%" height={20} />
                </td>
              </tr>
              <tr>
                <td className="w-1/2 py-1.5 md:py-1 text-[#2A2E3F]">
                  <Skeleton variant="text" width="50%" height={20} />
                </td>
                <td className="w-1/2">
                  <Skeleton variant="text" width="80%" height={20} />
                </td>
              </tr>
              <tr>
                <td className="w-1/2 py-1.5 md:py-1 text-[#2A2E3F] ">
                  <Skeleton variant="text" width="90%" height={20} />
                </td>
                <td className="w-1/2">
                  <Skeleton variant="text" width="70%" height={20} />
                </td>
              </tr>
              <tr>
                <td className="w-1/2 py-1.5 md:py-1 text-[#2A2E3F]">
                  <Skeleton variant="text" width="70%" height={20} />
                </td>
                <td className="w-1/2">
                  <Skeleton variant="text" width="80%" height={20} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-end w-auto mt-6">
        <Skeleton variant="rounded" width={140} height={30} className="mb-2" />
          <div className="flex flex-row gap-2">
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="circular" width={40} height={40} />
          </div>
      </div>
    </div>
  )  
}

export default SkeletonMerryListCard