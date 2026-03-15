export default function ButtonBase({
  children,
  variant = "",
  onClick,
  className = "",
  icon: Icon,
}: any) {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 font-mono text-sm font-bold transition-all active:translate-y-[2px] active:shadow-none";
  const variants = {
    primary:
      "font-[Lexend] bg-[#3D6B2C] text-[#F0F7ED] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] rounded-sm transition-colors hover:bg-[#2D4F21]",
    secondary:
      "font-[Lexend] bg-white text-black border border-black hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm",
    ghost:
      "font-[Lexend] bg-transparent text-gray-600 hover:text-black hover:bg-gray-100 rounded-sm",
    danger:
      "font-[Lexend] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-sm",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
