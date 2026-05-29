import TriageForm from "@/components/triage-form";

export const metadata = {
  title: "Triagem Médica — Legendários TOP",
  description: "Preencha seu formulário de triagem médica para participar do evento",
};

export default function TriagemPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
      <div className="max-w-lg mx-auto mb-6">
        <h1 className="text-2xl font-bold text-green-800 text-center">Triagem Médica</h1>
        <p className="text-green-600 text-center text-sm mt-1">Legendários TOP — Preencha com atenção</p>
      </div>
      <TriageForm />
    </main>
  );
}
