// src/api/charities.js
import http from './http';

/* ---------- Public / shared ---------- */
export const listCharities = (params = {}) =>
  http.get('/charities', { params });

export const getCharity = (id) =>
  http.get(`/charities/${id}`);

export const getCharityCampaigns = (id) =>
  http.get(`/charities/${id}/campaigns`);

export const getCharityChannels = (id) =>
  http.get(`/charities/${id}/channels`);

/* ---------- Charity admin: org profile & docs ---------- */
export const updateCharity = (id, payload) =>
  http.put(`/charities/${id}`, payload);

export const uploadCharityDocument = (id, formData) =>
  http.post(`/charities/${id}/documents`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/* ---------- Channels ---------- */
export const createChannel = (charityId, payload) =>
  http.post(`/charities/${charityId}/channels`, payload);

// If your backend supports delete; otherwise adjust accordingly
export const deleteChannel = (charityId, channelId) =>
  http.delete(`/charities/${charityId}/channels/${channelId}`);

/* ---------- Campaigns ---------- */
export const createCampaign = (charityId, payload) =>
  http.post(`/charities/${charityId}/campaigns`, payload);

export const updateCampaign = (campaignId, payload) =>
  http.put(`/campaigns/${campaignId}`, payload);

export const deleteCampaign = (campaignId) =>
  http.delete(`/campaigns/${campaignId}`);

/* ---------- Inbox (donations to this charity) ---------- */
export const getCharityDonations = (charityId) =>
  http.get(`/charities/${charityId}/donations`);

export const confirmDonation = (donationId, payload = { status: 'completed' }) =>
  http.patch(`/donations/${donationId}/confirm`, payload);

/* ---------- Fund usage ---------- */
export const getFundUsageLogs = (campaignId) =>
  http.get(`/campaigns/${campaignId}/fund-usage`);

export const createFundUsage = (campaignId, payload) =>
  http.post(`/campaigns/${campaignId}/fund-usage`, payload);
 
// ✅ add this line so existing imports keep working
export const listCharityDonations = getCharityDonations;
