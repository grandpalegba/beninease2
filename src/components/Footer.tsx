const Footer = () => {
  return (
    <footer className="bg-[#006B3F] text-white py-12 px-6">
      <div className="container max-w-7xl mx-auto text-center">
        <div className="flex flex-col items-center gap-1 mb-6">
          <h2 className="font-lato text-3xl md:text-4xl font-black tracking-[3px]">
            <span className="text-white">Benin</span><span className="text-[#FFD700]">Ease</span>
          </h2>
          <span className="text-sm md:text-base font-light tracking-[0.3em] uppercase text-white/80">
            L'Espace Béninois
          </span>
        </div>
        <p className="text-xs md:text-sm text-white/40 font-sans font-medium tracking-wide">
          © 2026 Benin<span className="text-[#FFD700]">Ease</span>. <br className="md:hidden" /> Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
