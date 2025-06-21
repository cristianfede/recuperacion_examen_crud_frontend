const API_URL = 'http://localhost:3333/api/reservas'

// Obtener todas las reservas
export const obtenerReservas = async () => {
  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error al obtener reservas:', errorData)
      throw new Error(errorData.message || 'Error al obtener reservas')
    }

    return await response.json()
  } catch (error) {
    console.error('Error en obtenerReservas:', error)
    throw error
  }
}

// Crear una nueva reserva
export const crearReserva = async (reserva: any) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reserva)
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Error al crear reserva:', result)
      throw new Error(result.message || 'Error al crear reserva')
    }

    return result
  } catch (error) {
    console.error('Error en crearReserva:', error)
    throw error
  }
}

// Actualizar una reserva
export const actualizarReserva = async (id: number, data: any) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Error al actualizar reserva:', result)
      throw new Error(result.message || 'Error al actualizar reserva')
    }

    return result
  } catch (error) {
    console.error('Error en actualizarReserva:', error)
    throw error
  }
}

// Eliminar una reserva
export const eliminarReserva = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })

    const result = await response.json()

    if (!response.ok) {
      console.error('Error al eliminar reserva:', result)
      throw new Error(result.message || 'Error al eliminar reserva')
    }

    return result
  } catch (error) {
    console.error('Error en eliminarReserva:', error)
    throw error
  }
}
