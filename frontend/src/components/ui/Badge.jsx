import styles from './Badge.module.css';

const colorMap = {
  pendente: 'yellow',
  em_andamento: 'blue',
  executada: 'purple',
  qualificada: 'teal',
  faturada: 'green',
  ativo: 'green',
  encerrado: 'gray',
  suspenso: 'red',
  vigente: 'green',
  a_vencer: 'yellow',
  vencido: 'red',
  novo: 'blue',
  contatado: 'yellow',
  qualificado: 'teal',
  convertido: 'green',
  planejada: 'blue',
  concluida: 'green',
  cancelada: 'red',
};

const labelMap = {
  pendente: 'Pendente',
  em_andamento: 'Em Andamento',
  executada: 'Executada',
  qualificada: 'Qualificada',
  faturada: 'Faturada',
  ativo: 'Ativo',
  encerrado: 'Encerrado',
  suspenso: 'Suspenso',
  vigente: 'Vigente',
  a_vencer: 'A Vencer',
  vencido: 'Vencido',
  novo: 'Novo',
  contatado: 'Contatado',
  qualificado: 'Qualificado',
  convertido: 'Convertido',
  planejada: 'Planejada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
};

export default function Badge({ status, label }) {
  const color = colorMap[status] || 'gray';
  return (
    <span className={`${styles.badge} ${styles[color]}`}>
      {label || labelMap[status] || status}
    </span>
  );
}
