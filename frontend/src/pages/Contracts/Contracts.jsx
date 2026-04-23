import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageLayout from '../../components/ui/PageLayout';
import { Table, TableSearch, Pagination } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import styles from './Contracts.module.css';

const columns = [
  { key: 'code', label: 'Código', width: '120px' },
  { key: 'title', label: 'Título' },
  { key: 'clientName', label: 'Cliente' },
  { key: 'value', label: 'Valor', render: (v) => `R$ ${parseFloat(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` },
  { key: 'status', label: 'Status', width: '120px', render: (v) => <Badge status={v} /> },
  { key: 'endDate', label: 'Vencimento', render: (v) => new Date(v + 'T00:00:00').toLocaleDateString('pt-BR') },
];

export default function Contracts() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', clientName: '', value: '', startDate: '', endDate: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/contracts', { params: { page, search, limit: 15 } });
      setData(res.data.data);
      setTotal(res.data.total);
    } catch { toast.error('Erro ao carregar contratos.'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.clientName || !form.value) { toast.error('Preencha os campos obrigatórios.'); return; }
    setSaving(true);
    try {
      await api.post('/contracts', form);
      toast.success('Contrato criado!');
      setModalOpen(false);
      setForm({ title: '', clientName: '', value: '', startDate: '', endDate: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.error || 'Erro ao criar contrato.'); }
    finally { setSaving(false); }
  };

  return (
    <PageLayout actions={
      <>
        <TableSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar contrato..." />
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Novo Contrato</Button>
      </>
    }>
      <div className={styles.tableCard}>
        <Table columns={columns} data={data} loading={loading} />
        <Pagination page={page} total={total} limit={15} onPage={setPage} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Contrato">
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.field}><label>Título *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título do contrato" /></div>
          <div className={styles.field}><label>Cliente *</label><input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Nome do cliente" /></div>
          <div className={styles.row}>
            <div className={styles.field}><label>Valor *</label><input type="number" step="0.01" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="0,00" /></div>
            <div className={styles.field}><label>Início *</label><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></div>
            <div className={styles.field}><label>Vencimento *</label><input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
          </div>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Criar Contrato</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
