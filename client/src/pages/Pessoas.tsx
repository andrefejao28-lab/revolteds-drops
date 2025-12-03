import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Pessoas() {
  const [nome, setNome] = useState("");
  const [classe, setClasse] = useState("");
  const [observacoes, setObservacoes] = useState("");
  
  const { data: pessoas = [], refetch } = trpc.pessoas.list.useQuery();
  
  const createMutation = trpc.pessoas.create.useMutation({
    onSuccess: () => {
      toast.success("Pessoa cadastrada com sucesso!");
      setNome("");
      setClasse("");
      setObservacoes("");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  const deleteMutation = trpc.pessoas.delete.useMutation({
    onSuccess: () => {
      toast.success("Pessoa removida com sucesso!");
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao remover: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    createMutation.mutate({ nome, classe, observacoes });
  };

  const handleDelete = (id: number) => {
    if (confirm("Tem certeza que deseja remover esta pessoa?")) {
      deleteMutation.mutate({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cadastro de Pessoas</h1>
        <p className="text-gray-600">Gerencie os participantes dos seus eventos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Plus className="h-5 w-5" />
              Nova Pessoa
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome / Nick *</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Andreh"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Classe</label>
                <input
                  type="text"
                  value={classe}
                  onChange={(e) => setClasse(e.target.value)}
                  placeholder="Ex: Warrior"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Observações</label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Notas adicionais..."
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
            <CardTitle className="text-blue-900">Pessoas Cadastradas ({pessoas.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {pessoas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Nenhuma pessoa cadastrada ainda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pessoas.map((pessoa) => (
                  <div 
                    key={pessoa.id} 
                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50 flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">{pessoa.nome}</p>
                      {pessoa.classe && (
                        <p className="text-sm text-blue-600 font-medium mt-1">{pessoa.classe}</p>
                      )}
                      {pessoa.observacoes && (
                        <p className="text-sm text-gray-600 mt-2">{pessoa.observacoes}</p>
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
      </div>
    </div>
  );
}
