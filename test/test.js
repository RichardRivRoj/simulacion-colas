return (
    <div className="min-h-screen py-12 bg-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Simulación de Cola</h1>
        <div className="mt-8">
          {formData && (
            <div>
              <p className="text-lg text-gray-700">
                Configuración: {formData.numberOfTables} mesas, Tasa de Llegada
                λ = {formData.arrivalRate}, Tasa de Servicio μ ={" "}
                {formData.serviceRate}
              </p>
              <button
                className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
                onClick={runSimulation}
              >
                Iniciar Simulación
              </button>
            </div>
          )}
          {loading && <p>Simulando...</p>}
          {simulationData.length > 0 && (
            <div className="mt-6">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="text-left">
                    <th className="px-4 py-2 border">Cliente</th>
                    <th className="px-4 py-2 border">Tiempo de Llegada</th>
                    <th className="px-4 py-2 border">Tiempo de Servicio</th>
                    <th className="px-4 py-2 border">Inicio de Servicio</th>
                    <th className="px-4 py-2 border">Tiempo de Espera</th>
                    <th className="px-4 py-2 border">Tiempo de Salida</th>
                    <th className="px-4 py-2 border">Tiempo en el Sistema</th>
                    <th className="px-4 py-2 border">Servidor Asignado</th>
                  </tr>
                </thead>
                <tbody>
                  {simulationData.map((client, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 border">{client.client}</td>
                      <td className="px-4 py-2 border">
                        {formatValue(client.arrivalTime)}
                      </td>
                      <td className="px-4 py-2 border">
                        {formatValue(client.serviceTime)}
                      </td>
                      <td className="px-4 py-2 border">
                        {formatValue(client.startTimeService)}
                      </td>
                      <td className="px-4 py-2 border">
                        {formatValue(client.waitingTime)}
                      </td>
                      <td className="px-4 py-2 border">
                        {formatValue(client.departureTime)}
                      </td>
                      <td className="px-4 py-2 border">
                        {formatValue(client.timeInSystem)}
                      </td>
                      <td className="px-4 py-2 border">
                        {client.serverAssigned}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );