import qrcode from "qrcode-generator";

/**
 * QR code como um caminho SVG de quadradinhos (a mesma linguagem de pixel
 * do site). Gerado no build, em componente de servidor: a biblioteca não
 * vai para o navegador. Correção de erro "M" e 4 módulos de margem branca
 * (zona de silêncio), como o padrão pede para a leitura funcionar.
 */
export function caminhoQR(texto: string) {
  const qr = qrcode(0, "M");
  qr.addData(texto);
  qr.make();
  const n = qr.getModuleCount();
  const margem = 4;
  let d = "";
  for (let y = 0; y < n; y++) {
    let x = 0;
    while (x < n) {
      if (!qr.isDark(y, x)) {
        x++;
        continue;
      }
      let fim = x;
      while (fim < n && qr.isDark(y, fim)) fim++;
      d += `M${x + margem} ${y + margem}h${fim - x}v1h${x - fim}z`;
      x = fim;
    }
  }
  return { d, lado: n + margem * 2 };
}
