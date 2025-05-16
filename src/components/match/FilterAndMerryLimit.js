import { PiSlidersBold } from "react-icons/pi";

const FilterAndMerryLimit = ({ onToggleFilter, merryLimit }) => {
  return (
    <div className="w-full max-w-[620px] mt-6 pb-4 px-4 flex justify-between">
      <div className="w-1/2 xl:hidden ">
        <button onClick={onToggleFilter} className="xl:hidden text-white flex gap-2">
          <PiSlidersBold color="#fff" size={24} />
          Filter
        </button>
      </div>

      <p className="w-1/2 xl:w-full flex justify-end xl:justify-center text-[#646D89]">
        Merry limit today&nbsp;
        <span className="text-[#FF1659]">
          {merryLimit.count}/{merryLimit.merry_per_day}
        </span>
      </p>
    </div>
  );
};

export default FilterAndMerryLimit;
