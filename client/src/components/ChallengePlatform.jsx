import React, { useState, useEffect } from 'react';

export default function ChallengePlatform() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [submitStatus, setSubmitStatus] = useState(null);

  // 1. Consumo de API con manejo de resiliencia
  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/challenges');
      if (!response.ok) throw new Error('El servidor respondió con un error.');
      const data = await response.json();
      setChallenges(data);
    } catch (err) {
      // Captura si el servidor Express está apagado o da 500
      setError('Servicio no disponible temporalmente. Comprueba la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Enviar respuesta al Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: selectedChallenge.id, code })
      });
      if (!response.ok) throw new Error();
      const result = await response.json();
      setSubmitStatus(`Resultado del envío: ${result.status}`);
    } catch (err) {
      alert('Error al enviar: El servidor de procesamiento no responde.');
    }
  };

  if (loading) return <p>Cargando retos desde la API...</p>;
  
  // Diseño Fallback Amigable exigido en los criterios
  if (error) return (
    <div style={{ padding: '20px', border: '2px solid red', borderRadius: '5px', background: '#fee' }}>
      <h3>⚠️ Error de Conexión</h3>
      <p>{error}</p>
      <button onClick={fetchChallenges} style={{ padding: '8px 12px', cursor: 'pointer' }}>Reintentar Conexión</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Lista de Retos */}
      <div style={{ width: '40%' }}>
        <h2>Retos Disponibles</h2>
        {challenges.map(ch => (
          <div key={ch.id} onClick={() => { setSelectedChallenge(ch); setSubmitStatus(null); }} style={{ padding: '10px', margin: '5px 0', border: '1px solid #ccc', cursor: 'pointer', background: selectedChallenge?.id === ch.id ? '#e0e0e0' : 'white' }}>
            <h4>{ch.title} ({ch.difficulty})</h4>
          </div>
        ))}
      </div>

      {/* Panel de Resolución */}
      <div style={{ width: '60%' }}>
        {selectedChallenge ? (
          <form onSubmit={handleSubmit}>
            <h3>{selectedChallenge.title}</h3>
            <p>{selectedChallenge.description}</p>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} rows="10" style={{ width: '100%', fontFamily: 'monospace' }} placeholder="// Escribe tu solución aquí..."></textarea>
            <br />
            <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>Enviar Solución</button>
            {submitStatus && <p><strong>{submitStatus}</strong></p>}
          </form>
        ) : (
          <p>Selecciona un reto de la izquierda para empezar.</p>
        )}
      </div>
    </div>
  );
}