import http from './http';

export const createDonation = (payload) =>
  http.post('/donations', payload);

export const uploadDonationProof = (donationId, formData) =>
  http.post(`/donations/${donationId}/proof`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const myDonations = () =>
  http.get('/me/donations');
