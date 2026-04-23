import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import PageLayout from '../../components/ui/PageLayout';
import { Table, TableSearch, Pagination } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import styles from './Documents.module.css';

const columns = [
  { key: 'title', label: 'Título' },
  { key: 'type', label: 'Tipo', width: '140px' },
  { key: 'status', label: 'Status', width: '130px', render: (v) => <Badge status={v} /> },
  { key: 'expiryDate', label: 'Vencimento', width: '140px', render: (v) => v ? new Date(v + 'T00:00:00').toLocaleDateString('pt-BR') : '—' },
];

export default function Documents() {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', type: '', expiryDate: '', status: 'vigente' });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/documents', { params: { page, search, limit: 15 } });
      setData(res.data.data);
      setTotal(res.data.total);
    } catch { toast.error('Erro ao carregar documentos.'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.type) { toast.error('Preencha os campos obrigatórios.'); return; }
    setSaving(true);
    try {
      await api.post('/documents', form);
      toast.success('Documento criado!');
      setModalOpen(false);
      setForm({ title: '', type: '', expiryDate: '', status: 'vigente' });
      fetchData();
    } catch { toast.error('Erro ao criar documento.'); }
    finally { setSaving(false); }
  };

  return (
    <PageLayout actions={
      <>
        <TableSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Buscar documento..." />
        <Button onClick={() => setModalOpen(true)}><Plus size={16} /> Novo Documento</Button>
      </>
    }>
      <div className={styles.tableCard}>
        <Table columns={columns} data={data} loading={loading} />
        <Pagination page={page} total={total} limit={15} onPage={setPage} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Documento">
        <form onSubmit={handleCreate} className={styles.form}>
          <div className={styles.field}><label>Título *</label><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Licença de Operação" /></div>
          <div className={styles.row}>
            <div className={styles.field}><label>Tipo *</label><input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="Ex: Licença, Certificado" /></div>
            <div className={styles.field}><label>Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="vigente">Vigente</option>
                <option value="a_vencer">A Vencer</option>
                <option value="vencido">Vencido</option>
              </select>
            </div>
          </div>
          <div className={styles.field}><label>Vencimento</label><input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /></div>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Salvar</Button>
          </div>
        </form>
      </Modal>
    </PageLayout>
  );
}
