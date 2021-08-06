const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join("-")
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};
const formatDate = date => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join("-");
};
const formatMD = date => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [month, day].map(formatNumber).join("-");
};

module.exports = {
  formatTime,
  formatDate,
  formatMD
};
