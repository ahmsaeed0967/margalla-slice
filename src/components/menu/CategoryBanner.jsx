// Primary-blue rounded banner that opens each menu category (MLTD-style):
// big white heavy-italic title on the left, a round food photo on the right
// with a 2px white ring. Text never sits on the photo.
export default function CategoryBanner({ title, image, as: Tag = "h2" }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary text-white h-24 sm:h-28 lg:h-32 flex items-center justify-between gap-3 pl-5 sm:pl-8 pr-5 sm:pr-8">
      <Tag className="relative min-w-0 font-display font-black italic uppercase leading-[0.95] tracking-tight text-[26px] sm:text-4xl lg:text-5xl">
        {title}
        <span aria-hidden="true" className="block mt-2 h-1.5 w-12 rounded-full bg-white" />
      </Tag>

      {image && (
        <div className="relative shrink-0 w-[70px] h-[70px] sm:w-20 sm:h-20 lg:w-24 lg:h-24">
          <img
            src={image}
            alt=""
            width={112}
            height={112}
            loading="lazy"
            decoding="async"
            className="relative w-full h-full rounded-full object-cover bg-white ring-2 ring-white"
          />
        </div>
      )}
    </div>
  );
}
