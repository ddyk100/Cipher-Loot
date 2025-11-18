'use client';

import Link from 'next/link';

const stats = [
  { label: 'Network', value: 'Sepolia' },
  { label: 'Contract', value: '0xc5A5...e68b' },
];

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden px-6 py-16 lg:px-12">
      {/* Baroque radial gradients with mint accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[15%] h-[600px] w-[600px] bg-[radial-gradient(circle,_rgba(197,227,216,0.1),_transparent_70%)]" />
        <div className="absolute top-[40%] right-[20%] h-[500px] w-[500px] bg-[radial-gradient(circle,_rgba(212,175,55,0.08),_transparent_70%)]" />
        <div className="absolute bottom-[5%] left-[40%] h-[550px] w-[550px] bg-[radial-gradient(circle,_rgba(142,197,176,0.09),_transparent_70%)]" />
      </div>

      {/* Baroque corner ornaments - only at four corners */}
      <div className="absolute top-8 left-8 text-6xl opacity-25" style={{ color: '#c5e3d8', textShadow: '0 0 20px rgba(197, 227, 216, 0.4)' }}>❦</div>
      <div className="absolute top-8 right-8 text-6xl opacity-20 rotate-90" style={{ color: '#d4af37', textShadow: '0 0 20px rgba(212, 175, 55, 0.3)' }}>❦</div>
      <div className="absolute bottom-8 left-8 text-6xl opacity-20 -rotate-90" style={{ color: '#d4af37', textShadow: '0 0 20px rgba(212, 175, 55, 0.3)' }}>❦</div>
      <div className="absolute bottom-8 right-8 text-6xl opacity-25 rotate-180" style={{ color: '#8ec5b0', textShadow: '0 0 20px rgba(142, 197, 176, 0.4)' }}>❦</div>

      <section className="mx-auto w-full max-w-7xl">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          {/* Left Side - Hero content */}
          <div className="space-y-8">
            {/* Large dramatic title - more flowing and elegant */}
            <div className="space-y-3">
              <h1 className="text-5xl font-black leading-[0.9] tracking-tight text-[#d4af37] sm:text-6xl lg:text-7xl" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900 }}>
                Cipher Loot
              </h1>
              <h1 className="ml-8 text-5xl font-black leading-[0.9] tracking-tight text-[#fffff0] sm:text-6xl lg:text-7xl" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900 }}>
                built with
              </h1>
              <h1 className="text-6xl font-black italic leading-[0.85] tracking-wide text-[#c5e3d8] sm:text-7xl lg:text-8xl" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, textShadow: '0 0 30px rgba(197, 227, 216, 0.5)' }}>
                fully homomorphic
              </h1>
              <h1 className="ml-16 text-6xl font-black italic leading-[0.85] tracking-wide text-[#c5e3d8] sm:text-7xl lg:text-8xl" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, textShadow: '0 0 30px rgba(197, 227, 216, 0.5)' }}>
                encryption
              </h1>
            </div>

            {/* Subtitle */}
            <p className="max-w-xl text-sm leading-relaxed text-[#fffff0]/80 sm:text-base" style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
              Draw mystery artifacts upon the Sepolia chain, preserve results in utmost privacy, 
              and prove the immutable honesty of destiny's hand.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/game" className="btn-primary group">
                <span className="transition-transform group-hover:rotate-12">⚔</span>
                <span>Enter the Vault</span>
              </Link>
              <a
                className="btn-muted"
                href="#"
                target="_blank"
                rel="noreferrer"
              >
                <span>⚡</span>
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Right Side - Game card stack and Pipeline */}
          <div className="relative -mt-24 lg:-ml-32 space-y-10">
            {/* Card stack container - compact and rounded */}
            <div className="flex justify-center items-center" style={{ minHeight: '340px' }}>
              <div className="relative" style={{ width: '320px', height: '300px' }}>
                
                {/* R Card - Bottom layer (rightmost, rotated right) */}
                <div 
                  className="absolute group cursor-pointer"
                  style={{
                    width: '200px',
                    height: '290px',
                    left: '120px',
                    top: '20px',
                    transform: 'rotate(10deg)',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(10deg) translateY(-12px) scale(1.04)';
                    e.currentTarget.style.zIndex = '40';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotate(10deg)';
                    e.currentTarget.style.zIndex = '10';
                  }}
                >
                  {/* Card border glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{
                         borderRadius: '48px',
                         background: 'linear-gradient(135deg, rgba(205, 127, 50, 0.7), rgba(139, 116, 61, 0.5))',
                         filter: 'blur(16px)',
                         transform: 'scale(1.06)'
                       }}>
                  </div>
                  
                  {/* Card body */}
                  <div className="relative w-full h-full overflow-hidden"
                       style={{
                         borderRadius: '48px',
                         background: 'linear-gradient(135deg, #1a1410 0%, #2d2416 50%, #1a1410 100%)',
                         boxShadow: '0 12px 50px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(205, 127, 50, 0.3), 0 0 0 2.5px rgba(205, 127, 50, 0.7)'
                       }}>
                    {/* Card pattern overlay */}
                    <div className="absolute inset-0 opacity-15"
                         style={{
                           backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(205, 127, 50, 0.18) 10px, rgba(205, 127, 50, 0.18) 20px)'
                         }}>
                    </div>
                    
                    {/* Card content */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                      <div className="text-6xl font-black tracking-[0.35em] text-[#cd7f32] mb-5" style={{ fontFamily: 'Cinzel, serif', textShadow: '0 0 25px rgba(205, 127, 50, 0.9), 0 0 50px rgba(205, 127, 50, 0.4)' }}>
                        R
                      </div>
                      <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#cd7f32] to-transparent mb-4"></div>
                      <div className="text-xs text-[#cd7f32]/75 text-center uppercase tracking-[0.25em] font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                        Common
                      </div>
                    </div>
                  </div>
                </div>

                {/* SR Card - Middle layer (center) */}
                <div 
                  className="absolute group cursor-pointer"
                  style={{
                    width: '200px',
                    height: '290px',
                    left: '60px',
                    top: '5px',
                    transform: 'rotate(0deg)',
                    transition: 'all 0.3s ease',
                    zIndex: 20,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(0deg) translateY(-12px) scale(1.04)';
                    e.currentTarget.style.zIndex = '40';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotate(0deg)';
                    e.currentTarget.style.zIndex = '20';
                  }}
                >
                  {/* Card border glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{
                         borderRadius: '48px',
                         background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.9), rgba(184, 134, 11, 0.6))',
                         filter: 'blur(16px)',
                         transform: 'scale(1.06)'
                       }}>
                  </div>
                  
                  {/* Card body */}
                  <div className="relative w-full h-full overflow-hidden"
                       style={{
                         borderRadius: '48px',
                         background: 'linear-gradient(135deg, #1a1a16 0%, #2d2d24 50%, #1a1a16 100%)',
                         boxShadow: '0 14px 55px rgba(0, 0, 0, 0.95), inset 0 1px 0 rgba(212, 175, 55, 0.4), 0 0 0 2.5px rgba(212, 175, 55, 0.9)'
                       }}>
                    {/* Card pattern overlay */}
                    <div className="absolute inset-0 opacity-15"
                         style={{
                           backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212, 175, 55, 0.22) 10px, rgba(212, 175, 55, 0.22) 20px)'
                         }}>
                    </div>
                    
                    {/* Card content */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                      <div className="text-6xl font-black tracking-[0.35em] text-[#d4af37] mb-5" style={{ fontFamily: 'Cinzel, serif', textShadow: '0 0 28px rgba(212, 175, 55, 1), 0 0 56px rgba(212, 175, 55, 0.5)' }}>
                        SR
                      </div>
                      <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mb-4"></div>
                      <div className="text-xs text-[#d4af37]/75 text-center uppercase tracking-[0.25em] font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                        Rare
                      </div>
                    </div>
                  </div>
                </div>

                {/* SSR Card - Top layer (leftmost, rotated left) */}
                <div 
                  className="absolute group cursor-pointer"
                  style={{
                    width: '200px',
                    height: '290px',
                    left: '0px',
                    top: '10px',
                    transform: 'rotate(-10deg)',
                    transition: 'all 0.3s ease',
                    zIndex: 30,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(-10deg) translateY(-12px) scale(1.04)';
                    e.currentTarget.style.zIndex = '40';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'rotate(-10deg)';
                    e.currentTarget.style.zIndex = '30';
                  }}
                >
                  {/* Card border glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                       style={{
                         borderRadius: '48px',
                         background: 'linear-gradient(135deg, rgba(244, 211, 94, 1), rgba(255, 215, 0, 0.7))',
                         filter: 'blur(16px)',
                         transform: 'scale(1.06)'
                       }}>
                  </div>
                  
                  {/* Card body */}
                  <div className="relative w-full h-full overflow-hidden"
                       style={{
                         borderRadius: '48px',
                         background: 'linear-gradient(135deg, #1a1810 0%, #2d2516 50%, #1a1810 100%)',
                         boxShadow: '0 16px 60px rgba(0, 0, 0, 1), inset 0 1px 0 rgba(244, 211, 94, 0.5), 0 0 0 2.5px rgba(244, 211, 94, 1)'
                       }}>
                    {/* Card pattern overlay */}
                    <div className="absolute inset-0 opacity-15"
                         style={{
                           backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(244, 211, 94, 0.28) 10px, rgba(244, 211, 94, 0.28) 20px)'
                         }}>
                    </div>
                    
                    {/* Card content */}
                    <div className="relative z-10 h-full flex flex-col items-center justify-center p-6">
                      <div className="text-6xl font-black tracking-[0.35em] text-[#f4d35e] mb-5" style={{ fontFamily: 'Cinzel, serif', textShadow: '0 0 32px rgba(244, 211, 94, 1), 0 0 64px rgba(244, 211, 94, 0.6)' }}>
                        SSR
                      </div>
                      <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#f4d35e] to-transparent mb-4"></div>
                      <div className="text-xs text-[#f4d35e]/75 text-center uppercase tracking-[0.25em] font-semibold" style={{ fontFamily: 'Cinzel, serif' }}>
                        Legendary
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Encrypted Pipeline card - shifted right */}
            <div className="mt-16 mr-8 w-fit p-6 transition-all hover:scale-[1.02] lg:ml-80 lg:mr-0">
              <div className="relative">
                <p className="mb-6 text-center text-base font-bold uppercase tracking-[0.35em] text-[#8ec5b0]/80" style={{ fontFamily: 'Cinzel, serif' }}>
                  ⚙ Encrypted Pipeline ⚙
                </p>
                <ul className="space-y-5 text-lg text-[#fffff0]/90" style={{ fontFamily: 'Playfair Display, serif' }}>
                  <li className="flex items-start gap-4">
                    <span className="mt-2 h-3 w-3 flex-shrink-0 bg-[#f4d35e] shadow-[0_0_15px_rgba(244,211,94,1),0_0_30px_rgba(244,211,94,0.6)]" style={{ borderRadius: '50%' }}></span>
                    <span>Draw hits CipherLoot contract</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-2 h-3 w-3 flex-shrink-0 bg-[#c5e3d8] shadow-[0_0_15px_rgba(197,227,216,1),0_0_30px_rgba(197,227,216,0.6)]" style={{ borderRadius: '50%' }}></span>
                    <span>Random roll under FHE</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-2 h-3 w-3 flex-shrink-0 bg-[#8ec5b0] shadow-[0_0_15px_rgba(142,197,176,1),0_0_30px_rgba(142,197,176,0.6)]" style={{ borderRadius: '50%' }}></span>
                    <span>Ciphertexts secured per wallet</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-2 h-3 w-3 flex-shrink-0 bg-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,1),0_0_30px_rgba(212,175,55,0.6)]" style={{ borderRadius: '50%' }}></span>
                    <span>Decrypt via EIP-712 signature</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
