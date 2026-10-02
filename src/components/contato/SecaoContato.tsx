import { contato, mensagemContato, secoes, whatsappCom } from "@/config/site";
import { Botao, IconeBalao, IconeExterno } from "@/components/botao/Botao";
import { Rasgo } from "@/components/papel/Rasgo";
import { TituloSecao } from "@/components/titulo/TituloSecao";
import { DecalqzinhoAdesivo } from "@/components/marca/Decalqzinho";
import { BrilhoPixel, CursorSeta, EstrelaLima, Tiques, TuboAmarelo } from "@/components/colagem/Objetos";
import s from "./SecaoContato.module.css";

/**
 * Contato: o papel acaba num rasgo e o breu da abertura volta. Chamada
 * grande e os dois canais reais (config/site.ts), cada um numa telinha com
 * o endereço aceso em fósforo verde — a TV da abertura em miniatura.
 */
export function SecaoContato() {
  return (
    <section id={secoes.contato.id} className={s.secao} aria-labelledby="contato-titulo">
      <Rasgo invertido />

      <div className={s.conteudo}>
        <div className={s.chamada}>
          <p className={s.selo}>Contato</p>
          <TituloSecao id="contato-titulo" linhas={["Bora trocar", "uma ideia?"]} tom="escuro" marcador="lima" tamanho="medio" />
          <p className={s.intro}>
            Conta o que você tem em mente — site, sistema, vídeo, automação.
            Manda um oi por onde for mais fácil.
          </p>
          <DecalqzinhoAdesivo className={s.decalq} prefixo="decalq-contato" />
        </div>

        <ul className={s.canais}>
          <li className={s.canal} data-canal="whatsapp">
            <p className={s.canalNome}>WhatsApp</p>
            <p className={s.tela}>
              <span className={s.telaTexto}>{contato.whatsappExibido}</span>
            </p>
            <Botao href={whatsappCom(mensagemContato)} variante="principal" externo icone={<IconeBalao />}>
              Chamar no WhatsApp
            </Botao>
          </li>
          <li className={s.canal} data-canal="instagram">
            <p className={s.canalNome}>Instagram</p>
            <p className={s.tela}>
              <span className={s.telaTexto}>{contato.instagramExibido}</span>
            </p>
            <Botao href={contato.instagram} variante="contorno" externo icone={<IconeExterno />}>
              Abrir o Instagram
            </Botao>
          </li>
        </ul>
      </div>

      {/* colagem da abertura, parada: o contato fecha a composição */}
      <div className={s.colagem} aria-hidden="true">
        <EstrelaLima className={s.estrela} />
        <TuboAmarelo className={s.tubo} />
        <CursorSeta className={s.cursor} />
        <BrilhoPixel className={s.brilho} />
        <Tiques className={s.tiques} cor="var(--lima)" />
      </div>
    </section>
  );
}
