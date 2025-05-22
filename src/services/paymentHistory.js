const downloadPDF = async () => {
  const res = await fetch('/api/generate-pdf', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'billing-history.pdf';
  link.click();
};
