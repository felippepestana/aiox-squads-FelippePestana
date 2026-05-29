"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronDown } from "lucide-react";

const TERMO_TEXT = `TERMO DE RESPONSABILIDADE E CONSENTIMENTO — LEGENDÁRIOS TOP

Eu, participante do Evento LEGENDÁRIOS TOP ("Evento"), declaro estar ciente e de acordo com os seguintes termos:

1. APTIDÃO FÍSICA
Declaro que estou em condições físicas adequadas para participar do Evento, tendo sido informado sobre o nível de esforço físico exigido. Afirmo que as informações de saúde prestadas na ficha de triagem são verdadeiras e completas.

2. RISCOS
Reconheço que o Evento envolve atividades físicas em ambiente externo, incluindo caminhadas em terreno irregular. Estou ciente dos riscos naturais associados e assumo integral responsabilidade por eventuais acidentes decorrentes de minha própria conduta.

3. EXAMES MÉDICOS
Comprometo-me a apresentar todos os exames exigidos conforme minha classificação de risco, e a seguir as orientações da equipe médica (Hakuna) durante o Evento.

4. IMAGEM E VOZ
Autorizo a captação e utilização de minha imagem e voz para fins de registro, divulgação e memória do Evento, sem direito a remuneração.

5. EQUIPAMENTOS E PERTENCES
Responsabilizo-me pela guarda de meus pertences pessoais durante o Evento.

6. OBEDIÊNCIA ÀS REGRAS
Comprometo-me a seguir todas as regras e orientações da organização do Evento, incluindo as instruções da equipe de saúde.

7. VERACIDADE DAS INFORMAÇÕES
Declaro que todas as informações prestadas neste cadastro são verdadeiras, e estou ciente de que dados falsos podem comprometer minha segurança e a dos demais participantes.

Ao confirmar este termo, declaro ter lido, compreendido e aceito todas as condições acima, de forma livre e consciente.`;

interface Props {
  participantName: string;
  onAccept: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function TermoModal({ participantName, onAccept, onCancel, loading }: Props) {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  function onScroll() {
    const el = textRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40;
    if (atBottom) setScrolledToBottom(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[92vh] shadow-2xl">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b">
          <h2 className="text-lg font-bold">Termo de Responsabilidade</h2>
          <p className="text-sm text-muted-foreground">{participantName}</p>
        </div>

        {/* Scrollable term */}
        <div
          ref={textRef}
          onScroll={onScroll}
          className="flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-gray-700 whitespace-pre-line"
        >
          {TERMO_TEXT}
          <div className="h-8" />
        </div>

        {/* Scroll indicator */}
        {!scrolledToBottom && (
          <div className="flex items-center justify-center gap-1 py-1 text-xs text-muted-foreground bg-gray-50 border-t">
            <ChevronDown className="w-3 h-3 animate-bounce" /> Role até o fim para aceitar
          </div>
        )}

        {/* Actions */}
        <div className="px-5 py-4 border-t space-y-2 bg-white">
          {scrolledToBottom && (
            <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-green-600" />
              Li e compreendi todo o conteúdo do termo acima.
            </div>
          )}
          <Button
            className="w-full bg-green-700 hover:bg-green-800"
            disabled={!scrolledToBottom || loading}
            onClick={onAccept}
          >
            {loading ? "Registrando..." : "Aceito o Termo e Confirmo Presença"}
          </Button>
          <Button variant="outline" className="w-full" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}
