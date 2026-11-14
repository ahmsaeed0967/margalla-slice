import { useState } from "react";
import Reveal from "../common/Reveal";
import { Star, MessageSquarePlus, X, CheckCircle2, Copy } from "lucide-react";
import { SITE } from "../../config/site";

// Direct Intent Link to open Google's review composer box
const WRITE_REVIEW_LINK =
  "https://www.google.com/maps/place/Tasto+Pizza/@33.5489877,73.05573,1036m/data=!3m1!1e3!4m8!3m7!1s0x38df930061fe20ff:0x1e80d32260f0c84c!8m2!3d33.5489877!4d73.05573!9m1!1b1!16s%2Fg%2F11z247cr70?hl=en-PK&entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D";

// IMPORTANT: these cards are only shown when SITE.showReviewCards is true
// (src/config/site.js). Set it to true ONLY if every review below is a genuine
// Google review (real customer name, real text). Until then the section shows
// just a "Rate us on Google" card. Several texts below mention things that are
// no longer true (Smoky Kabab pizza, the Grand Opening deal, a 25-minute delivery).
const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: "Hamza Tariq",
    rating: 5,
    date: "1 week ago",
    text: "The tandoori and tikka pizzas are generously topped with cheese and taste far better than the price suggests. Highly recommended for family dining!",
  },
  {
    id: 2,
    name: "Usman Ali",
    rating: 5,
    date: "2 weeks ago",
    text: "Crown Crust pizza is absolute fire 🔥! Fresh dough, great crunch on the crust, and the dip sauce takes it to the next level.",
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    rating: 5,
    date: "3 weeks ago",
    text: "Best pizza spot on Adyala Road right now. Quick delivery and piping hot food every single time.",
  },
  {
    id: 4,
    name: "Saad Sheikh",
    rating: 5,
    date: "a month ago",
    text: "Great value for money. Their Grand Opening Deal with wings and drink is unbeatable. 10/10 service!",
  },
  {
    id: 5,
    name: "Zainab Malik",
    rating: 5,
    date: "2 weeks ago",
    text: "Ordered for a family gathering. All 3 large pizzas were packed with flavor and delivered warm. Will definitely order again!",
  },
  {
    id: 6,
    name: "Fahad Hashmi",
    rating: 5,
    date: "3 weeks ago",
    text: "Oven baked wings are super crispy and saucy. Smoky Kabab crust pizza is easily the best in Rawalpindi.",
  },
  {
    id: 7,
    name: "Ayesha Noor",
    rating: 5,
    date: "1 month ago",
    text: "Super clean packaging and prompt delivery within 25 minutes. The cheese stretch on the large pizza was incredible!",
  },
  {
    id: 8,
    name: "Danyal Khan",
    rating: 5,
    date: "1 month ago",
    text: "Chicken Bar BQ flavor is mouthwatering. Staff is polite and the WhatsApp ordering makes it so fast and hassle free.",
  },
];

const MAX_REVIEW_CHARS = 300;

// Shown while SITE.showReviewCards is false: no testimonials, just a link to Google.
function RateUsCard() {
  return (
    <section id="reviews" className="py-12 lg:py-16 bg-cream border-t-2 border-line">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <div className="max-w-xl mx-auto bg-paper border-2 border-brand rounded-2xl p-6 text-center">
          <div className="flex justify-center gap-1 text-brand-deep" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} size={22} fill="currentColor" strokeWidth={0} />
            ))}
          </div>
          <h2 className="mt-3 font-display font-black text-2xl text-ink">Rate us on Google</h2>
          <p className="mt-2 text-[15px] text-muted font-medium">
            Enjoyed your order? A short review on Google helps other people find {SITE.name}.
          </p>
          <a
            href={WRITE_REVIEW_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-night text-white font-display font-extrabold text-[15px] active:scale-95 transition-transform"
          >
            <MessageSquarePlus size={18} strokeWidth={2.2} aria-hidden="true" />
            Write a review on Google
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Reviews() {
  const [reviewsList, setReviewsList] = useState(DEFAULT_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const isFormValid =
    rating > 0 &&
    reviewerName.trim().length >= 2 &&
    reviewText.trim().length >= 5;

  // Not saved anywhere: the review is shown on this page only, copied to the
  // clipboard, and the customer is sent to Google to post it there.
  function handleSubmitReview(e) {
    e.preventDefault();
    if (!isFormValid) return;

    const newRev = {
      id: Date.now(),
      name: reviewerName.trim(),
      rating,
      date: "Just now",
      text: reviewText.trim(),
    };

    setReviewsList((prev) => [newRev, ...prev]);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(reviewText.trim()).catch(() => {});
    }

    setIsCopied(true);

    setTimeout(() => {
      window.open(WRITE_REVIEW_LINK, "_blank");
      setIsModalOpen(false);
      setReviewerName("");
      setReviewText("");
      setIsCopied(false);
      setRating(0);
    }, 1200);
  }

  function handleOpenModal() {
    setRating(0);
    setHoverRating(0);
    setReviewerName("");
    setReviewText("");
    setIsCopied(false);
    setIsModalOpen(true);
  }

  if (!SITE.showReviewCards) return <RateUsCard />;

  return (
    <section id="reviews" className="py-12 lg:py-16 bg-cream border-t-2 border-line overflow-hidden relative">
      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70">
          <div className="bg-paper rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-brand relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
              className="absolute top-3 right-3 w-12 h-12 rounded-full bg-brand-tint text-ink flex items-center justify-center"
            >
              <X size={18} strokeWidth={2.2} />
            </button>

            <div className="text-center space-y-1.5 mb-5">
              <Star size={28} className="text-brand-deep mx-auto" fill="currentColor" strokeWidth={0} aria-hidden="true" />
              <h3 className="font-display font-black text-xl text-ink">
                Share Your Experience
              </h3>
              <p className="text-sm text-muted font-medium">
                Your review helps Tasto Pizza serve Rawalpindi better!
              </p>
            </div>

            {isCopied ? (
              <div className="py-6 text-center space-y-3 bg-brand-tint border border-line rounded-2xl p-4">
                <CheckCircle2 size={36} className="text-brand-deep mx-auto" aria-hidden="true" />
                <h4 className="font-display font-bold text-base text-ink">
                  Review added &amp; copied!
                </h4>
                <p className="text-sm text-ink">
                  Opening Google Review box... Simply <strong>Paste (Ctrl+V)</strong> and tap Post!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Star Picker */}
                <div className="flex flex-col items-center justify-center gap-1.5 bg-cream py-3.5 rounded-2xl border border-line">
                  <span className="text-sm font-black text-ink uppercase tracking-wider">
                    {rating === 0
                      ? "Select Your Rating *"
                      : `${rating} Star${rating > 1 ? "s" : ""} Selected`}
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`${star} star${star > 1 ? "s" : ""}`}
                          aria-pressed={rating >= star}
                          className="w-12 h-12 flex items-center justify-center text-brand-deep active:scale-95 transition-transform cursor-pointer"
                        >
                          <Star
                            size={28}
                            fill={active ? "currentColor" : "none"}
                            strokeWidth={active ? 0 : 2}
                            className={active ? "text-brand-deep" : "text-muted"}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="review-name" className="text-sm font-bold text-ink">
                      Your Name *
                    </label>
                    <span className="text-sm text-muted font-medium">
                      {reviewerName.length}/40
                    </span>
                  </div>
                  <input
                    id="review-name"
                    type="text"
                    required
                    maxLength={40}
                    placeholder="e.g. Ahmed Saeed"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full h-12 rounded-xl border-2 border-ink/30 px-3.5 text-[15px] font-semibold text-ink placeholder:text-muted bg-paper"
                  />
                </div>

                {/* Review */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="review-text" className="text-sm font-bold text-ink">
                      Your Review *
                    </label>
                    <span className="text-sm text-muted font-medium">
                      {reviewText.length}/{MAX_REVIEW_CHARS}
                    </span>
                  </div>
                  <textarea
                    id="review-text"
                    rows={3}
                    required
                    maxLength={MAX_REVIEW_CHARS}
                    placeholder="How was the crust, toppings, or delivery speed?"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full rounded-xl border-2 border-ink/30 p-3 text-[15px] font-semibold text-ink placeholder:text-muted bg-paper resize-none"
                  />
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full h-12 rounded-xl font-display font-black text-[15px] flex items-center justify-center gap-2 transition-transform ${
                    isFormValid
                      ? "bg-night text-white active:scale-95 cursor-pointer"
                      : "bg-cream-deep text-muted border-2 border-dashed border-ink/30 cursor-not-allowed"
                  }`}
                >
                  <Copy size={16} aria-hidden="true" />
                  <span>
                    {rating === 0 ? "Select Stars to Continue" : "Submit & Post on Google Maps"}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Smooth Infinite Marquee Animation for 8+ items */}
      <style>{`
        @keyframes smoothSlide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-smooth-slide {
          display: flex;
          width: max-content;
          animation: smoothSlide 28s linear infinite;
        }
        .animate-smooth-slide:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <Reveal className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="inline-block bg-brand-tint text-brand-deep text-sm font-black uppercase tracking-wider px-3 py-1 rounded-full">
            What Rawalpindi Is Saying
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-ink mt-2.5">
            Reviews From Google
          </h2>

          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 h-12 px-5 rounded-full bg-night text-white font-display font-extrabold text-[15px] active:scale-95 transition-transform cursor-pointer"
            >
              <MessageSquarePlus size={18} strokeWidth={2.2} aria-hidden="true" />
              <span>Write a Review on Google</span>
            </button>
          </div>
        </Reveal>

        {/* Sliding Track (8+ Items Loop) */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-28 bg-gradient-to-r from-cream to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-28 bg-gradient-to-l from-cream to-transparent z-10 pointer-events-none" />

          <div className="animate-smooth-slide flex gap-4 sm:gap-6 py-2">
            {[...reviewsList, ...reviewsList].map((rev, idx) => (
              <div
                key={`${rev.id}-${idx}`}
                className="w-72 sm:w-80 bg-paper border-2 border-brand rounded-2xl p-5 flex flex-col justify-between shrink-0"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-brand-deep">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                    <span className="bg-brand-tint text-brand-deep text-sm font-black px-2.5 py-0.5 rounded-full">
                      Google Review
                    </span>
                  </div>

                  <p className="text-[15px] text-ink font-medium leading-relaxed italic line-clamp-4">
                    "{rev.text}"
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-line flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-tint text-brand-deep font-black text-sm flex items-center justify-center">
                      {rev.name?.charAt(0) || "U"}
                    </div>
                    <span className="font-display font-extrabold text-sm text-ink truncate max-w-[140px]">
                      {rev.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-muted shrink-0">
                    {rev.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}