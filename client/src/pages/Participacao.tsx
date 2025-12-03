import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Users2 } from "lucide-react";
import { toast } from "sonner";

export default function Participacao() {
  const [eventoId, setEventoId] = useState("");
  const [pessoaId, setPessoaId] = useState("");
  
  const { data: eventos = [] } = trpc.eventos.list.useQuery();
  const { data: pessoas = [] } = trpc.pessoas.list.useQuery();
  const { data: participacoes = [], refetch } = trpc.participacao.byEvento.useQuery(
    { eventoId: parseInt(eventoId) },
    { enabled: !!eventoId }
  );
  
  const createMutation = trpc.participacao.create.useMutation({
    onSuccess: () => {
      toast.success("Participação registrada com sucesso!");
      setPessoaId("");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteMutation = trpc.participacao.delete.useMutation({
    onSuccess: () => {
      toast.success("Participação removida com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao remover: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventoId || !pessoaId) {
      toast.error("Evento e pessoa são obrigatórios");
      return;
    }
    createMutation.mutate({
      eventoId: parseInt(eventoId),
      pessoaId: parseInt(pessoaId),
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover esta participação?")) {
      deleteMutation.mutate({ id });
    }
  };

  const selectedEvento = eventos.find(e => e.id === parseInt(eventoId));

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Registro de Participação</h1>
        <p className="text-gray-600">Marque quem participou de cada evento</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Plus className="h-5 w-5" />
              Registrar Participação
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Evento *</label>
                <select
                  value={eventoId}
                  onChange={(e) => setEventoId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um evento</option>
                  {eventos.map((evento) => (
                    <option key={evento.id} value={evento.id}>
                      {evento.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pessoa *</label>
                <select
                  value={pessoaId}
                  onChange={(e) => setPessoaId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione uma pessoa</option>
                  {pessoas.map((pessoa) => (
                    <option key={pessoa.id} value={pessoa.id}>
                      {pessoa.nome}
                    </option>
                  ))}
                </select>
              </div>

              <Button 
                type="submit" 
                disabled={createMutation.isPending || !eventoId || !pessoaId} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Registrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {eventoId && (
          <Card className="lg:col-span-2 shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Users2 className="h-5 w-5" />
                Participantes - {selectedEvento?.nome} ({participacoes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {participacoes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Nenhum participante registrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {participacoes.map((pessoa) => (
                    <div 
                      key={pessoa.id} 
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">{pessoa.nome}</p>
                        {pessoa.classe && (
                          <p className="text-sm text-blue-600 font-medium mt-1">{pessoa.classe}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(pessoa.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
