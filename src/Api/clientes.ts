const API_URL = 'http://localhost:3333/api/clientes'

// Obtener todos los clientes
export const obtenerClientes = async () => {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Error al obtener clientes')
  return await response.json()
}

// Crear un cliente
export const crearCliente = async (data: any) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error al crear cliente')
  return await response.json()
}

// Eliminar un cliente
export const eliminarCliente = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Error al eliminar cliente')
  return await response.json()
}

export const actualizarCliente = async (id: number, data: any) => {
  const response = await fetch(`http://localhost:3333/api/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error al actualizar cliente')
  return await response.json()
}
