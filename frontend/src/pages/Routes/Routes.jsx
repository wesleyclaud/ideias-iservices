import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageLayout from '../../components/ui/PageLayout';
import { Table, TableSearch, Pagination } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import styles from './Routes.module.css';

const columns = [
  { key: 'title', label: 'Título' },
  { key: 'origin', label: 'Origem' },
  { key: 'destination', label: 'Destino' },
  { key: 'driver', label: 'Motorista', render: (v) => v?.name || '—' },
  { key: 'vehiclePlate', label: 'Placa', width: '120px', render: (v) => v || '—' },
  { key: 'status', label: 'Status', width: '130px', render: (v) => <Badge status={v} /> },
  { key: 'scheduledAt', label: 'Agendado', width: '130px', render: (v) => v ? new Date(v).toLocaleDateString('pt-BR') : '—' },
];

export default function Routes() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', origin: '', destination: '', vehiclePlate: '', scheduledAt: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/routes', { params: { page, search, limit: 15 } });
      setData(res.data.data);
      setTotal(res.data.total);
    } catch { toast.error('Erro ao carregar rotas.'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.origin || !form.destination) { toast.error('Preencha os campos obrigatórios.'); return; }
    setSaving(true);
    try {
      await api.post('/routes', form);
      toast.success('Rota criada!');
      setModalOpen(false);
      setForm({ title: '', origin: '', destination: '', vehiclePlate: '', scheduledAt: '' });
      fetchData();
    } catch { toast.error('Erro ao criar rota.'); }
    finally { setSaving(false); }
  };

  return (
    <PageLayout actions={
      <>
        <TableSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar rota..." />
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Nova Rota</Button>
      </>
    }>
      <div className={styles.tableCard}>
        <Table columns={columns} data={data} loading={loading} />
        <Pagination page={page} total={total} limit={15} onPage={setPage} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Rota">
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.field}><label>Título *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Nome da rota" /></div>
          <div className={styles.field}><label>Origem *</label><input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="Ponto de partida" /></div>
          <div className={styles.field}><label>Destino *</label><input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Ponto de chegada" /></div>
          <div className={styles.row}>
            <div className={styles.field}><label>Placa</label><input value={form.vehiclePlate} onChange={(e) => setForm({ ...form, vehiclePlate: e.target.value })} placeholder="ABC-1234" /></div>
            <div className={styles.field}><label>Agendamento</label><input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} /></div>
          </div>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Criar Rota</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
