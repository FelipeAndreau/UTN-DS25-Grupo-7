// src/services/clientes.service.ts
import { getClientes, createCliente, updateCliente, deleteCliente, } from "../models/clientes.model";

import { ClienteRequest } from "../types/clientes.types";

export const listarClientes = async () => {
  return await getClientes();
};

export const registrarCliente = async (data: ClienteRequest) => {
  await createCliente(data);
};

export const editarCliente = async (id: string, data: ClienteRequest) => {
  await updateCliente(id, data);
};

export const eliminarCliente = async (id: string) => {
  await deleteCliente(id);
};