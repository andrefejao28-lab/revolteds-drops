import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Gift } from "lucide-react";
import { toast } from "sonner";

export default function Drops() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [eventoId, setEventoId] = useState("");
  
  const { data: drops = [], refetch } = trpc.drops.list.useQuery();
  const { data: eventos = [] } = trpc.eventos.list.useQuery();
  
  const createMutation = trpc.drops.create.useMutation({
    onSuccess: () => {
      toast.success("Item cadastrado com sucesso!");
      setNome("");
      setTipo("");
      setEventoId("");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteMutation = trpc.drops.delete.useMutation({
    onSuccess: () => {
      toast.success("Drop removido com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao remover: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !eventoId) {
      toast.error("Nome e evento são obrigatórios");
      return;
    }
    createMutation.mutate({ nome, tipo, eventoId: parseInt(eventoId) });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este drop?")) {
      deleteMutation.mutate({ id });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível":
        return "bg-green-100 text-green-800";
      case "Escolhido":
        return "bg-yellow-100 text-yellow-800";
      case "Entregue":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cadastro de Drops</h1>
        <p className="text-gray-600">Registre os itens dropados em seus eventos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Plus className="h-5 w-5" />
              Novo Drop
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Item *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Espada Lendária"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo / Raridade</label>
                <input
                  type="text"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  placeholder="Ex: Lendário"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
              <Button 
                type="submit" 
                disabled={createMutation.isPending} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Cadastrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-blue-900">Drops Cadastrados ({drops.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {drops.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum drop cadastrado ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {drops.map((drop) => {
                  const evento = eventos.find(e => e.id === drop.eventoId);
                  return (
                    <div 
                      key={drop.id} 
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50 flex justify-between items-start"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Gift className="h-4 w-4 text-blue-600" />
                          <p className="font-bold text-gray-900 text-lg">{drop.nome}</p>
                        </div>
                        {drop.tipo && (
                          <p className="text-sm text-blue-600 font-medium mb-2">{drop.tipo}</p>
                        )}
                        <p className="text-sm text-gray-600 mb-2">Evento: {evento?.nome}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(drop.status)}`}>
                          {drop.status}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(drop.id)}
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
