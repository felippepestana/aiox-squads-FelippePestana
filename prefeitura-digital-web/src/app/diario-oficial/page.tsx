const cadernos = [
  { caderno: "Poder Executivo", atos: "Leis, decretos, portarias, resoluções, instruções normativas" },
  { caderno: "Licitações e Contratos", atos: "Editais, avisos, extratos de contrato/aditivo/ARP, dispensas, homologações" },
  { caderno: "Pessoal", atos: "Nomeação, exoneração, posse, aposentadoria, designação de FG" },
  { caderno: "Diversos", atos: "Avisos, balanços, convocações" },
];

export default function DiarioOficialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-fg">Diário Oficial</h1>
        <p className="mt-1 max-w-3xl text-gray-600">
          Elaboração de atos por tipo e caderno a partir de informações mínimas, com metadados para a
          biblioteca de consulta. Fundamentos: CF art. 37, LAI, Lei 14.129/2021 e assinatura ICP-Brasil
          (Lei 14.063/2020). Inspiração: SIGPub/AROM.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-2">Caderno</th>
              <th className="px-4 py-2">Tipos de ato</th>
            </tr>
          </thead>
          <tbody>
            {cadernos.map((c, i) => (
              <tr key={i} className="border-t border-gray-100">
                <td className="px-4 py-2 font-medium">{c.caderno}</td>
                <td className="px-4 py-2 text-gray-600">{c.atos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Roadmap: editor de atos com geração assistida, assinatura digital ICP-Brasil, publicação no PNCP
        quando exigível e biblioteca eletrônica pesquisável com verificação de autenticidade.
      </div>
    </div>
  );
}
