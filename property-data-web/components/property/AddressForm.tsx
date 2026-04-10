"use client";

import React, { useCallback } from "react";
import type { UseFormReturn } from "react-hook-form";

import type { PropertyFormData } from "@/types/property";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddressFormProps {
  form: UseFormReturn<PropertyFormData>;
}

export function AddressForm({ form }: AddressFormProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const cepValue = watch("cep");

  const fetchCep = useCallback(
    async (cep: string) => {
      const cleanCep = cep.replace(/\D/g, "");
      if (cleanCep.length !== 8) return;

      try {
        const response = await fetch(`/api/cep?cep=${cleanCep}`);
        if (!response.ok) return;

        const data = await response.json();
        if (data.erro) return;

        if (data.logradouro) setValue("address", data.logradouro);
        if (data.bairro) setValue("neighborhood", data.bairro);
        if (data.localidade) setValue("city", data.localidade);
        if (data.uf) setValue("state", data.uf);
      } catch {
        // silently fail on network errors
      }
    },
    [setValue]
  );

  const handleCepBlur = useCallback(() => {
    if (cepValue) {
      fetchCep(cepValue);
    }
  }, [cepValue, fetchCep]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* CEP */}
        <div className="space-y-2">
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            placeholder="00000-000"
            maxLength={9}
            {...register("cep")}
            onBlur={handleCepBlur}
          />
          {errors.cep && (
            <p className="text-xs text-destructive">{errors.cep.message}</p>
          )}
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Tipo do Imovel</Label>
          <Select
            value={watch("type")}
            onValueChange={(value) =>
              setValue("type", value as PropertyFormData["type"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residencial">Residencial</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
              <SelectItem value="rural">Rural</SelectItem>
              <SelectItem value="misto">Misto</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-xs text-destructive">{errors.type.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Address */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Endereco</Label>
          <Input
            id="address"
            placeholder="Rua, Avenida..."
            {...register("address")}
          />
          {errors.address && (
            <p className="text-xs text-destructive">{errors.address.message}</p>
          )}
        </div>

        {/* Number */}
        <div className="space-y-2">
          <Label htmlFor="number">Numero</Label>
          <Input
            id="number"
            placeholder="123"
            {...register("number")}
          />
          {errors.number && (
            <p className="text-xs text-destructive">{errors.number.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Neighborhood */}
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input
            id="neighborhood"
            placeholder="Bairro"
            {...register("neighborhood")}
          />
          {errors.neighborhood && (
            <p className="text-xs text-destructive">
              {errors.neighborhood.message}
            </p>
          )}
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            placeholder="Cidade"
            {...register("city")}
          />
          {errors.city && (
            <p className="text-xs text-destructive">{errors.city.message}</p>
          )}
        </div>

        {/* State */}
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            placeholder="UF"
            maxLength={2}
            {...register("state")}
          />
          {errors.state && (
            <p className="text-xs text-destructive">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Area */}
        <div className="space-y-2">
          <Label htmlFor="area">Area (m2)</Label>
          <Input
            id="area"
            type="number"
            placeholder="0"
            {...register("area", { valueAsNumber: true })}
          />
          {errors.area && (
            <p className="text-xs text-destructive">{errors.area.message}</p>
          )}
        </div>

        {/* Matricula */}
        <div className="space-y-2">
          <Label htmlFor="matricula">Matricula</Label>
          <Input
            id="matricula"
            placeholder="Numero da matricula"
            {...register("matricula")}
          />
          {errors.matricula && (
            <p className="text-xs text-destructive">
              {errors.matricula.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
