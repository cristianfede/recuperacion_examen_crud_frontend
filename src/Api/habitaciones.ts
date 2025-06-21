const API_URL = 'http://localhost:3333/api/habitaciones'

export const obtenerHabitaciones = async () => {
  const response = await fetch(API_URL)
  if (!response.ok) throw new Error('Error al obtener habitaciones')
  return await response.json()
}

export const crearHabitacion = async (data: any) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error al crear habitación')
  return await response.json()
}

export const eliminarHabitacion = async (id: number) => {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Error al eliminar habitación')
  return await response.json()
}

export const actualizarHabitacion = async (id: number, data: any) => {
  const response = await fetch(`http://localhost:3333/api/habitaciones/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Error al actualizar habitación')
  return await response.json()
}
