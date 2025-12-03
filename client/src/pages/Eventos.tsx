import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function Eventos() {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");
  
  const { data: eventos = [], refetch } = trpc.eventos.list.useQuery();
  
  const createMutation = trpc.eventos.create.useMutation({
    onSuccess: () => {
      toast.success("Evento cadastrado com sucesso!");
      setNome("");
      setData("");
      setDescricao("");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteMutation = trpc.eventos.delete.useMutation({
    onSuccess: () => {
      toast.success("Evento removido com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao remover: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !data) {
      toast.error("Nome e data são obrigatórios");
      return;
    }
    createMutation.mutate({ nome, data: new Date(data), descricao });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover este evento?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cadastro de Eventos</h1>
        <p className="text-gray-600">Registre os eventos e raids do seu grupo</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Plus className="h-5 w-5" />
              Novo Evento
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Evento *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Raid 1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Data *</label>
                <input
                  type="datetime-local"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Primeira raid da semana"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
            <CardTitle className="text-blue-900">Eventos Cadastrados ({eventos.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {eventos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhum evento cadastrado ainda</p>
              </div>
            ) : (
              <div className="space-y-3">
                {eventos.map((evento) => (
                  <div 
                    key={evento.id} 
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">{evento.nome}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(evento.data).toLocaleString('pt-BR')}
                      </div>
                      {evento.descricao && (
                        <p className="text-sm text-gray-600 mt-2">{evento.descricao}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(evento.id)}
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
      </div>
    </div>
  );
}
