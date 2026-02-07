import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

export type TipoAreaExposicao =
  | 'gondola'
  | 'terminal_gondola'
  | 'freezer_vertical'
  | 'freezer_horizontal'
  | 'banca_frutas';

export interface MedidasAreaExposicao {
  tipo: TipoAreaExposicao;
  // Gôndola e Terminal
  largura?: number;
  profundidade?: number;
  alturaEntrePrateleiras?: number;
  // Freezer Horizontal e Banca
  comprimento?: number;
  // Freezer Horizontal e Banca
  larguraHorizontal?: number;
  profundidadeHorizontal?: number;
}

interface ConfiguracaoAreaExposicaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (medidas: MedidasAreaExposicao) => void;
  translations: {
    titulo: string;
    descricao: string;
    tipoExposicao: string;
    gondola: string;
    terminalGondola: string;
    freezerVertical: string;
    freezerHorizontal: string;
    bancaFrutas: string;
    largura: string;
    profundidade: string;
    alturaEntrePrateleiras: string;
    comprimento: string;
    larguraHorizontal: string;
    profundidadeHorizontal: string;
    cm: string;
    cancelar: string;
    confirmar: string;
    erroValidacao: string;
    campoObrigatorio: string;
  };
}

export const ConfiguracaoAreaExposicao: React.FC<ConfiguracaoAreaExposicaoProps> = ({
  isOpen,
  onClose,
  onConfirm,
  translations,
}) => {
  const [tipo, setTipo] = useState<TipoAreaExposicao>('gondola');
  const [medidas, setMedidas] = useState<MedidasAreaExposicao>({
    tipo: 'gondola',
    largura: 280,
    profundidade: 40,
    alturaEntrePrateleiras: 60,
  });
  const [erros, setErros] = useState<Record<string, string>>({});

  const handleTipoChange = (novoTipo: TipoAreaExposicao) => {
    setTipo(novoTipo);
    setErros({});

    // Resetar medidas baseado no tipo
    const novasMedidas: MedidasAreaExposicao = { tipo: novoTipo };

    switch (novoTipo) {
      case 'gondola':
      case 'terminal_gondola':
      case 'freezer_vertical':
        novasMedidas.largura = 280;
        novasMedidas.profundidade = 40;
        novasMedidas.alturaEntrePrateleiras = 60;
        break;
      case 'freezer_horizontal':
      case 'banca_frutas':
        novasMedidas.comprimento = 300;
        novasMedidas.larguraHorizontal = 150;
        novasMedidas.profundidadeHorizontal = 80;
        break;
    }

    setMedidas(novasMedidas);
  };

  const handleMedidaChange = (campo: string, valor: string) => {
    const numeroValor = parseFloat(valor) || 0;
    setMedidas((prev) => ({
      ...prev,
      [campo]: numeroValor,
    }));

    // Limpar erro do campo quando o usuário começa a digitar
    if (erros[campo]) {
      setErros((prev) => {
        const novoErros = { ...prev };
        delete novoErros[campo];
        return novoErros;
      });
    }
  };

  const validarMedidas = (): boolean => {
    const novosErros: Record<string, string> = {};

    if (tipo === 'gondola' || tipo === 'terminal_gondola' || tipo === 'freezer_vertical') {
      if (!medidas.largura || medidas.largura <= 0) {
        novosErros.largura = translations.campoObrigatorio;
      }
      if (!medidas.profundidade || medidas.profundidade <= 0) {
        novosErros.profundidade = translations.campoObrigatorio;
      }
      if (!medidas.alturaEntrePrateleiras || medidas.alturaEntrePrateleiras <= 0) {
        novosErros.alturaEntrePrateleiras = translations.campoObrigatorio;
      }
    } else if (tipo === 'freezer_horizontal' || tipo === 'banca_frutas') {
      if (!medidas.comprimento || medidas.comprimento <= 0) {
        novosErros.comprimento = translations.campoObrigatorio;
      }
      if (!medidas.larguraHorizontal || medidas.larguraHorizontal <= 0) {
        novosErros.larguraHorizontal = translations.campoObrigatorio;
      }
      if (!medidas.profundidadeHorizontal || medidas.profundidadeHorizontal <= 0) {
        novosErros.profundidadeHorizontal = translations.campoObrigatorio;
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleConfirm = () => {
    if (validarMedidas()) {
      onConfirm(medidas);
      onClose();
    }
  };

  const renderCamposMedidas = () => {
    switch (tipo) {
      case 'gondola':
      case 'terminal_gondola':
      case 'freezer_vertical':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="largura" className="text-sm font-medium">
                {translations.largura} ({translations.cm})
              </Label>
              <Input
                id="largura"
                type="number"
                min="1"
                value={medidas.largura || ''}
                onChange={(e) => handleMedidaChange('largura', e.target.value)}
                className={erros.largura ? 'border-red-500' : ''}
              />
              {erros.largura && (
                <p className="text-red-500 text-xs mt-1">{erros.largura}</p>
              )}
            </div>

            <div>
              <Label htmlFor="profundidade" className="text-sm font-medium">
                {translations.profundidade} ({translations.cm})
              </Label>
              <Input
                id="profundidade"
                type="number"
                min="1"
                value={medidas.profundidade || ''}
                onChange={(e) => handleMedidaChange('profundidade', e.target.value)}
                className={erros.profundidade ? 'border-red-500' : ''}
              />
              {erros.profundidade && (
                <p className="text-red-500 text-xs mt-1">{erros.profundidade}</p>
              )}
            </div>

            <div>
              <Label htmlFor="alturaEntrePrateleiras" className="text-sm font-medium">
                {translations.alturaEntrePrateleiras} ({translations.cm})
              </Label>
              <Input
                id="alturaEntrePrateleiras"
                type="number"
                min="1"
                value={medidas.alturaEntrePrateleiras || ''}
                onChange={(e) => handleMedidaChange('alturaEntrePrateleiras', e.target.value)}
                className={erros.alturaEntrePrateleiras ? 'border-red-500' : ''}
              />
              {erros.alturaEntrePrateleiras && (
                <p className="text-red-500 text-xs mt-1">{erros.alturaEntrePrateleiras}</p>
              )}
            </div>
          </div>
        );

      case 'freezer_horizontal':
      case 'banca_frutas':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="comprimento" className="text-sm font-medium">
                {translations.comprimento} ({translations.cm})
              </Label>
              <Input
                id="comprimento"
                type="number"
                min="1"
                value={medidas.comprimento || ''}
                onChange={(e) => handleMedidaChange('comprimento', e.target.value)}
                className={erros.comprimento ? 'border-red-500' : ''}
              />
              {erros.comprimento && (
                <p className="text-red-500 text-xs mt-1">{erros.comprimento}</p>
              )}
            </div>

            <div>
              <Label htmlFor="larguraHorizontal" className="text-sm font-medium">
                {translations.larguraHorizontal} ({translations.cm})
              </Label>
              <Input
                id="larguraHorizontal"
                type="number"
                min="1"
                value={medidas.larguraHorizontal || ''}
                onChange={(e) => handleMedidaChange('larguraHorizontal', e.target.value)}
                className={erros.larguraHorizontal ? 'border-red-500' : ''}
              />
              {erros.larguraHorizontal && (
                <p className="text-red-500 text-xs mt-1">{erros.larguraHorizontal}</p>
              )}
            </div>

            <div>
              <Label htmlFor="profundidadeHorizontal" className="text-sm font-medium">
                {translations.profundidadeHorizontal} ({translations.cm})
              </Label>
              <Input
                id="profundidadeHorizontal"
                type="number"
                min="1"
                value={medidas.profundidadeHorizontal || ''}
                onChange={(e) => handleMedidaChange('profundidadeHorizontal', e.target.value)}
                className={erros.profundidadeHorizontal ? 'border-red-500' : ''}
              />
              {erros.profundidadeHorizontal && (
                <p className="text-red-500 text-xs mt-1">{erros.profundidadeHorizontal}</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{translations.titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-gray-600">{translations.descricao}</p>

          {/* Seleção de Tipo */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              {translations.tipoExposicao}
            </Label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: 'gondola' as const, label: translations.gondola },
                { value: 'terminal_gondola' as const, label: translations.terminalGondola },
                { value: 'freezer_vertical' as const, label: translations.freezerVertical },
                { value: 'freezer_horizontal' as const, label: translations.freezerHorizontal },
                { value: 'banca_frutas' as const, label: translations.bancaFrutas },
              ].map((opcao) => (
                <button
                  key={opcao.value}
                  onClick={() => handleTipoChange(opcao.value)}
                  className={`p-3 text-left rounded-lg border-2 transition-colors ${
                    tipo === opcao.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">{opcao.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Campos de Medidas */}
          <div className="border-t pt-4">
            <Label className="text-sm font-medium mb-3 block">Medidas</Label>
            {renderCamposMedidas()}
          </div>

          {/* Alerta de Validação */}
          {Object.keys(erros).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{translations.erroValidacao}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {translations.cancelar}
          </Button>
          <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
            {translations.confirmar}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
