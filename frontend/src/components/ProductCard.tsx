import { Link } from "react-router-dom";
import { ArrowRight, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

export const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const [liked, setLiked] = useState(false);

  const image = product?.images?.[0]?.image;

  const rating = useMemo(() => {
    const r = Number(product?.ratings ?? 0);
    return Math.max(0, Math.min(5, r));
  }, [product?.ratings]);

  const inStock = (product?.stock ?? 0) > 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-2xl"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={product?.name}
          className="h-52 w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
          loading="lazy"
        />

        {/* Soft overlay for readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-90" />

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {product?.category && (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur">
              {product.category}
            </span>
          )}

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur ${
              inStock
                ? "bg-emerald-500/90 text-white"
                : "bg-rose-500/90 text-white"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked((p) => !p);
          }}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all hover:scale-105 active:scale-95"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              liked ? "text-rose-500" : "text-gray-700"
            }`}
            fill={liked ? "currentColor" : "none"}
          />
        </button>

        {/* Name (on image, premium look) */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="line-clamp-1 text-lg font-extrabold text-white drop-shadow">
            {product?.name}
          </h3>

          {/* Rating */}
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(rating)
                      ? "text-yellow-300 fill-current"
                      : "text-white/50"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-white/90">
              {rating.toFixed(1)} • {product?.numOfReviews ?? 0} reviews
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">
          {product?.description || "Fresh and organic"}
        </p>

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-gray-500">Price</p>
            <p className="text-2xl font-black text-emerald-600">
              Rs. {product?.price}
              <span className="ml-1 text-sm font-semibold text-gray-500">
                / {product?.unitType ?? "unit"}
              </span>
            </p>
          </div>

          <Link
            to={`/product/${product?._id}`}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]"
          >
            View
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Subtle glow on hover */}
      <div className="pointer-events-none absolute -inset-24 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100">
        <div className="h-64 w-64 rounded-full bg-emerald-200/60" />
      </div>
    </motion.div>
  );
};
