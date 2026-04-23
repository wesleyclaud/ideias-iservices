import api from './api';

export const getDashboardCounts = async () => {
  const [os, contracts, docs] = await Promise.all([
    api.get('/service-orders/counts'),
    api.get('/contracts/counts'),
    api.get('/documents/counts'),
  ]);
  return {
    os: os.data,
    contracts: contracts.data,
    documents: docs.data,
  };
};
