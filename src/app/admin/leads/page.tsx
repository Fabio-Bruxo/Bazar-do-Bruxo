'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Users, Search, Mail, Sparkles } from 'lucide-react';
import { INITIAL_LEADS } from '@/data/db';
import { Lead } from '@/types';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('bazar_leads') || '[]');
      setLeads(saved.length > 0 ? saved : INITIAL_LEADS);
    } catch (e) {
      setLeads(INITIAL_LEADS);
    }
  }, []);

  const handleExportCSV = () => {
    const headers = ['Nome', 'Email', 'Preferencia', 'Origem', 'ResultadoQuiz', 'Data'];
    const rows = leads.map((l) => [
      l.name,
      l.email,
      l.preference,
      l.source,
      l.quizResult || '',
      l.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_bazar_do_bruxo_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.preference.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-bazar-charcoal-border">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="p-2 rounded-xl bg-bazar-charcoal-light border border-bazar-charcoal-border hover:border-bazar-gold text-bazar-parchment transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-mystic text-2xl font-bold text-bazar-parchment">
              Leads do Círculo do Bazar
            </h1>
            <p className="text-xs text-bazar-parchment/60">
              Contatos captados via Newsletter e Quiz do Cristal
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-bazar-gold hover:bg-bazar-gold-light text-bazar-charcoal text-xs font-bold rounded-xl flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Lista CSV</span>
        </button>
      </div>

      <div className="bg-bazar-charcoal-light rounded-3xl border border-bazar-charcoal-border overflow-hidden shadow-mystic">
        <div className="p-4 border-b border-bazar-charcoal-border">
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 bg-bazar-charcoal border border-bazar-charcoal-border rounded-xl px-3 py-2 text-xs text-bazar-parchment focus:outline-none focus:border-bazar-gold"
          />
        </div>

        <table className="w-full text-left text-xs text-bazar-parchment divide-y divide-bazar-charcoal-border">
          <thead className="bg-bazar-charcoal text-bazar-parchment/60 uppercase font-bold tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Nome</th>
              <th className="py-3 px-4">E-mail</th>
              <th className="py-3 px-4">Interesse / Preferência</th>
              <th className="py-3 px-4">Origem</th>
              <th className="py-3 px-4">Resultado Quiz</th>
              <th className="py-3 px-4">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bazar-charcoal-border">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-bazar-charcoal/40 transition-colors">
                <td className="py-3 px-4 font-bold">{lead.name}</td>
                <td className="py-3 px-4 text-bazar-parchment/80">{lead.email}</td>
                <td className="py-3 px-4 text-bazar-gold">{lead.preference}</td>
                <td className="py-3 px-4 uppercase text-[10px]">
                  <span className="bg-bazar-charcoal px-2 py-0.5 rounded border border-bazar-charcoal-border">
                    {lead.source}
                  </span>
                </td>
                <td className="py-3 px-4 text-emerald-400 capitalize">
                  {lead.quizResult || '-'}
                </td>
                <td className="py-3 px-4 text-bazar-parchment/50">
                  {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
