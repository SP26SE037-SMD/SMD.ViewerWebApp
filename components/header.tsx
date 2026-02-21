import ButtonBase from "@/components/button-base";

export default function Header() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 w-full mx-auto font-sans sticky z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
        <div className="flex items-center gap-12">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2 font-mono uppercase">
            UniSyllabus
          </div>
          <div className="hidden md:flex gap-8 text-[15px] font-medium text-gray-900">
            <a href="#" className="hover:opacity-60">
              Product
            </a>
            <a href="#" className="hover:opacity-60">
              Solutions
            </a>
            <a href="#" className="hover:opacity-60">
              Pricing
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ButtonBase variant="secondary">Log in</ButtonBase>
          <ButtonBase variant="primary">Get started</ButtonBase>
        </div>
      </div>
    </nav>
  );
}
