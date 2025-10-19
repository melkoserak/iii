// src/components/simulator/steps/Step11.tsx
"use client";
import React, { useEffect, useState } from 'react';
import { useSimulatorStore } from '@/stores/useSimulatorStore';
import { useCoverageStore, type ApiCoverage } from '@/stores/useCoverageStore'; // Importe o tipo
import { submitProposal } from '@/services/apiService';
import { track } from '@/lib/tracking';
import { Loader2, AlertTriangle, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Tipos para estruturar os dados do mapa de produtos
interface MappedCoverage extends ApiCoverage {
    capitalContratado: number;
    premioCalculado: number;
}
interface MappedProduct {
    idProduto: number;
    descricao: string;
    coberturas: MappedCoverage[];
}


export const Step11 = () => {
    const { formData } = useSimulatorStore();
    const coverageState = useCoverageStore();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [proposalNumber, setProposalNumber] = useState<string | null>(null);

    useEffect(() => {
        track('step_view', { step: 11, step_name: 'Envio da Proposta' });

        const handleFinalSubmit = async () => {
            // Usa o tipo MappedProduct para evitar o 'any'
            const productMap = new Map<string, MappedProduct>();
            coverageState.coverages.forEach(coverage => {
                if (coverage.isActive) {
                    const productId = coverage.originalData.productId;
                    
                    if (productId !== undefined) {
                        const productIdStr = String(productId);
                        if (!productMap.has(productIdStr)) {
                            productMap.set(productIdStr, {
                                idProduto: productId,
                                descricao: `Produto ${productId}`,
                                coberturas: []
                            });
                        }
                        const product = productMap.get(productIdStr);
                        if (product) {
                             product.coberturas.push({
                                ...coverage.originalData,
                                capitalContratado: coverage.currentCapital,
                                premioCalculado: coverageState.getCalculatedPremium(coverage)
                            });
                        }
                    }
                }
            });

            const finalSimulationConfig = {
                VL_TOTAL: coverageState.getTotalPremium(),
                produtos: Array.from(productMap.values())
            };

            const payload: Record<string, string> = {
                mag_nome_completo: formData.fullName,
                mag_cpf: formData.cpf,
                mag_email: formData.email,
                mag_celular: formData.phone,
                mag_estado: formData.state,
                mag_data_nascimento: formData.birthDate,
                mag_sexo: formData.gender,
                mag_renda: formData.income,
                mag_profissao_cbo: formData.profession,
                mag_cep: formData.zipCode,
                mag_logradouro: formData.street,
                mag_numero: formData.number,
                mag_complemento: formData.complement,
                mag_bairro: formData.neighborhood,
                mag_cidade: formData.city,
                mag_estado_civil: formData.maritalStatus,
                mag_tel_residencial: formData.homePhone,
                mag_rg_num: formData.rgNumber,
                mag_rg_orgao: formData.rgIssuer,
                mag_rg_data: formData.rgDate,
                mag_num_filhos: formData.childrenCount,
                mag_profissao_empresa: formData.company,
                mag_ppe: formData.isPPE,
                final_simulation_config: JSON.stringify(finalSimulationConfig),
                payment_pre_auth_code: formData.paymentPreAuthCode || '',
                reserved_proposal_number: formData.reservedProposalNumber || '',
                widget_answers: JSON.stringify(formData.dpsAnswers || {}),
            };
            
            formData.beneficiaries.forEach((ben, index) => {
                payload[`mag_ben[${index}][nome]`] = ben.fullName;
                payload[`mag_ben[${index}][nasc]`] = ben.birthDate;
                payload[`mag_ben[${index}][parentesco]`] = ben.relationship;
            });
            
            try {
                const result = await submitProposal(payload);
                if (result.proposal_number) {
                    setProposalNumber(result.proposal_number);
                    track('proposal_success', { proposal_number: result.proposal_number });
                } else {
                    throw new Error('A API não retornou um número de proposta.');
                }
            } catch (err) {
                const error = err as Error;
                setError(error.message || 'Ocorreu um erro desconhecido ao enviar a proposta.');
                track('proposal_error', { error_message: error.message });
            } finally {
                setIsLoading(false);
            }
        };

        handleFinalSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // O array vazio é intencional para executar apenas uma vez

    if (isLoading) {
        return (
            <div className="animate-fade-in text-center p-10">
                <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-medium text-foreground">A enviar a sua proposta...</h3>
                <p className="text-muted-foreground mt-2">Por favor, aguarde um momento.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="animate-fade-in text-center p-10 bg-destructive/10 border border-destructive rounded-lg">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="text-2xl font-medium text-destructive">Ocorreu um Erro</h3>
                <p className="text-muted-foreground mt-2 mb-6">{error}</p>
                <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
            </div>
        );
    }

    if (proposalNumber) {
        return (
            <div className="animate-fade-in text-center p-10">
                <PartyPopper className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-medium text-foreground">Proposta enviada com sucesso!</h3>
                <p className="text-muted-foreground mt-2">O número da sua proposta é:</p>
                <p className="text-3xl font-bold text-primary my-4">{proposalNumber}</p>
                <p className="text-muted-foreground mb-8">Entraremos em contacto em breve com mais informações.</p>
                <Button onClick={() => window.location.href = '/'}>Voltar ao Início</Button>
            </div>
        );
    }

    return null;
};