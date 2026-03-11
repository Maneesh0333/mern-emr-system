import Login from "../components/Auth/Login";

export default function AuthPage() {

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans">
      {/* LEFT – Marketing / Visual */}
      <div
        className="
          hidden h-screen sticky top-0 lg:flex flex-col items-center justify-center gap-20
          px-12 py-10
          text-white
          bg-gradient-to-br from-[#3B1608] via-[#7A3212] to-[#C4632A]
          overflow-hidden
        "
      >
        <div className="space-y-6 relative z-10">
          <h1 className="font-playfair text-5xl leading-tight font-black">
            Electronic <br />
            <span className="italic text-[#FFD6B8]">Medical Records</span> 

          </h1>

          <p className="max-w-md text-sm text-white/80">
             Streamlined appointment scheduling and patient management for modern
            healthcare facilities.
          </p>

        </div>
      </div>

      {/* RIGHT – Auth Form */}
      <div className="flex flex-col justify-center p-15 bg-[#FAF5ED]">
        <Login />
      </div>
    </div>
  );
}
