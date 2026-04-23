import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageLayout from '../../components/ui/PageLayout';
import { Table, TableSearch, Pagination } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import styles from './ServiceOrders.module.css';

const columns = [
  { key: 'code', label: 'Código', width: '120px' },
  { key: 'title', label: 'Título' },
  { key: 'status', label: 'Status', width: '150px', render: (v) => <Badge status={v} /> },
  { key: 'priority', label: 'Prioridade', width: '120px', render: (v) => <Badge status={v} /> },
  { key: 'assignee', label: 'Responsável', render: (v) => v?.name || '—' },
  { key: 'scheduledAt', label: 'Agendado', width: '140px', render: (v) => v ? new Date(v).toLocaleDateString('pt-BR') : '—' },
];

export default function ServiceOrders() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', priority: 'media', description: '', scheduledAt: '' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/service-orders', { params: { page, search, limit: 15 } });
      setData(res.data.data);
      setTotal(res.data.total);
    } catch { toast.error('Erro ao carregar OS.'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error('Título obrigatório.'); return; }
    setSaving(true);
    try {
      await api.post('/service-orders', form);
      toast.success('OS criada!');
      setModalOpen(false);
      setForm({ title: '', priority: 'media', description: '', scheduledAt: '' });
      fetchData();
    } catch (err) { toast.error(err.response?.data?.error || 'Erro ao criar OS.'); }
    finally { setSaving(false); }
  };

  return (
    <PageLayout
      actions={
        <>
          <TableSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar OS..." />
          <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Nova OS</Button>
        </>
      }
    >
      <div className={styles.tableCard}>
        <Table columns={columns} data={data} loading={loading} />
        <Pagination page={page} total={total} limit={15} onPage={setPage} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Ordem de Serviço">
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.field}>
            <label>Título *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título da OS" />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Prioridade</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Agendamento</label>
              <input type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
            </div>
          </div>
          <div className={styles.field}>
            <label>Descrição</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detalhes..." />
          </div>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Criar OS</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
