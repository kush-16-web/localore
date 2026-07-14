import GemCard from '../GemCard';
import type { GemCardData } from '../MasonryGrid';

type RightPanelProps = {
  gem: GemCardData | null;
  onClose: () => void;
  isOpen: boolean;
};

export default function RightPanel({ gem, onClose, isOpen }: RightPanelProps) {
  return (
    <aside
      className={`relative
        h-full  border-l border-[#332010] flex-shrink-0
        transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'w-[320px]' : 'w-0'}
      `}
    >

       {/* Blurred Background */}
  {gem && (
    <div
  className="absolute inset-0 bg-cover bg-center opacity-15"
  style={{ backgroundImage: `url(${gem.image})` }}
/>

  )}

    {/* Dark overlay */}
  <div className="absolute z-[-1] inset-0 bg-[#120B08]/20 backdrop-blur-md" />

      {/* Inner wrapper keeps content from reflowing during animation */}
      <div className="w-[320px] h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center bg-[#120B08]/10 backdrop-blur-sm px-4 py-3 shrink-0">
          <h4
            className="text-base font-semibold text-left text-[#F5E6D0]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {gem?.title}
          </h4>
          <button
            onClick={onClose}
            className="w-7 h-7 z-2 flex items-center justify-center rounded-lg group hover:text-[#cd5a0e] text-[#A07050] bg-[#261A14] backdrop-blur-md transition-all duration-300 cursor-pointer"
            aria-label="Close panel"
          >
            <i className="ti ti-x text-[14px] group-hover:rotate-180 transition-all duration-300" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto z-2 scrollbar-thin scrollbar-thumb-[#3D2A18] scrollbar-track-[#120B08]">
          {gem ? (
            <GemCard gem={gem} />
          ) : (
            <p className="text-[#6B4830] text-sm text-center mt-10 px-4">
              Select a gem to view its details.
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
