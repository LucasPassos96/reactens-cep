import * as z from "zod";

export const cepFormSchema = z.object({
  cep: z
    .string()
    .min(8, "Por favor, digite 8 números")
    .max(8, "O CEP brasileiro possui no máximo 8 números")
    .regex(/^[0-9]{8}$/, "Formato inválido! Por favor, digite apenas numeros")
});

export type CepFormData  = z.infer<typeof cepFormSchema>;

export type CepResponse = {
  cep: string;
  estado: string;
  localidade: string;
  uf: string;
  bairro: string;
  logradouro: string;
  complemento: string;
};