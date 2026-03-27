'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/src/lib/api';

type GuestResponse = {
  id?: string;
  guestId?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: 'INVITED' | 'CONFIRMED' | 'DECLINED';
  rsvpCode?: string;
  eventId?: string;
  organizationId?: string;
  createdAt?: string;
  event: {
    id: string;
    name: string;
    slug?: string | null;
    description?: string | null;
    date: string;
    location: string;
    capacity?: number | null;
    status?: string;
    organizationId?: string;
    createdAt?: string;
  };
};

export default function PublicRsvpPage() {
  const params = useParams();
  const code = params.code as string;

  const [guest, setGuest] = useState<GuestResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function loadGuest() {
    try {
      setMessage('');
      const data = await apiFetch(`/public/rsvp/${code}`);
      setGuest(data);
    } catch (err: any) {
      setGuest(null);
      setMessage(err.message || 'Erro ao carregar convite.');
    } finally {
      setLoading(false);
    }
  }

  async function respond(status: 'CONFIRMED' | 'DECLINED') {
    try {
      setMessage('');

      await apiFetch(`/public/rsvp/${code}/respond`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });

      await loadGuest();

      if (status === 'CONFIRMED') {
        setMessage('Presença confirmada com sucesso.');
      } else {
        setMessage('Você informou que não poderá comparecer.');
      }
    } catch (err: any) {
      setMessage(err.message || 'Erro ao responder convite.');
    }
  }

  useEffect(() => {
    if (code) {
      loadGuest();
    }
  }, [code]);

  if (loading) {
    return (
      <main style={{ padding: 40, fontFamily: 'Arial' }}>
        <h1>Carregando convite...</h1>
      </main>
    );
  }

  if (!guest) {
    return (
      <main style={{ padding: 40, fontFamily: 'Arial' }}>
        <h1>Convite não encontrado.</h1>
        {message ? <p>{message}</p> : null}
      </main>
    );
  }

  const eventDate = new Date(guest.event.date).toLocaleString('pt-BR');
  const eventSlug = guest.event.slug;
  const canSeeGiftList = guest.status === 'CONFIRMED' && !!eventSlug;

  return (
    <main
      style={{
        padding: 40,
        fontFamily: 'Arial',
        maxWidth: 700,
        margin: '0 auto',
      }}
    >
      <h1>{guest.event.name}</h1>

      <p>
        <strong>Data:</strong> {eventDate}
      </p>

      <p>
        <strong>Local:</strong> {guest.event.location}
      </p>

      <hr style={{ margin: '20px 0' }} />

      <h2>Olá, {guest.name}</h2>

      <p>Você confirma presença neste evento?</p>

      <p>
        <strong>Status atual:</strong>{' '}
        {guest.status === 'INVITED' && 'Aguardando resposta'}
        {guest.status === 'CONFIRMED' && 'Presença confirmada'}
        {guest.status === 'DECLINED' && 'Não poderá comparecer'}
      </p>

      <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          onClick={() => respond('CONFIRMED')}
          style={{
            padding: '10px 20px',
            background: 'green',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Confirmar presença
        </button>

        <button
          onClick={() => respond('DECLINED')}
          style={{
            padding: '10px 20px',
            background: 'red',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          Não poderei ir
        </button>

        {canSeeGiftList ? (
          <Link
            href={`/e/${eventSlug}`}
            style={{
              padding: '10px 20px',
              background: '#111827',
              color: 'white',
              borderRadius: 8,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Ver lista de presentes
          </Link>
        ) : null}
      </div>

      {message ? (
        <p style={{ marginTop: 20 }}>
          <strong>{message}</strong>
        </p>
      ) : null}
    </main>
  );
}