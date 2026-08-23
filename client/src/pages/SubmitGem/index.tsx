import { useNavigate } from "react-router-dom";
import GemForm from "../../components/GemForm/GemForm";

export default function SubmitGem() {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-[#3D2A18] scrollbar-track-[#120B08]">
      <div className="max-w-lg mx-auto px-5 py-8 md:py-12 font-['DM_Sans',sans-serif]">
        {/* Page heading */}
        <div className="mb-6">
          <h1
            className="flex items-center gap-2.5 text-2xl font-bold text-[#F5E6D0]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <i className="ti ti-diamond-filled text-xl text-[#E8743A]" />
            Share a Gem
          </h1>
          <p className="text-[13px] text-[#A07050] mt-1.5 leading-relaxed">
            Know a hidden spot? Share it with the city.
          </p>
        </div>

        <div className="bg-[#1C1410]/80 border border-[#332010] rounded-2xl p-5 backdrop-blur-sm">
          <GemForm onSuccess={() => navigate("/profile?tab=gems")} />
        </div>
      </div>
    </div>
  );
}
