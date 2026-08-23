import { useMemo, useState } from "react";
import { useGemPanel, type GemDraft } from "../../context/GemPanelContext";
import { AREAS, GEM_CATEGORIES } from "../../data/constants";

type GemFormProps = {
  onSuccess: () => void;
};

const inputBase = `
  w-full bg-[#110C08] border rounded-xl outline-none px-3.5 py-2.5
  text-[13px] text-[#F5E6D0] placeholder:text-[#6B4830]
  transition-colors duration-150 font-['DM_Sans',sans-serif]
`;
const inputIdle = "border-[#3D2A18] focus:border-[#E8743A]";
const labelCls =
  "block text-[10px] font-bold tracking-[0.10em] uppercase text-[#A07050] mb-1.5";

/**
 * Share-a-gem form — mirrors the fields of our mock gem data so the whole
 * flow works end-to-end in mock mode. Swap `addGem` for an API call when
 * the backend lands.
 */
export default function GemForm({ onSuccess }: GemFormProps) {
  const { addGem } = useGemPanel();

  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>("");
  const [area, setArea] = useState<string>("");
  const [hours, setHours] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit =
    title.trim() !== "" &&
    category !== "" &&
    area !== "" &&
    image.trim() !== "" &&
    description.trim() !== "";

  // Only render the preview <img> once the URL plausibly points at an image
  const showPreview = /^https?:\/\//i.test(image.trim());

  const previewSrc = useMemo(() => image.trim(), [image]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    addGem({
      title: title.trim(),
      category,
      area,
      image: image.trim(),
      description: description.trim(),
      hours: hours.trim() || "Open 24/7",
    } satisfies GemDraft);

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Mock-mode notice */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[#3D2A18] bg-[#110C08]/60">
        <i className="ti ti-flask text-[14px] text-[#E8743A] shrink-0" />
        <p className="text-[11px] leading-snug text-[#8B654A]">
          Mock mode — your gem is added locally for now. Real uploads arrive with the backend.
        </p>
      </div>

      {/* Image URL + live preview */}
      <div>
        <label htmlFor="gem-image" className={labelCls}>
          Photo URL
        </label>
        <div className="flex gap-3">
          <div
            className={`
              w-20 h-20 shrink-0 rounded-xl overflow-hidden grid place-items-center
              bg-[#110C08] border ${inputIdle}
            `}
          >
            {showPreview ? (
              <img
                src={previewSrc}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <i className="ti ti-photo text-xl text-[#6B4830]" />
            )}
          </div>
          <input
            id="gem-image"
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://… paste any photo link"
            className={`${inputBase} ${inputIdle}`}
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="gem-title" className={labelCls}>
          Title
        </label>
        <input
          id="gem-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={60}
          placeholder="e.g. Rander Kulfi & Coco Corner"
          className={`${inputBase} ${inputIdle}`}
        />
      </div>

      {/* Category chips */}
      <div>
        <span className={labelCls}>Category</span>
        <div className="flex flex-wrap gap-[7px]">
          {GEM_CATEGORIES.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(isActive ? "" : cat)}
                className={`
                  px-[13px] py-[6px] rounded-full text-[11px] font-medium cursor-pointer
                  transition-all duration-150 active:scale-95
                  ${
                    isActive
                      ? "bg-[#261A14] text-[#E8743A] border-[#E8743A]/40"
                      : "text-[#A07050] border-[#3D2A18] hover:bg-[#1C1410]"
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Area + hours */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="gem-area" className={labelCls}>
            Area
          </label>
          <select
            id="gem-area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className={`${inputBase} ${inputIdle} appearance-none cursor-pointer ${area ? "" : "text-[#6B4830]"}`}
          >
            <option value="" disabled>
              Select area
            </option>
            {AREAS.map((a) => (
              <option key={a.label} value={a.label}>
                {a.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="gem-hours" className={labelCls}>
            Best time <span className="normal-case font-medium text-[#6B4830]">(optional)</span>
          </label>
          <input
            id="gem-hours"
            type="text"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="e.g. 6 PM - 11 PM"
            className={`${inputBase} ${inputIdle}`}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="gem-description" className={labelCls}>
          What makes it a gem?
        </label>
        <textarea
          id="gem-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={280}
          placeholder="The story only a local would know — what to order, when to go, how to find it…"
          className={`${inputBase} ${inputIdle} resize-none leading-relaxed`}
        />
        <p className={`text-right text-[10px] mt-1 ${description.length >= 280 ? "text-[#E8743A]" : "text-[#6B4830]"}`}>
          {description.length}/280
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!canSubmit}
        className={`
          w-full flex items-center justify-center gap-2 py-3 rounded-xl
          text-[13px] font-semibold border-none cursor-pointer
          transition-all duration-150 active:scale-[0.98]
          ${
            canSubmit
              ? "bg-[#E8743A] hover:bg-[#D4622A] text-[#110C08]"
              : "bg-[#261A14] text-[#6B4830] cursor-not-allowed"
          }
        `}
      >
        <i className="ti ti-diamond-filled text-[15px]" />
        Share this gem
      </button>
    </form>
  );
}
