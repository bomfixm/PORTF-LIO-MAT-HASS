/**
 * Filtros SVG compartilhados pelos objetos da colagem. Renderizado uma vez
 * por página; cada objeto referencia os ids (`cg-*`). As medidas valem no
 * espaço do viewBox de quem usa — os objetos são desenhados perto de
 * 1 unidade ≈ 1 px no desktop, então o grão fica parecido em todos.
 */
export function FiltrosColagem() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        {/* Grão de papel: pontinhos escuros + fibras claras, só dentro da forma. */}
        <filter id="cg-papel" x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="2" result="r1" />
          <feColorMatrix in="r1" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .9 -.3" result="escuro" />
          <feComposite in="escuro" in2="SourceAlpha" operator="in" result="grao-escuro" />
          <feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="9" result="r2" />
          <feColorMatrix in="r2" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.2 -1.5" result="claro" />
          <feComposite in="claro" in2="SourceAlpha" operator="in" result="grao-claro" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="grao-escuro" />
            <feMergeNode in="grao-claro" />
          </feMerge>
        </filter>

        {/* Papel amassado: relevo de turbulência iluminado de cima à esquerda. */}
        <filter id="cg-amassado" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="turbulence" baseFrequency=".03" numOctaves="4" seed="6" result="relevo" />
          <feDiffuseLighting in="relevo" surfaceScale="2.6" diffuseConstant="1.12" lightingColor="#fff" result="luz">
            <feDistantLight azimuth="225" elevation="52" />
          </feDiffuseLighting>
          <feComposite in="luz" in2="SourceGraphic" operator="arithmetic" k1="1.08" k2="0" k3="0" k4="0" result="sombreado" />
          <feComposite in="sombreado" in2="SourceAlpha" operator="in" />
        </filter>

        {/* Giz / lápis de cera: traço tremido com falhas. */}
        <filter id="cg-giz" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="5" result="r" />
          <feDisplacementMap in="SourceGraphic" in2="r" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="tremido" />
          <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="8" result="r2" />
          <feColorMatrix in="r2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.2 2.6" result="falhas" />
          <feComposite in="tremido" in2="falhas" operator="in" />
        </filter>

        {/* Impressão gasta: falhas finas sem tremer o contorno. */}
        <filter id="cg-impresso" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="13" result="r" />
          <feColorMatrix in="r" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 1.95" result="falhas" />
          <feComposite in="SourceGraphic" in2="falhas" operator="in" />
        </filter>

        {/* Adesivo recortado: borda branca arredondada + sombra curta. */}
        <filter id="cg-adesivo" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="dilate" radius="9" result="d" />
          <feGaussianBlur in="d" stdDeviation="3" result="db" />
          <feComponentTransfer in="db" result="recorte">
            <feFuncA type="linear" slope="5" intercept="-1.6" />
          </feComponentTransfer>
          <feFlood floodColor="#f3efe6" result="branco" />
          <feComposite in="branco" in2="recorte" operator="in" result="papel" />
          <feGaussianBlur in="recorte" stdDeviation="4" result="sb" />
          <feOffset in="sb" dx="3" dy="7" result="so" />
          <feFlood floodColor="#000" floodOpacity=".5" />
          <feComposite in2="so" operator="in" result="sombra" />
          <feMerge>
            <feMergeNode in="sombra" />
            <feMergeNode in="papel" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="cg-desfoque" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
    </svg>
  );
}
