"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CepFormData,
  CepResponse,
  cepFormSchema,
} from "@/app/schemas/cep-schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import "@/app/styles/form.css";

export default function FormCep() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CepFormData>({
    resolver: zodResolver(cepFormSchema),
  });

  const [address, setAddress] = useState<CepResponse | null>();

  async function onSubmit(payload: CepFormData) {
    const url = `https://viacep.com.br/ws/${payload.cep}/json/`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.erro) {
        reset();
        setAddress(null);
        throw new Error(
          "CEP não encontrado! Por favor, digite novamente o seu CEP",
        );
      }

      setAddress(data);
      return data;
    } catch (error: any) {
      if (error instanceof Error) {
        toast.error(`Erro: ${error.message}`);
      }
      toast.error("Erro desconhecido");
    }
  }

  return (
    <main className="flex flex-col items-center">
      <div className="title flex flex-col justify-center items-center pb-4 px-4">
        <h1>
          REACTENS
          <span>Busque o seu CEP aqui!</span>
        </h1>
      </div>

      <Card className="sm:w-xl w-100vh formCard">
        <CardHeader>
          <CardTitle>Pesquise um CEP:</CardTitle>
        </CardHeader>

        <CardContent>
          <form id="search-cep" onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder="ex: 00000000" {...register("cep")} />
            {errors?.cep && (
              <div className="text-red-500 text-xs">{errors?.cep?.message}</div>
            )}

            <Button className="mt-3" variant={"outline"} type="submit">
              Buscar
            </Button>
          </form>

          {address && (
            <div className="mt-4 flex flex-col gap-3">
              <h1 className="formTitle">CEP: {address.cep}</h1>

              <div className="flex flex-col">
                <Label htmlFor="estado">Estado: </Label>
                <p id="estado">{address.estado}</p>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="cidade">Cidade: </Label>
                <p id="cidade">
                  {address.localidade} - {address.uf}
                </p>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="logradouro">Rua: </Label>
                <p id="logradouro">{address.logradouro}</p>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="bairro">Bairro: </Label>
                <p id="bairro">{address.bairro}</p>
              </div>

              <div className="flex flex-col">
                <Label htmlFor="rua">Rua: </Label>
                <p id="rua">{address.logradouro}</p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="complemento">Complemento: </Label>
                <Input type="string" id="complemento" />
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <p>Frete Econômico: R$ 6,40 - Até 15 dias de entrega</p>
                </div>

                <div>
                  <p>Frete Expresso: R$ 15,90 - Até 4 dias de entrega</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
