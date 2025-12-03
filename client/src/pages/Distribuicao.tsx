import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Share2 } from "lucide-react";
import { toast } from "sonner";

export default function Distribuicao() {
  const [eventoId, setEventoId] = useState("");
  const [pessoaId, setPessoaId] = useState("");
  const [dropId, setDropId] = useState("");
  const [observacoes, setObservacoes] = useState("");
  
  const { data: eventos = [] } = trpc.eventos.list.useQuery();
  const { data: pessoas = [] } = trpc.pessoas.list.useQuery();
  const { data: drops = [] } = trpc.drops.list.useQuery();
  const { data: participantes = [] } = trpc.participacao.byEvento.useQuery(
    { eventoId: parseInt(eventoId) },
    { enabled: !!eventoId }
  );
  const { data: dropsDisponiveisDoEvento = [] } = trpc.drops.byEvento.useQuery(
    { eventoId: parseInt(eventoId) },
    { enabled: !!eventoId }
  );
  const { data: distribuicoes = [], refetch } = trpc.distribuicao.list.useQuery();
  
  const createMutation = trpc.distribuicao.create.useMutation({
    onSuccess: () => {
      toast.success("Drop distribuído com sucesso!");
      setEventoId("");
      setPessoaId("");
      setDropId("");
      setObservacoes("");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteMutation = trpc.distribuicao.delete.useMutation({
    onSuccess: () => {
      toast.success("Distribuição removida com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao remover: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventoId || !pessoaId || !dropId) {
      toast.error("Evento, pessoa e drop são obrigatórios");
      return;
    }
    createMutation.mutate({
      eventoId: parseInt(eventoId),
      pessoaId: parseInt(pessoaId),
      dropId: parseInt(dropId),
      observacoes,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover esta distribuição?")) {
      deleteMutation.mutate({ id });
    }
  };

  const filteredDrops = dropsDisponiveisDoEvento.filter(d => d.status === "Disponível");

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Distribuição de Drops</h1>
        <p className="text-gray-600">Distribua os drops para os participantes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Plus className="h-5 w-5" />
              Distribuir Drop
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Evento *</label>
                <select
                  value={eventoId}
                  onChange={(e) => {
                    setEventoId(e.target.value);
                    setPessoaId("");
                    setDropId("");
                  }}
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

              {eventoId && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pessoa (Participantes) *</label>
                    <select
                      value={pessoaId}
                      onChange={(e) => setPessoaId(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione uma pessoa</option>
                      {participantes.map((pessoa) => (
                        <option key={pessoa.id} value={pessoa.id}>
                          {pessoa.nome}
                        </option>
                      ))}
                    </select>
                    {participantes.length === 0 && (
                      <p className="text-sm text-red-500 mt-1">Nenhum participante registrado para este evento</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Drop Disponível *</label>
                    <select
                      value={dropId}
                      onChange={(e) => setDropId(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione um drop</option>
                      {filteredDrops.map((drop) => (
                        <option key={drop.id} value={drop.id}>
                          {drop.nome} {drop.tipo ? `(${drop.tipo})` : ""}
                        </option>
                      ))}
                    </select>
                    {filteredDrops.length === 0 && (
                      <p className="text-sm text-red-500 mt-1">Nenhum drop disponível para este evento</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Observações</label>
                    <input
                      type="text"
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Ex: Sorteio, DKP, etc"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                disabled={createMutation.isPending || !eventoId} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Distribuindo...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Distribuir
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Share2 className="h-5 w-5" />
              Histórico de Distribuições ({distribuicoes.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {distribuicoes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhuma distribuição realizada ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {distribuicoes.map((dist) => {
                  const evento = eventos.find(e => e.id === dist.eventoId);
                  const pessoa = pessoas.find(p => p.id === dist.pessoaId);
                  const drop = drops.find(d => d.id === dist.dropId);
                  return (
                    <div 
                      key={dist.id} 
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg">
                          {drop?.nome} → {pessoa?.nome}
                        </p>
                        <p className="text-sm text-blue-600 font-medium mt-1">{evento?.nome}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(dist.dataEscolha).toLocaleString('pt-BR')}
                        </p>
                        {dist.observacoes && (
                          <p className="text-sm text-gray-600 mt-2">{dist.observacoes}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(dist.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
