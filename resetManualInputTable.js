
  function resetManualInputTable() {
    const tableBody = document.querySelector('#manualInputTable tbody');
    tableBody.innerHTML = ""; // Clear existing rows
    addManualInputRow(); // Add one empty row initially
  }